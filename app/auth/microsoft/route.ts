import { NextResponse } from 'next/server'

export async function GET() {
  // Microsoft 365 OAuth URL
  const clientId = process.env.MICROSOFT_CLIENT_ID || 'your-microsoft-client-id'
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/auth/microsoft/callback`)
  const scope = encodeURIComponent('https://graph.microsoft.com/User.Read https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Calendars.Read')
  
  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&response_mode=query`
  
  return NextResponse.redirect(authUrl)
}
