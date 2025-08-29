"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Lock, 
  Palette, 
  Bell, 
  Shield, 
  Camera,
  Eye,
  EyeOff,
  Check,
  X,
  Settings,
  Moon,
  Sun,
  Monitor,
  Upload
} from "lucide-react"
import { useAuth } from "@/lib/auth"

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'small' | 'medium' | 'large'
  compactMode: boolean
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    callAlerts: boolean
    ticketUpdates: boolean
    chatNotifications: boolean
  }
  dashboard: {
    showMetrics: boolean
    showActivity: boolean
    showQuickActions: boolean
    defaultView: 'overview' | 'calls' | 'tickets'
  }
}

export function EmployeeSelfService() {
  const { user, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: (theme as 'light' | 'dark' | 'system') || 'system',
    fontSize: 'medium',
    compactMode: false,
    notifications: {
      email: true,
      push: true,
      sms: false,
      callAlerts: true,
      ticketUpdates: true,
      chatNotifications: true
    },
    dashboard: {
      showMetrics: true,
      showActivity: true,
      showQuickActions: true,
      defaultView: 'overview'
    }
  })

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: "",
    avatar: user?.avatar || ""
  })

  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  })



  useEffect(() => {
    checkPasswordRequirements(passwordForm.newPassword)
  }, [passwordForm.newPassword])

  useEffect(() => {
    // Sync theme state with next-themes
    if (theme) {
      setPreferences(prev => ({ ...prev, theme: theme as 'light' | 'dark' | 'system' }))
    }
  }, [theme])

  useEffect(() => {
    // Load saved preferences and apply them
    const savedPrefs = localStorage.getItem('userPreferences')
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs)
        setPreferences(parsed)
      } catch (error) {
        console.error('Error loading preferences:', error)
      }
    }
  }, [])

  const checkPasswordRequirements = (password: string) => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    })
  }

  const isPasswordValid = () => {
    return Object.values(passwordRequirements).every(req => req) &&
           passwordForm.newPassword === passwordForm.confirmPassword &&
           passwordForm.currentPassword.length > 0
  }

  const handlePasswordChange = () => {
    if (isPasswordValid()) {
      // In real app, this would call an API
      alert("Password updated successfully!")
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setIsPasswordDialogOpen(false)
    }
  }

  const handleProfileUpdate = () => {
    // In real app, this would call an API
    updateUser({ ...user, ...profile })
    alert("Profile updated successfully!")
  }

  const handlePreferencesUpdate = () => {
    // In real app, this would save to user preferences API
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
    alert("Preferences saved successfully!")
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    setPreferences({ ...preferences, theme: newTheme })
  }



  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile({ ...profile, avatar: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center space-x-2 text-sm ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
      {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      <span>{text}</span>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account, security, and personalization preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-lg">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{profile.name}</h3>
                  <p className="text-muted-foreground">{user?.role}</p>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </label>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us a little about yourself..."
                  rows={3}
                />
              </div>

              <Button onClick={handleProfileUpdate}>
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Password & Security
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Last changed: {user?.lastPasswordChange || 'Never'}
                  </p>
                </div>
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Change Password</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new secure password
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Password Requirements</Label>
                        <div className="space-y-1">
                          <RequirementItem met={passwordRequirements.minLength} text="At least 8 characters" />
                          <RequirementItem met={passwordRequirements.hasUppercase} text="One uppercase letter" />
                          <RequirementItem met={passwordRequirements.hasLowercase} text="One lowercase letter" />
                          <RequirementItem met={passwordRequirements.hasNumber} text="One number" />
                          <RequirementItem met={passwordRequirements.hasSpecialChar} text="One special character" />
                          <RequirementItem 
                            met={passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.confirmPassword.length > 0} 
                            text="Passwords match" 
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handlePasswordChange} disabled={!isPasswordValid()}>
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Setup 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Theme</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor }
                  ].map((themeOption) => (
                    <div
                      key={themeOption.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        preferences.theme === themeOption.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleThemeChange(themeOption.value as 'light' | 'dark' | 'system')}
                    >
                      <themeOption.icon className="h-6 w-6 mb-2" />
                      <p className="font-medium">{themeOption.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="font-size" className="text-base font-medium">Font Size</Label>
                <Select value={preferences.fontSize} onValueChange={(value: any) => setPreferences({ ...preferences, fontSize: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Reduce spacing and padding for more content</p>
                </div>
                <Switch
                  checked={preferences.compactMode}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, compactMode: checked })}
                />
              </div>

              <div>
                <Label className="text-base font-medium">Dashboard Layout</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show Metrics</span>
                      <Switch
                        checked={preferences.dashboard.showMetrics}
                        onCheckedChange={(checked) => setPreferences({
                          ...preferences,
                          dashboard: { ...preferences.dashboard, showMetrics: checked }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show Activity Feed</span>
                      <Switch
                        checked={preferences.dashboard.showActivity}
                        onCheckedChange={(checked) => setPreferences({
                          ...preferences,
                          dashboard: { ...preferences.dashboard, showActivity: checked }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show Quick Actions</span>
                      <Switch
                        checked={preferences.dashboard.showQuickActions}
                        onCheckedChange={(checked) => setPreferences({
                          ...preferences,
                          dashboard: { ...preferences.dashboard, showQuickActions: checked }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="default-view" className="text-sm">Default View</Label>
                      <Select 
                        value={preferences.dashboard.defaultView} 
                        onValueChange={(value: any) => setPreferences({
                          ...preferences,
                          dashboard: { ...preferences.dashboard, defaultView: value }
                        })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="overview">Overview</SelectItem>
                          <SelectItem value="calls">Calls</SelectItem>
                          <SelectItem value="tickets">Tickets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handlePreferencesUpdate}>
                Save Appearance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how and when you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Communication Channels</Label>
                <div className="space-y-4 mt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Email Notifications</span>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.email}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, email: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Push Notifications</span>
                      <p className="text-sm text-muted-foreground">Browser and desktop notifications</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.push}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, push: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">SMS Notifications</span>
                      <p className="text-sm text-muted-foreground">Text message alerts</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.sms}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, sms: checked }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Notification Types</Label>
                <div className="space-y-4 mt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Call Alerts</span>
                      <p className="text-sm text-muted-foreground">Incoming and missed calls</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.callAlerts}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, callAlerts: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Ticket Updates</span>
                      <p className="text-sm text-muted-foreground">Status changes and assignments</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.ticketUpdates}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, ticketUpdates: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Chat Notifications</span>
                      <p className="text-sm text-muted-foreground">New messages and chat requests</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.chatNotifications}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, chatNotifications: checked }
                      })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handlePreferencesUpdate}>
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
