import { NextRequest, NextResponse } from "next/server";

// Mock agent activities data - in production, this would be stored in a database
let agentActivities: any[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    action: "call_received",
    details: "Processed incoming call from +1-555-0123, routed to available agent",
    status: "success",
    duration: 1250
  },
  {
    id: "2", 
    timestamp: new Date(Date.now() - 180000).toISOString(), // 3 minutes ago
    action: "ticket_created",
    details: "Created support ticket #T-2024-001 for customer John Doe - Account access issue",
    status: "success",
    duration: 890
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
    action: "customer_updated", 
    details: "Updated contact preferences for customer ID C-456789",
    status: "success",
    duration: 650
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
    action: "workflow_executed",
    details: "Executed follow-up email workflow for resolved tickets",
    status: "success",
    duration: 2100
  }
];

export async function GET(request: NextRequest) {
  try {
    // Return recent agent activities
    // In production, this would query your database/logs
    
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
    const recentActivities = agentActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    return NextResponse.json({
      success: true,
      activities: recentActivities,
      total: agentActivities.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to get agent activities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log new agent activity (called by your N8N agent)
    const newActivity = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: body.action || "unknown",
      details: body.details || "No details provided",
      status: body.status || "pending",
      duration: body.duration
    };
    
    agentActivities.unshift(newActivity);
    
    // Keep only the last 100 activities in memory
    if (agentActivities.length > 100) {
      agentActivities = agentActivities.slice(0, 100);
    }
    
    return NextResponse.json({
      success: true,
      message: "Activity logged",
      activity: newActivity
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to log activity" },
      { status: 500 }
    );
  }
}
