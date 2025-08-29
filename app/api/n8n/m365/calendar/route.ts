import { NextRequest, NextResponse } from 'next/server';
import { authenticateN8N, corsHeaders, handleCORS } from '@/lib/n8n-auth';

export async function POST(request: NextRequest) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const authError = authenticateN8N(request);
  if (authError) return authError;

  try {
    const eventData = await request.json();
    
    // Validate required fields
    if (!eventData.subject || !eventData.start || !eventData.end) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, start, end' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Mock calendar event creation
    const calendarEvent = {
      id: `event_${Date.now()}`,
      subject: eventData.subject,
      body: {
        contentType: 'HTML',
        content: eventData.body || '',
      },
      start: {
        dateTime: eventData.start,
        timeZone: eventData.timeZone || 'UTC',
      },
      end: {
        dateTime: eventData.end,
        timeZone: eventData.timeZone || 'UTC',
      },
      location: eventData.location ? {
        displayName: eventData.location,
      } : undefined,
      attendees: eventData.attendees?.map((email: string) => ({
        emailAddress: {
          address: email,
        },
      })) || [],
      isOnlineMeeting: eventData.isOnlineMeeting || false,
      onlineMeetingProvider: eventData.onlineMeetingProvider || 'teamsForBusiness',
      customerId: eventData.customerId,
      ticketId: eventData.ticketId,
      eventType: eventData.eventType || 'follow-up',
      n8nCreated: true,
      workflowId: eventData.workflowId,
      createdAt: new Date().toISOString(),
    };

    // Log the calendar event for tracking
    console.log('N8N Calendar event created:', {
      subject: eventData.subject,
      start: eventData.start,
      attendees: eventData.attendees,
      workflowId: eventData.workflowId,
    });

    return NextResponse.json(
      {
        success: true,
        event: calendarEvent,
        message: 'Calendar event created successfully',
        webLink: `https://outlook.office365.com/calendar/item/${calendarEvent.id}`,
      },
      {
        status: 201,
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON data' },
      { status: 400, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCORS(request);
}
