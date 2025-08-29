"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  Users, 
  Settings, 
  CreditCard, 
  Shield, 
  Globe, 
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  Upload,
  Download,
  BarChart3,
  UserCheck,
  Clock,
  AlertCircle
} from "lucide-react"
import { useAuth } from "@/lib/auth"

interface BillingInfo {
  plan: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'past_due' | 'cancelled'
  nextBillingDate: string
  amount: number
  users: number
  maxUsers: number
}

interface OrganizationSettings {
  allowedDomains: string[]
  requireDomainEmail: boolean
  enableSSO: boolean
  maxUsers: number
  features: string[]
  workingHours: {
    start: string
    end: string
    timezone: string
  }
  security: {
    passwordPolicy: {
      minLength: number
      requireSpecialChars: boolean
      requireNumbers: boolean
    }
    sessionTimeout: number
    twoFactorRequired: boolean
  }
}

export function OrganizationManagement() {
  const { user } = useAuth()
  const [isEditingOrg, setIsEditingOrg] = useState(false)
  const [isEditingBilling, setIsEditingBilling] = useState(false)

  // Mock organization data
  const [organization, setOrganization] = useState({
    id: "org_123",
    name: "Acme Call Center",
    domain: "acme.com",
    logo: "",
    description: "Leading customer service organization",
    address: "123 Business St, City, State 12345",
    phone: "+1 (555) 123-4567",
    email: "admin@acme.com",
    website: "https://acme.com",
    industry: "Customer Service",
    size: "50-100 employees",
    createdAt: "2024-01-01",
    status: "active" as const
  })

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    plan: 'professional',
    status: 'active',
    nextBillingDate: '2024-02-28',
    amount: 79,
    users: 15,
    maxUsers: 50
  })

  const [settings, setSettings] = useState<OrganizationSettings>({
    allowedDomains: ['acme.com', 'support.acme.com'],
    requireDomainEmail: true,
    enableSSO: false,
    maxUsers: 50,
    features: ['call_recording', 'advanced_analytics', 'integrations'],
    workingHours: {
      start: '09:00',
      end: '17:00',
      timezone: 'America/New_York'
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireSpecialChars: true,
        requireNumbers: true
      },
      sessionTimeout: 480, // 8 hours in minutes
      twoFactorRequired: false
    }
  })

  const handleSaveOrganization = () => {
    // In real app, this would call an API
    alert("Organization details saved successfully!")
    setIsEditingOrg(false)
  }

  const handleSaveBilling = () => {
    // In real app, this would call an API
    alert("Billing information updated successfully!")
    setIsEditingBilling(false)
  }

  const handleSaveSettings = () => {
    // In real app, this would call an API
    alert("Organization settings saved successfully!")
  }

  const addDomain = () => {
    const domain = prompt("Enter new domain:")
    if (domain) {
      setSettings({
        ...settings,
        allowedDomains: [...settings.allowedDomains, domain]
      })
    }
  }

  const removeDomain = (domain: string) => {
    setSettings({
      ...settings,
      allowedDomains: settings.allowedDomains.filter(d => d !== domain)
    })
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'starter':
        return <Badge variant="secondary">Starter</Badge>
      case 'professional':
        return <Badge variant="default">Professional</Badge>
      case 'enterprise':
        return <Badge variant="destructive">Enterprise</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>
      case 'past_due':
        return <Badge variant="destructive">Past Due</Badge>
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Organization Management</h2>
        <p className="text-muted-foreground">
          Manage your organization settings, billing, and configuration
        </p>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Organization Details</TabsTrigger>
          <TabsTrigger value="billing">Billing & Subscription</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Organization Information
                  </CardTitle>
                  <CardDescription>
                    Manage your organization's basic information and contact details
                  </CardDescription>
                </div>
                <Button 
                  variant={isEditingOrg ? "default" : "outline"}
                  onClick={() => isEditingOrg ? handleSaveOrganization() : setIsEditingOrg(true)}
                >
                  {isEditingOrg ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Details
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={organization.name}
                      onChange={(e) => setOrganization({...organization, name: e.target.value})}
                      disabled={!isEditingOrg}
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain">Primary Domain</Label>
                    <Input
                      id="domain"
                      value={organization.domain}
                      onChange={(e) => setOrganization({...organization, domain: e.target.value})}
                      disabled={!isEditingOrg}
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={organization.industry}
                      onChange={(e) => setOrganization({...organization, industry: e.target.value})}
                      disabled={!isEditingOrg}
                    />
                  </div>
                  <div>
                    <Label htmlFor="size">Company Size</Label>
                    <Select 
                      value={organization.size} 
                      onValueChange={(value) => setOrganization({...organization, size: value})}
                      disabled={!isEditingOrg}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10 employees">1-10 employees</SelectItem>
                        <SelectItem value="11-50 employees">11-50 employees</SelectItem>
                        <SelectItem value="50-100 employees">50-100 employees</SelectItem>
                        <SelectItem value="100-500 employees">100-500 employees</SelectItem>
                        <SelectItem value="500+ employees">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Contact Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={organization.email}
                      onChange={(e) => setOrganization({...organization, email: e.target.value})}
                      disabled={!isEditingOrg}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={organization.phone}
                      onChange={(e) => setOrganization({...organization, phone: e.target.value})}
                      disabled={!isEditingOrg}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={organization.website}
                      onChange={(e) => setOrganization({...organization, website: e.target.value})}
                      disabled={!isEditingOrg}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={organization.address}
                      onChange={(e) => setOrganization({...organization, address: e.target.value})}
                      disabled={!isEditingOrg}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={organization.description}
                  onChange={(e) => setOrganization({...organization, description: e.target.value})}
                  disabled={!isEditingOrg}
                  rows={3}
                  placeholder="Describe your organization..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Current Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Plan</span>
                  {getPlanBadge(billingInfo.plan)}
                </div>
                <div className="flex justify-between items-center">
                  <span>Status</span>
                  {getStatusBadge(billingInfo.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span>Monthly Cost</span>
                  <span className="font-bold">${billingInfo.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Next Billing</span>
                  <span>{billingInfo.nextBillingDate}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Users ({billingInfo.users}/{billingInfo.maxUsers})</span>
                    <span>{Math.round((billingInfo.users / billingInfo.maxUsers) * 100)}%</span>
                  </div>
                  <Progress value={(billingInfo.users / billingInfo.maxUsers) * 100} />
                </div>
                <Button className="w-full">
                  Manage Subscription
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: "2024-01-28", amount: 79, status: "paid" },
                    { date: "2023-12-28", amount: 79, status: "paid" },
                    { date: "2023-11-28", amount: 79, status: "paid" },
                    { date: "2023-10-28", amount: 79, status: "paid" }
                  ].map((bill, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">${bill.amount}</p>
                        <p className="text-sm text-muted-foreground">{bill.date}</p>
                      </div>
                      <Badge variant="default">Paid</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoices
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Domain Settings
                </CardTitle>
                <CardDescription>
                  Manage allowed domains for user registration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Domain Email</Label>
                    <p className="text-sm text-muted-foreground">Only allow users from approved domains</p>
                  </div>
                  <Switch
                    checked={settings.requireDomainEmail}
                    onCheckedChange={(checked) => setSettings({...settings, requireDomainEmail: checked})}
                  />
                </div>
                <div>
                  <Label>Allowed Domains</Label>
                  <div className="space-y-2 mt-2">
                    {settings.allowedDomains.map((domain, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <span>{domain}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeDomain(domain)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addDomain}>
                      Add Domain
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security policies for your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable SSO</Label>
                    <p className="text-sm text-muted-foreground">Single Sign-On integration</p>
                  </div>
                  <Switch
                    checked={settings.enableSSO}
                    onCheckedChange={(checked) => setSettings({...settings, enableSSO: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require 2FA</Label>
                    <p className="text-sm text-muted-foreground">Two-factor authentication for all users</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorRequired}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: {...settings.security, twoFactorRequired: checked}
                    })}
                  />
                </div>
                <div>
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: {...settings.security, sessionTimeout: parseInt(e.target.value)}
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Minimum Password Length</Label>
                  <Input
                    type="number"
                    value={settings.security.passwordPolicy.minLength}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        passwordPolicy: {
                          ...settings.security.passwordPolicy,
                          minLength: parseInt(e.target.value)
                        }
                      }
                    })}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleSaveSettings} className="w-full">
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{billingInfo.users}</div>
                <p className="text-xs text-muted-foreground">
                  {billingInfo.maxUsers - billingInfo.users} remaining
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Users currently online</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">Total interactions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>Organization usage over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2">
                {[45, 52, 48, 61, 55, 67].map((height, index) => (
                  <div key={index} className="flex-1 bg-primary rounded-t" style={{ height: `${height * 2}px` }}></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
