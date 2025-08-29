import { NextRequest, NextResponse } from 'next/server';
import { authenticateN8N, corsHeaders, handleCORS } from '@/lib/n8n-auth';

export async function POST(request: NextRequest) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const authError = authenticateN8N(request);
  if (authError) return authError;

  try {
    const ticketData = await request.json();
    
    // Validate ticket data
    if (!ticketData.customerId || !ticketData.title) {
      return NextResponse.json(
        { error: 'Customer ID and title are required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Process new ticket
    const newTicket = {
      id: `ticket_${Date.now()}`,
      customerId: ticketData.customerId,
      title: ticketData.title,
      description: ticketData.description || '',
      priority: ticketData.priority || 'medium',
      status: 'new',
      category: ticketData.category || 'general',
      source: ticketData.source || 'n8n_webhook',
      tags: ticketData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'n8n_automation',
      assignedAgentId: null,
      estimatedResolutionTime: ticketData.estimatedResolutionTime || '24 hours',
      n8nWebhook: true,
      workflowId: ticketData.workflowId,
      originalData: ticketData.originalData || null,
    };

    // Auto-assignment logic (mock)
    const assignmentSuggestion = {
      suggestedAgent: null, // Will be populated by routing logic
      department: ticketData.category || 'general',
      skills: ticketData.skillsRequired || ['general'],
      urgency: ticketData.priority === 'urgent' ? 'immediate' : 'standard',
      slaTarget: ticketData.priority === 'urgent' ? '4 hours' : '24 hours',
    };

    // Log the ticket creation
    console.log('Ticket created via webhook:', {
      ticketId: newTicket.id,
      customerId: ticketData.customerId,
      priority: newTicket.priority,
      workflowId: ticketData.workflowId,
      timestamp: newTicket.createdAt,
    });

    // Trigger notifications (mock)
    const notifications = {
      customer: {
        type: 'email',
        template: 'ticket_created_confirmation',
        recipient: ticketData.customerEmail,
        data: {
          ticketId: newTicket.id,
          title: newTicket.title,
        },
      },
      agent: {
        type: 'dashboard_notification',
        message: `New ${newTicket.priority} priority ticket created`,
        ticketId: newTicket.id,
      },
      supervisor: ticketData.priority === 'urgent' ? {
        type: 'urgent_alert',
        message: `Urgent ticket requires immediate attention`,
        ticketId: newTicket.id,
      } : null,
    };

    return NextResponse.json(
      {
        success: true,
        ticket: newTicket,
        assignment: assignmentSuggestion,
        notifications,
        message: 'Ticket created and processed successfully',
        nextSteps: [
          'Customer notification sent',
          'Agent assignment in progress',
          'SLA timer started',
        ],
      },
      {
        status: 201,
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error('Ticket webhook error:', error);
    return NextResponse.json(
      { error: 'Invalid ticket data' },
      { status: 400, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCORS(request);
}
