import { NextRequest, NextResponse } from 'next/server';

// Mock permissions data to avoid circular dependencies
const mockPermissions = {
  appPermissions: [
    { id: 'slack', name: 'Slack', enabled: true, category: 'communication' },
    { id: 'asana', name: 'Asana', enabled: true, category: 'project-management' },
    { id: 'hubspot', name: 'HubSpot', enabled: true, category: 'crm' },
    { id: 'salesforce', name: 'Salesforce', enabled: true, category: 'crm' },
    { id: 'mailchimp', name: 'Mailchimp', enabled: true, category: 'marketing' },
    { id: 'quickbooks', name: 'QuickBooks', enabled: true, category: 'finance' },
    { id: 'stripe', name: 'Stripe', enabled: true, category: 'payments' }
  ],
  featurePermissions: [
    { id: 'user-management', name: 'User Management', enabled: false, category: 'admin' },
    { id: 'organization', name: 'Organization Settings', enabled: false, category: 'admin' },
    { id: 'worker-permissions', name: 'Worker Permissions', enabled: false, category: 'admin' }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const appId = searchParams.get('appId');
    const featureId = searchParams.get('featureId');

    // TODO: In production, get actual user role from database/session
    const userRole: string = 'root'; // For development, assume root role

    if (appId) {
      // Root users (admins) have access to all apps
      if (userRole === 'root') {
        return NextResponse.json({ 
          hasAccess: true,
          appName: appId,
          reason: 'Root admin access'
        });
      }

      // Check if worker has access to specific app
      const app = mockPermissions.appPermissions?.find((app: any) => app.id === appId);
      return NextResponse.json({ 
        hasAccess: app?.enabled || false,
        appName: app?.name || appId
      });
    }

    if (featureId) {
      // Root users (admins) have access to all features
      if (userRole === 'root') {
        return NextResponse.json({ 
          hasAccess: true,
          featureName: featureId,
          reason: 'Root admin access'
        });
      }

      // Check if worker has access to specific feature
      const feature = mockPermissions.featurePermissions?.find((feature: any) => feature.id === featureId);
      return NextResponse.json({ 
        hasAccess: feature?.enabled || false,
        featureName: feature?.name || featureId
      });
    }

    // Return all permissions for the user
    // Root users get all permissions enabled
    if (userRole === 'root') {
      return NextResponse.json({
        appPermissions: mockPermissions.appPermissions?.map((app: any) => ({ ...app, enabled: true })) || [],
        featurePermissions: mockPermissions.featurePermissions?.map((feature: any) => ({ ...feature, enabled: true })) || [],
        userRole: 'root'
      });
    }

    // Return all permissions for the user
    return NextResponse.json({
      appPermissions: mockPermissions.appPermissions || [],
      featurePermissions: mockPermissions.featurePermissions || [],
      userRole
    });
  } catch (error) {
    console.error('Failed to check worker permissions:', error);
    return NextResponse.json({ 
      error: 'Failed to check permissions',
      hasAccess: false
    }, { status: 500 });
  }
}
