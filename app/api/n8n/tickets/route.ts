import { NextRequest, NextResponse } from 'next/server';
import { authenticateN8N, corsHeaders, handleCORS } from '@/lib/n8n-auth';
import { mockTickets } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const authError = authenticateN8N(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const customerId = searchParams.get('customerId');
  const agentId = searchParams.get('agentId');

  let filteredTickets = mockTickets;

  // Apply filters
  if (status) {
    filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
  }
  if (priority) {
    filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
  }
  if (customerId) {
    filteredTickets = filteredTickets.filter(ticket => ticket.customerId === customerId);
  }
  if (agentId) {
    filteredTickets = filteredTickets.filter(ticket => ticket.agentId === agentId);
  }

  // Sort by creation date (newest first)
  filteredTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

  return NextResponse.json(
    {
      tickets: paginatedTickets,
      pagination: {
        page,
        limit,
        total: filteredTickets.length,
        totalPages: Math.ceil(filteredTickets.length / limit),
      },
      filters: { status, priority, customerId, agentId },
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
    const ticketData = await request.json();
    
    // Validate required fields
    if (!ticketData.customerId || !ticketData.title || !ticketData.description) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, title, description' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Create new ticket
    const newTicket = {
      id: `ticket_${Date.now()}`,
      customerId: ticketData.customerId,
      agentId: ticketData.agentId || null,
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority || 'medium',
      status: ticketData.status || 'new',
      category: ticketData.category || 'general',
      tags: ticketData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      linkedInteractionId: ticketData.linkedInteractionId || null,
      n8nSource: true, // Flag to indicate this was created by n8n
      n8nWorkflowId: ticketData.workflowId, // Track which n8n workflow created this
    };

    return NextResponse.json(
      {
        success: true,
        ticket: newTicket,
        message: 'Ticket created successfully',
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
