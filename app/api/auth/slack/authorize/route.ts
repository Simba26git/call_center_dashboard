import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const clientId = process.env.SLACK_CLIENT_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/slack/callback`
    
    if (!clientId) {
      return NextResponse.json({
        error: 'Slack integration not configured'
      }, { status: 500 })
    }

    // Slack OAuth scopes for call center functionality
    const scopes = [
      'channels:read',
      'channels:history', 
      'chat:write',
      'chat:write.public',
      'users:read',
      'users:read.email',
      'im:read',
      'im:history',
      'im:write',
      'mpim:read',
      'mpim:history',
      'mpim:write',
      'groups:read',
      'groups:history'
    ].join(',')

    const authUrl = new URL('https://slack.com/oauth/v2/authorize')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('scope', scopes)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')

    return NextResponse.redirect(authUrl.toString())
    
  } catch (error) {
    console.error('Slack authorization error:', error)
    return NextResponse.json({
      error: 'Failed to initiate Slack authorization'
    }, { status: 500 })
  }
}
