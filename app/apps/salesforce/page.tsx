"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Users, TrendingUp, DollarSign } from "lucide-react"

export default function SalesforcePage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/integrations/salesforce/status');
      const data = await response.json();
      setIsConnected(data.connected);
    } catch (error) {
      console.error('Failed to check Salesforce connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectToSalesforce = () => {
    window.location.href = '/api/auth/salesforce/authorize';
  };

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
                  <p>Checking Salesforce connection...</p>
                </div>
              </div>
            ) : !isConnected ? (
              <div className="flex items-center justify-center h-64">
                <Card className="w-96">
                  <CardHeader className="text-center">
                    <CardTitle>Connect to Salesforce</CardTitle>
                    <CardDescription>
                      Connect your Salesforce account to access leads, opportunities, and customer data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button onClick={connectToSalesforce} className="w-full">
                      Connect Salesforce Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Salesforce</h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      Connected
                    </Badge>
                  </div>
                </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">+23 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">$2.3M pipeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$89K</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24%</div>
            <p className="text-xs text-muted-foreground">Lead to opportunity</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salesforce CRM Integration</CardTitle>
          <CardDescription>
            Access your Salesforce data directly from the call center platform
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Zap className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Salesforce Integration Active</h3>
          <p className="text-muted-foreground mb-6">
            Your Salesforce CRM is connected and syncing data in real-time.
          </p>
          <div className="flex gap-4 justify-center">
            <Button>View Full CRM</Button>
            <Button variant="outline">Sync Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
