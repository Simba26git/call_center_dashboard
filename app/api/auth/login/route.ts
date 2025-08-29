import { NextRequest, NextResponse } from 'next/server'

// Mock authentication - replace with actual auth service
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "root@acme.com",
    password: "demo123", // In real app, this would be hashed
    role: "root",
    organizationId: "org1"
  },
  {
    id: "2",
    name: "Sarah Wilson", 
    email: "manager@acme.com",
    password: "demo123",
    role: "manager",
    organizationId: "org1"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "agent@acme.com", 
    password: "demo123",
    role: "agent",
    organizationId: "org1"
  }
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = users.find(u => u.email === email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check password (in real app, compare hashed passwords)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token (mock)
    const token = `jwt-token-${user.id}-${Date.now()}`

    // Return user data and token
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({
      user: userWithoutPassword,
      token,
      organization: {
        id: "org1",
        name: "Acme Corporation",
        domain: "acme.com",
        tier: "enterprise"
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
