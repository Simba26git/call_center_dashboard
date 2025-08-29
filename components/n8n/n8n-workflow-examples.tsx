"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Workflow, 
  Phone, 
  Mail, 
  Calendar, 
  Users,
  Ticket,
  Download,
  Copy,
  Info
} from "lucide-react";

const workflowExamples = [
  {
    id: 'intelligent-routing',
    title: 'Intelligent Call Routing',
    description: 'Automatically route incoming calls to the best available agent based on customer tier, skills, and availability',
    category: 'Call Management',
    icon: Phone,
    complexity: 'Medium',
    nodes: [
      { type: 'Webhook', name: 'Incoming Call' },
      { type: 'HTTP Request', name: 'Customer Lookup' },
      { type: 'IF', name: 'Check Customer Tier' },
      { type: 'HTTP Request', name: 'Find Available Agent' },
      { type: 'HTTP Request', name: 'Assign Call' },
      { type: 'HTTP Request', name: 'Send Notification' },
    ],
    workflow: {
      "meta": {
        "instanceId": "call-center-routing"
      },
      "nodes": [
        {
          "parameters": {
            "httpMethod": "POST",
            "path": "incoming-call",
            "responseMode": "responseNode"
          },
          "id": "webhook1",
          "name": "Incoming Call",
          "type": "n8n-nodes-base.webhook",
          "typeVersion": 1,
          "position": [240, 300]
        },
        {
          "parameters": {
            "url": "={{$node[\"Incoming Call\"].json[\"callCenterUrl\"]}}/api/n8n/customers/search",
            "sendBody": true,
            "bodyParameters": {
              "parameters": [
                {
                  "name": "query",
                  "value": "={{$node[\"Incoming Call\"].json[\"phoneNumber\"]}}"
                }
              ]
            },
            "headers": {
              "parameters": [
                {
                  "name": "x-api-key",
                  "value": "={{$node[\"Incoming Call\"].json[\"apiKey\"]}}"
                }
              ]
            }
          },
          "id": "http1",
          "name": "Customer Lookup",
          "type": "n8n-nodes-base.httpRequest",
          "typeVersion": 4.1,
          "position": [460, 300]
        }
      ]
    }
  },
  {
    id: 'automated-ticketing',
    title: 'Automated Ticket Creation',
    description: 'Create tickets from various sources (email, form, chat) and automatically assign to appropriate agents',
    category: 'Ticket Management',
    icon: Ticket,
    complexity: 'Easy',
    nodes: [
      { type: 'Email Trigger', name: 'Customer Email' },
      { type: 'OpenAI', name: 'Analyze Intent' },
      { type: 'HTTP Request', name: 'Create Ticket' },
      { type: 'HTTP Request', name: 'Assign Agent' },
      { type: 'Email', name: 'Confirmation Email' },
    ],
  },
  {
    id: 'follow-up-automation',
    title: 'Follow-up Automation',
    description: 'Automatically schedule follow-ups and send reminder emails based on ticket status and customer preferences',
    category: 'Customer Success',
    icon: Calendar,
    complexity: 'Advanced',
    nodes: [
      { type: 'Cron', name: 'Daily Check' },
      { type: 'HTTP Request', name: 'Get Resolved Tickets' },
      { type: 'IF', name: 'Check Follow-up Time' },
      { type: 'HTTP Request', name: 'Create Calendar Event' },
      { type: 'HTTP Request', name: 'Send Email' },
      { type: 'Microsoft 365', name: 'Schedule Meeting' },
    ],
  },
  {
    id: 'ai-customer-insights',
    title: 'AI Customer Insights',
    description: 'Use AI to analyze customer interactions and provide insights to agents in real-time',
    category: 'AI Enhancement',
    icon: Users,
    complexity: 'Advanced',
    nodes: [
      { type: 'Webhook', name: 'Agent Dashboard' },
      { type: 'HTTP Request', name: 'Get Customer History' },
      { type: 'OpenAI', name: 'Analyze Sentiment' },
      { type: 'OpenAI', name: 'Generate Insights' },
      { type: 'HTTP Request', name: 'Update Dashboard' },
    ],
  },
  {
    id: 'email-integration',
    title: 'Microsoft 365 Email Integration',
    description: 'Sync customer emails with Microsoft 365 and create tickets from important messages',
    category: 'Email Management',
    icon: Mail,
    complexity: 'Medium',
    nodes: [
      { type: 'Microsoft 365', name: 'Watch Emails' },
      { type: 'IF', name: 'Filter Important' },
      { type: 'HTTP Request', name: 'Create Ticket' },
      { type: 'Microsoft 365', name: 'Reply Email' },
      { type: 'HTTP Request', name: 'Update Customer' },
    ],
  },
];

export function N8NWorkflowExamples() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflowExamples[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyWorkflow = async (workflow: any) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(workflow.workflow, null, 2));
      setCopiedId(workflow.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy workflow:', error);
    }
  };

  const downloadWorkflow = (workflow: any) => {
    const dataStr = JSON.stringify(workflow.workflow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${workflow.id}-workflow.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            N8N Workflow Examples
          </CardTitle>
          <CardDescription>
            Pre-built workflows to get you started with call center automation
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow List */}
        <div className="space-y-3">
          {workflowExamples.map((workflow) => (
            <Card 
              key={workflow.id}
              className={`cursor-pointer transition-colors ${
                selectedWorkflow.id === workflow.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedWorkflow(workflow)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <workflow.icon className="h-5 w-5 mt-1 text-primary" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{workflow.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {workflow.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {workflow.category}
                      </Badge>
                      <Badge className={`text-xs ${getComplexityColor(workflow.complexity)}`}>
                        {workflow.complexity}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workflow Detail */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <selectedWorkflow.icon className="h-6 w-6 mt-1 text-primary" />
                  <div>
                    <CardTitle>{selectedWorkflow.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {selectedWorkflow.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyWorkflow(selectedWorkflow)}
                    disabled={!selectedWorkflow.workflow}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copiedId === selectedWorkflow.id ? 'Copied!' : 'Copy JSON'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => downloadWorkflow(selectedWorkflow)}
                    disabled={!selectedWorkflow.workflow}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline">{selectedWorkflow.category}</Badge>
                <Badge className={getComplexityColor(selectedWorkflow.complexity)}>
                  {selectedWorkflow.complexity}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedWorkflow.nodes.length} nodes
                </span>
              </div>

              {selectedWorkflow.id === 'intelligent-routing' && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This workflow includes a complete JSON export. Other workflows show the node structure for reference.
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <h4 className="font-medium mb-3">Workflow Nodes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedWorkflow.nodes.map((node, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{node.name}</div>
                        <div className="text-xs text-muted-foreground">{node.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow-specific implementation guides */}
              {selectedWorkflow.id === 'intelligent-routing' && (
                <div className="space-y-3">
                  <h4 className="font-medium">Implementation Steps</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Import the workflow JSON into your n8n instance</li>
                    <li>Configure the webhook URL in your phone system</li>
                    <li>Set the API key in the HTTP Request nodes</li>
                    <li>Customize the routing logic based on your requirements</li>
                    <li>Test with sample phone numbers</li>
                  </ol>
                </div>
              )}

              {selectedWorkflow.id === 'automated-ticketing' && (
                <div className="space-y-3">
                  <h4 className="font-medium">Setup Requirements</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Configure email trigger (IMAP/POP3)</li>
                    <li>Set up OpenAI API credentials</li>
                    <li>Configure call center API endpoints</li>
                    <li>Design email templates</li>
                  </ul>
                </div>
              )}

              {selectedWorkflow.id === 'follow-up-automation' && (
                <div className="space-y-3">
                  <h4 className="font-medium">Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Daily check for tickets requiring follow-up</li>
                    <li>Intelligent scheduling based on customer preferences</li>
                    <li>Microsoft 365 calendar integration</li>
                    <li>Automated email reminders</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedWorkflow.workflow && (
            <Card>
              <CardHeader>
                <CardTitle>Workflow JSON</CardTitle>
                <CardDescription>
                  Copy this JSON and import it into your n8n instance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(selectedWorkflow.workflow, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
