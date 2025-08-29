"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Workflow, 
  Zap, 
  Globe, 
  Key, 
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  Database,
  BarChart3,
  Settings
} from "lucide-react";

interface N8NIntegrationProps {
  apiKey?: string;
  n8nBaseUrl?: string;
}

export function N8NIntegrationPanel({ apiKey, n8nBaseUrl }: N8NIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(apiKey || '');
  const [baseUrlInput, setBaseUrlInput] = useState(n8nBaseUrl || 'http://localhost:5678');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Mock webhook URLs for documentation
  const webhookUrls = {
    callReceived: `${window.location.origin}/webhook/n8n/call-received`,
    ticketCreated: `${window.location.origin}/webhook/n8n/ticket-created`,
    agentStatus: `${window.location.origin}/webhook/n8n/agent-status`,
    customerUpdated: `${window.location.origin}/webhook/n8n/customer-updated`,
  };

  const apiEndpoints = [
    { method: 'GET', path: '/api/n8n/health', description: 'Health check' },
    { method: 'GET', path: '/api/n8n/customers', description: 'List customers' },
    { method: 'POST', path: '/api/n8n/customers/search', description: 'Search customers' },
    { method: 'GET', path: '/api/n8n/tickets', description: 'List tickets' },
    { method: 'POST', path: '/api/n8n/tickets', description: 'Create ticket' },
    { method: 'GET', path: '/api/n8n/agents', description: 'List agents' },
    { method: 'POST', path: '/api/n8n/calls/initiate', description: 'Initiate call' },
    { method: 'POST', path: '/api/n8n/m365/email', description: 'Send email' },
    { method: 'POST', path: '/api/n8n/m365/calendar', description: 'Create calendar event' },
  ];

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/n8n/health', {
        headers: {
          'x-api-key': apiKeyInput,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setTestResponse(data);
      setIsConnected(response.ok);
    } catch (error) {
      setTestResponse({ error: 'Connection failed' });
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const triggerTestWorkflow = async () => {
    setLoading(true);
    try {
      // Test customer search
      const searchResponse = await fetch('/api/n8n/customers/search', {
        method: 'POST',
        headers: {
          'x-api-key': apiKeyInput,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'john',
          filters: { tier: 'gold' }
        }),
      });
      
      const searchData = await searchResponse.json();
      
      // Add to recent activity
      setRecentActivity(prev => [{
        id: Date.now(),
        type: 'api_call',
        action: 'Customer Search',
        status: searchResponse.ok ? 'success' : 'error',
        timestamp: new Date().toISOString(),
        data: searchData,
      }, ...prev.slice(0, 9)]);
      
    } catch (error) {
      setRecentActivity(prev => [{
        id: Date.now(),
        type: 'error',
        action: 'Test Workflow',
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            N8N Integration
          </CardTitle>
          <CardDescription>
            Connect your call center dashboard with n8n workflows for automation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant={isConnected ? "default" : "secondary"} className="gap-2">
              {isConnected ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Button onClick={testConnection} disabled={loading} size="sm">
              {loading ? "Testing..." : "Test Connection"}
            </Button>
            <Button onClick={triggerTestWorkflow} disabled={loading || !isConnected} size="sm" variant="outline">
              Test Workflow
            </Button>
          </div>

          {testResponse && (
            <Alert>
              <Activity className="h-4 w-4" />
              <AlertDescription>
                <pre className="text-xs">{JSON.stringify(testResponse, null, 2)}</pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="configuration" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configuration">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="endpoints">
            <Globe className="h-4 w-4 mr-2" />
            API Endpoints
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Zap className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="activity">
            <BarChart3 className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Configure the connection between n8n and your call center dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Set N8N_API_KEY in your environment variables
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseUrl">N8N Base URL</Label>
                <Input
                  id="baseUrl"
                  placeholder="http://localhost:5678"
                  value={baseUrlInput}
                  onChange={(e) => setBaseUrlInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  URL where your n8n instance is running
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Environment Variables</h4>
                <div className="space-y-1 text-sm font-mono">
                  <p>N8N_API_KEY=your-secure-api-key</p>
                  <p>N8N_BASE_URL=http://localhost:5678</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available API Endpoints</CardTitle>
              <CardDescription>
                Use these endpoints in your n8n workflows to interact with the call center
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm">{endpoint.path}</code>
                      <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(`${window.location.origin}${endpoint.path}`)}
                    >
                      Copy URL
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Endpoints</CardTitle>
              <CardDescription>
                Configure these webhook URLs in your n8n workflows to send data to the call center
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(webhookUrls).map(([name, url]) => (
                  <div key={name} className="space-y-2">
                    <Label className="capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</Label>
                    <div className="flex items-center gap-2">
                      <Input value={url} readOnly className="font-mono text-sm" />
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(url)}>
                        Copy
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Include the API key in webhook headers:
                  </p>
                  <code className="text-xs bg-background p-2 rounded block">
                    x-api-key: your-api-key
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Monitor n8n integration activity and API calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className={`mt-1 ${
                        activity.status === 'success' ? 'text-green-600' : 
                        activity.status === 'error' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {activity.status === 'success' ? <CheckCircle className="h-4 w-4" /> :
                         activity.status === 'error' ? <AlertCircle className="h-4 w-4" /> :
                         <Clock className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{activity.action}</h4>
                          <Badge variant={activity.status === 'success' ? 'default' : 'destructive'}>
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                        {activity.data && (
                          <details className="mt-2">
                            <summary className="text-xs cursor-pointer">View Details</summary>
                            <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto">
                              {JSON.stringify(activity.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Recent Activity</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    API calls and webhook activity will appear here
                  </p>
                  <Button onClick={triggerTestWorkflow} disabled={loading || !isConnected}>
                    Run Test Workflow
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
