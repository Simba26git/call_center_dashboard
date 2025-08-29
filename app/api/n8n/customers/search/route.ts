import { NextRequest, NextResponse } from 'next/server';
import { authenticateN8N, corsHeaders, handleCORS } from '@/lib/n8n-auth';
import { mockCustomers } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const authError = authenticateN8N(request);
  if (authError) return authError;

  try {
    const { query, filters } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Search customers
    let results = mockCustomers.filter(customer => {
      const searchText = query.toLowerCase();
      return (
        customer.name.toLowerCase().includes(searchText) ||
        customer.email?.toLowerCase().includes(searchText) ||
        customer.phone?.includes(query) ||
        customer.accountNumber.toLowerCase().includes(searchText)
      );
    });

    // Apply additional filters
    if (filters) {
      if (filters.tier) {
        results = results.filter(customer => customer.tier === filters.tier);
      }
      if (filters.verificationStatus) {
        results = results.filter(customer => customer.verificationStatus === filters.verificationStatus);
      }
      if (filters.preferredLanguage) {
        results = results.filter(customer => customer.preferredLanguage === filters.preferredLanguage);
      }
    }

    // Sort by relevance (exact matches first)
    results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === query.toLowerCase() ||
                    a.email?.toLowerCase() === query.toLowerCase() ||
                    a.accountNumber.toLowerCase() === query.toLowerCase();
      const bExact = b.name.toLowerCase() === query.toLowerCase() ||
                    b.email?.toLowerCase() === query.toLowerCase() ||
                    b.accountNumber.toLowerCase() === query.toLowerCase();
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });

    return NextResponse.json(
      {
        query,
        filters,
        results,
        count: results.length,
        searchTime: new Date().toISOString(),
      },
      {
        status: 200,
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON data' },
      { status: 400, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCORS(request);
}
