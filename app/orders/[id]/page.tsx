"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { OrderDetail } from "@/components/orders/order-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { mockOrders } from "@/lib/mock-data"
import type { Order } from "@/types"

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock loading order data
    setTimeout(() => {
      const foundOrder = mockOrders.find((o) => o.id === params.id)
      setOrder(foundOrder || null)
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleStatusUpdate = (orderId: string, status: Order["status"]) => {
    if (order) {
      setOrder({ ...order, status, updatedAt: new Date() })
    }
  }

  const handleRefundRequest = (orderId: string, reason: string) => {
    console.log("Refund request:", { orderId, reason })
    // Handle refund request logic
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </main>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
              <p className="text-muted-foreground mb-4">The requested order could not be found.</p>
              <Link href="/orders">
                <Button className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Orders
                </Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Link href="/orders">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </Button>
            </Link>
            <OrderDetail order={order} onStatusUpdate={handleStatusUpdate} onRefundRequest={handleRefundRequest} />
          </div>
        </main>
      </div>
    </div>
  )
}
