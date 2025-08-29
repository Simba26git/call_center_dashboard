"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Save, X, Calendar, Star, Gift, Shield, Key, MessageSquare, CreditCard, History } from "lucide-react"
import type { Customer } from "@/types"
import { VerificationPanel } from "./verification-panel"

interface CustomerProfileProps {
  customer: Customer
  onUpdate: (updates: Partial<Customer>) => void
}

export function CustomerProfile({ customer, onUpdate }: CustomerProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedCustomer, setEditedCustomer] = useState(customer)
  const [showPasswordReset, setShowPasswordReset] = useState(false)

  const handleSave = () => {
    onUpdate(editedCustomer)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedCustomer(customer)
    setIsEditing(false)
  }

  const handleVerificationComplete = (method: string, success: boolean) => {
    if (success) {
      onUpdate({ verificationStatus: "verified" })
    }
  }

  const handlePasswordReset = () => {
    setShowPasswordReset(true)
    // Simulate password reset
    setTimeout(() => {
      setShowPasswordReset(false)
    }, 2000)
  }

  const getTierColor = (tier: Customer["tier"]) => {
    switch (tier) {
      case "platinum":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "silver":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-orange-100 text-orange-800 border-orange-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-2xl">
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getTierColor(customer.tier)} variant="outline">
                {customer.tier}
              </Badge>
              <Badge variant="outline">{customer.accountNumber}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" className="gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty & Rewards</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Customer's personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editedCustomer.name}
                    onChange={(e) => setEditedCustomer({ ...editedCustomer, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedCustomer.email || ""}
                    onChange={(e) => setEditedCustomer({ ...editedCustomer, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={editedCustomer.phone || ""}
                    onChange={(e) => setEditedCustomer({ ...editedCustomer, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select
                    value={editedCustomer.preferredLanguage}
                    onValueChange={(value) => setEditedCustomer({ ...editedCustomer, preferredLanguage: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Account status and tier information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Account Number</Label>
                  <Badge variant="outline" className="font-mono">
                    {customer.accountNumber}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Customer Tier</Label>
                  <Select
                    value={editedCustomer.tier}
                    onValueChange={(value: Customer["tier"]) => setEditedCustomer({ ...editedCustomer, tier: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bronze">Bronze</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Verification Status</Label>
                  <Badge
                    variant="outline"
                    className={
                      customer.verificationStatus === "verified"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : customer.verificationStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {customer.verificationStatus}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-medium">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                      onClick={handlePasswordReset}
                      disabled={showPasswordReset}
                    >
                      <Key className="h-4 w-4" />
                      {showPasswordReset ? "Sending..." : "Reset Password"}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <MessageSquare className="h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {showPasswordReset && (
            <Alert>
              <Key className="h-4 w-4" />
              <AlertDescription>Password reset email sent to {customer.email}</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="verification">
          <VerificationPanel customer={customer} onVerificationComplete={handleVerificationComplete} />
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Loyalty & Rewards Program
              </CardTitle>
              <CardDescription>Customer's loyalty status and rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">2,450</div>
                  <div className="text-sm text-muted-foreground">Points Balance</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">18</div>
                  <div className="text-sm text-muted-foreground">Months Member</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <CreditCard className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">$1,250</div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Available Rewards</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">10% Off Next Purchase</div>
                      <div className="text-sm text-muted-foreground">Valid until Dec 31, 2024</div>
                    </div>
                    <Button size="sm">Apply</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Free Shipping</div>
                      <div className="text-sm text-muted-foreground">On orders over $50</div>
                    </div>
                    <Button size="sm">Apply</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication Preferences</CardTitle>
              <CardDescription>How the customer prefers to be contacted</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={editedCustomer.consentFlags.marketing}
                  onCheckedChange={(checked) =>
                    setEditedCustomer({
                      ...editedCustomer,
                      consentFlags: { ...editedCustomer.consentFlags, marketing: checked },
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via text message</p>
                </div>
                <Switch disabled={!isEditing} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Call Recording Consent</Label>
                  <p className="text-sm text-muted-foreground">Allow calls to be recorded for quality</p>
                </div>
                <Switch
                  checked={editedCustomer.consentFlags.recording}
                  onCheckedChange={(checked) =>
                    setEditedCustomer({
                      ...editedCustomer,
                      consentFlags: { ...editedCustomer.consentFlags, recording: checked },
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Account security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                    Disabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Login Notifications</div>
                    <div className="text-sm text-muted-foreground">Get notified of account access</div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Password Last Changed</div>
                    <div className="text-sm text-muted-foreground">Security recommendation: Change every 90 days</div>
                  </div>
                  <Badge variant="outline">45 days ago</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Recent Security Events</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm">Successful login from Chrome on Windows</div>
                      <div className="text-xs text-muted-foreground">2 hours ago • IP: 192.168.1.100</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm">Password reset requested</div>
                      <div className="text-xs text-muted-foreground">1 day ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
