// Core entity types for the call center application
export type UserRole = "root" | "manager" | "agent" | "supervisor" | "admin"
export type OrganizationTier = "starter" | "professional" | "enterprise" | "custom"

export interface Organization {
  id: string
  name: string
  domain: string
  tier: OrganizationTier
  logo?: string
  settings: {
    allowedDomains: string[]
    requireDomainEmail: boolean
    enableSSO: boolean
    maxUsers: number
    features: string[]
  }
  integrations: {
    [key: string]: any
  }
  createdAt: Date
  updatedAt: Date
  rootUserId: string
  status: "active" | "suspended" | "trial"
  billingInfo?: {
    subscriptionId: string
    planId: string
    nextBillingDate: Date
  }
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  avatar?: string
  status: "available" | "away" | "on-call" | "acw" | "offline"
  organizationId: string
  teamId?: string
  managerId?: string
  permissions: string[]
  lastPasswordChange?: string
  integrations: {
    microsoft365?: {
      connected: boolean
      email?: string
      accessToken?: string
      refreshToken?: string
      lastSync?: Date
    }
    [key: string]: any
  }
  settings: {
    notifications: {
      email: boolean
      slack: boolean
      inApp: boolean
    }
    timezone: string
    language: string
  }
  createdAt: Date
  lastLogin?: Date
  isActive: boolean
}

export interface Team {
  id: string
  name: string
  organizationId: string
  managerId: string
  supervisorId?: string
  agentIds: string[]
  description?: string
  permissions: string[]
  settings: {
    allowedIntegrations: string[]
    maxActiveInteractions: number
    workingHours: {
      start: string
      end: string
      timezone: string
    }
    autoAssignment: boolean
  }
}

export interface Permission {
  id: string
  name: string
  description: string
  category: "user_management" | "integrations" | "reports" | "settings" | "interactions"
  level: "read" | "write" | "admin"
}

export interface RoleTemplate {
  role: UserRole
  defaultPermissions: string[]
  canManage: UserRole[]
  description: string
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  accountNumber: string
  tier: "bronze" | "silver" | "gold" | "platinum"
  verificationStatus: "verified" | "pending" | "failed"
  preferredLanguage: string
  consentFlags: {
    recording: boolean
    marketing: boolean
  }
}

export interface Interaction {
  id: string
  type: "call" | "chat" | "social" | "email"
  customerId: string
  agentId: string
  status: "active" | "hold" | "wrap-up" | "completed"
  startTime: Date
  endTime?: Date
  notes?: string
  disposition?: string
  recordingId?: string
}

export interface Call extends Interaction {
  type: "call"
  direction: "inbound" | "outbound"
  phoneNumber: string
  callState: "idle" | "ringing" | "active" | "hold" | "transfer" | "wrap-up" | "done"
  isRecording: boolean
  isMuted: boolean
  duration: number
}

export interface Ticket {
  id: string
  customerId: string
  agentId?: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "new" | "triage" | "in-progress" | "pending-customer" | "resolved" | "closed"
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  linkedInteractionId?: string
}

export interface Order {
  id: string
  customerId: string
  status: "draft" | "pending-payment" | "processing" | "shipped" | "delivered" | "completed" | "cancelled"
  items: OrderItem[]
  total: number
  shippingAddress?: Address
  trackingNumber?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  quantity: number
  price: number
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface KBArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  helpful: number
  notHelpful: number
  lastUpdated: Date
}

export interface Script {
  id: string
  name: string
  category: string
  content: ScriptStep[]
}

export interface ScriptStep {
  id: string
  type: "text" | "question" | "action"
  content: string
  nextSteps?: { [key: string]: string }
}

export interface Integration {
  id: string
  name: "microsoft365" | "sap" | "quickbooks"
  status: "connected" | "disconnected" | "error"
  lastSync?: Date
  config: Record<string, any>
}

// Microsoft 365 Integration Types
export interface Microsoft365Email {
  id: string
  subject: string
  from: {
    emailAddress: {
      name?: string
      address: string
    }
  }
  receivedDateTime: string
  bodyPreview: string
  isRead: boolean
  customerId?: string
  ticketId?: string
}

export interface Microsoft365CalendarEvent {
  id: string
  subject: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees?: Array<{
    emailAddress: {
      address: string
      name?: string
    }
  }>
  location?: {
    displayName: string
  }
  customerId?: string
  ticketId?: string
}

export interface Microsoft365Contact {
  id: string
  displayName: string
  emailAddresses?: Array<{
    address: string
    name?: string
  }>
  businessPhones?: string[]
  mobilePhone?: string
  customerId?: string
}

export interface Microsoft365Team {
  id: string
  displayName: string
  description?: string
  webUrl?: string
}

export interface Microsoft365Integration {
  isConnected: boolean
  userPrincipalName?: string
  displayName?: string
  emails: Microsoft365Email[]
  events: Microsoft365CalendarEvent[]
  contacts: Microsoft365Contact[]
  teams: Microsoft365Team[]
}
