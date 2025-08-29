"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { OrderList } from "@/components/orders/order-list"

export default function OrdersPage() {
  return (
    <ProtectedRoute requiredPermission="orders.read">
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <OrderList />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
