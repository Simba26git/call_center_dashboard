import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.ASANA_CLIENT_ID;
    
    if (!clientId) {
      return NextResponse.json({ 
        error: 'Asana integration not configured' 
      }, { status: 500 });
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/asana/callback`;
    
    // Generate state parameter for security
    const state = Math.random().toString(36).substring(2, 15);
    
    const authUrl = new URL('https://app.asana.com/-/oauth_authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('state', state);
    
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('Asana authorization error:', error);
    return NextResponse.json({ 
      error: 'Failed to initiate Asana authorization' 
    }, { status: 500 });
  }
}
