"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  User,
  Phone,
  Mail,
  Ticket,
  ShoppingCart,
  Clock,
  AlertTriangle,
  CheckCircle,
  Key,
  MessageSquare,
} from "lucide-react"
import type { Customer } from "@/types"

interface CustomerSidebarProps {
  customer: Customer | null
  onQuickAction: (action: string) => void
}

export function CustomerSidebar({ customer, onQuickAction }: CustomerSidebarProps) {
  if (!customer) {
    return (
      <div className="w-80 border-l border-border bg-muted/30 p-4">
        <div className="text-center text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No customer selected</p>
        </div>
      </div>
    )
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

  const getVerificationIcon = (status: Customer["verificationStatus"]) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />
    }
  }

  return (
    <div className="w-80 border-l border-border bg-background">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {/* Customer Profile */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {getVerificationIcon(customer.verificationStatus)}
                    <span className="capitalize">{customer.verificationStatus}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account</span>
                <Badge variant="outline">{customer.accountNumber}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tier</span>
                <Badge className={getTierColor(customer.tier)} variant="outline">
                  {customer.tier}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Language</span>
                <Badge variant="outline">{customer.preferredLanguage.toUpperCase()}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {customer.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-transparent"
                onClick={() => onQuickAction("reset-password")}
              >
                <Key className="h-4 w-4" />
                Reset Password
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-transparent"
                onClick={() => onQuickAction("send-verification")}
              >
                <MessageSquare className="h-4 w-4" />
                Send Verification Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-transparent"
                onClick={() => onQuickAction("create-ticket")}
              >
                <Ticket className="h-4 w-4" />
                Create Ticket
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-transparent"
                onClick={() => onQuickAction("view-orders")}
              >
                <ShoppingCart className="h-4 w-4" />
                View Orders
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p>Inbound call - 15 min</p>
                    <p className="text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-2">
                  <Ticket className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p>Ticket #12345 created</p>
                    <p className="text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-2">
                  <ShoppingCart className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p>Order #ORD-789 shipped</p>
                    <p className="text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consent Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Consent Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Call Recording</span>
                <Badge variant={customer.consentFlags.recording ? "default" : "secondary"}>
                  {customer.consentFlags.recording ? "Consented" : "Not Consented"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Marketing</span>
                <Badge variant={customer.consentFlags.marketing ? "default" : "secondary"}>
                  {customer.consentFlags.marketing ? "Opted In" : "Opted Out"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
