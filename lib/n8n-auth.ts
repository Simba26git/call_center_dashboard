import { NextRequest, NextResponse } from 'next/server';

// Simple API key authentication for n8n
const N8N_API_KEY = process.env.N8N_API_KEY || 'n8n-call-center-key';

export function authenticateN8N(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!apiKey || apiKey !== N8N_API_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid API key' },
      { status: 401 }
    );
  }
  
  return null; // Authentication successful
}

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  };
}

export function handleCORS(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders(),
    });
  }
  return null;
}
