import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  
  if (error) {
    console.error('Microsoft 365 OAuth error:', error, errorDescription)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/microsoft365?error=${encodeURIComponent(errorDescription || error)}`)
  }
  
  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/microsoft365?error=no_authorization_code`)
  }
  
  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID || '',
        client_secret: process.env.MICROSOFT_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/microsoft365/callback`,
      }),
    })
    
    const tokens = await tokenResponse.json()
    
    if (tokens.error) {
      console.error('Microsoft token exchange error:', tokens)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/microsoft365?error=${encodeURIComponent(tokens.error_description || 'Token exchange failed')}`)
    }
    
    // Get user info from Microsoft Graph
    const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    })
    
    const userInfo = await userResponse.json()
    
    if (userResponse.ok) {
      // In a real application, you would:
      // 1. Get the current user from session/JWT
      // 2. Store the tokens in your database associated with the user
      // 3. Store refresh token securely for long-term access
      
      console.log('Microsoft 365 user connected:', userInfo.displayName, userInfo.mail)
      
      // For now, we'll just redirect with success
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/microsoft365?connected=true`)
    } else {
      console.error('Failed to get user info:', userInfo)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/microsoft365?error=failed_to_get_user_info`)
    }
    
  } catch (error) {
    console.error('Microsoft 365 OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/microsoft365?error=callback_processing_failed`)
  }
}
