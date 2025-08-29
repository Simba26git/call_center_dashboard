import { Client } from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { PublicClientApplication, InteractionType } from "@azure/msal-browser";
import { msalConfig, graphScopes } from "./msal-config";

export class Microsoft365Service {
  private graphClient: Client | null = null;
  private msalInstance: PublicClientApplication;

  constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig);
  }

  // Initialize Graph client with authentication
  async initializeGraphClient(): Promise<Client> {
    if (this.graphClient) {
      return this.graphClient;
    }

    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
      this.msalInstance,
      {
        account: this.msalInstance.getActiveAccount()!,
        scopes: graphScopes.user,
        interactionType: InteractionType.Popup,
      }
    );

    this.graphClient = Client.initWithMiddleware({ authProvider });
    return this.graphClient;
  }

  // User Profile
  async getUserProfile() {
    const client = await this.initializeGraphClient();
    return await client.api("/me").get();
  }

  async getUserPhoto() {
    const client = await this.initializeGraphClient();
    try {
      return await client.api("/me/photo/$value").get();
    } catch (error) {
      console.log("No profile photo found");
      return null;
    }
  }

  // Email Integration
  async getEmails(top: number = 10) {
    const client = await this.initializeGraphClient();
    return await client
      .api("/me/messages")
      .top(top)
      .select("subject,from,receivedDateTime,bodyPreview,isRead")
      .orderby("receivedDateTime desc")
      .get();
  }

  async sendEmail(to: string, subject: string, body: string, isHtml: boolean = true) {
    const client = await this.initializeGraphClient();
    const mail = {
      message: {
        subject,
        body: {
          contentType: isHtml ? "HTML" : "Text",
          content: body,
        },
        toRecipients: [
          {
            emailAddress: {
              address: to,
            },
          },
        ],
      },
    };

    return await client.api("/me/sendMail").post(mail);
  }

  // Calendar Integration
  async getCalendarEvents(startDateTime?: string, endDateTime?: string) {
    const client = await this.initializeGraphClient();
    let request = client
      .api("/me/events")
      .select("subject,start,end,attendees,organizer,location")
      .orderby("start/dateTime");

    if (startDateTime && endDateTime) {
      request = request.filter(
        `start/dateTime ge '${startDateTime}' and end/dateTime le '${endDateTime}'`
      );
    }

    return await request.get();
  }

  async createCalendarEvent(event: {
    subject: string;
    start: string;
    end: string;
    attendees?: string[];
    body?: string;
    location?: string;
  }) {
    const client = await this.initializeGraphClient();
    const eventData = {
      subject: event.subject,
      body: {
        contentType: "HTML",
        content: event.body || "",
      },
      start: {
        dateTime: event.start,
        timeZone: "UTC",
      },
      end: {
        dateTime: event.end,
        timeZone: "UTC",
      },
      location: event.location ? {
        displayName: event.location,
      } : undefined,
      attendees: event.attendees?.map(email => ({
        emailAddress: {
          address: email,
        },
      })) || [],
    };

    return await client.api("/me/events").post(eventData);
  }

  // Contacts Integration
  async getContacts() {
    const client = await this.initializeGraphClient();
    return await client
      .api("/me/contacts")
      .select("displayName,emailAddresses,businessPhones,mobilePhone")
      .get();
  }

  async createContact(contact: {
    displayName: string;
    emailAddress?: string;
    businessPhone?: string;
    mobilePhone?: string;
  }) {
    const client = await this.initializeGraphClient();
    const contactData = {
      displayName: contact.displayName,
      emailAddresses: contact.emailAddress ? [
        {
          address: contact.emailAddress,
          name: contact.displayName,
        },
      ] : [],
      businessPhones: contact.businessPhone ? [contact.businessPhone] : [],
      mobilePhone: contact.mobilePhone,
    };

    return await client.api("/me/contacts").post(contactData);
  }

  // Teams Integration
  async getTeams() {
    const client = await this.initializeGraphClient();
    return await client.api("/me/joinedTeams").get();
  }

  async sendTeamsMessage(teamId: string, channelId: string, message: string) {
    const client = await this.initializeGraphClient();
    const chatMessage = {
      body: {
        content: message,
        contentType: "text",
      },
    };

    return await client
      .api(`/teams/${teamId}/channels/${channelId}/messages`)
      .post(chatMessage);
  }

  // OneDrive Integration
  async getOneDriveFiles() {
    const client = await this.initializeGraphClient();
    return await client
      .api("/me/drive/root/children")
      .select("name,size,lastModifiedDateTime,webUrl")
      .get();
  }

  async uploadFileToOneDrive(fileName: string, file: File) {
    const client = await this.initializeGraphClient();
    return await client
      .api(`/me/drive/root:/${fileName}:/content`)
      .put(file);
  }

  // Search across Microsoft 365
  async searchM365(query: string) {
    const client = await this.initializeGraphClient();
    const searchRequest = {
      requests: [
        {
          entityTypes: ["message", "chatMessage", "driveItem"],
          query: {
            queryString: query,
          },
        },
      ],
    };

    return await client.api("/search/query").post(searchRequest);
  }

  // People API for finding colleagues
  async searchPeople(query: string) {
    const client = await this.initializeGraphClient();
    return await client
      .api("/me/people")
      .search(query)
      .select("displayName,emailAddresses,phones")
      .get();
  }
}
