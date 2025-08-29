"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Lock, Mail, User, ArrowRight, Shield } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('login')
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(email, password)
      router.push('/')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSSOLogin = (provider: string) => {
    // In a real app, this would redirect to the SSO provider
    window.location.href = `/auth/${provider}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Call Center Platform</h1>
          <p className="text-muted-foreground">
            Sign in to your organization account
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="sso">SSO Login</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Organization Login
                </CardTitle>
                <CardDescription>
                  Enter your organization credentials to access the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@organization.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Demo Accounts
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full text-left justify-start"
                      onClick={() => {
                        setEmail('root@acme.com')
                        setPassword('demo123')
                      }}
                    >
                      <Shield className="mr-2 h-4 w-4 text-red-500" />
                      Root Admin - Full Access
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-left justify-start"
                      onClick={() => {
                        setEmail('manager@acme.com')
                        setPassword('demo123')
                      }}
                    >
                      <User className="mr-2 h-4 w-4 text-blue-500" />
                      Manager - Team Management
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-left justify-start"
                      onClick={() => {
                        setEmail('agent@acme.com')
                        setPassword('demo123')
                      }}
                    >
                      <User className="mr-2 h-4 w-4 text-gray-500" />
                      Agent - Basic Access
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sso">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Single Sign-On
                </CardTitle>
                <CardDescription>
                  Sign in using your organization's SSO provider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSSOLogin('microsoft')}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Continue with Microsoft 365
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSSOLogin('google')}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Continue with Google Workspace
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSSOLogin('okta')}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Continue with Okta
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    SSO must be configured by your organization administrator
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Need help? Contact your organization administrator or{' '}
            <a href="#" className="text-primary hover:underline">
              technical support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
