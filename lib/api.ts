// Mock API functions for development
import type { User, Customer, Ticket, Order, KBArticle } from "@/types"
import { mockUsers, mockCustomers, mockTickets, mockOrders, mockKBArticles } from "./mock-data"

// Call Center specific types
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  tags: string[];
  lastCalled?: Date;
  notes?: string;
  status: 'active' | 'do-not-call' | 'follow-up' | 'converted';
  source: 'manual' | 'import' | 'web' | 'referral';
  createdAt: Date;
}

export interface Call {
  id: string;
  contactId: string;
  duration: number;
  timestamp: Date;
  outcome: 'answered' | 'no-answer' | 'busy' | 'voicemail' | 'disconnected';
  notes?: string;
  recording?: string;
  agentId: string;
  disposition: 'interested' | 'not-interested' | 'callback' | 'sale' | 'no-contact';
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  contacts: string[];
  status: 'active' | 'paused' | 'completed' | 'draft';
  createdAt: Date;
  completedCalls: number;
  totalCalls: number;
  successRate: number;
  script?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'available' | 'busy' | 'break' | 'offline';
  totalCalls: number;
  successfulCalls: number;
  averageCallTime: number;
}

export interface CallSession {
  id: string;
  contactId: string;
  agentId: string;
  status: 'dialing' | 'ringing' | 'connected' | 'on-hold' | 'ended';
  startTime: Date;
  duration: number;
}

// Mock data for call center
let contacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1-555-0123',
    email: 'john.smith@acme.com',
    company: 'Acme Corporation',
    tags: ['enterprise', 'hot-lead'],
    lastCalled: new Date('2024-01-15'),
    notes: 'Interested in premium package. Decision maker for IT purchases.',
    status: 'follow-up',
    source: 'web',
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '+1-555-0124',
    email: 'sarah.j@techstart.com',
    company: 'TechStart Inc',
    tags: ['startup', 'warm-lead'],
    notes: 'Looking for cost-effective solution',
    status: 'active',
    source: 'referral',
    createdAt: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Mike Chen',
    phone: '+1-555-0125',
    email: 'mike.chen@innovate.io',
    company: 'Innovate Solutions',
    tags: ['mid-market', 'demo-scheduled'],
    lastCalled: new Date('2024-01-20'),
    notes: 'Scheduled demo for January 25th at 2 PM',
    status: 'follow-up',
    source: 'manual',
    createdAt: new Date('2024-01-18')
  }
];

let calls: Call[] = [
  {
    id: '1',
    contactId: '1',
    duration: 180,
    timestamp: new Date('2024-01-15T10:30:00'),
    outcome: 'answered',
    notes: 'Discussed pricing options and implementation timeline',
    agentId: 'agent1',
    disposition: 'interested'
  },
  {
    id: '2',
    contactId: '2',
    duration: 0,
    timestamp: new Date('2024-01-16T14:15:00'),
    outcome: 'no-answer',
    agentId: 'agent1',
    disposition: 'no-contact'
  }
];

let campaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q1 Enterprise Outreach',
    description: 'Targeting enterprise clients for Q1 sales push',
    contacts: ['1', '3'],
    status: 'active',
    createdAt: new Date('2024-01-01'),
    completedCalls: 15,
    totalCalls: 50,
    successRate: 0.3
  }
];

let agents: Agent[] = [
  {
    id: 'agent1',
    name: 'Alex Rodriguez',
    email: 'alex@callcenter.com',
    status: 'available',
    totalCalls: 45,
    successfulCalls: 12,
    averageCallTime: 145
  }
];

let currentCallSession: CallSession | null = null;

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  // Auth
  async login(email: string, password: string): Promise<User> {
    await delay(500)
    const user = mockUsers.find((u) => u.email === email)
    if (!user) throw new Error("Invalid credentials")
    return user
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(200)
    return mockUsers[0] // Default to first user for demo
  },

  // Customers (legacy)
  async getCustomers(): Promise<Customer[]> {
    await delay(300)
    return mockCustomers
  },

  async getCustomer(id: string): Promise<Customer | null> {
    await delay(200)
    return mockCustomers.find((c) => c.id === id) || null
  },

  async searchCustomers(query: string): Promise<Customer[]> {
    await delay(300)
    return mockCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email?.toLowerCase().includes(query.toLowerCase()) ||
        c.phone?.includes(query) ||
        c.accountNumber.toLowerCase().includes(query.toLowerCase()),
    )
  },

  // Call Center - Contact management
  async getContacts(): Promise<Contact[]> {
    await delay(300)
    return [...contacts]
  },

  async getContact(id: string): Promise<Contact | null> {
    await delay(200)
    return contacts.find(c => c.id === id) || null
  },

  async createContact(contact: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> {
    await delay(300)
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    contacts.push(newContact)
    return newContact
  },

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    await delay(300)
    const index = contacts.findIndex(c => c.id === id)
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...updates }
      return contacts[index]
    }
    throw new Error('Contact not found')
  },

  async deleteContact(id: string): Promise<void> {
    await delay(300)
    contacts = contacts.filter(c => c.id !== id)
  },

  async searchContacts(query: string): Promise<Contact[]> {
    await delay(300)
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email?.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query) ||
        c.company?.toLowerCase().includes(query.toLowerCase())
    )
  },

  // Call Center - Call management
  async getCalls(): Promise<Call[]> {
    await delay(300)
    return [...calls]
  },

  async getCallsForContact(contactId: string): Promise<Call[]> {
    await delay(200)
    return calls.filter(c => c.contactId === contactId)
  },

  async createCall(call: Omit<Call, 'id'>): Promise<Call> {
    const newCall: Call = {
      ...call,
      id: Date.now().toString()
    }
    calls.push(newCall)
    await delay(300)
    return newCall
  },

  // Call Center - Campaign management
  async getCampaigns(): Promise<Campaign[]> {
    await delay(300)
    return [...campaigns]
  },

  async createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt' | 'completedCalls' | 'successRate'>): Promise<Campaign> {
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      createdAt: new Date(),
      completedCalls: 0,
      successRate: 0
    }
    campaigns.push(newCampaign)
    await delay(300)
    return newCampaign
  },

  // Call Center - Agent management
  async getAgents(): Promise<Agent[]> {
    await delay(200)
    return [...agents]
  },

  async updateAgentStatus(agentId: string, status: Agent['status']): Promise<Agent | null> {
    const index = agents.findIndex(a => a.id === agentId)
    if (index === -1) return null
    agents[index] = { ...agents[index], status }
    await delay(200)
    return agents[index]
  },

  // Call Center - Call session management
  async startCall(contactId: string, agentId: string): Promise<CallSession> {
    currentCallSession = {
      id: Date.now().toString(),
      contactId,
      agentId,
      status: 'dialing',
      startTime: new Date(),
      duration: 0
    }
    await delay(1000)
    if (currentCallSession) {
      currentCallSession.status = 'ringing'
    }
    return currentCallSession
  },

  async answerCall(): Promise<CallSession | null> {
    if (currentCallSession) {
      currentCallSession.status = 'connected'
    }
    await delay(500)
    return currentCallSession
  },

  async endCall(outcome: Call['outcome'], disposition: Call['disposition'], notes?: string): Promise<void> {
    if (currentCallSession) {
      const duration = Math.floor((Date.now() - currentCallSession.startTime.getTime()) / 1000)
      
      // Create call record
      await api.createCall({
        contactId: currentCallSession.contactId,
        duration,
        timestamp: currentCallSession.startTime,
        outcome,
        notes,
        agentId: currentCallSession.agentId,
        disposition
      })

      // Update contact last called
      await api.updateContact(currentCallSession.contactId, {
        lastCalled: new Date()
      })

      currentCallSession = null
    }
  },

  async getCurrentCall(): Promise<CallSession | null> {
    return currentCallSession
  },

  // Call Center - Analytics
  async getCallAnalytics() {
    await delay(400)
    const totalCalls = calls.length
    const answeredCalls = calls.filter(c => c.outcome === 'answered').length
    const avgDuration = calls.reduce((sum, call) => sum + call.duration, 0) / calls.length || 0
    
    return {
      totalCalls,
      answeredCalls,
      answerRate: totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0,
      avgDuration: Math.round(avgDuration),
      conversionRate: 25.4,
      dailyCalls: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        calls: Math.floor(Math.random() * 20) + 5
      }))
    }
  },

  // Tickets
  async getTickets(): Promise<Ticket[]> {
    await delay(300)
    return mockTickets
  },

  async getTicket(id: string): Promise<Ticket | null> {
    await delay(200)
    return mockTickets.find(t => t.id === id) || null
  },

  async createTicket(ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">): Promise<Ticket> {
    await delay(500)
    const newTicket: Ticket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockTickets.push(newTicket)
    return newTicket
  },

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket | null> {
    await delay(300)
    const index = mockTickets.findIndex(t => t.id === id)
    if (index === -1) return null
    mockTickets[index] = { ...mockTickets[index], ...updates, updatedAt: new Date() }
    return mockTickets[index]
  },

  async deleteTicket(id: string): Promise<boolean> {
    await delay(300)
    const originalLength = mockTickets.length
    const filteredTickets = mockTickets.filter(t => t.id !== id)
    mockTickets.length = 0
    mockTickets.push(...filteredTickets)
    return mockTickets.length < originalLength
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    await delay(300)
    return mockOrders
  },

  async getOrder(id: string): Promise<Order | null> {
    await delay(200)
    return mockOrders.find(o => o.id === id) || null
  },

  async createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    await delay(400)
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockOrders.push(newOrder)
    return newOrder
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    await delay(300)
    const index = mockOrders.findIndex(o => o.id === id)
    if (index === -1) return null
    mockOrders[index] = { ...mockOrders[index], ...updates, updatedAt: new Date() }
    return mockOrders[index]
  },

  async getCustomerOrders(customerId: string): Promise<Order[]> {
    await delay(300)
    return mockOrders.filter((o) => o.customerId === customerId)
  },

  // Knowledge Base
  async searchKB(query: string): Promise<KBArticle[]> {
    await delay(300)
    return mockKBArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
    )
  },

  // WebSocket mock for real-time events
  createWebSocket(): WebSocket {
    // Mock WebSocket for development
    const mockWS = {
      send: (data: string) => console.log("WS Send:", data),
      close: () => console.log("WS Closed"),
      addEventListener: (event: string, handler: Function) => {
        if (event === "message") {
          // Simulate incoming call after 5 seconds
          setTimeout(() => {
            handler({
              data: JSON.stringify({
                type: "incoming_call",
                payload: {
                  id: "call-" + Date.now(),
                  customerId: "cust-1",
                  phoneNumber: "+1-555-0123",
                  direction: "inbound",
                },
              }),
            })
          }, 5000)
        }
      },
    } as unknown as WebSocket

    return mockWS
  },
}
