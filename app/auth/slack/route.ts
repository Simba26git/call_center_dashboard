import { NextResponse } from 'next/server'

export async function GET() {
  // Slack OAuth URL
  const clientId = process.env.SLACK_CLIENT_ID || 'your-slack-client-id'
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/auth/slack/callback`)
  const scope = encodeURIComponent('channels:read chat:write users:read')
  
  const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`
  
  return NextResponse.redirect(authUrl)
}
