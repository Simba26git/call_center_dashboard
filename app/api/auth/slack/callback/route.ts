import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  
  if (error) {
    console.error('Slack OAuth error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/slack?error=${encodeURIComponent(error)}`)
  }
  
  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/slack?error=no_authorization_code`)
  }
  
  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID || '',
        client_secret: process.env.SLACK_CLIENT_SECRET || '',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/slack/callback`,
      }),
    })
    
    const tokens = await tokenResponse.json()
    
    if (!tokens.ok) {
      console.error('Slack token exchange error:', tokens)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/slack?error=${encodeURIComponent(tokens.error || 'Token exchange failed')}`)
    }
    
    // Get team info
    const teamResponse = await fetch('https://slack.com/api/team.info', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    })
    
    const teamInfo = await teamResponse.json()
    
    if (teamInfo.ok) {
      // In a real application, you would:
      // 1. Get the current user from session/JWT
      // 2. Store the tokens in your database associated with the user
      // 3. Store team info and bot token for workspace operations
      
      console.log('Slack workspace connected:', teamInfo.team.name)
      
      // For now, we'll just redirect with success
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/slack?connected=true`)
    } else {
      console.error('Failed to get team info:', teamInfo)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/slack?error=failed_to_get_team_info`)
    }
    
  } catch (error) {
    console.error('Slack OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/apps/slack?error=callback_processing_failed`)
  }
}
