import { NextResponse } from 'next/server'

export async function GET() {
  // Stripe OAuth URL
  const clientId = process.env.STRIPE_CLIENT_ID || 'your-stripe-client-id'
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/auth/stripe/callback`)
  
  const authUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=read_write`
  
  return NextResponse.redirect(authUrl)
}
