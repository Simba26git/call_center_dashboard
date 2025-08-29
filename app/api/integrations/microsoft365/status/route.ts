import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if user has a valid Microsoft 365 token stored
    // In a real application, you would:
    // 1. Get the current user from session/JWT
    // 2. Check if they have a valid Microsoft access token in your database
    // 3. Optionally verify the token with Microsoft Graph API
    
    // For now, we'll check if environment variables are configured
    const clientId = process.env.MICROSOFT_CLIENT_ID
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET
    
    if (!clientId || !clientSecret) {
      return NextResponse.json({
        connected: false,
        error: 'Microsoft 365 integration not configured. Please contact your administrator.'
      })
    }

    // Here you would normally check the database for user's Microsoft tokens
    // For demonstration, we'll return not connected so users can see the connect flow
    return NextResponse.json({
      connected: false,
      error: 'Please connect your Microsoft 365 account to continue.'
    })
    
  } catch (error) {
    console.error('Microsoft 365 status check error:', error)
    return NextResponse.json({
      connected: false,
      error: 'Failed to check Microsoft 365 connection status.'
    }, { status: 500 })
  }
}
