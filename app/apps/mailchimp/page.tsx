"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, Mail, Users, TrendingUp } from "lucide-react"

export default function MailchimpPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/integrations/mailchimp/status');
      const data = await response.json();
      setIsConnected(data.connected);
    } catch (error) {
      console.error('Failed to check Mailchimp connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectToMailchimp = () => {
    window.location.href = '/api/auth/mailchimp/authorize';
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
                  <p>Checking Mailchimp connection...</p>
                </div>
              </div>
            ) : !isConnected ? (
              <div className="flex items-center justify-center h-64">
                <Card className="w-96">
                  <CardHeader className="text-center">
                    <CardTitle>Connect to Mailchimp</CardTitle>
                    <CardDescription>
                      Connect your Mailchimp account to access email campaigns, subscribers, and automation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button onClick={connectToMailchimp} className="w-full">
                      Connect Mailchimp Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Mailchimp</h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      Connected
                    </Badge>
                  </div>
                </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,247</div>
            <p className="text-xs text-muted-foreground">+127 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.5%</div>
            <p className="text-xs text-muted-foreground">Above industry avg</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-muted-foreground">+0.8% from last campaign</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Sent this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Marketing Integration</CardTitle>
          <CardDescription>
            Manage your email campaigns and subscriber lists from the call center
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Send className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Mailchimp Integration Active</h3>
          <p className="text-muted-foreground mb-6">
            Your email marketing campaigns are connected and ready to use.
          </p>
          <div className="flex gap-4 justify-center">
            <Button>Create Campaign</Button>
            <Button variant="outline">View Analytics</Button>
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
