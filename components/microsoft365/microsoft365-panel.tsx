"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMicrosoft365 } from "./microsoft365-provider";
import { 
  Mail, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  Search,
  Plus,
  Send,
  ExternalLink
} from "lucide-react";

export function Microsoft365Panel() {
  const { isAuthenticated, user, m365Service, login, logout, loading, error } = useMicrosoft365();
  const [emails, setEmails] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [emailForm, setEmailForm] = useState({ to: "", subject: "", body: "" });

  useEffect(() => {
    if (isAuthenticated && m365Service) {
      loadData();
    }
  }, [isAuthenticated, m365Service]);

  const loadData = async () => {
    if (!m365Service) return;

    try {
      const [emailsData, eventsData, contactsData, teamsData] = await Promise.all([
        m365Service.getEmails(5),
        m365Service.getCalendarEvents(),
        m365Service.getContacts(),
        m365Service.getTeams(),
      ]);

      setEmails(emailsData.value || []);
      setEvents(eventsData.value || []);
      setContacts(contactsData.value || []);
      setTeams(teamsData.value || []);
    } catch (error) {
      console.error("Error loading Microsoft 365 data:", error);
    }
  };

  const sendEmail = async () => {
    if (!m365Service || !emailForm.to || !emailForm.subject) return;

    try {
      await m365Service.sendEmail(emailForm.to, emailForm.subject, emailForm.body);
      setEmailForm({ to: "", subject: "", body: "" });
      await loadData(); // Refresh emails
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const createCalendarEvent = async (customerName: string, customerEmail: string) => {
    if (!m365Service) return;

    const now = new Date();
    const followUpTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow

    try {
      await m365Service.createCalendarEvent({
        subject: `Follow-up: ${customerName}`,
        start: followUpTime.toISOString(),
        end: new Date(followUpTime.getTime() + 30 * 60 * 1000).toISOString(), // 30 minutes
        attendees: customerEmail ? [customerEmail] : [],
        body: `Follow-up call with ${customerName} regarding their recent interaction.`,
        location: "Call Center",
      });
      await loadData(); // Refresh events
    } catch (error) {
      console.error("Error creating calendar event:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Microsoft 365 Integration
          </CardTitle>
          <CardDescription>
            Connect to Microsoft 365 to access emails, calendar, contacts, and Teams.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={login} disabled={loading}>
            {loading ? "Connecting..." : "Connect to Microsoft 365"}
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Microsoft 365 Integration
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{user?.username}</Badge>
              <Button variant="outline" size="sm" onClick={logout}>
                Disconnect
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="emails" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="emails">
            <Mail className="h-4 w-4 mr-2" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Users className="h-4 w-4 mr-2" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="teams">
            <MessageSquare className="h-4 w-4 mr-2" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="compose">
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emails.map((email, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{email.subject}</h4>
                      <Badge variant={email.isRead ? "secondary" : "default"}>
                        {email.isRead ? "Read" : "Unread"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      From: {email.from?.emailAddress?.name || email.from?.emailAddress?.address}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{email.bodyPreview}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(email.receivedDateTime).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.map((event, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h4 className="font-medium">{event.subject}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.start.dateTime).toLocaleString()} - 
                      {new Date(event.end.dateTime).toLocaleString()}
                    </p>
                    {event.location?.displayName && (
                      <p className="text-sm text-muted-foreground">Location: {event.location.displayName}</p>
                    )}
                    {event.attendees?.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Attendees: {event.attendees.length}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contacts.map((contact, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h4 className="font-medium">{contact.displayName}</h4>
                    {contact.emailAddresses?.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Email: {contact.emailAddresses[0].address}
                      </p>
                    )}
                    {contact.businessPhones?.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Phone: {contact.businessPhones[0]}
                      </p>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => createCalendarEvent(
                        contact.displayName,
                        contact.emailAddresses?.[0]?.address
                      )}
                    >
                      Schedule Follow-up
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teams.map((team, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h4 className="font-medium">{team.displayName}</h4>
                    <p className="text-sm text-muted-foreground">{team.description}</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in Teams
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compose Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="recipient@example.com"
                  value={emailForm.to}
                  onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  placeholder="Email body"
                  rows={6}
                  value={emailForm.body}
                  onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                />
              </div>
              <Button onClick={sendEmail} disabled={!emailForm.to || !emailForm.subject}>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
