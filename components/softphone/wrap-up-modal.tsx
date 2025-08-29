"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface WrapUpModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: WrapUpData) => void
}

export interface WrapUpData {
  disposition: string
  notes: string
  followUpRequired: boolean
  category: string
  tags: string[]
}

const dispositions = [
  { value: "resolved", label: "Issue Resolved" },
  { value: "escalated", label: "Escalated to Supervisor" },
  { value: "callback", label: "Callback Required" },
  { value: "no-answer", label: "No Answer" },
  { value: "wrong-number", label: "Wrong Number" },
  { value: "information", label: "Information Provided" },
]

const categories = [
  { value: "billing", label: "Billing Inquiry" },
  { value: "technical", label: "Technical Support" },
  { value: "account", label: "Account Management" },
  { value: "sales", label: "Sales Inquiry" },
  { value: "complaint", label: "Complaint" },
  { value: "other", label: "Other" },
]

const commonTags = ["password-reset", "billing-dispute", "service-outage", "new-customer", "retention", "upsell"]

export function WrapUpModal({ open, onClose, onSubmit }: WrapUpModalProps) {
  const [disposition, setDisposition] = useState("")
  const [notes, setNotes] = useState("")
  const [followUpRequired, setFollowUpRequired] = useState(false)
  const [category, setCategory] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleSubmit = () => {
    if (!disposition || !category) return

    onSubmit({
      disposition,
      notes,
      followUpRequired,
      category,
      tags: selectedTags,
    })

    // Reset form
    setDisposition("")
    setNotes("")
    setFollowUpRequired(false)
    setCategory("")
    setSelectedTags([])
    onClose()
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Call Wrap-Up</DialogTitle>
          <DialogDescription>Complete the call details before finishing.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Disposition */}
          <div className="space-y-2">
            <Label htmlFor="disposition">Call Disposition *</Label>
            <Select value={disposition} onValueChange={setDisposition}>
              <SelectTrigger>
                <SelectValue placeholder="Select disposition" />
              </SelectTrigger>
              <SelectContent>
                {dispositions.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {commonTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Call Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes about the call..."
              rows={3}
            />
          </div>

          {/* Follow-up */}
          <div className="flex items-center space-x-2">
            <Checkbox id="followup" checked={followUpRequired} onCheckedChange={setFollowUpRequired} />
            <Label htmlFor="followup" className="text-sm">
              Follow-up required
            </Label>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!disposition || !category} className="flex-1">
            Complete Call
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
