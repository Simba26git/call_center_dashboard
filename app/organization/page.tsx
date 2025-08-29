"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { OrganizationDashboard } from '@/components/organization/organization-dashboard'

export default function OrganizationPage() {
  return (
    <ProtectedRoute requiredPermission="user.read">
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <OrganizationDashboard />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
