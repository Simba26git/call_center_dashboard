import { NextRequest, NextResponse } from 'next/server';
import { authenticateN8N, corsHeaders, handleCORS } from '@/lib/n8n-auth';

export async function GET(request: NextRequest) {
  // Handle CORS
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  // Authenticate
  const authError = authenticateN8N(request);
  if (authError) return authError;

  // Health check response
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'call-center-api',
      version: '1.0.0',
      endpoints: {
        customers: '/api/n8n/customers',
        tickets: '/api/n8n/tickets',
        agents: '/api/n8n/agents',
        calls: '/api/n8n/calls',
        webhooks: '/webhook/n8n/*'
      }
    },
    {
      status: 200,
      headers: corsHeaders(),
    }
  );
}

export async function OPTIONS(request: NextRequest) {
  return handleCORS(request);
}
