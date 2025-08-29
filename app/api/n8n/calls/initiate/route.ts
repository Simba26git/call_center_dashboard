import { NextRequest, NextResponse } from 'next/server';
import { authenticateN8N, corsHeaders, handleCORS } from '@/lib/n8n-auth';

export async function POST(request: NextRequest) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const authError = authenticateN8N(request);
  if (authError) return authError;

  try {
    const callData = await request.json();
    
    // Validate required fields
    if (!callData.customerId || !callData.phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, phoneNumber' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Create new call record
    const newCall = {
      id: `call_${Date.now()}`,
      type: 'call',
      customerId: callData.customerId,
      agentId: callData.agentId || null,
      direction: callData.direction || 'outbound',
      phoneNumber: callData.phoneNumber,
      status: 'active',
      callState: 'ringing',
      isRecording: callData.enableRecording || false,
      isMuted: false,
      duration: 0,
      startTime: new Date(),
      notes: callData.notes || '',
      disposition: null,
      recordingId: null,
      n8nInitiated: true,
      workflowId: callData.workflowId,
      priority: callData.priority || 'medium',
      scheduledTime: callData.scheduledTime || new Date().toISOString(),
    };

    // Mock call initiation response
    const callResponse = {
      callId: newCall.id,
      status: 'initiated',
      estimatedConnectionTime: 5, // seconds
      dialingNumber: callData.phoneNumber,
      agentRequired: !callData.agentId,
    };

    return NextResponse.json(
      {
        success: true,
        call: newCall,
        response: callResponse,
        message: 'Call initiated successfully',
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
