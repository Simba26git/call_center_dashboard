"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  TrendingUp, 
  Users, 
  Mail, 
  Phone,
  Building,
  DollarSign,
  Calendar,
  Search,
  Plus,
  MoreHorizontal,
  Star,
  Eye
} from "lucide-react"

export default function HubSpotPage() {
  const [activeTab, setActiveTab] = useState("contacts")
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/integrations/hubspot/status');
      const data = await response.json();
      setIsConnected(data.connected);
    } catch (error) {
      console.error('Failed to check HubSpot connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectToHubSpot = () => {
    window.location.href = '/api/auth/hubspot/authorize';
  };

  const contacts = [
    {
      id: 1,
      name: "John Anderson",
      company: "ABC Corporation",
      email: "john@abccorp.com",
      phone: "+1 (555) 123-4567",
      status: "Customer",
      lastActivity: "2 hours ago",
      dealValue: "$15,000"
    },
    {
      id: 2,
      name: "Sarah Mitchell",
      company: "Tech Solutions Inc",
      email: "sarah@techsolutions.com",
      phone: "+1 (555) 987-6543",
      status: "Lead",
      lastActivity: "1 day ago",
      dealValue: "$25,000"
    },
    {
      id: 3,
      name: "Mike Chen",
      company: "Digital Dynamics",
      email: "mike@digitaldynamics.com",
      phone: "+1 (555) 456-7890",
      status: "Prospect",
      lastActivity: "3 days ago",
      dealValue: "$8,500"
    }
  ]

  const deals = [
    {
      id: 1,
      name: "ABC Corp - Enterprise Plan",
      company: "ABC Corporation",
      stage: "Negotiation",
      value: "$15,000",
      probability: 75,
      closeDate: "2025-09-15",
      owner: "John Smith"
    },
    {
      id: 2,
      name: "Tech Solutions - Annual Contract",
      company: "Tech Solutions Inc",
      stage: "Proposal",
      value: "$25,000",
      probability: 60,
      closeDate: "2025-09-30",
      owner: "Sarah Johnson"
    }
  ]

  const campaigns = [
    {
      id: 1,
      name: "Q3 Product Launch",
      type: "Email Campaign",
      status: "Active",
      sent: 1250,
      opened: 425,
      clicked: 89,
      performance: "34% open rate"
    },
    {
      id: 2,
      name: "Customer Retention Drive",
      type: "Nurture Sequence",
      status: "Draft",
      sent: 0,
      opened: 0,
      clicked: 0,
      performance: "Not sent"
    }
  ]

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Checking HubSpot connection...</p>
                </div>
              </div>
            ) : !isConnected ? (
              <div className="flex items-center justify-center h-64">
                <Card className="w-96">
                  <CardHeader className="text-center">
                    <CardTitle>Connect to HubSpot</CardTitle>
                    <CardDescription>
                      Connect your HubSpot account to access contacts, deals, and marketing campaigns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button onClick={connectToHubSpot} className="w-full">
                      Connect HubSpot Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">HubSpot</h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      Connected
                    </Badge>
                  </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">$485,000 pipeline value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Performance</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34%</div>
            <p className="text-xs text-muted-foreground">Average open rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45K</div>
            <p className="text-xs text-muted-foreground">Closed deals</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contacts</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search contacts..." className="pl-8 w-64" />
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {contact.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{contact.dealValue}</p>
                        <Badge variant={contact.status === 'Customer' ? 'default' : contact.status === 'Lead' ? 'secondary' : 'outline'}>
                          {contact.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Deals</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Deal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deals.map((deal) => (
                  <div key={deal.id} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{deal.name}</h4>
                        <p className="text-sm text-muted-foreground">{deal.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{deal.value}</p>
                        <Badge variant="secondary">{deal.stage}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span>Close Date: {deal.closeDate}</span>
                        <span>Owner: {deal.owner}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{deal.probability}% probability</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Marketing Campaigns</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{campaign.name}</h4>
                        <p className="text-sm text-muted-foreground">{campaign.type}</p>
                      </div>
                      <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sent</p>
                        <p className="font-medium">{campaign.sent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Opened</p>
                        <p className="font-medium">{campaign.opened.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Clicked</p>
                        <p className="font-medium">{campaign.clicked.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Performance</p>
                        <p className="font-medium">{campaign.performance}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
  )
}
