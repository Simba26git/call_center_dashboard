"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, CheckCircle, Users, Clock } from "lucide-react"

export default function AsanaPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/integrations/asana/status');
      const data = await response.json();
      setIsConnected(data.connected);
    } catch (error) {
      console.error('Failed to check Asana connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectToAsana = () => {
    window.location.href = '/api/auth/asana/authorize';
  };

  const tasks = [
    { id: 1, title: "Follow up with ABC Corp", project: "Sales Pipeline", priority: "High", dueDate: "Today", completed: false },
    { id: 2, title: "Update customer documentation", project: "Documentation", priority: "Medium", dueDate: "Tomorrow", completed: false },
    { id: 3, title: "Review Q3 performance metrics", project: "Analytics", priority: "Low", dueDate: "This week", completed: true },
  ]

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Checking Asana connection...</p>
                </div>
              </div>
            ) : !isConnected ? (
              <div className="flex items-center justify-center h-64">
                <Card className="w-96">
                  <CardHeader className="text-center">
                    <CardTitle>Connect to Asana</CardTitle>
                    <CardDescription>
                      Connect your Asana account to access projects, tasks, and team collaboration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button onClick={connectToAsana} className="w-full">
                      Connect Asana Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Asana</h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      Connected
                    </Badge>
                  </div>
                </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 due today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Tasks</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className={`p-3 rounded-lg border ${task.completed ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      {task.completed ? <CheckCircle className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 border rounded-full" />}
                    </Button>
                    <div>
                      <p className={`font-medium ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.project}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'default' : 'secondary'}>
                      {task.priority}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {task.dueDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
