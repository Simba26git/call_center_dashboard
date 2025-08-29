"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { 
  MessageSquare, 
  Hash, 
  Users, 
  Search,
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreHorizontal,
  AtSign,
  AlertCircle,
  CheckCircle
} from "lucide-react"

function SlackContent() {
  const { user } = useAuth()
  const [selectedChannel, setSelectedChannel] = useState("general")
  const [messageInput, setMessageInput] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Check Slack connection status
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
          const response = await fetch('/api/integrations/slack/status')
          const data = await response.json()
          setIsConnected(data.connected)
          if (!data.connected && data.error) {
            setConnectionError(data.error)
          }
        }
      } catch (error) {
        console.error('Failed to check Slack connection:', error)
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
      // Redirect to Slack OAuth
      window.location.href = '/api/auth/slack/authorize'
    } catch (error) {
      console.error('Failed to initiate Slack connection:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking Slack connection...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Slack</h2>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Not Connected
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connect Slack</CardTitle>
            <CardDescription>
              Connect your Slack workspace to communicate with your team directly from the call center
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Slack Integration</h3>
            <p className="text-muted-foreground mb-6">
              Sign in with your Slack workspace to access channels, direct messages, and team communication.
            </p>
            {connectionError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{connectionError}</p>
              </div>
            )}
            <Button onClick={handleConnect} className="bg-purple-600 hover:bg-purple-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Connect Slack Workspace
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Slack</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loading Slack Workspace...</CardTitle>
          <CardDescription>
            Connecting to your Slack workspace to fetch channels and messages.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Fetching workspace data...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SlackPage() {
  return (
    <ProtectedRoute requiredPermission="*">
      <div className="h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <SlackContent />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
