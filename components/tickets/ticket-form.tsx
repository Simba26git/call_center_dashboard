"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, User, Plus } from "lucide-react"
import { api } from "@/lib/api"
import type { Ticket, Customer } from "@/types"

interface TicketFormProps {
  onSubmit: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export function TicketForm({ onSubmit, onCancel }: TicketFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Ticket["priority"]>("medium")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerSearch, setCustomerSearch] = useState("")
  const [customerResults, setCustomerResults] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)

  const handleCustomerSearch = async () => {
    if (!customerSearch.trim()) return

    try {
      const results = await api.searchCustomers(customerSearch)
      setCustomerResults(results)
    } catch (error) {
      console.error("Customer search failed:", error)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !selectedCustomer) return

    setLoading(true)
    try {
      const ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt"> = {
        customerId: selectedCustomer.id,
        agentId: "1", // Current user
        title: title.trim(),
        description: description.trim(),
        priority,
        status: "new",
        category,
        tags,
      }

      onSubmit(ticketData)
    } catch (error) {
      console.error("Failed to create ticket:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    "Account Access",
    "Billing Inquiry",
    "Technical Support",
    "Product Information",
    "Complaint",
    "Feature Request",
    "Other",
  ]

  const commonTags = ["urgent", "billing", "technical", "account", "password", "refund", "bug", "enhancement"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Ticket</h1>
          <p className="text-muted-foreground">Log a new customer support issue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
              <CardDescription>Provide information about the customer issue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief description of the issue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the customer's issue..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={(value: Ticket["priority"]) => setPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} variant="outline" size="sm" className="bg-transparent">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {commonTags.map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      onClick={() => !tags.includes(tag) && setTags([...tags, tag])}
                      disabled={tags.includes(tag)}
                      className="text-xs bg-transparent"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Selection */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
              <CardDescription>Select the customer for this ticket</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedCustomer ? (
                <>
                  <div className="flex gap-2">
                    <Input
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      placeholder="Search by name, email, or phone"
                      onKeyDown={(e) => e.key === "Enter" && handleCustomerSearch()}
                    />
                    <Button onClick={handleCustomerSearch} size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  {customerResults.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {customerResults.map((customer) => (
                        <div
                          key={customer.id}
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-accent"
                        >
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                          <div className="text-sm text-muted-foreground">{customer.accountNumber}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{selectedCustomer.name}</div>
                        <div className="text-sm text-muted-foreground">{selectedCustomer.email}</div>
                        <div className="text-sm text-muted-foreground">{selectedCustomer.accountNumber}</div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCustomer(null)}
                    className="w-full bg-transparent"
                  >
                    Change Customer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={handleSubmit}
                disabled={!title.trim() || !description.trim() || !selectedCustomer || loading}
                className="w-full"
              >
                {loading ? "Creating..." : "Create Ticket"}
              </Button>
              <Button onClick={onCancel} variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
