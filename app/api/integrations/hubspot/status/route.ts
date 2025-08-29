import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if HubSpot client ID is configured
    if (!process.env.HUBSPOT_CLIENT_ID) {
      return NextResponse.json({ 
        connected: false, 
        error: 'HubSpot integration not configured' 
      });
    }

    // TODO: Check if user has valid HubSpot access token in database
    // For now, return false until token storage is implemented
    const isConnected = false;

    return NextResponse.json({ 
      connected: isConnected,
      service: 'hubspot'
    });
  } catch (error) {
    console.error('HubSpot status check error:', error);
    return NextResponse.json({ 
      connected: false, 
      error: 'Failed to check HubSpot connection status' 
    }, { status: 500 });
  }
}
