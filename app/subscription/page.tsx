"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Crown, Users, CreditCard, Calendar, Settings, Plus, UserPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  planName: string;
  planId: string;
  status: "active" | "cancelled" | "expired";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  maxUsers: number;
  usedUsers: number;
  features: string[];
  price: number;
  billing: "monthly" | "annual";
}

interface Manager {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  employeeCount: number;
  status: "active" | "inactive";
  permissions: string[];
}

interface Employee {
  id: string;
  name: string;
  email: string;
  managerId: string;
  createdAt: string;
  status: "active" | "inactive";
  role: string;
}

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateManager, setShowCreateManager] = useState(false);
  const [newManagerData, setNewManagerData] = useState({
    name: "",
    email: "",
    permissions: [] as string[]
  });

  // Mock data - in real app, this would come from API
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setSubscription({
        id: "sub_1234567890",
        planName: "Professional",
        planId: "professional",
        status: "active",
        currentPeriodStart: "2025-01-01",
        currentPeriodEnd: "2025-02-01",
        maxUsers: 25,
        usedUsers: 8,
        features: [
          "Up to 25 agents",
          "Advanced analytics",
          "Quality monitoring",
          "All integrations",
          "Manager roles",
          "Priority support",
          "Desktop & Web access"
        ],
        price: 79,
        billing: "monthly"
      });

      setManagers([
        {
          id: "mgr_001",
          name: "Sarah Johnson",
          email: "sarah.johnson@company.com",
          createdAt: "2025-01-15",
          employeeCount: 5,
          status: "active",
          permissions: ["customer_management", "ticket_management", "qa_monitoring"]
        },
        {
          id: "mgr_002",
          name: "Mike Chen",
          email: "mike.chen@company.com",
          createdAt: "2025-01-20",
          employeeCount: 3,
          status: "active",
          permissions: ["customer_management", "order_management", "reports"]
        }
      ]);

      setEmployees([
        {
          id: "emp_001",
          name: "John Smith",
          email: "john.smith@company.com",
          managerId: "mgr_001",
          createdAt: "2025-01-16",
          status: "active",
          role: "Support Agent"
        },
        {
          id: "emp_002",
          name: "Emily Davis",
          email: "emily.davis@company.com",
          managerId: "mgr_001",
          createdAt: "2025-01-17",
          status: "active",
          role: "Senior Support Agent"
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateManager = async () => {
    if (!newManagerData.name || !newManagerData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newManager: Manager = {
      id: `mgr_${Date.now()}`,
      name: newManagerData.name,
      email: newManagerData.email,
      createdAt: new Date().toISOString().split('T')[0],
      employeeCount: 0,
      status: "active",
      permissions: newManagerData.permissions
    };

    setManagers([...managers, newManager]);
    setNewManagerData({ name: "", email: "", permissions: [] });
    setShowCreateManager(false);

    toast({
      title: "Success",
      description: "Manager account created successfully"
    });
  };

  const availablePermissions = [
    { id: "customer_management", label: "Customer Management" },
    { id: "ticket_management", label: "Ticket Management" },
    { id: "order_management", label: "Order Management" },
    { id: "qa_monitoring", label: "Quality Assurance" },
    { id: "reports", label: "Reports & Analytics" },
    { id: "user_management", label: "Employee Management" }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (user?.role !== "root") {
    return (
      <div className="p-6">
        <Card>
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Only the root account (subscription owner) can access subscription management.
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
          <Crown className="h-8 w-8 text-yellow-600" />
          <div>
            <h1 className="text-3xl font-bold">Subscription Management</h1>
            <p className="text-gray-600">Manage your plan, users, and billing</p>
          </div>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          Root Account
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="managers">Managers</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscription && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-2">
                      {subscription.planName} Plan
                    </h3>
                    <p className="text-gray-600 mb-4">
                      ${subscription.price}/{subscription.billing === "monthly" ? "month" : "year"}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Status:</span>
                        <Badge variant={subscription.status === "active" ? "default" : "destructive"}>
                          {subscription.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Current period:</span>
                        <span>{subscription.currentPeriodStart} - {subscription.currentPeriodEnd}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Users:</span>
                        <span>{subscription.usedUsers} / {subscription.maxUsers}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Included Features:</h4>
                    <ul className="space-y-1 text-sm">
                      {subscription.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Managers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{managers.length}</div>
                <p className="text-xs text-gray-600">Active manager accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
                <p className="text-xs text-gray-600">Active employee accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">User Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {subscription ? Math.round((subscription.usedUsers / subscription.maxUsers) * 100) : 0}%
                </div>
                <p className="text-xs text-gray-600">
                  {subscription?.usedUsers} of {subscription?.maxUsers} users
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="managers" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Manager Accounts</h2>
            <Dialog open={showCreateManager} onOpenChange={setShowCreateManager}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Manager
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Manager Account</DialogTitle>
                  <DialogDescription>
                    Create a new manager account that can manage employees
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newManagerData.name}
                      onChange={(e) => setNewManagerData({ ...newManagerData, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newManagerData.email}
                      onChange={(e) => setNewManagerData({ ...newManagerData, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {availablePermissions.map((permission) => (
                        <label key={permission.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newManagerData.permissions.includes(permission.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewManagerData({
                                  ...newManagerData,
                                  permissions: [...newManagerData.permissions, permission.id]
                                });
                              } else {
                                setNewManagerData({
                                  ...newManagerData,
                                  permissions: newManagerData.permissions.filter(p => p !== permission.id)
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
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCreateManager(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateManager}>
                      Create Manager
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {managers.map((manager) => (
              <Card key={manager.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{manager.name}</h3>
                        <p className="text-sm text-gray-600">{manager.email}</p>
                        <p className="text-xs text-gray-500">
                          Created: {manager.createdAt} • {manager.employeeCount} employees
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={manager.status === "active" ? "default" : "secondary"}>
                        {manager.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Permissions:</h4>
                    <div className="flex flex-wrap gap-1">
                      {manager.permissions.map((permission) => {
                        const permLabel = availablePermissions.find(p => p.id === permission)?.label || permission;
                        return (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permLabel}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your subscription and payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Current Plan</h3>
                  <p className="text-2xl font-bold text-blue-600">Professional</p>
                  <p className="text-gray-600">$79/month</p>
                  <Button className="mt-2" variant="outline" size="sm">
                    Change Plan
                  </Button>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Next Billing</h3>
                  <p className="text-lg font-semibold">February 1, 2025</p>
                  <p className="text-gray-600">$79.00</p>
                  <Button className="mt-2" variant="outline" size="sm">
                    Update Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">January 2025</p>
                    <p className="text-sm text-gray-600">Professional Plan</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$79.00</p>
                    <Badge variant="default" className="text-xs">Paid</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">December 2024</p>
                    <p className="text-sm text-gray-600">Professional Plan</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$79.00</p>
                    <Badge variant="default" className="text-xs">Paid</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Settings</CardTitle>
              <CardDescription>Configure your subscription preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto-renewal</h3>
                    <p className="text-sm text-gray-600">Automatically renew your subscription</p>
                  </div>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email notifications</h3>
                    <p className="text-sm text-gray-600">Receive billing and usage alerts</p>
                  </div>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Usage alerts</h3>
                    <p className="text-sm text-gray-600">Get notified when approaching user limits</p>
                  </div>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Cancel subscription</h3>
                    <p className="text-sm text-gray-600">Cancel your subscription at the end of the current period</p>
                  </div>
                  <Button variant="destructive" size="sm">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
