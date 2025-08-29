import { NextRequest, NextResponse } from "next/server";

// Mock agent status data - in production, this would connect to your N8N instance
let agentStatus = {
  status: "online", // online, offline, busy
  lastSeen: new Date().toISOString(),
  agentInfo: {
    name: "N8N AI Agent",
    version: "1.0.0",
    workflowsActive: 3,
    tasksInQueue: 2
  }
};

export async function GET(request: NextRequest) {
  try {
    // In production, you would check your N8N instance health here
    // For now, return mock data
    
    return NextResponse.json({
      success: true,
      status: agentStatus.status,
      lastSeen: agentStatus.lastSeen,
      agentInfo: agentStatus.agentInfo,
      connected: agentStatus.status !== "offline"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to get agent status" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Update agent status (this would be called by your N8N agent)
    if (body.status) {
      agentStatus.status = body.status;
      agentStatus.lastSeen = new Date().toISOString();
    }
    
    if (body.agentInfo) {
      agentStatus.agentInfo = { ...agentStatus.agentInfo, ...body.agentInfo };
    }
    
    return NextResponse.json({
      success: true,
      message: "Agent status updated",
      status: agentStatus.status
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update agent status" },
      { status: 500 }
    );
  }
}
