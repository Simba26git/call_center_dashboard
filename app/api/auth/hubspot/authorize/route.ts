import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.HUBSPOT_CLIENT_ID;
    
    if (!clientId) {
      return NextResponse.json({ 
        error: 'HubSpot integration not configured' 
      }, { status: 500 });
    }

    // HubSpot OAuth scopes for CRM access
    const scopes = [
      'contacts',
      'content',
      'reports',
      'automation',
      'tickets',
      'files'
    ].join(' ');

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/hubspot/callback`;
    
    // Generate state parameter for security
    const state = Math.random().toString(36).substring(2, 15);
    
    const authUrl = new URL('https://app.hubspot.com/oauth/authorize');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('scope', scopes);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('state', state);
    
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('HubSpot authorization error:', error);
    return NextResponse.json({ 
      error: 'Failed to initiate HubSpot authorization' 
    }, { status: 500 });
  }
}
