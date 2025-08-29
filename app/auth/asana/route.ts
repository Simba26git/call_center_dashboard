import { NextResponse } from 'next/server'

export async function GET() {
  // Asana OAuth URL
  const clientId = process.env.ASANA_CLIENT_ID || 'your-asana-client-id'
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/auth/asana/callback`)
  
  const authUrl = `https://app.asana.com/-/oauth_authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=default`
  
  return NextResponse.redirect(authUrl)
}
