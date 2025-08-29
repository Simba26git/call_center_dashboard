"use client";

import { useState, useEffect } from "react";
import { useMicrosoft365 } from "@/components/microsoft365/microsoft365-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Calendar, 
  Phone, 
  ExternalLink, 
  Plus,
  Search,
  UserPlus
} from "lucide-react";

interface CustomerIntegrationProps {
  customerId: string;
  customerEmail?: string;
  customerName: string;
}

export function CustomerMicrosoft365Integration({ 
  customerId, 
  customerEmail, 
  customerName 
}: CustomerIntegrationProps) {
  const { isAuthenticated, m365Service } = useMicrosoft365();
  const [customerEmails, setCustomerEmails] = useState<any[]>([]);
  const [customerEvents, setCustomerEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && m365Service && customerEmail) {
      loadCustomerData();
    }
  }, [isAuthenticated, m365Service, customerEmail]);

  const loadCustomerData = async () => {
    if (!m365Service || !customerEmail) return;

    setLoading(true);
    try {
      // Search for emails from/to this customer
      const searchResults = await m365Service.searchM365(customerEmail);
      const emailResults = searchResults.value?.[0]?.hitsContainers?.[0]?.hits || [];
      
      // Get calendar events involving this customer
      const events = await m365Service.getCalendarEvents();
      const customerEvents = events.value?.filter((event: any) => 
        event.attendees?.some((attendee: any) => 
          attendee.emailAddress.address.toLowerCase() === customerEmail.toLowerCase()
        )
      ) || [];

      setCustomerEmails(emailResults);
      setCustomerEvents(customerEvents);
    } catch (error) {
      console.error("Error loading customer Microsoft 365 data:", error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleFollowUp = async () => {
    if (!m365Service || !customerEmail) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM tomorrow

    const endTime = new Date(tomorrow);
    endTime.setMinutes(endTime.getMinutes() + 30); // 30-minute meeting

    try {
      await m365Service.createCalendarEvent({
        subject: `Follow-up: ${customerName}`,
        start: tomorrow.toISOString(),
        end: endTime.toISOString(),
        attendees: [customerEmail],
        body: `Follow-up call with ${customerName} regarding their recent interaction.`,
        location: "Call Center",
      });
      
      await loadCustomerData(); // Refresh data
    } catch (error) {
      console.error("Error creating follow-up event:", error);
    }
  };

  const sendEmailToCustomer = async (subject: string, body: string) => {
    if (!m365Service || !customerEmail) return;

    try {
      await m365Service.sendEmail(customerEmail, subject, body);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const addToContacts = async () => {
    if (!m365Service || !customerEmail) return;

    try {
      await m365Service.createContact({
        displayName: customerName,
        emailAddress: customerEmail,
      });
    } catch (error) {
      console.error("Error adding to contacts:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Microsoft 365 Integration</CardTitle>
          <CardDescription>
            Connect to Microsoft 365 to view customer interaction history and create follow-ups.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please connect to Microsoft 365 in the main dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Microsoft 365 Customer Data
              </CardTitle>
              <CardDescription>
                Interaction history and collaboration tools for {customerName}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={scheduleFollowUp}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
              <Button size="sm" variant="outline" onClick={addToContacts}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add to Contacts
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="emails" className="w-full">
        <TabsList>
          <TabsTrigger value="emails">Email History</TabsTrigger>
          <TabsTrigger value="calendar">Calendar Events</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Correspondence</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading email history...</p>
              ) : customerEmails.length > 0 ? (
                <div className="space-y-3">
                  {customerEmails.map((email, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{email.resource?.subject}</h4>
                        <Badge variant="secondary">
                          {new Date(email.resource?.receivedDateTime || email.resource?.sentDateTime).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {email.resource?.bodyPreview || email.summary}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No email history found for this customer.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading calendar events...</p>
              ) : customerEvents.length > 0 ? (
                <div className="space-y-3">
                  {customerEvents.map((event, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{event.subject}</h4>
                        <Badge variant={new Date(event.start.dateTime) > new Date() ? "default" : "secondary"}>
                          {new Date(event.start.dateTime) > new Date() ? "Upcoming" : "Past"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.start.dateTime).toLocaleString()} - 
                        {new Date(event.end.dateTime).toLocaleString()}
                      </p>
                      {event.location?.displayName && (
                        <p className="text-sm text-muted-foreground">
                          Location: {event.location.displayName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No scheduled meetings found with this customer.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Email Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => sendEmailToCustomer(
                    "Follow-up on your recent inquiry",
                    `Dear ${customerName},\n\nThank you for contacting us. I wanted to follow up on your recent inquiry...\n\nBest regards,\nCall Center Team`
                  )}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Follow-up Email
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => sendEmailToCustomer(
                    "Your issue has been resolved",
                    `Dear ${customerName},\n\nI'm happy to inform you that your issue has been resolved...\n\nBest regards,\nCall Center Team`
                  )}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Resolution Email
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calendar Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={scheduleFollowUp}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Follow-up Call
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    nextWeek.setHours(14, 0, 0, 0); // 2 PM next week
                    
                    const endTime = new Date(nextWeek);
                    endTime.setMinutes(endTime.getMinutes() + 60); // 1-hour meeting
                    
                    if (m365Service && customerEmail) {
                      m365Service.createCalendarEvent({
                        subject: `Quarterly Review: ${customerName}`,
                        start: nextWeek.toISOString(),
                        end: endTime.toISOString(),
                        attendees: [customerEmail],
                        body: `Quarterly business review with ${customerName}.`,
                        location: "Conference Room / Teams",
                      });
                    }
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Quarterly Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
