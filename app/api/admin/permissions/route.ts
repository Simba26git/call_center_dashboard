import { NextRequest, NextResponse } from 'next/server';

interface AppPermission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
  icon?: string;
}

interface FeaturePermission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
}

interface PermissionsRequest {
  appPermissions: AppPermission[];
  featurePermissions: FeaturePermission[];
}

// In-memory storage for permissions (replace with database in production)
let currentPermissions: PermissionsRequest = {
  appPermissions: [],
  featurePermissions: []
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(currentPermissions);
  } catch (error) {
    console.error('Failed to get permissions:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve permissions' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: In production, verify that the requesting user has root/admin role
    // This endpoint should only be accessible to root users (admins)
    
    const body: PermissionsRequest = await request.json();
    
    // Validate the request body
    if (!body.appPermissions || !body.featurePermissions) {
      return NextResponse.json({ 
        error: 'Invalid permissions data' 
      }, { status: 400 });
    }

    // Store permissions (in production, save to database)
    currentPermissions = {
      appPermissions: body.appPermissions,
      featurePermissions: body.featurePermissions
    };

    // TODO: In production, you would:
    // 1. Validate admin authentication
    // 2. Save to database
    // 3. Broadcast changes to connected workers
    // 4. Log the permission changes for audit

    console.log('Permissions updated:', {
      enabledApps: body.appPermissions.filter(app => app.enabled).map(app => app.name),
      enabledFeatures: body.featurePermissions.filter(feature => feature.enabled).map(feature => feature.name),
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Permissions updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to save permissions:', error);
    return NextResponse.json({ 
      error: 'Failed to save permissions' 
    }, { status: 500 });
  }
}
