import { NextRequest, NextResponse } from 'next/server'

// Mock organization data - replace with actual database
const organizations = [
  {
    id: "org1",
    name: "Acme Corporation",
    domain: "acme.com",
    tier: "enterprise",
    settings: {
      allowedDomains: ["acme.com"],
      requireDomainEmail: true,
      enableSSO: true,
      maxUsers: 1000,
      features: ["advanced_analytics", "api_access", "white_label"]
    },
    integrations: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    rootUserId: "1",
    status: "active"
  }
]

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Verify the user's JWT token
    // 2. Get the user's organization ID
    // 3. Return the organization data
    
    const orgId = request.nextUrl.searchParams.get('id')
    
    if (orgId) {
      const organization = organizations.find(org => org.id === orgId)
      if (!organization) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
      }
      return NextResponse.json(organization)
    }

    return NextResponse.json(organizations)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.domain) {
      return NextResponse.json({ error: 'Name and domain are required' }, { status: 400 })
    }

    const newOrganization = {
      id: `org${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    }

    organizations.push(newOrganization)
    
    return NextResponse.json(newOrganization, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const orgId = data.id

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    const orgIndex = organizations.findIndex(org => org.id === orgId)
    if (orgIndex === -1) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    organizations[orgIndex] = {
      ...organizations[orgIndex],
      ...data,
      updatedAt: new Date()
    }

    return NextResponse.json(organizations[orgIndex])
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
