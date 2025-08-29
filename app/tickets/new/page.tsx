"use client"

import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { TicketForm } from "@/components/tickets/ticket-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"
import type { Ticket } from "@/types"

export default function NewTicketPage() {
  const router = useRouter()

  const handleSubmit = async (ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => {
    try {
      await api.createTicket(ticketData)
      router.push("/tickets")
    } catch (error) {
      console.error("Failed to create ticket:", error)
    }
  }

  const handleCancel = () => {
    router.push("/tickets")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Link href="/tickets">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Tickets
              </Button>
            </Link>
            <TicketForm onSubmit={handleSubmit} onCancel={handleCancel} />
          </div>
        </main>
      </div>
    </div>
  )
}
