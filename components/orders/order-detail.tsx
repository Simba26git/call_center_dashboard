"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  CreditCard,
  RefreshCw,
  MessageSquare,
  MapPin,
  Calendar,
} from "lucide-react"
import type { Order } from "@/types"

interface OrderDetailProps {
  order: Order
  onStatusUpdate: (orderId: string, status: Order["status"]) => void
  onRefundRequest: (orderId: string, reason: string) => void
}

export function OrderDetail({ order, onStatusUpdate, onRefundRequest }: OrderDetailProps) {
  const [refundReason, setRefundReason] = useState("")
  const [showRefundDialog, setShowRefundDialog] = useState(false)

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "pending-payment":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "shipped":
        return <Truck className="h-5 w-5" />
      case "delivered":
      case "completed":
        return <CheckCircle className="h-5 w-5" />
      case "processing":
        return <Clock className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const handleRefundSubmit = () => {
    if (refundReason.trim()) {
      onRefundRequest(order.id, refundReason)
      setRefundReason("")
      setShowRefundDialog(false)
    }
  }

  const orderTimeline = [
    { status: "draft", label: "Order Created", date: order.createdAt, completed: true },
    { status: "pending-payment", label: "Payment Pending", date: order.createdAt, completed: order.status !== "draft" },
    {
      status: "processing",
      label: "Processing",
      date: order.updatedAt,
      completed: ["processing", "shipped", "delivered", "completed"].includes(order.status),
    },
    {
      status: "shipped",
      label: "Shipped",
      date: order.updatedAt,
      completed: ["shipped", "delivered", "completed"].includes(order.status),
    },
    {
      status: "delivered",
      label: "Delivered",
      date: order.updatedAt,
      completed: ["delivered", "completed"].includes(order.status),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {getStatusIcon(order.status)}
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(order.status)} variant="outline">
                {order.status.replace("-", " ")}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{order.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <MessageSquare className="h-4 w-4" />
            Contact Customer
          </Button>
          <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Request Refund
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Refund</DialogTitle>
                <DialogDescription>Create a refund request for this order</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Refund Reason</Label>
                  <Textarea
                    id="reason"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Explain the reason for the refund request..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRefundSubmit} disabled={!refundReason.trim()} className="flex-1">
                    Submit Request
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRefundDialog(false)}
                    className="flex-1 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>{order.items.length} item(s) in this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</div>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center font-medium text-lg">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.shippingAddress ? (
                  <div className="space-y-2">
                    <div className="font-medium">Delivery Address</div>
                    <div className="text-sm text-muted-foreground">
                      <div>{order.shippingAddress.street}</div>
                      <div>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </div>
                      <div>{order.shippingAddress.country}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No shipping address provided</div>
                )}

                {order.trackingNumber && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="font-medium">Tracking Number</div>
                      <div className="font-mono text-sm bg-muted p-2 rounded">{order.trackingNumber}</div>
                    </div>
                  </>
                )}

                <Separator />
                <div className="space-y-2">
                  <div className="font-medium">Estimated Delivery</div>
                  <div className="text-sm text-muted-foreground">3-5 business days</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>Track the progress of this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderTimeline.map((step, index) => (
                  <div key={step.status} className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.completed ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {step.completed ? step.date.toLocaleString() : "Pending"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {order.trackingNumber && (
                <>
                  <Separator className="my-6" />
                  <Alert>
                    <Truck className="h-4 w-4" />
                    <AlertDescription>
                      Your order is on its way! Track your package using tracking number: {order.trackingNumber}
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Subtotal</div>
                  <div className="font-medium">${(order.total * 0.9).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Tax</div>
                  <div className="font-medium">${(order.total * 0.1).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Shipping</div>
                  <div className="font-medium">Free</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="font-medium text-lg">${order.total.toFixed(2)}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="font-medium">Payment Method</div>
                <div className="text-sm text-muted-foreground">**** **** **** 1234 (Visa)</div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Payment Status</div>
                <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
                  Paid
                </Badge>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                  <CreditCard className="h-4 w-4" />
                  Generate Payment Link
                </Button>
                <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                  <MessageSquare className="h-4 w-4" />
                  Send Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Order shipped</div>
                    <div className="text-xs text-muted-foreground">{order.updatedAt.toLocaleString()} • System</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Order processing started</div>
                    <div className="text-xs text-muted-foreground">
                      {order.createdAt.toLocaleString()} • Agent Sarah
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Package className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Order created</div>
                    <div className="text-xs text-muted-foreground">{order.createdAt.toLocaleString()} • Customer</div>
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
