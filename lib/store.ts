import { create } from "zustand"
import type { User, Call, Customer } from "@/types"

interface AppState {
  // User and auth
  currentUser: User | null
  setCurrentUser: (user: User | null) => void

  // Call state
  activeCall: Call | null
  setActiveCall: (call: Call | null) => void

  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // Current customer context
  selectedCustomer: Customer | null
  setSelectedCustomer: (customer: Customer | null) => void

  // Notifications
  notifications: Array<{ id: string; type: "info" | "warning" | "error"; message: string }>
  addNotification: (notification: Omit<AppState["notifications"][0], "id">) => void
  removeNotification: (id: string) => void

  callHistory: Call[]
  addToCallHistory: (call: Call) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  activeCall: null,
  setActiveCall: (call) => set({ activeCall: call }),

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  selectedCustomer: null,
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),

  notifications: [],
  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9)
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }))
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  callHistory: [],
  addToCallHistory: (call) => {
    set((state) => ({
      callHistory: [call, ...state.callHistory.slice(0, 49)], // Keep last 50 calls
    }))
  },
}))
