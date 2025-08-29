"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { TicketList } from "@/components/tickets/ticket-list"

export default function TicketsPage() {
  return (
    <ProtectedRoute requiredPermission="tickets.read">
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <TicketList />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
