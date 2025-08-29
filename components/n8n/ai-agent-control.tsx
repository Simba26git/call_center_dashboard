"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bot, 
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Brain,
  Database,
  BarChart3,
  Zap,
  Phone,
  MessageSquare,
  Users
} from "lucide-react";

interface AgentActivity {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  status: "success" | "error" | "pending";
  duration?: number;
}

interface AgentMetrics {
  tasksCompleted: number;
  averageResponseTime: number;
  errorRate: number;
  uptime: string;
  activeWorkflows: number;
}

export function AIAgentControl() {
  const [agentStatus, setAgentStatus] = useState<"online" | "offline" | "busy">("offline");
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([]);
  const [metrics, setMetrics] = useState<AgentMetrics>({
    tasksCompleted: 0,
    averageResponseTime: 0,
    errorRate: 0,
    uptime: "0h 0m",
    activeWorkflows: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [integrationsConfigured, setIntegrationsConfigured] = useState({
    n8n: false,
    microsoft365: false,
    openai: false
  });

  useEffect(() => {
    // Check agent status and load data on mount
    checkAgentStatus();
    loadAgentActivities();
    loadMetrics();
    checkIntegrationsStatus();
    
    // Set up real-time polling
    const interval = setInterval(() => {
      checkAgentStatus();
      loadAgentActivities();
      loadMetrics();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const checkIntegrationsStatus = async () => {
    try {
      const response = await fetch("/api/settings/integrations");
      const data = await response.json();
      
      if (data.success) {
        setIntegrationsConfigured({
          n8n: !!data.settings.n8n?.apiKey,
          microsoft365: !!data.settings.microsoft365?.clientId,
          openai: !!data.settings.openai?.apiKey
        });
      }
    } catch (error) {
      console.error("Failed to check integrations status:", error);
    }
  };

  const checkAgentStatus = async () => {
    try {
      const response = await fetch("/api/n8n/agent/status");
      const data = await response.json();
      setAgentStatus(data.status || "offline");
    } catch (error) {
      setAgentStatus("offline");
    }
  };

  const loadAgentActivities = async () => {
    try {
      const response = await fetch("/api/n8n/agent/activities");
      const data = await response.json();
      setAgentActivities(data.activities || []);
    } catch (error) {
      console.error("Failed to load agent activities:", error);
    }
  };

  const loadMetrics = async () => {
    try {
      const response = await fetch("/api/n8n/agent/metrics");
      const data = await response.json();
      setMetrics(data.metrics || metrics);
    } catch (error) {
      console.error("Failed to load metrics:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-green-600 bg-green-100";
      case "busy": return "text-yellow-600 bg-yellow-100";
      case "offline": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "call_received": return <Phone className="h-4 w-4" />;
      case "ticket_created": return <MessageSquare className="h-4 w-4" />;
      case "customer_updated": return <Users className="h-4 w-4" />;
      case "workflow_executed": return <Zap className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">N8N AI Agent Control Center</h1>
            <p className="text-muted-foreground">Monitor and interact with your intelligent call center agent</p>
          </div>
        </div>
        <Badge className={getStatusColor(agentStatus)}>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${agentStatus === 'online' ? 'bg-green-500' : agentStatus === 'busy' ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <span className="capitalize">{agentStatus}</span>
          </div>
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Live Activities</TabsTrigger>
          <TabsTrigger value="api">API Documentation</TabsTrigger>
          <TabsTrigger value="webhooks">Webhook Endpoints</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{metrics.tasksCompleted}</p>
                    <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{metrics.averageResponseTime}ms</p>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{metrics.errorRate}%</p>
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{metrics.activeWorkflows}</p>
                    <p className="text-sm text-muted-foreground">Active Workflows</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              <strong>Integration Setup:</strong> Configure your API keys and integrations in{" "}
              <a href="/settings" className="underline font-medium">Settings → Integrations</a>{" "}
              to enable full AI agent functionality.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Integration Status</span>
              </CardTitle>
              <CardDescription>
                Current status of connected services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <span className="text-sm font-medium">N8N Workflows</span>
                  </div>
                  <Badge variant={integrationsConfigured.n8n ? "default" : "secondary"}>
                    {integrationsConfigured.n8n ? "Connected" : "Not Configured"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">Microsoft 365</span>
                  </div>
                  <Badge variant={integrationsConfigured.microsoft365 ? "default" : "secondary"}>
                    {integrationsConfigured.microsoft365 ? "Connected" : "Not Configured"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4" />
                    <span className="text-sm font-medium">OpenAI</span>
                  </div>
                  <Badge variant={integrationsConfigured.openai ? "default" : "secondary"}>
                    {integrationsConfigured.openai ? "Connected" : "Not Configured"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Agent Capabilities</span>
              </CardTitle>
              <CardDescription>
                What your N8N AI agent can do through this platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Customer Management</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• View and update customer profiles</li>
                    <li>• Access customer interaction history</li>
                    <li>• Verify customer information</li>
                    <li>• Update contact preferences</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Call & Ticket Handling</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Create and manage support tickets</li>
                    <li>• Route calls intelligently</li>
                    <li>• Log call interactions</li>
                    <li>• Schedule follow-ups</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Order Processing</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Access order information</li>
                    <li>• Update order status</li>
                    <li>• Process returns and refunds</li>
                    <li>• Track shipments</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Microsoft 365 Integration</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Send emails on behalf of agents</li>
                    <li>• Schedule meetings and appointments</li>
                    <li>• Access organizational contacts</li>
                    <li>• Create Teams meetings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Live Agent Activities</span>
              </CardTitle>
              <CardDescription>
                Real-time view of what your AI agent is doing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agentActivities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent agent activities</p>
                  <p className="text-sm">Agent activities will appear here when your N8N agent starts working</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {agentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{activity.action.replace(/_/g, ' ').toUpperCase()}</p>
                          <Badge variant={activity.status === 'success' ? 'default' : activity.status === 'error' ? 'destructive' : 'secondary'}>
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                          {activity.duration && ` • ${activity.duration}ms`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>API Endpoints for Agent Control</span>
              </CardTitle>
              <CardDescription>
                These endpoints allow your N8N AI agent to interact with the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { method: 'GET', path: '/api/n8n/customers', description: 'List all customers', auth: true },
                  { method: 'GET', path: '/api/n8n/customers/{id}', description: 'Get customer details', auth: true },
                  { method: 'PUT', path: '/api/n8n/customers/{id}', description: 'Update customer information', auth: true },
                  { method: 'GET', path: '/api/n8n/tickets', description: 'List support tickets', auth: true },
                  { method: 'POST', path: '/api/n8n/tickets', description: 'Create new support ticket', auth: true },
                  { method: 'PUT', path: '/api/n8n/tickets/{id}', description: 'Update ticket status', auth: true },
                  { method: 'GET', path: '/api/n8n/orders', description: 'List customer orders', auth: true },
                  { method: 'GET', path: '/api/n8n/orders/{id}', description: 'Get order details', auth: true },
                  { method: 'POST', path: '/api/n8n/calls/log', description: 'Log call interaction', auth: true },
                  { method: 'POST', path: '/api/n8n/microsoft365/email', description: 'Send email via Outlook', auth: true },
                  { method: 'POST', path: '/api/n8n/microsoft365/meeting', description: 'Schedule Teams meeting', auth: true },
                ].map((endpoint) => (
                  <div key={`${endpoint.method}-${endpoint.path}`} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={endpoint.method === 'GET' ? 'secondary' : endpoint.method === 'POST' ? 'default' : 'outline'}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{endpoint.path}</code>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{endpoint.description}</p>
                      {endpoint.auth && (
                        <p className="text-xs text-muted-foreground">Requires API key</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Webhook Endpoints</span>
              </CardTitle>
              <CardDescription>
                Configure these webhook URLs in your N8N workflows to receive real-time updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    name: 'Call Received', 
                    url: '/webhook/n8n/call-received',
                    description: 'Triggered when a new call is received',
                    payload: '{ "callId": "string", "customerPhone": "string", "timestamp": "string" }'
                  },
                  { 
                    name: 'Ticket Created', 
                    url: '/webhook/n8n/ticket-created',
                    description: 'Triggered when a new support ticket is created',
                    payload: '{ "ticketId": "string", "customerId": "string", "priority": "string" }'
                  },
                  { 
                    name: 'Agent Status Update', 
                    url: '/webhook/n8n/agent-status',
                    description: 'Send agent status updates to the dashboard',
                    payload: '{ "status": "online|busy|offline", "workflowId": "string" }'
                  },
                  { 
                    name: 'Customer Updated', 
                    url: '/webhook/n8n/customer-updated',
                    description: 'Triggered when customer information is updated',
                    payload: '{ "customerId": "string", "updatedFields": ["string"] }'
                  }
                ].map((webhook) => (
                  <div key={webhook.name} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{webhook.name}</h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(`${window.location.origin}${webhook.url}`)}
                      >
                        Copy URL
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{webhook.description}</p>
                    <code className="block text-xs bg-muted p-2 rounded overflow-x-auto">
                      {typeof window !== 'undefined' ? `${window.location.origin}${webhook.url}` : `https://your-domain.com${webhook.url}`}
                    </code>
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground">Example payload</summary>
                      <pre className="mt-2 bg-muted p-2 rounded overflow-x-auto">{webhook.payload}</pre>
                    </details>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>For N8N Setup:</strong> Use the API endpoints and webhooks above to connect your AI agent. 
          Your agent can read customer data, create tickets, log calls, send emails, and more - all through these programmatic interfaces.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default AIAgentControl;
