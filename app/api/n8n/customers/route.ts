import { NextRequest, NextResponse } from 'next/server';
import { authenticateN8N, corsHeaders, handleCORS } from '@/lib/n8n-auth';
import { mockCustomers } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const authError = authenticateN8N(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search');
  const tier = searchParams.get('tier');

  let filteredCustomers = mockCustomers;

  // Apply search filter
  if (search) {
    filteredCustomers = filteredCustomers.filter(customer =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search) ||
      customer.accountNumber.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply tier filter
  if (tier) {
    filteredCustomers = filteredCustomers.filter(customer => customer.tier === tier);
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  return NextResponse.json(
    {
      customers: paginatedCustomers,
      pagination: {
        page,
        limit,
        total: filteredCustomers.length,
        totalPages: Math.ceil(filteredCustomers.length / limit),
      },
      filters: { search, tier },
    },
    {
      status: 200,
      headers: corsHeaders(),
    }
  );
}

export async function POST(request: NextRequest) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const authError = authenticateN8N(request);
  if (authError) return authError;

  try {
    const customerData = await request.json();
    
    // Validate required fields
    if (!customerData.name || !customerData.accountNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: name, accountNumber' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Create new customer (in real app, this would save to database)
    const newCustomer = {
      id: `cust_${Date.now()}`,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      accountNumber: customerData.accountNumber,
      tier: customerData.tier || 'bronze',
      verificationStatus: 'pending',
      preferredLanguage: customerData.preferredLanguage || 'en',
      consentFlags: {
        recording: customerData.consentFlags?.recording || false,
        marketing: customerData.consentFlags?.marketing || false,
      },
      createdAt: new Date().toISOString(),
      n8nSource: true, // Flag to indicate this was created by n8n
    };

    return NextResponse.json(
      {
        success: true,
        customer: newCustomer,
        message: 'Customer created successfully',
      },
      {
        status: 201,
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
