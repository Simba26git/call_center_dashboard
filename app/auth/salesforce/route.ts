import { NextResponse } from 'next/server'

export async function GET() {
  // Salesforce OAuth URL
  const clientId = process.env.SALESFORCE_CLIENT_ID || 'your-salesforce-client-id'
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/auth/salesforce/callback`)
  
  const authUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`
  
  return NextResponse.redirect(authUrl)
}
