import { NextRequest, NextResponse } from "next/server";

// Mock metrics data - in production, this would be calculated from your database
let agentMetrics = {
  tasksCompleted: 47,
  averageResponseTime: 1250,
  errorRate: 2.3,
  uptime: "14h 32m",
  activeWorkflows: 5,
  callsHandled: 23,
  ticketsCreated: 8,
  emailsSent: 12,
  meetingsScheduled: 3
};

export async function GET(request: NextRequest) {
  try {
    // In production, calculate these metrics from your database/logs
    
    // Simulate some real-time updates
    const now = new Date();
    const uptimeHours = Math.floor((now.getTime() % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const uptimeMinutes = Math.floor((now.getTime() % (60 * 60 * 1000)) / (60 * 1000));
    
    agentMetrics.uptime = `${uptimeHours}h ${uptimeMinutes}m`;
    agentMetrics.averageResponseTime = Math.floor(1000 + Math.random() * 500); // Simulate variation
    
    return NextResponse.json({
      success: true,
      metrics: agentMetrics
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to get agent metrics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Update metrics (called by your N8N agent to report performance)
    if (body.metrics) {
      agentMetrics = { ...agentMetrics, ...body.metrics };
    }
    
    return NextResponse.json({
      success: true,
      message: "Metrics updated",
      metrics: agentMetrics
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update metrics" },
      { status: 500 }
    );
  }
}
