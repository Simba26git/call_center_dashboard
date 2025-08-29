"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { 
  Mail, 
  Calendar, 
  FileText, 
  Send, 
  Search,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreHorizontal,
  Paperclip,
  AlertCircle,
  CheckCircle
} from "lucide-react"

function Microsoft365Content() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("email")
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Check Microsoft 365 connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check URL parameters for connection result
        const urlParams = new URLSearchParams(window.location.search)
        const connected = urlParams.get('connected')
        const error = urlParams.get('error')
        
        if (connected === 'true') {
          setIsConnected(true)
          setConnectionError(null)
          // Clear URL parameters
          window.history.replaceState({}, '', window.location.pathname)
        } else if (error) {
          setIsConnected(false)
          setConnectionError(decodeURIComponent(error))
        } else {
          // Check connection status via API
          const response = await fetch('/api/integrations/microsoft365/status')
          const data = await response.json()
          setIsConnected(data.connected)
          if (!data.connected && data.error) {
            setConnectionError(data.error)
          }
        }
      } catch (error) {
        console.error('Failed to check Microsoft 365 connection:', error)
        setIsConnected(false)
        setConnectionError('Unable to verify connection status')
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()
  }, [])

  const handleConnect = async () => {
    try {
      // Redirect to Microsoft OAuth
      window.location.href = '/api/auth/microsoft365/authorize'
    } catch (error) {
      console.error('Failed to initiate Microsoft 365 connection:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking Microsoft 365 connection...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Microsoft 365</h2>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Not Connected
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connect Microsoft 365</CardTitle>
            <CardDescription>
              Connect your Microsoft 365 account to access Outlook, Calendar, and OneDrive
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Mail className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Microsoft 365 Integration</h3>
            <p className="text-muted-foreground mb-6">
              Sign in with your Microsoft 365 account to access your emails, calendar, and files directly from the call center.
            </p>
            {connectionError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{connectionError}</p>
              </div>
            )}
            <Button onClick={handleConnect} className="bg-blue-600 hover:bg-blue-700">
              <Mail className="h-4 w-4 mr-2" />
              Connect Microsoft 365
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // This would load real data from Microsoft Graph API
  const emails = []
  const calendar = []

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Microsoft 365</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Outlook
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            OneDrive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loading your emails...</CardTitle>
              <CardDescription>
                Connecting to Microsoft Graph API to fetch your latest emails.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Fetching emails from Outlook...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loading your calendar...</CardTitle>
              <CardDescription>
                Connecting to Microsoft Graph API to fetch your calendar events.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Fetching calendar from Outlook...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loading your files...</CardTitle>
              <CardDescription>
                Connecting to Microsoft Graph API to fetch your OneDrive files.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Fetching files from OneDrive...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function Microsoft365Page() {
  return (
    <ProtectedRoute requiredPermission="*">
      <div className="h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <Microsoft365Content />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
