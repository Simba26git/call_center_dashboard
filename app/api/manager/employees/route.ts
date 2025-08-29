import { NextRequest, NextResponse } from 'next/server';

// Mock employee data - in a real app, this would come from your database
const mockEmployees = {
  'mgr_001': [
    {
      id: 'emp_001',
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'Support Agent',
      department: 'Customer Service',
      status: 'active',
      createdAt: '2025-01-16',
      lastLogin: '2025-01-28',
      permissions: ['customer_management', 'ticket_management']
    },
    {
      id: 'emp_002',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'Senior Support Agent',
      department: 'Customer Service',
      status: 'active',
      createdAt: '2025-01-17',
      lastLogin: '2025-01-28',
      permissions: ['customer_management', 'ticket_management', 'reports']
    }
  ],
  'mgr_002': [
    {
      id: 'emp_003',
      name: 'Michael Brown',
      email: 'michael.brown@company.com',
      role: 'Sales Agent',
      department: 'Sales',
      status: 'active',
      createdAt: '2025-01-20',
      lastLogin: '2025-01-27',
      permissions: ['customer_management', 'order_management']
    }
  ]
};

const mockManagerPermissions = {
  'mgr_001': {
    customer_management: true,
    ticket_management: true,
    order_management: true,
    qa_monitoring: false,
    reports: true,
    user_management: true
  },
  'mgr_002': {
    customer_management: true,
    ticket_management: true,
    order_management: true,
    qa_monitoring: false,
    reports: true,
    user_management: true
  }
};

export async function GET(req: NextRequest) {
  try {
    // In a real app, you would get the manager ID from the authenticated user
    const managerId = 'mgr_001'; // This would come from the authenticated session
    
    const employees = mockEmployees[managerId as keyof typeof mockEmployees] || [];
    const permissions = mockManagerPermissions[managerId as keyof typeof mockManagerPermissions];

    return NextResponse.json({
      employees,
      permissions,
      success: true
    });
  } catch (error) {
    console.error('Error fetching manager data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, data } = body;

    // In a real app, you would authenticate and authorize the manager here
    // Only managers should be able to perform these actions on their teams

    switch (action) {
      case 'create_employee':
        // In a real app, you would create the employee in your database
        // and send them an invitation email with login credentials
        console.log('Creating employee:', data);
        
        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        
        return NextResponse.json({
          success: true,
          message: 'Employee account created successfully',
          employee: {
            id: `emp_${Date.now()}`,
            ...data,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
            lastLogin: 'Never'
          },
          temporaryPassword: tempPassword
        });

      case 'update_employee':
        // In a real app, you would update the employee in your database
        console.log('Updating employee:', data);
        
        return NextResponse.json({
          success: true,
          message: 'Employee updated successfully'
        });

      case 'toggle_employee_status':
        // In a real app, you would update the employee status in your database
        console.log('Toggling employee status:', data);
        
        return NextResponse.json({
          success: true,
          message: `Employee ${data.status === 'active' ? 'activated' : 'deactivated'} successfully`
        });

      case 'delete_employee':
        // In a real app, you would soft delete or archive the employee
        console.log('Deleting employee:', data);
        
        return NextResponse.json({
          success: true,
          message: 'Employee account deleted successfully'
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error managing employees:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
