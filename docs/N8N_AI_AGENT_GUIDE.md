# N8N AI Agent Platform Integration

## Overview

This call center dashboard is designed to be controlled by your N8N AI agent. The platform provides a comprehensive API that allows your AI agent to:

- Monitor customer data and interactions
- Create and manage support tickets
- Log call activities
- Send emails and schedule meetings via Microsoft 365
- Update customer information
- Access order and transaction history

## Key Features for AI Agent Control

### 1. **Real-time Agent Status Monitoring**
Your N8N agent can report its status and activities to the dashboard:
- Online/Offline/Busy status updates
- Activity logging with timestamps
- Performance metrics tracking
- Workflow execution monitoring

### 2. **Customer Data Access**
Your agent can read and update customer information:
```
GET /api/n8n/customers - List all customers
GET /api/n8n/customers/{id} - Get specific customer details
PUT /api/n8n/customers/{id} - Update customer information
```

### 3. **Automated Ticket Management**
Create and manage support tickets programmatically:
```
GET /api/n8n/tickets - List tickets
POST /api/n8n/tickets - Create new ticket
PUT /api/n8n/tickets/{id} - Update ticket status
```

### 4. **Call Logging and Routing**
Log call interactions and route calls intelligently:
```
POST /api/n8n/calls/log - Log call data
GET /api/n8n/calls - Retrieve call history
```

### 5. **Microsoft 365 Integration**
Send emails and schedule meetings on behalf of agents:
```
POST /api/n8n/microsoft365/email - Send emails via Outlook
POST /api/n8n/microsoft365/meeting - Schedule Teams meetings
```

## API Authentication

All API endpoints require authentication via API key:
```
Headers:
X-API-Key: your-secure-api-key
Content-Type: application/json
```

Set your API key in the environment variables:
```
N8N_API_KEY=your-secure-api-key
```

## Webhook Endpoints

Configure these webhooks in your N8N workflows to receive real-time updates:

- `POST /webhook/n8n/call-received` - New incoming calls
- `POST /webhook/n8n/ticket-created` - New support tickets
- `POST /webhook/n8n/agent-status` - Agent status updates
- `POST /webhook/n8n/customer-updated` - Customer data changes

## Sample N8N Workflow: Intelligent Call Routing

1. **Trigger**: Incoming call webhook
2. **Customer Lookup**: Query customer API by phone number
3. **Priority Assessment**: Analyze customer tier and issue urgency
4. **Agent Assignment**: Route to available agent with right skills
5. **CRM Update**: Log call details and create ticket if needed
6. **Follow-up**: Schedule automatic follow-up based on call outcome

## Agent Status Reporting

Your N8N agent should regularly report its status:

```javascript
// POST /api/n8n/agent/status
{
  "status": "online", // online, busy, offline
  "agentInfo": {
    "name": "N8N AI Agent",
    "workflowsActive": 5,
    "tasksInQueue": 2
  }
}
```

## Activity Logging

Log all agent activities for monitoring:

```javascript
// POST /api/n8n/agent/activities
{
  "action": "call_received",
  "details": "Processed call from +1-555-0123, created ticket T-001",
  "status": "success",
  "duration": 1250
}
```

## Getting Started

1. **Set up your N8N instance** with API access to this dashboard
2. **Configure API keys** in both N8N and this platform
3. **Import workflow templates** or create custom automation workflows
4. **Test API endpoints** using the built-in testing interface
5. **Deploy and monitor** your AI agent workflows

## Dashboard Features

The dashboard provides:
- Real-time agent activity monitoring
- Performance metrics and analytics
- Live status indicators
- API endpoint documentation
- Webhook configuration guides
- Activity logs and audit trails

Your AI agent can work in the background while human agents use the dashboard interface to handle complex interactions that require human judgment.

## Support

For technical support and advanced configuration, check the API documentation in the dashboard or contact the development team.
