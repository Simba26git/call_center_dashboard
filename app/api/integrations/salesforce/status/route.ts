import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if Salesforce client ID is configured
    if (!process.env.SALESFORCE_CLIENT_ID) {
      return NextResponse.json({ 
        connected: false, 
        error: 'Salesforce integration not configured' 
      });
    }

    // TODO: Check if user has valid Salesforce access token in database
    // For now, return false until token storage is implemented
    const isConnected = false;

    return NextResponse.json({ 
      connected: isConnected,
      service: 'salesforce'
    });
  } catch (error) {
    console.error('Salesforce status check error:', error);
    return NextResponse.json({ 
      connected: false, 
      error: 'Failed to check Salesforce connection status' 
    }, { status: 500 });
  }
}
