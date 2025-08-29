"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, UserPlus, Edit, Trash2, Shield, Key, 
  CheckCircle, XCircle, Clock, Mail, Phone,
  Settings, MoreHorizontal, Download, Upload
} from 'lucide-react'
import { User, UserRole, Team, Organization, Permission } from '@/types'

interface UserManagementProps {
  organization: Organization
  currentUser: User
}

export function UserManagement({ organization, currentUser }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("users")

  // Mock data - replace with actual API calls
  useEffect(() => {
    setUsers([
      {
        id: "1",
        name: "John Doe",
        email: "john@acme.com",
        role: "root",
        organizationId: organization.id,
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
      },
      {
        id: "2", 
        name: "Sarah Wilson",
        email: "sarah@acme.com",
        role: "manager",
        organizationId: organization.id,
        teamId: "team1",
        permissions: ["user.read", "user.write", "team.manage"],
        status: "available",
        integrations: {
          microsoft365: { connected: false }
        },
        settings: {
          notifications: { email: true, slack: false, inApp: true },
          timezone: "UTC",
          language: "en"
        },
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true
      }
    ])

    setTeams([
      {
        id: "team1",
        name: "Sales Team",
        organizationId: organization.id,
        managerId: "2",
        agentIds: ["3", "4"],
        permissions: ["interaction.read", "interaction.write", "customer.read"],
        settings: {
          allowedIntegrations: ["microsoft365", "hubspot", "slack"],
          maxActiveInteractions: 5,
          workingHours: { start: "09:00", end: "17:00", timezone: "UTC" },
          autoAssignment: true
        }
      }
    ])
  }, [organization.id])

  const roleHierarchy = {
    root: { level: 5, label: "Root Admin", color: "bg-red-500" },
    manager: { level: 4, label: "Manager", color: "bg-blue-500" },
    supervisor: { level: 3, label: "Supervisor", color: "bg-green-500" },
    admin: { level: 2, label: "Admin", color: "bg-yellow-500" },
    agent: { level: 1, label: "Agent", color: "bg-gray-500" }
  }

  const canManageUser = (targetUser: User) => {
    const currentLevel = roleHierarchy[currentUser.role].level
    const targetLevel = roleHierarchy[targetUser.role].level
    return currentLevel > targetLevel || currentUser.id === targetUser.id
  }

  const getAvailableRoles = () => {
    const currentLevel = roleHierarchy[currentUser.role].level
    return Object.entries(roleHierarchy)
      .filter(([_, roleInfo]) => roleInfo.level < currentLevel)
      .map(([role, _]) => role as UserRole)
  }

  const AddUserDialog = () => {
    const [newUser, setNewUser] = useState({
      name: "",
      email: "",
      role: "agent" as UserRole,
      teamId: ""
    })

    const handleSubmit = () => {
      // Here you would make an API call to create the user
      console.log("Creating user:", newUser)
      setIsAddUserOpen(false)
      setNewUser({ name: "", email: "", role: "agent", teamId: "" })
    }

    return (
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account for your organization
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@acme.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoles().map(role => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${roleHierarchy[role].color}`} />
                        {roleHierarchy[role].label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(newUser.role === "agent" || newUser.role === "supervisor") && (
              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Select value={newUser.teamId} onValueChange={(value) => setNewUser(prev => ({ ...prev, teamId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(team => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const UserRow = ({ user }: { user: User }) => (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${roleHierarchy[user.role].color}`} />
          {roleHierarchy[user.role].label}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={user.status === "available" ? "default" : "secondary"}>
          {user.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {user.integrations.microsoft365?.connected ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm">M365</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-muted-foreground">
          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {canManageUser(user) && (
            <>
              <Button variant="ghost" size="sm" onClick={() => {
                setSelectedUser(user)
                setIsEditUserOpen(true)
              }}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions for {organization.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <AddUserDialog />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Users
              </CardTitle>
              <CardDescription>
                Manage user accounts and their access levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Integrations</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Organize users into teams with specific permissions and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teams.map(team => (
                  <Card key={team.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {team.name}
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="font-semibold">Manager</Label>
                          <p className="text-sm text-muted-foreground">
                            {users.find(u => u.id === team.managerId)?.name || "Not assigned"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">Team Members</Label>
                          <p className="text-sm text-muted-foreground">
                            {team.agentIds.length} members
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">Allowed Integrations</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {team.settings.allowedIntegrations.map(integration => (
                              <Badge key={integration} variant="outline" className="text-xs">
                                {integration}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Permissions
              </CardTitle>
              <CardDescription>
                Configure what each role can access and modify
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(roleHierarchy).map(([role, info]) => (
                  <Card key={role}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${info.color}`} />
                        {info.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        {role === "root" && "Full system access and control"}
                        {role === "manager" && "Team management and reporting access"}
                        {role === "supervisor" && "Agent oversight and quality monitoring"}
                        {role === "admin" && "System configuration and user management"}
                        {role === "agent" && "Customer interaction and basic system access"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Audit Log
              </CardTitle>
              <CardDescription>
                Track user activities and system changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Audit log functionality coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
