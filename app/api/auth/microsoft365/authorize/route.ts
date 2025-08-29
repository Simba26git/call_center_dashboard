import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const clientId = process.env.MICROSOFT_CLIENT_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/microsoft365/callback`
    
    if (!clientId) {
      return NextResponse.json({
        error: 'Microsoft 365 integration not configured'
      }, { status: 500 })
    }

    // Microsoft 365 OAuth scopes for call center functionality
    const scopes = [
      'https://graph.microsoft.com/User.Read',
      'https://graph.microsoft.com/Mail.Read',
      'https://graph.microsoft.com/Mail.Send',
      'https://graph.microsoft.com/Calendars.Read',
      'https://graph.microsoft.com/Calendars.ReadWrite',
      'https://graph.microsoft.com/Files.Read',
      'https://graph.microsoft.com/Files.ReadWrite'
    ].join(' ')

    const authUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', scopes)
    authUrl.searchParams.set('response_mode', 'query')
    authUrl.searchParams.set('prompt', 'consent') // Force consent screen to show all permissions

    return NextResponse.redirect(authUrl.toString())
    
  } catch (error) {
    console.error('Microsoft 365 authorization error:', error)
    return NextResponse.json({
      error: 'Failed to initiate Microsoft 365 authorization'
    }, { status: 500 })
  }
}
