import { NextResponse } from 'next/server'

export async function GET() {
  // Mailchimp OAuth URL
  const clientId = process.env.MAILCHIMP_CLIENT_ID || 'your-mailchimp-client-id'
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/auth/mailchimp/callback`)
  
  const authUrl = `https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`
  
  return NextResponse.redirect(authUrl)
}
