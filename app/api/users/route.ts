import { NextRequest, NextResponse } from 'next/server'

// Mock user data - replace with actual database
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "root@acme.com",
    role: "root",
    organizationId: "org1",
    permissions: ["*"],
    status: "available",
    integrations: {
      microsoft365: { connected: true, email: "john@acme.com" }
    },
    settings: {
      notifications: { email: true, slack: true, inApp: true },
      timezone: "UTC",
      language: "en"
    },
    createdAt: new Date(),
    lastLogin: new Date(),
    isActive: true
  },
  {
    id: "2", 
    name: "Sarah Wilson",
    email: "manager@acme.com",
    role: "manager",
    organizationId: "org1",
    teamId: "team1",
    permissions: ["user.read", "user.write", "team.manage"],
    status: "available",
    integrations: {
      microsoft365: { connected: false }
    },
    settings: {
      notifications: { email: true, slack: false, inApp: true },
      timezone: "UTC",
      language: "en"
    },
    createdAt: new Date(),
    lastLogin: new Date(),
    isActive: true
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "agent@acme.com",
    role: "agent",
    organizationId: "org1",
    teamId: "team1",
    permissions: ["interactions.read", "interactions.write", "customer.read"],
    status: "available",
    integrations: {
      microsoft365: { connected: false }
    },
    settings: {
      notifications: { email: true, slack: false, inApp: true },
      timezone: "UTC",
      language: "en"
    },
    createdAt: new Date(),
    lastLogin: new Date(),
    isActive: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const orgId = request.nextUrl.searchParams.get('organizationId')
    const role = request.nextUrl.searchParams.get('role')
    
    let filteredUsers = users
    
    if (orgId) {
      filteredUsers = filteredUsers.filter(user => user.organizationId === orgId)
    }
    
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role)
    }

    return NextResponse.json(filteredUsers)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.email || !data.role || !data.organizationId) {
      return NextResponse.json({ 
        error: 'Name, email, role, and organizationId are required' 
      }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = users.find(user => user.email === data.email)
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const newUser = {
      id: `user${Date.now()}`,
      ...data,
      permissions: data.permissions || [],
      status: "available",
      integrations: {},
      settings: {
        notifications: { email: true, slack: false, inApp: true },
        timezone: "UTC",
        language: "en"
      },
      createdAt: new Date(),
      isActive: true
    }

    users.push(newUser)
    
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const userId = data.id

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const userIndex = users.findIndex(user => user.id === userId)
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    users[userIndex] = {
      ...users[userIndex],
      ...data,
      updatedAt: new Date()
    }

    return NextResponse.json(users[userIndex])
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const userIndex = users.findIndex(user => user.id === userId)
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Instead of deleting, mark as inactive
    users[userIndex].isActive = false
    // users[userIndex].updatedAt = new Date()  // Will add this field when extending the type

    return NextResponse.json({ message: 'User deactivated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
