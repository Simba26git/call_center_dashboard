import { Configuration, PopupRequest } from "@azure/msal-browser";

// MSAL Configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || "your-azure-app-client-id",
    authority: process.env.NEXT_PUBLIC_AZURE_AUTHORITY || "https://login.microsoftonline.com/common",
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

// Microsoft Graph API scopes
export const loginRequest: PopupRequest = {
  scopes: [
    "User.Read",
    "Mail.Read",
    "Mail.Send",
    "Calendars.ReadWrite",
    "People.Read",
    "Contacts.ReadWrite",
    "Chat.ReadWrite",
    "Team.ReadBasic.All",
    "Files.ReadWrite.All"
  ],
};

// Additional scopes for specific features
export const graphScopes = {
  mail: ["Mail.Read", "Mail.Send", "Mail.ReadWrite"],
  calendar: ["Calendars.ReadWrite", "Calendars.Read"],
  contacts: ["Contacts.ReadWrite", "Contacts.Read"],
  teams: ["Chat.ReadWrite", "Team.ReadBasic.All", "TeamMember.ReadWrite.All"],
  files: ["Files.ReadWrite.All", "Sites.ReadWrite.All"],
  user: ["User.Read", "User.ReadBasic.All"],
  people: ["People.Read"],
};
