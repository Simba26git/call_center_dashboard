"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Building2, User } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (role: string) => {
    setIsLoading(true);
    
    // Mock authentication - in real app this would call your auth service
    const mockUser = {
      id: "user_123",
      name: role === "root" ? "Admin User" : role === "manager" ? "Manager User" : "Employee User",
      email: credentials.email || `${role}@company.com`,
      role,
      organizationId: "org_123",
      permissions: role === "root" ? ["*"] : ["customer.read", "tickets.read"],
      status: "available",
      integrations: {},
      settings: {
        notifications: { email: true, slack: true, inApp: true },
        timezone: "UTC",
        language: "en"
      },
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true,
      organization: {
        id: "org_123",
        name: "Acme Corp",
        domain: "acme.com",
        tier: "professional",
        settings: {
          allowedDomains: ["acme.com"],
          requireDomainEmail: false,
          enableSSO: false,
          maxUsers: 25,
          features: ["basic_analytics", "integrations"]
        },
        integrations: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        rootUserId: "user_123",
        status: "active",
        subscription: {
          plan: "Professional",
          status: "active"
        }
      }
    };
    
    // Store in localStorage for demo
    localStorage.setItem("user", JSON.stringify(mockUser));
    
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Choose your account type to access the call center system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="root" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="root">Root</TabsTrigger>
              <TabsTrigger value="manager">Manager</TabsTrigger>
              <TabsTrigger value="employee">Employee</TabsTrigger>
            </TabsList>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email (optional for demo)"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password (optional for demo)"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>
            </div>

            <TabsContent value="root" className="space-y-4">
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Crown className="h-6 w-6 text-yellow-600" />
                    <div>
                      <h3 className="font-semibold">Root Account</h3>
                      <p className="text-sm text-gray-600">
                        Full admin access, subscription management, create managers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button 
                className="w-full" 
                onClick={() => handleLogin("root")}
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In as Root Admin"}
              </Button>
            </TabsContent>

            <TabsContent value="manager" className="space-y-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Manager Account</h3>
                      <p className="text-sm text-gray-600">
                        Manage employees, team permissions, quality monitoring
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button 
                className="w-full" 
                onClick={() => handleLogin("manager")}
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In as Manager"}
              </Button>
            </TabsContent>

            <TabsContent value="employee" className="space-y-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Employee Account</h3>
                      <p className="text-sm text-gray-600">
                        Handle calls, manage tickets, access assigned tools
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button 
                className="w-full" 
                onClick={() => handleLogin("agent")}
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In as Employee"}
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Button 
              variant="link" 
              onClick={() => router.push("/landing")}
              className="text-sm"
            >
              ← Back to Landing Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
