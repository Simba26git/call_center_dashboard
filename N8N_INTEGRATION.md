# N8N AI Agent Integration for Call Center Dashboard

This comprehensive guide shows how to integrate n8n with your call center dashboard to create intelligent AI agents that automate call routing, ticket management, customer follow-ups, and more.

## 🎯 Overview

The n8n integration transforms your call center into an intelligent, automated system that can:
- **Route calls intelligently** based on customer data and agent skills
- **Create tickets automatically** from emails, forms, and chat messages  
- **Schedule follow-ups** and send reminders automatically
- **Analyze customer sentiment** and provide real-time insights
- **Integrate with Microsoft 365** for unified communication
- **Send notifications** across multiple channels

## 🚀 Quick Start

### 1. Environment Setup

Add these variables to your `.env.local`:
```env
# N8N Integration
N8N_API_KEY=your-secure-api-key
N8N_BASE_URL=http://localhost:5678

# Optional: OpenAI for AI features
OPENAI_API_KEY=your-openai-key
```

### 2. Start N8N

```bash
# Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e WEBHOOK_URL=http://localhost:5678/ \
  n8nio/n8n

# Or install locally
npm install n8n -g
n8n start
```

### 3. Access Integration

1. Navigate to `/n8n` in your call center dashboard
2. Configure your API key
3. Test the connection
4. Import pre-built workflows

## 📡 API Endpoints

### Authentication
All API calls require the `x-api-key` header:
```bash
curl -H "x-api-key: your-api-key" https://your-domain.com/api/n8n/health
```

### Customer Management
```bash
# List customers
GET /api/n8n/customers

# Search customers  
POST /api/n8n/customers/search
{
  "query": "john doe",
  "filters": { "tier": "gold" }
}

# Create customer
POST /api/n8n/customers
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "accountNumber": "ACC001",
  "tier": "gold"
}

# Update customer
PUT /api/n8n/customers/{id}
{
  "email": "newemail@example.com",
  "tier": "platinum"
}
```

### Ticket Management
```bash
# List tickets
GET /api/n8n/tickets?status=new&priority=high

# Create ticket
POST /api/n8n/tickets
{
  "customerId": "cust_123",
  "title": "Unable to access account",
  "description": "Customer cannot log into their account",
  "priority": "high",
  "category": "technical",
  "workflowId": "n8n_auto_ticket"
}

# Update ticket
PUT /api/n8n/tickets/{id}
{
  "status": "in-progress",
  "agentId": "agent_456"
}
```

### Agent Management
```bash
# List available agents
GET /api/n8n/agents?status=available

# Assign customer to agent
POST /api/n8n/agents/{agentId}/assign
{
  "customerId": "cust_123",
  "interactionType": "call",
  "priority": "medium",
  "skillsRequired": ["technical", "billing"]
}
```

### Call Management
```bash
# Initiate outbound call
POST /api/n8n/calls/initiate
{
  "customerId": "cust_123",
  "phoneNumber": "+1234567890",
  "agentId": "agent_456",
  "priority": "high",
  "workflowId": "follow_up_call"
}

# Update call status
PUT /api/n8n/calls/{callId}/status
{
  "status": "completed",
  "disposition": "resolved",
  "notes": "Issue resolved successfully"
}
```

### Microsoft 365 Integration
```bash
# Send email
POST /api/n8n/m365/email
{
  "to": "customer@example.com",
  "subject": "Follow-up on your recent inquiry",
  "body": "<p>Dear Customer...</p>",
  "customerId": "cust_123",
  "ticketId": "ticket_789"
}

# Create calendar event
POST /api/n8n/m365/calendar
{
  "subject": "Follow-up call with John Doe",
  "start": "2024-12-01T14:00:00Z",
  "end": "2024-12-01T14:30:00Z",
  "attendees": ["customer@example.com"],
  "body": "Follow-up call regarding recent support case"
}
```

## 🪝 Webhook Endpoints

Configure these in your external systems to send data to the call center:

### Incoming Call Webhook
```bash
POST /webhook/n8n/call-received
{
  "phoneNumber": "+1234567890",
  "callerName": "John Doe", 
  "customerId": "cust_123",
  "department": "technical",
  "priority": "medium",
  "workflowId": "intelligent_routing"
}
```

### Ticket Creation Webhook  
```bash
POST /webhook/n8n/ticket-created
{
  "customerId": "cust_123",
  "title": "Password reset request",
  "description": "Customer needs password reset",
  "source": "email",
  "priority": "low",
  "workflowId": "email_to_ticket"
}
```

### Agent Status Webhook
```bash
POST /webhook/n8n/agent-status
{
  "agentId": "agent_456",
  "status": "available",
  "skills": ["technical", "billing"],
  "maxConcurrentCalls": 3
}
```

## 🔄 Pre-built Workflows

### 1. Intelligent Call Routing

**Purpose**: Route incoming calls to the best available agent

**Workflow**: Incoming Call → Customer Lookup → Agent Matching → Call Assignment

```json
{
  "nodes": [
    {
      "name": "Incoming Call Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "incoming-call"
      }
    },
    {
      "name": "Customer Lookup",
      "type": "n8n-nodes-base.httpRequest", 
      "parameters": {
        "url": "https://your-domain.com/api/n8n/customers/search",
        "method": "POST",
        "body": {
          "query": "={{$node['Incoming Call Webhook'].json['phoneNumber']}}"
        }
      }
    }
  ]
}
```

### 2. Automated Ticket Creation

**Purpose**: Create tickets from emails and forms automatically

**Workflow**: Email/Form → AI Analysis → Ticket Creation → Agent Assignment

### 3. Follow-up Automation

**Purpose**: Schedule automatic follow-ups based on ticket resolution

**Workflow**: Resolved Ticket → Wait Period → Schedule Follow-up → Send Reminder

### 4. Microsoft 365 Sync

**Purpose**: Sync customer data with Outlook contacts and calendar

**Workflow**: Customer Update → M365 Contact Sync → Calendar Integration

### 5. AI Customer Insights

**Purpose**: Provide real-time customer insights to agents

**Workflow**: Agent Request → Customer History → AI Analysis → Insight Generation

## 🤖 AI Agent Examples

### Intelligent Routing Agent
```javascript
// N8N Function Node - Customer Tier Routing
const customerTier = $node["Customer Lookup"].json["results"][0]["tier"];
const availableAgents = $node["Get Agents"].json["agents"];

let routingDecision;

switch(customerTier) {
  case 'platinum':
  case 'gold':
    routingDecision = availableAgents.find(agent => 
      agent.skills.includes('premium_support') && agent.isAvailable
    );
    break;
  case 'silver':
    routingDecision = availableAgents.find(agent => 
      agent.skills.includes('standard_support') && agent.isAvailable  
    );
    break;
  default:
    routingDecision = availableAgents.find(agent => agent.isAvailable);
}

return [{
  agentId: routingDecision?.id || null,
  priority: customerTier === 'platinum' ? 'urgent' : 'normal',
  estimatedWaitTime: routingDecision ? 0 : 180
}];
```

### Sentiment Analysis Agent
```javascript
// N8N Function Node - Analyze Customer Sentiment
const customerMessage = $node["Incoming Message"].json["message"];

// Use OpenAI to analyze sentiment
const sentimentAnalysis = $node["OpenAI"].json["choices"][0]["message"]["content"];

const sentiment = JSON.parse(sentimentAnalysis);

return [{
  sentiment: sentiment.sentiment, // positive, negative, neutral
  confidence: sentiment.confidence,
  urgency: sentiment.sentiment === 'negative' ? 'high' : 'normal',
  suggestedResponse: sentiment.suggestedResponse,
  escalate: sentiment.sentiment === 'negative' && sentiment.confidence > 0.8
}];
```

### Smart Ticket Assignment Agent
```javascript
// N8N Function Node - Intelligent Ticket Assignment
const ticket = $node["New Ticket"].json;
const agents = $node["Available Agents"].json["agents"];

// Score agents based on skills, workload, and performance
const agentScores = agents.map(agent => {
  let score = 0;
  
  // Skill matching
  const skillMatch = ticket.skillsRequired?.filter(skill => 
    agent.skills.includes(skill)
  ).length || 0;
  score += skillMatch * 10;
  
  // Workload factor (lower workload = higher score)
  score += (10 - agent.currentWorkload);
  
  // Performance factor
  score += agent.performanceRating * 2;
  
  return { ...agent, score };
});

// Select best agent
const bestAgent = agentScores.sort((a, b) => b.score - a.score)[0];

return [{
  assignedAgent: bestAgent.id,
  assignmentReason: 'skill_and_performance_match',
  estimatedResolutionTime: bestAgent.avgResolutionTime,
  confidence: bestAgent.score / 30 // Normalize to 0-1
}];
```

## 📊 Monitoring & Analytics

### Performance Metrics
- **Call Routing Efficiency**: Average time to connect customers with agents
- **Ticket Resolution Rate**: Percentage of tickets resolved by AI vs human agents  
- **Customer Satisfaction**: Sentiment analysis of interactions
- **Agent Productivity**: Tickets handled per agent with AI assistance

### Real-time Dashboards
The integration provides real-time monitoring of:
- Active workflows and their status
- API call success/failure rates
- Customer satisfaction trends
- Agent performance metrics

## 🔧 Advanced Configuration

### Custom Workflow Triggers
Create custom triggers for specific business logic:

```javascript
// Custom trigger for VIP customer detection
if (customer.tier === 'platinum' && customer.issueCount > 3) {
  // Immediate escalation to supervisor
  return 'vip_escalation_path';
} else if (customer.sentiment === 'negative') {
  // Priority routing for upset customers
  return 'priority_routing_path';
} else {
  // Standard routing
  return 'standard_routing_path';
}
```

### Error Handling
Implement robust error handling in workflows:

```javascript
try {
  const result = await makeAPICall();
  return result;
} catch (error) {
  // Log error and fallback to manual process
  await logError(error);
  await notifySupervisor({
    type: 'workflow_failure',
    workflow: 'customer_routing',
    error: error.message
  });
  return 'manual_fallback';
}
```

## 🛡️ Security Best Practices

### API Security
- Use strong, unique API keys
- Implement rate limiting
- Validate all incoming data
- Use HTTPS for all communications

### Data Protection  
- Encrypt sensitive customer data
- Implement data retention policies
- Audit all API access
- Follow GDPR/compliance requirements

### Access Control
- Role-based access to workflows
- Secure webhook endpoints
- Monitor for unusual activity
- Regular security audits

## 🚀 Deployment

### Production Checklist
- [ ] Configure production API keys
- [ ] Set up monitoring and alerting
- [ ] Test all workflows thoroughly
- [ ] Configure backup/failover procedures
- [ ] Document all custom workflows
- [ ] Train staff on new automation

### Scaling Considerations
- Use n8n cloud or cluster setup for high availability
- Implement caching for frequently accessed data
- Monitor API rate limits
- Scale webhook endpoints as needed

## 📞 Support & Resources

- **N8N Documentation**: https://docs.n8n.io/
- **OpenAI API**: https://platform.openai.com/docs
- **Microsoft Graph**: https://docs.microsoft.com/en-us/graph/
- **Call Center Integration Guide**: See `/N8N_INTEGRATION.md`

## 📝 Example Use Cases

### E-commerce Support
1. **Order Issue**: Customer calls about order → System looks up order → Routes to order specialist → Creates ticket → Sends update email
2. **Return Request**: Customer emails return request → AI extracts order info → Creates return ticket → Schedules pickup → Updates customer

### Technical Support  
1. **Software Issue**: Customer reports bug → System checks account tier → Routes to technical expert → Creates bug ticket → Schedules follow-up
2. **Account Access**: Customer can't login → AI guides through reset → Creates account ticket if needed → Monitors resolution

### Sales Follow-up
1. **Lead Qualification**: Website form submission → AI scores lead → Routes to sales agent → Creates opportunity → Schedules demo
2. **Post-Sale Follow-up**: Purchase completed → Wait 7 days → Send satisfaction survey → Schedule success call → Update CRM

This integration transforms your call center into an intelligent, automated system that provides better customer service while reducing manual work for your agents.
