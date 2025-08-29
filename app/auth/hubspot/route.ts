import { NextResponse } from 'next/server'

export async function GET() {
  // HubSpot OAuth URL
  const clientId = process.env.HUBSPOT_CLIENT_ID || 'your-hubspot-client-id'
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/auth/hubspot/callback`)
  const scope = encodeURIComponent('contacts crm.objects.contacts.read crm.objects.contacts.write')
  
  const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`
  
  return NextResponse.redirect(authUrl)
}
