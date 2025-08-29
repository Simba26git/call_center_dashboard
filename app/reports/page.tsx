"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardCharts } from "@/components/reports/dashboard-charts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/admin/user-management"
import { QAMonitoring } from "@/components/admin/qa-monitoring"

export default function ReportsPage() {
  return (
    <ProtectedRoute requiredPermission="reports.view">
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
              <p className="text-muted-foreground">Monitor performance and manage system administration</p>
            </div>

            <Tabs defaultValue="dashboard" className="space-y-4">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="qa">Quality Assurance</TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <DashboardCharts />
              </TabsContent>

              <TabsContent value="qa">
                <QAMonitoring />
              </TabsContent>

              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}
