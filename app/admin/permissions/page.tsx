'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth';
import { 
  Settings, 
  Users, 
  Shield, 
  Eye, 
  EyeOff,
  Save,
  RefreshCw,
  Lock,
  Unlock,
  Crown
} from 'lucide-react';

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

export default function AdminPermissionsPage() {
  const { isAdmin, user } = useAuth();
  const [appPermissions, setAppPermissions] = useState<AppPermission[]>([
    {
      id: 'microsoft365',
      name: 'Microsoft 365',
      description: 'Access to Outlook, Calendar, OneDrive, and Teams',
      enabled: true,
      category: 'productivity',
      icon: '📧'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and messaging',
      enabled: true,
      category: 'communication',
      icon: '💬'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'CRM, contacts, deals, and marketing automation',
      enabled: true,
      category: 'crm',
      icon: '🎯'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Advanced CRM and sales pipeline management',
      enabled: false,
      category: 'crm',
      icon: '☁️'
    },
    {
      id: 'asana',
      name: 'Asana',
      description: 'Project management and task tracking',
      enabled: true,
      category: 'productivity',
      icon: '📋'
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Email marketing and automation',
      enabled: false,
      category: 'marketing',
      icon: '📬'
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'Financial management and invoicing',
      enabled: false,
      category: 'finance',
      icon: '💰'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing and billing',
      enabled: false,
      category: 'finance',
      icon: '💳'
    }
  ]);

  const [featurePermissions, setFeaturePermissions] = useState<FeaturePermission[]>([
    {
      id: 'view_customer_data',
      name: 'View Customer Data',
      description: 'Access to customer profiles and personal information',
      enabled: true,
      category: 'data_access'
    },
    {
      id: 'edit_customer_data',
      name: 'Edit Customer Data',
      description: 'Ability to modify customer information',
      enabled: false,
      category: 'data_access'
    },
    {
      id: 'view_orders',
      name: 'View Orders',
      description: 'Access to order history and details',
      enabled: true,
      category: 'orders'
    },
    {
      id: 'process_refunds',
      name: 'Process Refunds',
      description: 'Ability to initiate refunds and returns',
      enabled: false,
      category: 'orders'
    },
    {
      id: 'create_tickets',
      name: 'Create Tickets',
      description: 'Ability to create support tickets',
      enabled: true,
      category: 'support'
    },
    {
      id: 'resolve_tickets',
      name: 'Resolve Tickets',
      description: 'Ability to close and resolve tickets',
      enabled: true,
      category: 'support'
    },
    {
      id: 'escalate_tickets',
      name: 'Escalate Tickets',
      description: 'Ability to escalate tickets to managers',
      enabled: true,
      category: 'support'
    },
    {
      id: 'view_reports',
      name: 'View Reports',
      description: 'Access to analytics and performance reports',
      enabled: false,
      category: 'reporting'
    },
    {
      id: 'export_data',
      name: 'Export Data',
      description: 'Ability to export customer and order data',
      enabled: false,
      category: 'reporting'
    }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const toggleAppPermission = (appId: string) => {
    setAppPermissions(prev => 
      prev.map(app => 
        app.id === appId ? { ...app, enabled: !app.enabled } : app
      )
    );
  };

  const toggleFeaturePermission = (featureId: string) => {
    setFeaturePermissions(prev => 
      prev.map(feature => 
        feature.id === featureId ? { ...feature, enabled: !feature.enabled } : feature
      )
    );
  };

  const savePermissions = async () => {
    setIsSaving(true);
    try {
      // TODO: API call to save permissions
      await fetch('/api/admin/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appPermissions,
          featurePermissions
        }),
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save permissions:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    // Reset to default permissions
    setAppPermissions(prev => prev.map(app => ({ ...app, enabled: false })));
    setFeaturePermissions(prev => prev.map(feature => ({ ...feature, enabled: false })));
  };

  const enableAllApps = () => {
    setAppPermissions(prev => prev.map(app => ({ ...app, enabled: true })));
  };

  const enableAllFeatures = () => {
    setFeaturePermissions(prev => prev.map(feature => ({ ...feature, enabled: true })));
  };

  const groupedApps = appPermissions.reduce((acc, app) => {
    if (!acc[app.category]) {
      acc[app.category] = [];
    }
    acc[app.category].push(app);
    return acc;
  }, {} as Record<string, AppPermission[]>);

  const groupedFeatures = featurePermissions.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, FeaturePermission[]>);

  const categoryLabels: Record<string, string> = {
    productivity: 'Productivity Tools',
    communication: 'Communication',
    crm: 'Customer Relationship Management',
    marketing: 'Marketing Tools',
    finance: 'Financial Tools',
    data_access: 'Data Access',
    orders: 'Order Management',
    support: 'Support Functions',
    reporting: 'Reporting & Analytics'
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {!isAdmin ? (
              <div className="flex items-center justify-center h-64">
                <Card className="w-96">
                  <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Shield className="h-8 w-8 text-red-500" />
                      <Crown className="h-8 w-8 text-yellow-500" />
                    </div>
                    <CardTitle className="text-red-600">Access Denied</CardTitle>
                    <CardDescription>
                      Only Root Administrators can access permission management
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Current Role: <Badge variant="outline">{user?.role}</Badge>
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">Worker Permissions</h1>
                    <Crown className="h-6 w-6 text-yellow-500" />
                  </div>
                  <p className="text-muted-foreground">
                    Control which apps and features workers can access (Root Admin Only)
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {lastSaved && (
                    <span className="text-sm text-muted-foreground">
                      Last saved: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                  <Button onClick={savePermissions} disabled={isSaving}>
                    {isSaving ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="apps" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="apps">App Access</TabsTrigger>
                  <TabsTrigger value="features">Feature Permissions</TabsTrigger>
                  <TabsTrigger value="roles">Role Templates</TabsTrigger>
                </TabsList>

                <TabsContent value="apps" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Application Access Control
                          </CardTitle>
                          <CardDescription>
                            Select which third-party apps workers can connect and access
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={resetToDefaults}>
                            <Lock className="h-4 w-4 mr-2" />
                            Disable All
                          </Button>
                          <Button variant="outline" size="sm" onClick={enableAllApps}>
                            <Unlock className="h-4 w-4 mr-2" />
                            Enable All
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {Object.entries(groupedApps).map(([category, apps]) => (
                        <div key={category} className="space-y-3">
                          <h3 className="text-lg font-semibold text-foreground">
                            {categoryLabels[category]}
                          </h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            {apps.map((app) => (
                              <div
                                key={app.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="text-2xl">{app.icon}</div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <Label htmlFor={app.id} className="font-medium">
                                        {app.name}
                                      </Label>
                                      {app.enabled ? (
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                          <Eye className="h-3 w-3 mr-1" />
                                          Enabled
                                        </Badge>
                                      ) : (
                                        <Badge variant="secondary">
                                          <EyeOff className="h-3 w-3 mr-1" />
                                          Disabled
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {app.description}
                                    </p>
                                  </div>
                                </div>
                                <Switch
                                  id={app.id}
                                  checked={app.enabled}
                                  onCheckedChange={() => toggleAppPermission(app.id)}
                                />
                              </div>
                            ))}
                          </div>
                          <Separator />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Feature Permissions
                          </CardTitle>
                          <CardDescription>
                            Control what actions workers can perform within the system
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setFeaturePermissions(prev => prev.map(f => ({ ...f, enabled: false })))}>
                            <Lock className="h-4 w-4 mr-2" />
                            Disable All
                          </Button>
                          <Button variant="outline" size="sm" onClick={enableAllFeatures}>
                            <Unlock className="h-4 w-4 mr-2" />
                            Enable All
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {Object.entries(groupedFeatures).map(([category, features]) => (
                        <div key={category} className="space-y-3">
                          <h3 className="text-lg font-semibold text-foreground">
                            {categoryLabels[category]}
                          </h3>
                          <div className="space-y-3">
                            {features.map((feature) => (
                              <div
                                key={feature.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Label htmlFor={feature.id} className="font-medium">
                                      {feature.name}
                                    </Label>
                                    {feature.enabled ? (
                                      <Badge variant="default" className="bg-green-100 text-green-800">
                                        <Eye className="h-3 w-3 mr-1" />
                                        Enabled
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary">
                                        <EyeOff className="h-3 w-3 mr-1" />
                                        Disabled
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {feature.description}
                                  </p>
                                </div>
                                <Switch
                                  id={feature.id}
                                  checked={feature.enabled}
                                  onCheckedChange={() => toggleFeaturePermission(feature.id)}
                                />
                              </div>
                            ))}
                          </div>
                          <Separator />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="roles" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Role Templates
                      </CardTitle>
                      <CardDescription>
                        Quick permission presets for different worker roles
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <Card className="cursor-pointer hover:bg-accent" onClick={() => {
                          // Apply Basic Support role
                          setAppPermissions(prev => prev.map(app => ({ 
                            ...app, 
                            enabled: ['microsoft365', 'slack'].includes(app.id) 
                          })));
                          setFeaturePermissions(prev => prev.map(feature => ({ 
                            ...feature, 
                            enabled: ['view_customer_data', 'create_tickets', 'view_orders'].includes(feature.id) 
                          })));
                        }}>
                          <CardHeader>
                            <CardTitle className="text-lg">Basic Support</CardTitle>
                            <CardDescription>
                              Limited access for new workers
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p className="text-sm"><strong>Apps:</strong> Microsoft 365, Slack</p>
                              <p className="text-sm"><strong>Features:</strong> View customers, Create tickets</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:bg-accent" onClick={() => {
                          // Apply Advanced Support role
                          setAppPermissions(prev => prev.map(app => ({ 
                            ...app, 
                            enabled: ['microsoft365', 'slack', 'hubspot', 'asana'].includes(app.id) 
                          })));
                          setFeaturePermissions(prev => prev.map(feature => ({ 
                            ...feature, 
                            enabled: !['process_refunds', 'view_reports', 'export_data', 'edit_customer_data'].includes(feature.id) 
                          })));
                        }}>
                          <CardHeader>
                            <CardTitle className="text-lg">Advanced Support</CardTitle>
                            <CardDescription>
                              Full support capabilities
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p className="text-sm"><strong>Apps:</strong> Microsoft 365, Slack, HubSpot, Asana</p>
                              <p className="text-sm"><strong>Features:</strong> Most support functions</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:bg-accent" onClick={() => {
                          // Apply Sales Representative role
                          setAppPermissions(prev => prev.map(app => ({ 
                            ...app, 
                            enabled: ['microsoft365', 'slack', 'hubspot', 'salesforce', 'mailchimp'].includes(app.id) 
                          })));
                          setFeaturePermissions(prev => prev.map(feature => ({ 
                            ...feature, 
                            enabled: !['export_data'].includes(feature.id) 
                          })));
                        }}>
                          <CardHeader>
                            <CardTitle className="text-lg">Sales Representative</CardTitle>
                            <CardDescription>
                              CRM and sales tools access
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p className="text-sm"><strong>Apps:</strong> CRM tools, Marketing</p>
                              <p className="text-sm"><strong>Features:</strong> Customer management, Orders</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
