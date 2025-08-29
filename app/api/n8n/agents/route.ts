import { NextRequest, NextResponse } from 'next/server';
import { authenticateN8N, corsHeaders, handleCORS } from '@/lib/n8n-auth';
import { mockUsers } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const authError = authenticateN8N(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const role = searchParams.get('role');
  const teamId = searchParams.get('teamId');

  let filteredAgents = mockUsers;

  // Apply filters
  if (status) {
    filteredAgents = filteredAgents.filter(agent => agent.status === status);
  }
  if (role) {
    filteredAgents = filteredAgents.filter(agent => agent.role === role);
  }
  if (teamId) {
    filteredAgents = filteredAgents.filter(agent => agent.teamId === teamId);
  }

  // Enhance with availability info for n8n
  const agentsWithAvailability = filteredAgents.map(agent => ({
    ...agent,
    isAvailable: agent.status === 'available',
    currentWorkload: Math.floor(Math.random() * 10), // Mock workload
    skills: ['general', 'technical', 'billing'], // Mock skills
    languages: ['en', 'es'], // Mock languages
    maxConcurrentCalls: 3,
    currentActiveCalls: agent.status === 'on-call' ? Math.floor(Math.random() * 3) : 0,
  }));

  return NextResponse.json(
    {
      agents: agentsWithAvailability,
      availableCount: agentsWithAvailability.filter(a => a.isAvailable).length,
      totalCount: agentsWithAvailability.length,
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
