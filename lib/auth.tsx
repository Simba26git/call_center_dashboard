"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Organization, UserRole } from '@/types'

interface AuthContextType {
  user: User | null
  organization: Organization | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  hasPermission: (permission: string) => boolean
  canManageUser: (targetUser: User) => boolean
  canAccessRoute: (route: string) => boolean
  isAdmin: boolean // Helper to check if user is root (admin)
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Role hierarchy for permission checking
  const roleHierarchy = {
    root: { level: 5, permissions: ["*"] }, // Root is the ultimate admin with all permissions
    manager: { level: 4, permissions: ["user.read", "user.write", "team.manage", "reports.view", "integrations.manage"] },
    supervisor: { level: 3, permissions: ["user.read", "team.view", "reports.view", "interactions.manage"] },
    admin: { level: 2, permissions: ["user.read", "settings.manage", "integrations.view"] },
    agent: { level: 1, permissions: ["interactions.read", "interactions.write", "customer.read"] }
  }

  // Route access control
  const routePermissions = {
    '/': ["*"],
    '/customers': ["customer.read"],
    '/interactions': ["interactions.read"],
    '/orders': ["orders.read"],
    '/reports': ["reports.view"],
    '/tickets': ["tickets.read"],
    '/settings': ["settings.manage", "user.write"],
    '/settings/users': ["user.write"],
    '/settings/organization': ["user.write"],
    '/admin': ["user.write"],
    '/admin/permissions': ["*"], // Only root (admin) can access permissions
    '/organization': ["user.write"]
  }

  useEffect(() => {
    // Check for existing session
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Only run in browser environment
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }
      
      // Development mode - auto-login as root user for development
      const isDevelopment = process.env.NODE_ENV === 'development'
      
      if (isDevelopment) {
        const devUser: User = {
          id: "dev_root",
          name: "Developer Admin",
          email: "dev@company.com",
          role: "root",
          organizationId: "dev_org",
          permissions: ["*"],
          status: "available",
          integrations: {
            microsoft365: { connected: true, email: "dev@company.com" }
          },
          settings: {
            notifications: { email: true, slack: true, inApp: true },
            timezone: "UTC",
            language: "en"
          },
          createdAt: new Date(),
          lastLogin: new Date(),
          isActive: true
        }

        const devOrganization: Organization = {
          id: "dev_org",
          name: "Development Company",
          domain: "dev.com",
          tier: "enterprise",
          settings: {
            allowedDomains: ["dev.com"],
            requireDomainEmail: false,
            enableSSO: false,
            maxUsers: 1000,
            features: ["advanced_analytics", "api_access", "white_label"]
          },
          integrations: {},
          createdAt: new Date(),
          updatedAt: new Date(),
          rootUserId: "dev_root",
          status: "active"
        }

        setUser(devUser)
        setOrganization(devOrganization)
        setIsLoading(false)
        return
      }
      
      // Check for stored user data first (for demo)
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setOrganization(userData.organization)
          setIsLoading(false)
          return
        } catch (error) {
          console.error('Error parsing stored user:', error)
          localStorage.removeItem('user')
        }
      }
      
      // Check for auth token
      const token = localStorage.getItem('authToken')
      if (token) {
        // Mock user data - replace with actual API call
        const mockUser: User = {
          id: "1",
          name: "John Doe",
          email: "john@acme.com",
          role: "root",
          organizationId: "org1",
          permissions: ["*"],
          status: "available",
          integrations: {
            microsoft365: { connected: true, email: "john@acme.com" }
          },
          settings: {
            notifications: { email: true, slack: true, inApp: true },
            timezone: "UTC",
            language: "en"
          },
          createdAt: new Date(),
          lastLogin: new Date(),
          isActive: true
        }

        const mockOrganization: Organization = {
          id: "org1",
          name: "Acme Corporation",
          domain: "acme.com",
          tier: "enterprise",
          settings: {
            allowedDomains: ["acme.com"],
            requireDomainEmail: true,
            enableSSO: true,
            maxUsers: 1000,
            features: ["advanced_analytics", "api_access", "white_label"]
          },
          integrations: {},
          createdAt: new Date(),
          updatedAt: new Date(),
          rootUserId: "1",
          status: "active"
        }

        setUser(mockUser)
        setOrganization(mockOrganization)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      // In a real app, this would make an API call to your authentication endpoint
      
      // Mock login logic
      if (email && password) {
        const token = 'mock-jwt-token'
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', token)
        }
        await checkAuth()
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
    setUser(null)
    setOrganization(null)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    
    // Root has all permissions
    if (user.role === 'root' || user.permissions.includes("*")) {
      return true
    }

    // Check specific permissions
    return user.permissions.includes(permission) || 
           roleHierarchy[user.role]?.permissions.includes(permission) ||
           roleHierarchy[user.role]?.permissions.includes("*")
  }

  const canManageUser = (targetUser: User): boolean => {
    if (!user) return false
    
    // Can always manage yourself
    if (user.id === targetUser.id) return true
    
    // Root can manage everyone
    if (user.role === 'root') return true
    
    // Check role hierarchy
    const currentLevel = roleHierarchy[user.role]?.level || 0
    const targetLevel = roleHierarchy[targetUser.role]?.level || 0
    
    return currentLevel > targetLevel
  }

  const canAccessRoute = (route: string): boolean => {
    if (!user) return false
    
    const requiredPermissions = routePermissions[route as keyof typeof routePermissions] || ["*"]
    
    return requiredPermissions.some(permission => hasPermission(permission))
  }

  const isAdmin = user?.role === 'root'

  const value = {
    user,
    organization,
    login,
    logout,
    updateUser,
    hasPermission,
    canManageUser,
    canAccessRoute,
    isAdmin,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
