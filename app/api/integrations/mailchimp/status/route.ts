import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if Mailchimp client ID is configured
    if (!process.env.MAILCHIMP_CLIENT_ID) {
      return NextResponse.json({ 
        connected: false, 
        error: 'Mailchimp integration not configured' 
      });
    }

    // TODO: Check if user has valid Mailchimp access token in database
    // For now, return false until token storage is implemented
    const isConnected = false;

    return NextResponse.json({ 
      connected: isConnected,
      service: 'mailchimp'
    });
  } catch (error) {
    console.error('Mailchimp status check error:', error);
    return NextResponse.json({ 
      connected: false, 
      error: 'Failed to check Mailchimp connection status' 
    }, { status: 500 });
  }
}
