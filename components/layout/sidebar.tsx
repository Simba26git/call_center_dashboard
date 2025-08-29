"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { useAuth } from "@/lib/auth"
import {
  LayoutDashboard,
  Phone,
  Users,
  Ticket,
  ShoppingCart,
  Megaphone,
  BookOpen,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Mail,
  Workflow,
  Building2,
  Shield,
  Crown,
  CreditCard,
  Calculator,
  FileText,
  Zap,
  MessageSquare,
  Send,
  TrendingUp,
  Globe,
  DollarSign,
  Bot,
} from "lucide-react"
import {
  SlackLogo,
  AsanaLogo,
  HubSpotLogo,
  SalesforceLogo,
  MailchimpLogo,
  QuickBooksLogo,
  StripeLogo,
} from "@/components/icons"

interface AppPermission {
  id: string;
  enabled: boolean;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  permission: string;
  roles?: string[];
}

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  const { user, hasPermission } = useAuth()
  const [appPermissions, setAppPermissions] = useState<AppPermission[]>([])

  useEffect(() => {
    // Fetch worker permissions on mount
    const fetchPermissions = async () => {
      try {
        const response = await fetch('/api/worker/permissions')
        const data = await response.json()
        setAppPermissions(data.appPermissions || [])
      } catch (error) {
        console.error('Failed to fetch permissions:', error)
      }
    }

    fetchPermissions()
  }, [])

  const hasAppAccess = (appId: string) => {
    // Allow access if user is root (admin), manager, or admin
    if (user && ['root', 'admin', 'manager'].includes(user.role)) {
      return true
    }
    
    // Check if app is enabled for workers
    const permission = appPermissions.find(app => app.id === appId)
    return permission?.enabled || false
  }

  const navigation: NavigationItem[] = [
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: LayoutDashboard,
      permission: "*"
    },
    { 
      name: "Live Interactions", 
      href: "/interactions", 
      icon: Phone,
      permission: "interactions.read"
    },
    { 
      name: "Customers", 
      href: "/customers", 
      icon: Users,
      permission: "customer.read"
    },
    { 
      name: "Tickets", 
      href: "/tickets", 
      icon: Ticket,
      permission: "tickets.read"
    },
    { 
      name: "Orders", 
      href: "/orders", 
      icon: ShoppingCart,
      permission: "orders.read"
    },
    { 
      name: "N8N AI Agent", 
      href: "/n8n", 
      icon: Workflow,
      permission: "*"
    },
    { 
      name: "Reports & QA", 
      href: "/reports", 
      icon: BarChart3,
      permission: "reports.view"
    },
    { 
      name: "Settings", 
      href: "/settings", 
      icon: Settings,
      permission: "*"
    },
  ]

  const adminNavigation: NavigationItem[] = [
    { 
      name: "Subscription", 
      href: "/subscription", 
      icon: Crown,
      permission: "admin.manage",
      roles: ["root"]
    },
    { 
      name: "Employee Management", 
      href: "/manager", 
      icon: Users,
      permission: "user.manage",
      roles: ["root", "manager"]
    },
    { 
      name: "Organization", 
      href: "/organization", 
      icon: Building2,
      permission: "user.read",
      roles: ["root"]
    },
    { 
      name: "Worker Permissions", 
      href: "/admin/permissions", 
      icon: Shield,
      permission: "admin.manage",
      roles: ["root"]
    },
  ]

  const filteredNavigation = navigation.filter(item => {
    // Check role-based access
    if (item.roles && user && !item.roles.includes(user.role)) {
      return false
    }
    // Check permission-based access
    return hasPermission(item.permission)
  })

  const filteredAdminNavigation = adminNavigation.filter(item => {
    // Check role-based access
    if (item.roles && user && !item.roles.includes(user.role)) {
      return false
    }
    // Check permission-based access
    return hasPermission(item.permission)
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'root':
        return <Crown className="h-3 w-3 text-yellow-500" />
      case 'manager':
        return <Shield className="h-3 w-3 text-blue-500" />
      case 'supervisor':
        return <Shield className="h-3 w-3 text-green-500" />
      case 'admin':
        return <Shield className="h-3 w-3 text-purple-500" />
      default:
        return <Users className="h-3 w-3 text-gray-500" />
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-sidebar-foreground">Call Center</h1>
            {user && (
              <div className="flex items-center gap-1">
                {getRoleIcon(user.role)}
              </div>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 text-sidebar-foreground",
                    !sidebarOpen && "px-2",
                    isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {sidebarOpen && <span>{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Admin Section */}
        {user && (user.role === 'root' || user.role === 'manager') && filteredAdminNavigation.length > 0 && (
          <div className="mt-6 pt-4 border-t border-sidebar-border">
            {sidebarOpen && (
              <h3 className="px-3 mb-3 text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wider">
                Admin
              </h3>
            )}
            <nav className="space-y-2">
              {filteredAdminNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 text-sidebar-foreground",
                        !sidebarOpen && "px-2",
                        isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {sidebarOpen && <span>{item.name}</span>}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}

        {/* Worker App Connections */}
        {user && (user.role === 'agent' || user.role === 'supervisor' || user.role === 'manager' || user.role === 'root') && (
          <div className="mt-6 pt-4 border-t border-sidebar-border">
            {sidebarOpen && (
              <h3 className="px-3 mb-3 text-xs font-semibold text-sidebar-muted-foreground uppercase tracking-wider">
                Quick Connect
              </h3>
            )}
            <div className="space-y-1">
              {/* Slack */}
              {hasAppAccess('slack') && (
                <Link href="/apps/slack">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
                      sidebarOpen ? "justify-start" : "justify-center px-2"
                    )}
                  >
                    <SlackLogo className="h-4 w-4 flex-shrink-0" />
                    {sidebarOpen && <span>Slack</span>}
                  </Button>
                </Link>
              )}
              
              {/* Asana */}
              {hasAppAccess('asana') && (
                <Link href="/apps/asana">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
                      sidebarOpen ? "justify-start" : "justify-center px-2"
                    )}
                  >
                    <AsanaLogo className="h-4 w-4 flex-shrink-0" />
                    {sidebarOpen && <span>Asana</span>}
                  </Button>
                </Link>
              )}
              
              {/* HubSpot */}
              {hasAppAccess('hubspot') && (
                <Link href="/apps/hubspot">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
                      sidebarOpen ? "justify-start" : "justify-center px-2"
                    )}
                  >
                    <HubSpotLogo className="h-4 w-4 flex-shrink-0" />
                    {sidebarOpen && <span>HubSpot</span>}
                  </Button>
                </Link>
              )}
              
              {/* Salesforce */}
              {hasAppAccess('salesforce') && (
                <Link href="/apps/salesforce">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
                      sidebarOpen ? "justify-start" : "justify-center px-2"
                    )}
                  >
                    <SalesforceLogo className="h-4 w-4 flex-shrink-0" />
                    {sidebarOpen && <span>Salesforce</span>}
                  </Button>
                </Link>
              )}
              
              {/* Mailchimp */}
              {hasAppAccess('mailchimp') && (
                <Link href="/apps/mailchimp">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
                      sidebarOpen ? "justify-start" : "justify-center px-2"
                    )}
                  >
                    <MailchimpLogo className="h-4 w-4 flex-shrink-0" />
                    {sidebarOpen && <span>Mailchimp</span>}
                  </Button>
                </Link>
              )}
              
              {/* QuickBooks */}
              {hasAppAccess('quickbooks') && (
                <Link href="/apps/quickbooks">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
                      sidebarOpen ? "justify-start" : "justify-center px-2"
                    )}
                  >
                    <QuickBooksLogo className="h-4 w-4 flex-shrink-0" />
                    {sidebarOpen && <span>QuickBooks</span>}
                  </Button>
                </Link>
              )}
              
              {/* Stripe */}
              {hasAppAccess('stripe') && (
                <Link href="/apps/stripe">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
                      sidebarOpen ? "justify-start" : "justify-center px-2"
                    )}
                  >
                    <StripeLogo className="h-4 w-4 flex-shrink-0" />
                    {sidebarOpen && <span>Stripe</span>}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
