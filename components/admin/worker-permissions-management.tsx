"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Shield, 
  Users, 
  Settings, 
  Lock, 
  Unlock,
  Edit,
  Save,
  Plus,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  MessageSquare,
  Send,
  TrendingUp,
  Globe,
  DollarSign,
  Bot,
  Building2,
  CreditCard,
  Calculator,
  FileText,
  Mail
} from "lucide-react"
import { useAuth } from "@/lib/auth"

interface AppPermission {
  id: string
  name: string
  description: string
  icon: any
  category: 'communication' | 'productivity' | 'finance' | 'integration'
  enabled: boolean
  features: {
    id: string
    name: string
    description: string
    enabled: boolean
  }[]
}

interface PermissionTemplate {
  id: string
  name: string
  description: string
  permissions: string[]
}

interface UserRole {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
}

export function WorkerPermissionsManagement() {
  const { user } = useAuth()
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [appPermissions, setAppPermissions] = useState<AppPermission[]>([
    {
      id: "slack",
      name: "Slack",
      description: "Team communication and collaboration",
      icon: MessageSquare,
      category: "communication",
      enabled: true,
      features: [
        { id: "send_messages", name: "Send Messages", description: "Send messages to channels", enabled: true },
        { id: "create_channels", name: "Create Channels", description: "Create new channels", enabled: false },
        { id: "invite_users", name: "Invite Users", description: "Invite users to workspace", enabled: false }
      ]
    },
    {
      id: "asana",
      name: "Asana",
      description: "Project and task management",
      icon: CheckCircle,
      category: "productivity",
      enabled: true,
      features: [
        { id: "view_tasks", name: "View Tasks", description: "View assigned tasks", enabled: true },
        { id: "create_tasks", name: "Create Tasks", description: "Create new tasks", enabled: true },
        { id: "manage_projects", name: "Manage Projects", description: "Create and manage projects", enabled: false }
      ]
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Customer relationship management",
      icon: Users,
      category: "integration",
      enabled: true,
      features: [
        { id: "view_contacts", name: "View Contacts", description: "View customer contacts", enabled: true },
        { id: "edit_contacts", name: "Edit Contacts", description: "Modify customer information", enabled: true },
        { id: "delete_contacts", name: "Delete Contacts", description: "Remove customer records", enabled: false }
      ]
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Sales and customer management",
      icon: TrendingUp,
      category: "integration",
      enabled: false,
      features: [
        { id: "view_leads", name: "View Leads", description: "Access lead information", enabled: false },
        { id: "edit_leads", name: "Edit Leads", description: "Modify lead details", enabled: false },
        { id: "create_opportunities", name: "Create Opportunities", description: "Create sales opportunities", enabled: false }
      ]
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Email marketing and automation",
      icon: Mail,
      category: "communication",
      enabled: true,
      features: [
        { id: "view_campaigns", name: "View Campaigns", description: "View email campaigns", enabled: true },
        { id: "create_campaigns", name: "Create Campaigns", description: "Create new campaigns", enabled: false },
        { id: "manage_lists", name: "Manage Lists", description: "Manage subscriber lists", enabled: false }
      ]
    },
    {
      id: "quickbooks",
      name: "QuickBooks",
      description: "Financial management and invoicing",
      icon: Calculator,
      category: "finance",
      enabled: false,
      features: [
        { id: "view_invoices", name: "View Invoices", description: "Access invoice information", enabled: false },
        { id: "create_invoices", name: "Create Invoices", description: "Generate new invoices", enabled: false },
        { id: "manage_payments", name: "Manage Payments", description: "Process payments", enabled: false }
      ]
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Payment processing and billing",
      icon: CreditCard,
      category: "finance",
      enabled: true,
      features: [
        { id: "view_payments", name: "View Payments", description: "View payment history", enabled: true },
        { id: "process_refunds", name: "Process Refunds", description: "Issue customer refunds", enabled: false },
        { id: "manage_subscriptions", name: "Manage Subscriptions", description: "Handle subscription billing", enabled: false }
      ]
    }
  ])

  const [permissionTemplates] = useState<PermissionTemplate[]>([
    {
      id: "basic_agent",
      name: "Basic Agent",
      description: "Standard permissions for call center agents",
      permissions: ["slack.send_messages", "asana.view_tasks", "hubspot.view_contacts", "stripe.view_payments"]
    },
    {
      id: "senior_agent",
      name: "Senior Agent",
      description: "Enhanced permissions for experienced agents",
      permissions: ["slack.send_messages", "asana.view_tasks", "asana.create_tasks", "hubspot.view_contacts", "hubspot.edit_contacts", "stripe.view_payments", "mailchimp.view_campaigns"]
    },
    {
      id: "team_lead",
      name: "Team Lead",
      description: "Supervisory permissions for team leaders",
      permissions: ["slack.send_messages", "slack.create_channels", "asana.view_tasks", "asana.create_tasks", "asana.manage_projects", "hubspot.view_contacts", "hubspot.edit_contacts", "stripe.view_payments", "mailchimp.view_campaigns", "mailchimp.create_campaigns"]
    }
  ])

  const [customRoles, setCustomRoles] = useState<UserRole[]>([
    {
      id: "support_specialist",
      name: "Support Specialist",
      description: "Customer support focused role",
      permissions: ["slack.send_messages", "hubspot.view_contacts", "hubspot.edit_contacts", "stripe.view_payments"],
      userCount: 8
    },
    {
      id: "sales_agent",
      name: "Sales Agent", 
      description: "Sales focused role with CRM access",
      permissions: ["slack.send_messages", "hubspot.view_contacts", "hubspot.edit_contacts", "salesforce.view_leads", "mailchimp.view_campaigns"],
      userCount: 5
    }
  ])

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  })

  const handleAppToggle = (appId: string) => {
    setAppPermissions(apps => 
      apps.map(app => 
        app.id === appId ? { ...app, enabled: !app.enabled } : app
      )
    )
  }

  const handleFeatureToggle = (appId: string, featureId: string) => {
    setAppPermissions(apps =>
      apps.map(app =>
        app.id === appId
          ? {
              ...app,
              features: app.features.map(feature =>
                feature.id === featureId
                  ? { ...feature, enabled: !feature.enabled }
                  : feature
              )
            }
          : app
      )
    )
  }

  const applyTemplate = () => {
    if (!selectedTemplate) return
    
    const template = permissionTemplates.find(t => t.id === selectedTemplate)
    if (!template) return

    // Reset all permissions
    setAppPermissions(apps =>
      apps.map(app => ({
        ...app,
        enabled: false,
        features: app.features.map(feature => ({ ...feature, enabled: false }))
      }))
    )

    // Apply template permissions
    template.permissions.forEach(permission => {
      const [appId, featureId] = permission.split('.')
      setAppPermissions(apps =>
        apps.map(app => {
          if (app.id === appId) {
            return {
              ...app,
              enabled: true,
              features: app.features.map(feature =>
                feature.id === featureId
                  ? { ...feature, enabled: true }
                  : feature
              )
            }
          }
          return app
        })
      )
    })

    alert(`Applied "${template.name}" template successfully!`)
  }

  const savePermissions = () => {
    // In real app, this would call an API
    const enabledPermissions = appPermissions
      .filter(app => app.enabled)
      .flatMap(app => 
        app.features
          .filter(feature => feature.enabled)
          .map(feature => `${app.id}.${feature.id}`)
      )
    
    console.log("Saving permissions:", enabledPermissions)
    alert("Worker permissions saved successfully!")
  }

  const createCustomRole = () => {
    if (!newRole.name.trim()) return

    const role: UserRole = {
      id: newRole.name.toLowerCase().replace(/\s+/g, '_'),
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0
    }

    setCustomRoles([...customRoles, role])
    setNewRole({ name: "", description: "", permissions: [] })
    setIsCreateRoleOpen(false)
    alert("Custom role created successfully!")
  }

  const deleteRole = (roleId: string) => {
    setCustomRoles(roles => roles.filter(r => r.id !== roleId))
    alert("Role deleted successfully!")
  }

  const filteredApps = appPermissions.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return MessageSquare
      case 'productivity': return CheckCircle
      case 'finance': return DollarSign
      case 'integration': return Zap
      default: return Settings
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'communication': return 'text-blue-600'
      case 'productivity': return 'text-green-600'
      case 'finance': return 'text-purple-600'
      case 'integration': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Worker Permissions</h2>
        <p className="text-muted-foreground">
          Control which applications and features your workers can access
        </p>
      </div>

      <Tabs defaultValue="apps" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="apps">App Permissions</TabsTrigger>
          <TabsTrigger value="templates">Permission Templates</TabsTrigger>
          <TabsTrigger value="roles">Custom Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="apps" className="space-y-6">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={savePermissions}>
              <Save className="h-4 w-4 mr-2" />
              Save Permissions
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredApps.map((app) => {
              const CategoryIcon = getCategoryIcon(app.category)
              return (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gray-100 ${getCategoryColor(app.category)}`}>
                          <app.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {app.name}
                            <Badge variant="outline">
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {app.category}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{app.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={app.enabled}
                          onCheckedChange={() => handleAppToggle(app.id)}
                        />
                        {app.enabled ? (
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            Disabled
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {app.enabled && (
                    <CardContent>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Feature Permissions</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {app.features.map((feature) => (
                            <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{feature.name}</div>
                                <div className="text-xs text-muted-foreground">{feature.description}</div>
                              </div>
                              <Switch
                                checked={feature.enabled}
                                onCheckedChange={() => handleFeatureToggle(app.id, feature.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Templates</CardTitle>
              <CardDescription>
                Apply pre-configured permission sets to quickly setup worker access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-4">
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a permission template" />
                  </SelectTrigger>
                  <SelectContent>
                    {permissionTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={applyTemplate} disabled={!selectedTemplate}>
                  Apply Template
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {permissionTemplates.map((template) => (
                  <Card key={template.id} className={`cursor-pointer transition-colors ${
                    selectedTemplate === template.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`} onClick={() => setSelectedTemplate(template.id)}>
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        {template.permissions.length} permissions included
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Custom Roles</h3>
              <p className="text-sm text-muted-foreground">Create and manage custom permission roles</p>
            </div>
            <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Custom Role</DialogTitle>
                  <DialogDescription>
                    Define a new role with specific permissions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input
                      id="roleName"
                      value={newRole.name}
                      onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                      placeholder="Enter role name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roleDescription">Description</Label>
                    <Input
                      id="roleDescription"
                      value={newRole.description}
                      onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                      placeholder="Describe this role"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createCustomRole}>
                      Create Role
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {customRoles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{role.name}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteRole(role.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Users assigned:</span>
                      <Badge variant="secondary">{role.userCount}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Permissions:</span>
                      <span>{role.permissions.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
