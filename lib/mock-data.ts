import type { User, Customer, Ticket, Order, KBArticle, Script } from "@/types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "agent",
    status: "available",
    teamId: "team-1",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    role: "supervisor",
    status: "available",
    teamId: "team-1",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@company.com",
    role: "admin",
    status: "available",
  },
  {
    id: "4",
    name: "Lisa Rodriguez",
    email: "lisa.rodriguez@company.com",
    role: "agent",
    status: "on-call",
    teamId: "team-1",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.kim@company.com",
    role: "agent",
    status: "away",
    teamId: "team-2",
  },
  {
    id: "6",
    name: "Emma Wilson",
    email: "emma.wilson@company.com",
    role: "supervisor",
    status: "available",
    teamId: "team-2",
  },
]

export const mockCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0123",
    accountNumber: "ACC-001234",
    tier: "gold",
    verificationStatus: "verified",
    preferredLanguage: "en",
    consentFlags: {
      recording: true,
      marketing: false,
    },
  },
  {
    id: "cust-2",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+1-555-0456",
    accountNumber: "ACC-005678",
    tier: "platinum",
    verificationStatus: "verified",
    preferredLanguage: "es",
    consentFlags: {
      recording: true,
      marketing: true,
    },
  },
]

export const mockTickets: Ticket[] = [
  {
    id: "ticket-1",
    customerId: "cust-1",
    agentId: "1",
    title: "Unable to access account",
    description: "Customer cannot log into their online account",
    priority: "high",
    status: "in-progress",
    category: "Account Access",
    tags: ["login", "password"],
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-01-15T14:30:00Z"),
  },
]

export const mockOrders: Order[] = [
  {
    id: "order-1",
    customerId: "cust-1",
    status: "shipped",
    items: [
      {
        id: "item-1",
        productId: "prod-1",
        name: "Premium Service Plan",
        quantity: 1,
        price: 99.99,
      },
    ],
    total: 99.99,
    trackingNumber: "TRK123456789",
    createdAt: new Date("2024-01-10T09:00:00Z"),
    updatedAt: new Date("2024-01-12T16:00:00Z"),
  },
]

export const mockKBArticles: KBArticle[] = [
  {
    id: "kb-1",
    title: "How to Reset Customer Password",
    content: "Step-by-step guide for password reset...",
    category: "Account Management",
    tags: ["password", "reset", "security"],
    helpful: 45,
    notHelpful: 3,
    lastUpdated: new Date("2024-01-01T00:00:00Z"),
  },
]

export const mockScripts: Script[] = [
  {
    id: "script-1",
    name: "Complaint Handling",
    category: "Customer Service",
    content: [
      {
        id: "step-1",
        type: "text",
        content: "Thank you for calling. I understand you have a concern. Can you please tell me more about the issue?",
      },
      {
        id: "step-2",
        type: "question",
        content: "Is this related to billing, service, or technical support?",
        nextSteps: {
          billing: "step-3a",
          service: "step-3b",
          technical: "step-3c",
        },
      },
    ],
  },
]
