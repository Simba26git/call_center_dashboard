"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Mail, 
  Calendar, 
  Key, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  TestTube,
  Trash2,
  Plug
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  configured: boolean;
  fields: IntegrationField[];
}

interface IntegrationField {
  key: string;
  label: string;
  type: "text" | "password" | "url";
  required: boolean;
  placeholder?: string;
  description?: string;
}

export function IntegrationsSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [activeIntegration, setActiveIntegration] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadIntegrations();
    loadIntegrationSettings();
  }, []);

  const loadIntegrations = () => {
    const availableIntegrations: Integration[] = [
      {
        id: "n8n",
        name: "N8N Workflow Automation",
        description: "Connect your N8N instance for AI agent workflow automation",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "apiKey",
            label: "API Key",
            type: "password",
            required: true,
            placeholder: "Your N8N API key",
            description: "Generate this in your N8N instance settings"
          },
          {
            key: "baseUrl",
            label: "Base URL",
            type: "url",
            required: true,
            placeholder: "http://localhost:5678",
            description: "Your N8N instance URL"
          },
          {
            key: "webhookSecret",
            label: "Webhook Secret",
            type: "password",
            required: false,
            placeholder: "Optional webhook secret for security",
            description: "Used to verify incoming webhooks"
          }
        ]
      },
      {
        id: "microsoft365",
        name: "Microsoft 365",
        description: "Integrate with Outlook, Teams, and Calendar",
        icon: Mail,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "clientId",
            label: "Client ID",
            type: "text",
            required: true,
            placeholder: "Azure AD Application Client ID",
            description: "From your Azure AD app registration"
          },
          {
            key: "clientSecret",
            label: "Client Secret",
            type: "password",
            required: true,
            placeholder: "Azure AD Application Client Secret",
            description: "Generated in Azure AD app registration"
          },
          {
            key: "tenantId",
            label: "Tenant ID",
            type: "text",
            required: true,
            placeholder: "Your Azure AD Tenant ID",
            description: "Found in Azure AD overview"
          },
          {
            key: "redirectUri",
            label: "Redirect URI",
            type: "url",
            required: true,
            placeholder: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
            description: "Must match the redirect URI in Azure AD"
          }
        ]
      },
      {
        id: "openai",
        name: "OpenAI",
        description: "Enable AI-powered features and insights",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "apiKey",
            label: "API Key",
            type: "password",
            required: true,
            placeholder: "sk-...",
            description: "Your OpenAI API key"
          },
          {
            key: "model",
            label: "Default Model",
            type: "text",
            required: false,
            placeholder: "gpt-4",
            description: "Default model to use for AI features"
          },
          {
            key: "maxTokens",
            label: "Max Tokens",
            type: "text",
            required: false,
            placeholder: "2000",
            description: "Maximum tokens per API call"
          }
        ]
      },
      {
        id: "twilio",
        name: "Twilio",
        description: "SMS and voice communication integration",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "accountSid",
            label: "Account SID",
            type: "text",
            required: true,
            placeholder: "AC...",
            description: "Your Twilio Account SID"
          },
          {
            key: "authToken",
            label: "Auth Token",
            type: "password",
            required: true,
            placeholder: "Your Twilio Auth Token",
            description: "Found in Twilio console"
          },
          {
            key: "phoneNumber",
            label: "Phone Number",
            type: "text",
            required: true,
            placeholder: "+1234567890",
            description: "Your Twilio phone number"
          }
        ]
      },
      {
        id: "stripe",
        name: "Stripe",
        description: "Payment processing and customer billing",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "publishableKey",
            label: "Publishable Key",
            type: "text",
            required: true,
            placeholder: "pk_...",
            description: "Your Stripe publishable key"
          },
          {
            key: "secretKey",
            label: "Secret Key",
            type: "password",
            required: true,
            placeholder: "sk_...",
            description: "Your Stripe secret key"
          },
          {
            key: "webhookSecret",
            label: "Webhook Secret",
            type: "password",
            required: false,
            placeholder: "whsec_...",
            description: "For webhook signature verification"
          }
        ]
      },
      {
        id: "quickbooks",
        name: "QuickBooks",
        description: "Accounting and financial management integration",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "clientId",
            label: "Client ID",
            type: "text",
            required: true,
            placeholder: "Your QuickBooks App Client ID",
            description: "From QuickBooks Developer Dashboard"
          },
          {
            key: "clientSecret",
            label: "Client Secret",
            type: "password",
            required: true,
            placeholder: "Your QuickBooks App Client Secret",
            description: "Generated in QuickBooks Developer Dashboard"
          },
          {
            key: "redirectUri",
            label: "Redirect URI",
            type: "url",
            required: true,
            placeholder: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/quickbooks/callback`,
            description: "Must match the redirect URI in QuickBooks app"
          },
          {
            key: "sandbox",
            label: "Sandbox Mode",
            type: "text",
            required: false,
            placeholder: "true/false",
            description: "Set to true for development environment"
          }
        ]
      },
      {
        id: "xero",
        name: "Xero",
        description: "Cloud-based accounting software integration",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "clientId",
            label: "Client ID",
            type: "text",
            required: true,
            placeholder: "Your Xero App Client ID",
            description: "From Xero Developer Portal"
          },
          {
            key: "clientSecret",
            label: "Client Secret",
            type: "password",
            required: true,
            placeholder: "Your Xero App Client Secret",
            description: "Generated in Xero Developer Portal"
          },
          {
            key: "redirectUri",
            label: "Redirect URI",
            type: "url",
            required: true,
            placeholder: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/xero/callback`,
            description: "Must match the redirect URI in Xero app"
          }
        ]
      },
      {
        id: "hubspot",
        name: "HubSpot",
        description: "CRM and marketing automation for small to medium businesses",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "apiKey",
            label: "Private App Access Token",
            type: "password",
            required: true,
            placeholder: "pat-na1-...",
            description: "Create a private app in HubSpot settings"
          },
          {
            key: "portalId",
            label: "Portal ID",
            type: "text",
            required: true,
            placeholder: "12345678",
            description: "Your HubSpot portal/hub ID"
          }
        ]
      },
      {
        id: "salesforce",
        name: "Salesforce",
        description: "Enterprise CRM and customer success platform",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "clientId",
            label: "Consumer Key",
            type: "text",
            required: true,
            placeholder: "Your Salesforce Connected App Consumer Key",
            description: "From Salesforce Connected App setup"
          },
          {
            key: "clientSecret",
            label: "Consumer Secret",
            type: "password",
            required: true,
            placeholder: "Your Salesforce Connected App Consumer Secret",
            description: "Generated in Salesforce Connected App"
          },
          {
            key: "username",
            label: "Username",
            type: "text",
            required: true,
            placeholder: "user@company.com",
            description: "Salesforce username for API access"
          },
          {
            key: "password",
            label: "Password + Security Token",
            type: "password",
            required: true,
            placeholder: "passwordSecurityToken",
            description: "Password concatenated with security token"
          },
          {
            key: "instanceUrl",
            label: "Instance URL",
            type: "url",
            required: false,
            placeholder: "https://yourinstance.salesforce.com",
            description: "Your Salesforce instance URL (auto-detected if empty)"
          }
        ]
      },
      {
        id: "asana",
        name: "Asana",
        description: "Project management and team collaboration",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "accessToken",
            label: "Personal Access Token",
            type: "password",
            required: true,
            placeholder: "1/...",
            description: "Generate in Asana Developer Console"
          },
          {
            key: "workspaceId",
            label: "Workspace ID",
            type: "text",
            required: false,
            placeholder: "1234567890123456",
            description: "Default workspace for creating tasks"
          }
        ]
      },
      {
        id: "trello",
        name: "Trello",
        description: "Visual project management with boards and cards",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "apiKey",
            label: "API Key",
            type: "text",
            required: true,
            placeholder: "Your Trello API Key",
            description: "Get from https://trello.com/app-key"
          },
          {
            key: "token",
            label: "API Token",
            type: "password",
            required: true,
            placeholder: "Your Trello API Token",
            description: "Generate token for your API key"
          },
          {
            key: "defaultBoardId",
            label: "Default Board ID",
            type: "text",
            required: false,
            placeholder: "5f2b8b4e4f2b8b4e4f2b8b4e",
            description: "Default board for creating cards"
          }
        ]
      },
      {
        id: "slack",
        name: "Slack",
        description: "Team communication and workflow automation",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "botToken",
            label: "Bot User OAuth Token",
            type: "password",
            required: true,
            placeholder: "xoxb-...",
            description: "OAuth token for your Slack app"
          },
          {
            key: "signingSecret",
            label: "Signing Secret",
            type: "password",
            required: true,
            placeholder: "Your Slack App Signing Secret",
            description: "Used to verify requests from Slack"
          },
          {
            key: "defaultChannel",
            label: "Default Channel",
            type: "text",
            required: false,
            placeholder: "#general",
            description: "Default channel for notifications"
          }
        ]
      },
      {
        id: "mailchimp",
        name: "Mailchimp",
        description: "Email marketing and automation platform",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "apiKey",
            label: "API Key",
            type: "password",
            required: true,
            placeholder: "your-api-key-us1",
            description: "Generate in Mailchimp account settings"
          },
          {
            key: "audienceId",
            label: "Audience ID",
            type: "text",
            required: false,
            placeholder: "1234567890",
            description: "Default audience for subscribers"
          }
        ]
      },
      {
        id: "buffer",
        name: "Buffer",
        description: "Social media management and scheduling",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "accessToken",
            label: "Access Token",
            type: "password",
            required: true,
            placeholder: "1/...",
            description: "Generate in Buffer Developers"
          }
        ]
      },
      {
        id: "hootsuite",
        name: "Hootsuite",
        description: "Social media management platform",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "clientId",
            label: "Client ID",
            type: "text",
            required: true,
            placeholder: "Your Hootsuite App Client ID",
            description: "From Hootsuite Developer Portal"
          },
          {
            key: "clientSecret",
            label: "Client Secret",
            type: "password",
            required: true,
            placeholder: "Your Hootsuite App Client Secret",
            description: "Generated in Hootsuite Developer Portal"
          },
          {
            key: "redirectUri",
            label: "Redirect URI",
            type: "url",
            required: true,
            placeholder: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/hootsuite/callback`,
            description: "Must match the redirect URI in Hootsuite app"
          }
        ]
      },
      {
        id: "googleworkspace",
        name: "Google Workspace",
        description: "Gmail, Calendar, Drive, and Google Apps integration",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "clientId",
            label: "Client ID",
            type: "text",
            required: true,
            placeholder: "your-client-id.googleusercontent.com",
            description: "From Google Cloud Console"
          },
          {
            key: "clientSecret",
            label: "Client Secret",
            type: "password",
            required: true,
            placeholder: "Your Google App Client Secret",
            description: "Generated in Google Cloud Console"
          },
          {
            key: "redirectUri",
            label: "Redirect URI",
            type: "url",
            required: true,
            placeholder: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/google/callback`,
            description: "Must match the redirect URI in Google Console"
          }
        ]
      },
      {
        id: "paynow",
        name: "PayNow (Webdev)",
        description: "Payment processing for web development services",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "integrationId",
            label: "Integration ID",
            type: "text",
            required: true,
            placeholder: "Your PayNow Integration ID",
            description: "Provided by PayNow for your account"
          },
          {
            key: "integrationKey",
            label: "Integration Key",
            type: "password",
            required: true,
            placeholder: "Your PayNow Integration Key",
            description: "Secret key for PayNow API access"
          },
          {
            key: "returnUrl",
            label: "Return URL",
            type: "url",
            required: true,
            placeholder: `${typeof window !== 'undefined' ? window.location.origin : ''}/payment/paynow/return`,
            description: "URL for successful payment redirects"
          },
          {
            key: "resultUrl",
            label: "Result URL",
            type: "url",
            required: true,
            placeholder: `${typeof window !== 'undefined' ? window.location.origin : ''}/webhook/paynow`,
            description: "URL for payment status updates"
          }
        ]
      },
      {
        id: "paystack",
        name: "Paystack",
        description: "African payment processing platform",
        icon: Bot,
        enabled: false,
        configured: false,
        fields: [
          {
            key: "publicKey",
            label: "Public Key",
            type: "text",
            required: true,
            placeholder: "pk_test_...",
            description: "Your Paystack public key"
          },
          {
            key: "secretKey",
            label: "Secret Key",
            type: "password",
            required: true,
            placeholder: "sk_test_...",
            description: "Your Paystack secret key"
          },
          {
            key: "webhookSecret",
            label: "Webhook Secret",
            type: "password",
            required: false,
            placeholder: "Your webhook secret",
            description: "For webhook signature verification"
          }
        ]
      }
    ];

    setIntegrations(availableIntegrations);
  };

  const loadIntegrationSettings = async () => {
    try {
      const response = await fetch("/api/settings/integrations");
      if (response.ok) {
        const data = await response.json();
        setFormData(data.settings || {});
        
        // Update integration status based on saved settings
        setIntegrations(prev => prev.map(integration => ({
          ...integration,
          configured: data.settings[integration.id] ? 
            integration.fields.filter(f => f.required).every(f => data.settings[integration.id]?.[f.key]) : 
            false,
          enabled: data.settings[integration.id]?.enabled || false
        })));
      }
    } catch (error) {
      console.error("Failed to load integration settings:", error);
    }
  };

  const saveIntegrationSettings = async (integrationId: string) => {
    setIsLoading(true);
    try {
      const integrationData = formData[integrationId] || {};
      
      const response = await fetch("/api/settings/integrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          integrationId,
          settings: integrationData
        }),
      });

      if (response.ok) {
        setIntegrations(prev => prev.map(integration => 
          integration.id === integrationId 
            ? { 
                ...integration, 
                configured: integration.fields.filter(f => f.required).every(f => integrationData[f.key] || false)
              }
            : integration
        ));
        
        setTestResults(prev => ({ ...prev, [integrationId]: { success: true, message: "Settings saved successfully" } }));
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [integrationId]: { success: false, message: "Failed to save settings" } }));
    } finally {
      setIsLoading(false);
    }
  };

  const testIntegration = async (integrationId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/settings/integrations/${integrationId}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData[integrationId] || {}),
      });

      const result = await response.json();
      setTestResults(prev => ({ ...prev, [integrationId]: result }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [integrationId]: { success: false, message: "Connection test failed" } 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIntegration = async (integrationId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/settings/integrations/${integrationId}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        setIntegrations(prev => prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, enabled }
            : integration
        ));
      }
    } catch (error) {
      console.error("Failed to toggle integration:", error);
    }
  };

  const deleteIntegration = async (integrationId: string) => {
    if (!confirm("Are you sure you want to delete this integration? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/settings/integrations/${integrationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFormData(prev => {
          const newData = { ...prev };
          delete newData[integrationId];
          return newData;
        });
        
        setIntegrations(prev => prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, configured: false, enabled: false }
            : integration
        ));
        
        setTestResults(prev => {
          const newResults = { ...prev };
          delete newResults[integrationId];
          return newResults;
        });
      }
    } catch (error) {
      console.error("Failed to delete integration:", error);
    }
  };

  const updateFormData = (integrationId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [integrationId]: {
        ...(prev[integrationId] || {}),
        [field]: value
      }
    }));
  };

  const togglePasswordVisibility = (integrationId: string, field: string) => {
    const key = `${integrationId}.${field}`;
    setShowPasswords(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Integrations</h2>
        <p className="text-muted-foreground">
          Connect external services to enhance your call center capabilities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Integration List */}
        <div className="space-y-4">
          {integrations.map((integration) => (
            <Card 
              key={integration.id} 
              className={`cursor-pointer transition-colors ${
                activeIntegration === integration.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setActiveIntegration(integration.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <integration.icon className="h-6 w-6" />
                    <div>
                      <h3 className="font-medium">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {integration.configured && (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Configured
                      </Badge>
                    )}
                    {integration.enabled && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Configuration */}
        <div className="lg:col-span-2">
          {activeIntegration ? (
            (() => {
              const integration = integrations.find(i => i.id === activeIntegration);
              if (!integration) return null;

              return (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <integration.icon className="h-6 w-6" />
                        <div>
                          <CardTitle>{integration.name}</CardTitle>
                          <CardDescription>{integration.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={integration.enabled}
                          onCheckedChange={(enabled) => toggleIntegration(integration.id, enabled)}
                          disabled={!integration.configured}
                        />
                        <Label className="text-sm">
                          {integration.enabled ? 'Enabled' : 'Disabled'}
                        </Label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Configuration Fields */}
                    <div className="space-y-4">
                      {integration.fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={`${integration.id}.${field.key}`}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          <div className="relative">
                            <Input
                              id={`${integration.id}.${field.key}`}
                              type={
                                field.type === 'password' && !showPasswords[`${integration.id}.${field.key}`] 
                                  ? 'password' 
                                  : 'text'
                              }
                              placeholder={field.placeholder}
                              value={formData[integration.id]?.[field.key] || ''}
                              onChange={(e) => updateFormData(integration.id, field.key, e.target.value)}
                            />
                            {field.type === 'password' && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => togglePasswordVisibility(integration.id, field.key)}
                              >
                                {showPasswords[`${integration.id}.${field.key}`] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                          {field.description && (
                            <p className="text-sm text-muted-foreground">{field.description}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Test Results */}
                    {testResults[integration.id] && (
                      <Alert variant={testResults[integration.id].success ? "default" : "destructive"}>
                        {testResults[integration.id].success ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertDescription>
                          {testResults[integration.id].message}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => saveIntegrationSettings(integration.id)}
                        disabled={isLoading}
                        className="flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Settings</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => testIntegration(integration.id)}
                        disabled={isLoading || !integration.fields.filter(f => f.required).every(f => formData[integration.id]?.[f.key])}
                        className="flex items-center space-x-2"
                      >
                        <TestTube className="h-4 w-4" />
                        <span>Test Connection</span>
                      </Button>

                      {integration.configured && (
                        <Button
                          variant="destructive"
                          onClick={() => deleteIntegration(integration.id)}
                          disabled={isLoading}
                          className="flex items-center space-x-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })()
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Plug className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Select an Integration</h3>
                <p className="text-muted-foreground">
                  Choose an integration from the list to configure its settings
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
