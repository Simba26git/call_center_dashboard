import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (error) {
      console.error('Mailchimp OAuth error:', error);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/mailchimp?error=authorization_failed`);
    }
    
    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/mailchimp?error=no_code`);
    }

    const clientId = process.env.MAILCHIMP_CLIENT_ID;
    const clientSecret = process.env.MAILCHIMP_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/mailchimp?error=config_missing`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://login.mailchimp.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/mailchimp/callback`,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Token exchange failed');
    }

    const tokenData = await tokenResponse.json();
    
    // Get user info from Mailchimp
    const userResponse = await fetch(`https://${tokenData.dc}.api.mailchimp.com/3.0/`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });
    const userData = await userResponse.json();

    // TODO: Store tokens and user info in database
    console.log('Mailchimp connection successful:', {
      accountName: userData.account_name,
      accountId: userData.account_id,
      dc: tokenData.dc
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/mailchimp?connected=true`);
  } catch (error) {
    console.error('Mailchimp callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/mailchimp?error=callback_failed`);
  }
}
