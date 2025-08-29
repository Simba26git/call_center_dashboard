"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Users, UserPlus, Shield, Settings, Eye, MoreHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive";
  createdAt: string;
  lastLogin: string;
  permissions: string[];
}

interface ManagerPermissions {
  customer_management: boolean;
  ticket_management: boolean;
  order_management: boolean;
  qa_monitoring: boolean;
  reports: boolean;
  user_management: boolean;
}

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [managerPermissions, setManagerPermissions] = useState<ManagerPermissions | null>(null);
  const [showCreateEmployee, setShowCreateEmployee] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    permissions: [] as string[]
  });

  // Mock data - in real app, this would come from API
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      // Mock manager permissions (what this manager is allowed to grant)
      setManagerPermissions({
        customer_management: true,
        ticket_management: true,
        order_management: true,
        qa_monitoring: false, // Manager doesn't have QA monitoring
        reports: true,
        user_management: true
      });

      // Mock employee data
      setEmployees([
        {
          id: "emp_001",
          name: "John Smith",
          email: "john.smith@company.com",
          role: "Support Agent",
          department: "Customer Service",
          status: "active",
          createdAt: "2025-01-16",
          lastLogin: "2025-01-28",
          permissions: ["customer_management", "ticket_management"]
        },
        {
          id: "emp_002",
          name: "Emily Davis",
          email: "emily.davis@company.com",
          role: "Senior Support Agent",
          department: "Customer Service",
          status: "active",
          createdAt: "2025-01-17",
          lastLogin: "2025-01-28",
          permissions: ["customer_management", "ticket_management", "reports"]
        },
        {
          id: "emp_003",
          name: "Michael Brown",
          email: "michael.brown@company.com",
          role: "Sales Agent",
          department: "Sales",
          status: "active",
          createdAt: "2025-01-20",
          lastLogin: "2025-01-27",
          permissions: ["customer_management", "order_management"]
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const availableRoles = [
    "Support Agent",
    "Senior Support Agent",
    "Sales Agent",
    "Technical Support",
    "Customer Success"
  ];

  const availableDepartments = [
    "Customer Service",
    "Sales",
    "Technical Support",
    "Customer Success"
  ];

  const availablePermissions = [
    { id: "customer_management", label: "Customer Management", available: managerPermissions?.customer_management },
    { id: "ticket_management", label: "Ticket Management", available: managerPermissions?.ticket_management },
    { id: "order_management", label: "Order Management", available: managerPermissions?.order_management },
    { id: "reports", label: "Reports & Analytics", available: managerPermissions?.reports },
    { id: "qa_monitoring", label: "Quality Assurance", available: managerPermissions?.qa_monitoring }
  ].filter(p => p.available);

  const handleCreateEmployee = async () => {
    if (!newEmployeeData.name || !newEmployeeData.email || !newEmployeeData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newEmployee: Employee = {
      id: `emp_${Date.now()}`,
      name: newEmployeeData.name,
      email: newEmployeeData.email,
      role: newEmployeeData.role,
      department: newEmployeeData.department,
      status: "active",
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: "Never",
      permissions: newEmployeeData.permissions
    };

    setEmployees([...employees, newEmployee]);
    setNewEmployeeData({ name: "", email: "", role: "", department: "", permissions: [] });
    setShowCreateEmployee(false);

    toast({
      title: "Success",
      description: `Employee account created for ${newEmployee.name}`
    });
  };

  const handleToggleEmployeeStatus = (employeeId: string) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, status: emp.status === "active" ? "inactive" : "active" }
        : emp
    ));
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (user?.role !== "manager" && user?.role !== "root") {
    return (
      <div className="p-6">
        <Card>
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Only managers can access employee management.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Employee Management</h1>
            <p className="text-gray-600">Manage your team members and their permissions</p>
          </div>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          Manager Dashboard
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-gray-600">Under your management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {employees.filter(emp => emp.status === "active").length}
            </div>
            <p className="text-xs text-gray-600">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(employees.map(emp => emp.department)).size}
            </div>
            <p className="text-xs text-gray-600">Different departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Recent Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {employees.filter(emp => emp.lastLogin !== "Never").length}
            </div>
            <p className="text-xs text-gray-600">Logged in recently</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Members</CardTitle>
            <Dialog open={showCreateEmployee} onOpenChange={setShowCreateEmployee}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Employee Account</DialogTitle>
                  <DialogDescription>
                    Add a new team member with appropriate permissions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={newEmployeeData.name}
                        onChange={(e) => setNewEmployeeData({ ...newEmployeeData, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmployeeData.email}
                        onChange={(e) => setNewEmployeeData({ ...newEmployeeData, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role">Role *</Label>
                      <Select value={newEmployeeData.role} onValueChange={(value) => setNewEmployeeData({ ...newEmployeeData, role: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRoles.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select value={newEmployeeData.department} onValueChange={(value) => setNewEmployeeData({ ...newEmployeeData, department: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDepartments.map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Permissions</Label>
                    <p className="text-sm text-gray-600 mb-3">Select which features this employee can access</p>
                    <div className="grid grid-cols-2 gap-3">
                      {availablePermissions.map((permission) => (
                        <label key={permission.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={newEmployeeData.permissions.includes(permission.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewEmployeeData({
                                  ...newEmployeeData,
                                  permissions: [...newEmployeeData.permissions, permission.id]
                                });
                              } else {
                                setNewEmployeeData({
                                  ...newEmployeeData,
                                  permissions: newEmployeeData.permissions.filter(p => p !== permission.id)
                                });
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{permission.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowCreateEmployee(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateEmployee}>
                      Create Employee
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-gray-600">{employee.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{employee.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {employee.permissions.slice(0, 2).map((permission) => {
                        const permLabel = availablePermissions.find(p => p.id === permission)?.label || permission;
                        return (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permLabel}
                          </Badge>
                        );
                      })}
                      {employee.permissions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{employee.permissions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleEmployeeStatus(employee.id)}>
                          <Shield className="h-4 w-4 mr-2" />
                          {employee.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
