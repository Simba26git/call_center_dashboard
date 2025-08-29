import { NextRequest, NextResponse } from 'next/server';

// Mock subscription data - in a real app, this would come from your billing provider (Stripe, etc.)
const mockSubscriptions = {
  'org_123': {
    id: 'sub_1234567890',
    planName: 'Professional',
    planId: 'professional',
    status: 'active',
    currentPeriodStart: '2025-01-01',
    currentPeriodEnd: '2025-02-01',
    maxUsers: 25,
    usedUsers: 8,
    features: [
      'Up to 25 agents',
      'Advanced analytics',
      'Quality monitoring',
      'All integrations',
      'Manager roles',
      'Priority support',
      'Desktop & Web access'
    ],
    price: 79,
    billing: 'monthly'
  }
};

const mockManagers = {
  'org_123': [
    {
      id: 'mgr_001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      createdAt: '2025-01-15',
      employeeCount: 5,
      status: 'active',
      permissions: ['customer_management', 'ticket_management', 'qa_monitoring']
    },
    {
      id: 'mgr_002',
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      createdAt: '2025-01-20',
      employeeCount: 3,
      status: 'active',
      permissions: ['customer_management', 'order_management', 'reports']
    }
  ]
};

export async function GET(req: NextRequest) {
  try {
    // In a real app, you would get the organization ID from the authenticated user
    const orgId = 'org_123';
    
    const subscription = mockSubscriptions[orgId as keyof typeof mockSubscriptions];
    const managers = mockManagers[orgId as keyof typeof mockManagers] || [];

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json({
      subscription,
      managers,
      success: true
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, data } = body;

    // In a real app, you would authenticate and authorize the user here
    // Only root accounts should be able to perform these actions

    switch (action) {
      case 'create_manager':
        // In a real app, you would create the manager in your database
        // and send them an invitation email
        console.log('Creating manager:', data);
        
        return NextResponse.json({
          success: true,
          message: 'Manager account created successfully',
          manager: {
            id: `mgr_${Date.now()}`,
            ...data,
            createdAt: new Date().toISOString().split('T')[0],
            employeeCount: 0,
            status: 'active'
          }
        });

      case 'update_subscription':
        // In a real app, you would update the subscription via your billing provider
        console.log('Updating subscription:', data);
        
        return NextResponse.json({
          success: true,
          message: 'Subscription updated successfully'
        });

      case 'cancel_subscription':
        // In a real app, you would cancel the subscription via your billing provider
        console.log('Cancelling subscription');
        
        return NextResponse.json({
          success: true,
          message: 'Subscription cancellation scheduled'
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error managing subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
