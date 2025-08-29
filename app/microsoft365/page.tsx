"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Microsoft365Dashboard } from "@/components/microsoft365/microsoft365-dashboard";
import { Microsoft365Panel } from "@/components/microsoft365/microsoft365-panel";
import { useMicrosoft365 } from "@/components/microsoft365/microsoft365-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings,
  BarChart3,
  Workflow
} from "lucide-react";

export default function Microsoft365Page() {
  const { isAuthenticated, user, login, logout, loading, error } = useMicrosoft365();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Microsoft 365 Integration</h1>
                <p className="text-muted-foreground mt-1">
                  Connect and manage your Microsoft 365 services within the call center
                </p>
              </div>
              {isAuthenticated && (
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Connected as {user?.username}
                  </Badge>
                  <Button variant="outline" onClick={logout}>
                    Disconnect
                  </Button>
                </div>
              )}
            </div>

            {!isAuthenticated ? (
              /* Connection Setup */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Connect to Microsoft 365
                    </CardTitle>
                    <CardDescription>
                      Integrate with your Microsoft 365 account to access emails, calendar, contacts, and Teams.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <Mail className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h3 className="font-medium">Email</h3>
                        <p className="text-sm text-muted-foreground">Read and send emails</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <h3 className="font-medium">Calendar</h3>
                        <p className="text-sm text-muted-foreground">Schedule meetings</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <h3 className="font-medium">Contacts</h3>
                        <p className="text-sm text-muted-foreground">Sync contact lists</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <h3 className="font-medium">Teams</h3>
                        <p className="text-sm text-muted-foreground">Collaborate with team</p>
                      </div>
                    </div>
                    
                    <Button onClick={login} disabled={loading} className="w-full" size="lg">
                      {loading ? "Connecting..." : "Connect to Microsoft 365"}
                    </Button>
                    
                    {error && (
                      <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="h-5 w-5" />
                      Integration Benefits
                    </CardTitle>
                    <CardDescription>
                      See how Microsoft 365 integration enhances your call center workflow
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <div>
                          <h4 className="font-medium">Customer Communication</h4>
                          <p className="text-sm text-muted-foreground">
                            Send follow-up emails and schedule callbacks directly from customer profiles
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                        <div>
                          <h4 className="font-medium">Unified Calendar</h4>
                          <p className="text-sm text-muted-foreground">
                            Sync your call center schedule with Outlook calendar events
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                        <div>
                          <h4 className="font-medium">Contact Synchronization</h4>
                          <p className="text-sm text-muted-foreground">
                            Automatically sync customer contacts with your Outlook address book
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                        <div>
                          <h4 className="font-medium">Team Collaboration</h4>
                          <p className="text-sm text-muted-foreground">
                            Share customer updates and collaborate via Teams channels
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Connected Interface */
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="dashboard">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger value="email-calendar">
                    <Mail className="h-4 w-4 mr-2" />
                    Email & Calendar
                  </TabsTrigger>
                  <TabsTrigger value="contacts-teams">
                    <Users className="h-4 w-4 mr-2" />
                    Contacts & Teams
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                  <Microsoft365Dashboard />
                </TabsContent>

                <TabsContent value="email-calendar" className="space-y-6">
                  <Microsoft365Panel />
                </TabsContent>

                <TabsContent value="contacts-teams" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Contact Management</CardTitle>
                        <CardDescription>
                          Manage and sync your Microsoft 365 contacts
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Contact management features will be loaded here.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Teams Integration</CardTitle>
                        <CardDescription>
                          Collaborate with your team via Microsoft Teams
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Teams collaboration features will be loaded here.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Integration Settings</CardTitle>
                      <CardDescription>
                        Configure your Microsoft 365 integration preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Connected Account</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{user?.username}</Badge>
                          <Button variant="outline" size="sm" onClick={logout}>
                            Disconnect
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Sync Preferences</h4>
                        <p className="text-sm text-muted-foreground">
                          Configure how data is synchronized between your call center and Microsoft 365.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Permissions</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>• Read and send emails</p>
                          <p>• Read and write calendar events</p>
                          <p>• Read and write contacts</p>
                          <p>• Access Teams information</p>
                          <p>• Search across Microsoft 365</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
