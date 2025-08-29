# Microsoft 365 Integration for Call Center Application

This document describes the Microsoft 365 integration features added to the call center application, enabling seamless connectivity with Microsoft 365 services including Outlook, Calendar, Contacts, and Teams.

## Features

### 🔐 Authentication & Authorization
- Single Sign-On (SSO) with Azure Active Directory
- OAuth 2.0 flow using MSAL (Microsoft Authentication Library)
- Secure token management and refresh
- Multi-tenant support

### 📧 Email Integration
- **Read Emails**: Access customer correspondence from Outlook
- **Send Emails**: Send follow-up emails directly from customer profiles
- **Email Templates**: Quick access to common email templates
- **Search**: Find customer emails across all folders
- **Unread Notifications**: Track unread emails in dashboard

### 📅 Calendar Integration
- **Schedule Follow-ups**: Create calendar events for customer callbacks
- **View Events**: See upcoming meetings and appointments
- **Meeting Invites**: Send meeting invitations to customers
- **Availability**: Check availability before scheduling
- **Reminders**: Automatic reminders for customer interactions

### 👥 Contacts Integration
- **Sync Contacts**: Automatically sync customer data with Outlook contacts
- **Search People**: Find colleagues and contacts across organization
- **Add Contacts**: Create new contacts from customer interactions
- **Contact History**: View interaction history with each contact

### 💬 Teams Integration
- **Team Collaboration**: Share customer updates in Teams channels
- **Chat Integration**: Access Teams chat for quick collaboration
- **File Sharing**: Share customer documents via Teams
- **Notifications**: Receive Teams notifications for important updates

### 📊 Dashboard & Analytics
- **Activity Overview**: See recent emails, meetings, and interactions
- **Statistics**: Track email read rates, meeting counts, and more
- **Quick Actions**: Fast access to common Microsoft 365 tasks
- **Integration Status**: Monitor connection health and sync status

## Setup Instructions

### 1. Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory > App registrations**
3. Click **New registration**
4. Fill in the application details:
   - **Name**: Call Center Microsoft 365 Integration
   - **Supported account types**: Accounts in any organizational directory (Any Azure AD directory - Multitenant)
   - **Redirect URI**: 
     - Type: Single-page application (SPA)
     - URL: `http://localhost:3000` (for development)

### 2. Configure API Permissions

Add the following Microsoft Graph permissions:

#### Delegated Permissions
- `User.Read` - Read user profile
- `Mail.Read` - Read user mail
- `Mail.Send` - Send mail as user
- `Mail.ReadWrite` - Read and write access to user mail
- `Calendars.Read` - Read user calendars
- `Calendars.ReadWrite` - Read and write user calendars
- `Contacts.Read` - Read user contacts
- `Contacts.ReadWrite` - Read and write user contacts
- `People.Read` - Read relevant people lists
- `Chat.ReadWrite` - Read and write user chat messages
- `Team.ReadBasic.All` - Read the names and descriptions of teams
- `Files.ReadWrite.All` - Read and write files that the user can access

### 3. Environment Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the environment variables:
   ```env
   NEXT_PUBLIC_AZURE_CLIENT_ID=your-app-client-id
   NEXT_PUBLIC_AZURE_AUTHORITY=https://login.microsoftonline.com/common
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
   ```

### 4. Grant Admin Consent (Optional)

For organization-wide deployment:
1. In Azure Portal, go to your app registration
2. Navigate to **API permissions**
3. Click **Grant admin consent for [Your Organization]**

## Usage Guide

### Connecting to Microsoft 365

1. Navigate to the **Microsoft 365** page in the sidebar
2. Click **Connect to Microsoft 365**
3. Complete the authentication flow
4. Grant necessary permissions
5. Start using integrated features

### Customer Profile Integration

On customer detail pages, you'll see:
- **Email History**: Past correspondence with the customer
- **Scheduled Meetings**: Upcoming and past meetings
- **Quick Actions**: Send emails, schedule follow-ups
- **Contact Sync**: Add customer to Outlook contacts

### Dashboard Features

The Microsoft 365 dashboard provides:
- **Statistics**: Email counts, calendar events, contacts
- **Recent Activity**: Latest emails and meetings
- **Quick Actions**: Common tasks like composing emails
- **Status Monitoring**: Connection health and sync status

## File Structure

```
components/microsoft365/
├── microsoft365-provider.tsx     # Authentication context and provider
├── microsoft365-panel.tsx        # Main integration panel component
├── microsoft365-dashboard.tsx    # Dashboard with stats and activity
└── customer-integration.tsx      # Customer-specific integration features

lib/
├── msal-config.ts                # MSAL authentication configuration
└── microsoft365-service.ts       # Microsoft Graph API service layer

app/
└── microsoft365/
    └── page.tsx                  # Dedicated Microsoft 365 integration page
```

## API Integration Points

### Microsoft Graph Endpoints Used

- **User Profile**: `/me`
- **Email**: `/me/messages`, `/me/sendMail`
- **Calendar**: `/me/events`, `/me/calendar/events`
- **Contacts**: `/me/contacts`
- **People**: `/me/people`
- **Teams**: `/me/joinedTeams`
- **Search**: `/search/query`

### Error Handling

The integration includes comprehensive error handling for:
- Authentication failures
- API rate limiting
- Network connectivity issues
- Permission denied scenarios
- Token expiration

## Security Considerations

### Data Protection
- All API calls use HTTPS encryption
- Tokens are stored securely in session storage
- No sensitive data is cached permanently
- User consent is required for all operations

### Permissions
- Follows principle of least privilege
- Granular permissions for specific features
- Users can revoke access at any time
- Admin consent available for enterprise deployments

## Troubleshooting

### Common Issues

1. **Authentication Fails**
   - Check client ID and authority URL
   - Verify redirect URI matches Azure configuration
   - Ensure app registration is active

2. **Permission Denied**
   - Check if required Graph permissions are granted
   - Verify user has necessary licenses (Microsoft 365)
   - Admin consent may be required

3. **API Rate Limiting**
   - Implement retry logic with exponential backoff
   - Monitor Graph API usage in Azure Portal
   - Consider caching frequently accessed data

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

## Production Deployment

### Security Checklist
- [ ] Use HTTPS for redirect URIs
- [ ] Configure proper CORS settings
- [ ] Set up monitoring and alerting
- [ ] Implement proper logging
- [ ] Configure rate limiting
- [ ] Set up backup authentication methods

### Performance Optimization
- [ ] Implement request caching
- [ ] Use batch requests where possible
- [ ] Optimize graph queries with $select
- [ ] Monitor API usage patterns
- [ ] Set up CDN for static assets

## Support and Resources

- [Microsoft Graph Documentation](https://docs.microsoft.com/en-us/graph/)
- [MSAL.js Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
- [Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/)
- [Microsoft 365 Developer Center](https://developer.microsoft.com/en-us/microsoft-365)

## License

This integration follows the same license as the main call center application.
