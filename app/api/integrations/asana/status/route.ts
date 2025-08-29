import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if Asana client ID is configured
    if (!process.env.ASANA_CLIENT_ID) {
      return NextResponse.json({ 
        connected: false, 
        error: 'Asana integration not configured' 
      });
    }

    // TODO: Check if user has valid Asana access token in database
    // For now, return false until token storage is implemented
    const isConnected = false;

    return NextResponse.json({ 
      connected: isConnected,
      service: 'asana'
    });
  } catch (error) {
    console.error('Asana status check error:', error);
    return NextResponse.json({ 
      connected: false, 
      error: 'Failed to check Asana connection status' 
    }, { status: 500 });
  }
}
