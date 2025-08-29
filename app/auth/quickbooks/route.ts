import { NextResponse } from 'next/server'

export async function GET() {
  // QuickBooks OAuth URL
  const clientId = process.env.QUICKBOOKS_CLIENT_ID || 'your-quickbooks-client-id'
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/auth/quickbooks/callback`)
  const scope = encodeURIComponent('com.intuit.quickbooks.accounting')
  
  const authUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&response_type=code&access_type=offline`
  
  return NextResponse.redirect(authUrl)
}
