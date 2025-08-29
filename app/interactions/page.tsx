"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { SoftphonePanel } from "@/components/softphone/softphone-panel"

export default function InteractionsPage() {
  return (
    <ProtectedRoute requiredPermission="interactions.read">
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-hidden">
            <SoftphonePanel />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
