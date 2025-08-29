import { NextRequest, NextResponse } from 'next/server';
import { authenticateN8N, corsHeaders, handleCORS } from '@/lib/n8n-auth';

export async function POST(request: NextRequest) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const authError = authenticateN8N(request);
  if (authError) return authError;

  try {
    const callData = await request.json();
    
    // Validate incoming call data
    if (!callData.phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Process incoming call
    const incomingCall = {
      id: `call_${Date.now()}`,
      phoneNumber: callData.phoneNumber,
      callerName: callData.callerName || 'Unknown',
      customerId: callData.customerId || null,
      priority: callData.priority || 'medium',
      callType: callData.callType || 'inbound',
      receivedAt: new Date().toISOString(),
      status: 'ringing',
      queuePosition: callData.queuePosition || 1,
      estimatedWaitTime: callData.estimatedWaitTime || 60,
      callerId: callData.callerId || callData.phoneNumber,
      department: callData.department || 'general',
      language: callData.language || 'en',
      n8nWebhook: true,
      workflowId: callData.workflowId,
    };

    // Route the call (mock routing logic)
    const routingDecision = {
      action: 'route',
      targetQueue: callData.department || 'general',
      priority: incomingCall.priority,
      skills: callData.skillsRequired || ['general'],
      language: incomingCall.language,
      estimatedWaitTime: incomingCall.estimatedWaitTime,
    };

    // Log the incoming call
    console.log('Incoming call webhook received:', {
      phoneNumber: callData.phoneNumber,
      customerId: callData.customerId,
      workflowId: callData.workflowId,
      timestamp: incomingCall.receivedAt,
    });

    // Trigger real-time updates (in real app, this would use WebSockets/SSE)
    // For now, just return the processed data

    return NextResponse.json(
      {
        success: true,
        call: incomingCall,
        routing: routingDecision,
        message: 'Incoming call processed successfully',
        nextSteps: [
          'Customer lookup initiated',
          'Agent assignment in progress',
          'Call routing to appropriate queue',
        ],
      },
      {
        status: 200,
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Invalid webhook data' },
      { status: 400, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCORS(request);
}
