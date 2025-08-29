import { NextRequest, NextResponse } from 'next/server';
import { authenticateN8N, corsHeaders, handleCORS } from '@/lib/n8n-auth';
import { mockCustomers } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const authError = authenticateN8N(request);
  if (authError) return authError;

  const customer = mockCustomers.find(c => c.id === params.id);

  if (!customer) {
    return NextResponse.json(
      { error: 'Customer not found' },
      { status: 404, headers: corsHeaders() }
    );
  }

  return NextResponse.json(
    {
      customer,
      interactions: [], // In real app, fetch related interactions
      tickets: [], // In real app, fetch related tickets
      orders: [], // In real app, fetch related orders
    },
    {
      status: 200,
      headers: corsHeaders(),
    }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const authError = authenticateN8N(request);
  if (authError) return authError;

  try {
    const updateData = await request.json();
    
    const customer = mockCustomers.find(c => c.id === params.id);
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    // Update customer (in real app, this would update the database)
    const updatedCustomer = {
      ...customer,
      ...updateData,
      id: params.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
      updatedByN8N: true,
    };

    return NextResponse.json(
      {
        success: true,
        customer: updatedCustomer,
        message: 'Customer updated successfully',
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
