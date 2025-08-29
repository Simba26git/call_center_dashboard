import { NextRequest, NextResponse } from 'next/server';
import { authenticateN8N, corsHeaders, handleCORS } from '@/lib/n8n-auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const authError = authenticateN8N(request);
  if (authError) return authError;

  try {
    const { customerId, interactionType, priority, skillsRequired } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { error: 'customerId is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Mock assignment logic (in real app, this would use sophisticated routing)
    const assignment = {
      agentId: params.id,
      customerId,
      interactionType: interactionType || 'call',
      priority: priority || 'medium',
      assignedAt: new Date().toISOString(),
      estimatedWaitTime: Math.floor(Math.random() * 300), // seconds
      assignmentReason: 'skill_match', // available, skill_match, priority, round_robin
      skillsRequired: skillsRequired || [],
      n8nAssignment: true,
    };

    // Update agent status (mock)
    const agentUpdate = {
      agentId: params.id,
      status: 'on-call',
      currentCustomerId: customerId,
      assignmentTime: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        assignment,
        agentUpdate,
        message: `Customer ${customerId} assigned to agent ${params.id}`,
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
