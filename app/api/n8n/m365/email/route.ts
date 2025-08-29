import { NextRequest, NextResponse } from 'next/server';
import { authenticateN8N, corsHeaders, handleCORS } from '@/lib/n8n-auth';

export async function POST(request: NextRequest) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const authError = authenticateN8N(request);
  if (authError) return authError;

  try {
    const emailData = await request.json();
    
    // Validate required fields
    if (!emailData.to || !emailData.subject || !emailData.body) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, body' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Mock email sending (in real app, this would use Microsoft Graph API)
    const emailResponse = {
      id: `email_${Date.now()}`,
      to: emailData.to,
      subject: emailData.subject,
      body: emailData.body,
      sentAt: new Date().toISOString(),
      status: 'sent',
      messageId: `<${Date.now()}@callcenter.microsoft365.com>`,
      isHtml: emailData.isHtml || true,
      customerId: emailData.customerId,
      ticketId: emailData.ticketId,
      templateUsed: emailData.template,
      n8nSent: true,
      workflowId: emailData.workflowId,
    };

    // Log the email for tracking
    console.log('N8N Email sent:', {
      to: emailData.to,
      subject: emailData.subject,
      workflowId: emailData.workflowId,
      timestamp: emailResponse.sentAt,
    });

    return NextResponse.json(
      {
        success: true,
        email: emailResponse,
        message: 'Email sent successfully via Microsoft 365',
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
