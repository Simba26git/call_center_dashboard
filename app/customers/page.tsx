"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { CustomerList } from "@/components/customers/customer-list"

export default function CustomersPage() {
  return (
    <ProtectedRoute requiredPermission="customer.read">
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <CustomerList />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
