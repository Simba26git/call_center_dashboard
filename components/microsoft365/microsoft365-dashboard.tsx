"use client";

import { useState, useEffect } from "react";
import { useMicrosoft365 } from "./microsoft365-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Calendar, 
  Users, 
  MessageSquare, 
  FileText,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity
} from "lucide-react";

export function Microsoft365Dashboard() {
  const { isAuthenticated, user, m365Service } = useMicrosoft365();
  const [stats, setStats] = useState({
    totalEmails: 0,
    unreadEmails: 0,
    todayEvents: 0,
    upcomingEvents: 0,
    totalContacts: 0,
    teamsCount: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && m365Service) {
      loadDashboardData();
    }
  }, [isAuthenticated, m365Service]);

  const loadDashboardData = async () => {
    if (!m365Service) return;

    setLoading(true);
    try {
      const [emails, events, contacts, teams] = await Promise.all([
        m365Service.getEmails(50),
        m365Service.getCalendarEvents(),
        m365Service.getContacts(),
        m365Service.getTeams(),
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayEvents = events.value?.filter((event: any) => {
        const eventDate = new Date(event.start.dateTime);
        return eventDate >= today && eventDate < tomorrow;
      }) || [];

      const upcomingEvents = events.value?.filter((event: any) => {
        const eventDate = new Date(event.start.dateTime);
        return eventDate >= tomorrow;
      }) || [];

      setStats({
        totalEmails: emails.value?.length || 0,
        unreadEmails: emails.value?.filter((email: any) => !email.isRead).length || 0,
        todayEvents: todayEvents.length,
        upcomingEvents: upcomingEvents.length,
        totalContacts: contacts.value?.length || 0,
        teamsCount: teams.value?.length || 0,
      });

      // Create recent activity feed
      const activities = [
        ...emails.value?.slice(0, 5).map((email: any) => ({
          type: 'email',
          title: `Email: ${email.subject}`,
          description: `From: ${email.from?.emailAddress?.name || email.from?.emailAddress?.address}`,
          timestamp: new Date(email.receivedDateTime),
          isRead: email.isRead,
        })) || [],
        ...todayEvents.slice(0, 3).map((event: any) => ({
          type: 'event',
          title: `Meeting: ${event.subject}`,
          description: `${new Date(event.start.dateTime).toLocaleTimeString()}`,
          timestamp: new Date(event.start.dateTime),
        })) || [],
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setRecentActivity(activities.slice(0, 10));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string, isRead?: boolean) => {
    if (type === 'email' && !isRead) return 'text-blue-600';
    if (type === 'event') return 'text-green-600';
    return 'text-muted-foreground';
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Emails</p>
                <p className="text-2xl font-bold">{stats.totalEmails}</p>
              </div>
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            {stats.unreadEmails > 0 && (
              <div className="mt-2">
                <Badge variant="destructive" className="text-xs">
                  {stats.unreadEmails} unread
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Events</p>
                <p className="text-2xl font-bold">{stats.todayEvents}</p>
              </div>
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            {stats.upcomingEvents > 0 && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {stats.upcomingEvents} upcoming
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contacts</p>
                <p className="text-2xl font-bold">{stats.totalContacts}</p>
              </div>
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teams</p>
                <p className="text-2xl font-bold">{stats.teamsCount}</p>
              </div>
              <MessageSquare className="h-5 w-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email Read Rate</p>
                <p className="text-2xl font-bold">
                  {stats.totalEmails > 0 ? Math.round(((stats.totalEmails - stats.unreadEmails) / stats.totalEmails) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="mt-2">
              <Progress 
                value={stats.totalEmails > 0 ? ((stats.totalEmails - stats.unreadEmails) / stats.totalEmails) * 100 : 0} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-sm font-bold text-green-600">Connected</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                {user?.username}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest emails and calendar events from Microsoft 365
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className={`mt-0.5 ${getActivityColor(activity.type, activity.isRead)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activity.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.timestamp.toLocaleString()}
                    </p>
                  </div>
                  {activity.type === 'email' && !activity.isRead && (
                    <Badge variant="destructive" className="text-xs shrink-0">
                      Unread
                    </Badge>
                  )}
                  {activity.type === 'event' && activity.timestamp > new Date() && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      <Clock className="h-3 w-3 mr-1" />
                      Upcoming
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No recent activity found.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Microsoft 365 Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and integrations with your call center workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Mail className="h-6 w-6" />
              <span className="text-sm font-medium">Compose Email</span>
              <span className="text-xs text-muted-foreground">Send follow-up emails</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm font-medium">Schedule Meeting</span>
              <span className="text-xs text-muted-foreground">Create calendar events</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm font-medium">Find Contacts</span>
              <span className="text-xs text-muted-foreground">Search your contacts</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm font-medium">Teams Chat</span>
              <span className="text-xs text-muted-foreground">Connect with colleagues</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
