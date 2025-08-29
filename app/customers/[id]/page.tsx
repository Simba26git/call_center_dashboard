"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { CustomerProfile } from "@/components/customers/customer-profile"
import { CustomerMicrosoft365Integration } from "@/components/microsoft365/customer-integration"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"
import type { Customer } from "@/types"

export default function CustomerDetailPage() {
  const params = useParams()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCustomer()
  }, [params.id])

  const loadCustomer = async () => {
    try {
      setLoading(true)
      const data = await api.getCustomer(params.id as string)
      setCustomer(data)
    } catch (error) {
      console.error("Failed to load customer:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = (updates: Partial<Customer>) => {
    if (customer) {
      setCustomer({ ...customer, ...updates })
    }
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

  if (!customer) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Customer Not Found</h2>
              <p className="text-muted-foreground mb-4">The requested customer could not be found.</p>
              <Link href="/customers">
                <Button className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Customers
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
            <Link href="/customers">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Customers
              </Button>
            </Link>
            <CustomerProfile customer={customer} onUpdate={handleUpdate} />
            <CustomerMicrosoft365Integration 
              customerId={customer.id}
              customerEmail={customer.email}
              customerName={customer.name}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
