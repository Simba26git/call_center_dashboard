"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, Users, Settings, Shield, CreditCard } from 'lucide-react'
import { Organization, OrganizationTier } from '@/types'

interface OrganizationSetupProps {
  onComplete: (organization: Partial<Organization>) => void
}

export function OrganizationSetup({ onComplete }: OrganizationSetupProps) {
  const [step, setStep] = useState(1)
  const [orgData, setOrgData] = useState<Partial<Organization>>({
    name: '',
    domain: '',
    tier: 'starter',
    settings: {
      allowedDomains: [],
      requireDomainEmail: false,
      enableSSO: false,
      maxUsers: 10,
      features: []
    }
  })

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
    else onComplete(orgData)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const tierFeatures = {
    starter: ['Up to 10 users', 'Basic integrations', 'Email support', 'Standard reporting'],
    professional: ['Up to 100 users', 'Advanced integrations', 'Priority support', 'Advanced analytics', 'API access'],
    enterprise: ['Unlimited users', 'All integrations', '24/7 dedicated support', 'Custom analytics', 'White-label options', 'SSO'],
    custom: ['Custom user limits', 'Tailored integrations', 'Dedicated account manager', 'Custom features', 'On-premise options']
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Details
              </CardTitle>
              <CardDescription>
                Set up your organization's basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  placeholder="Acme Corporation"
                  value={orgData.name}
                  onChange={(e) => setOrgData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="domain">Primary Domain</Label>
                <Input
                  id="domain"
                  placeholder="acme.com"
                  value={orgData.domain}
                  onChange={(e) => setOrgData(prev => ({ ...prev, domain: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground">
                  This will be used for email domain validation and branding
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedDomains">Additional Allowed Domains (Optional)</Label>
                <Textarea
                  id="allowedDomains"
                  placeholder="subsidiary1.com, subsidiary2.com"
                  onChange={(e) => {
                    const domains = e.target.value.split(',').map(d => d.trim()).filter(d => d)
                    setOrgData(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings!, allowedDomains: domains }
                    }))
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  Comma-separated list of additional domains for user registration
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Choose Your Plan
              </CardTitle>
              <CardDescription>
                Select the plan that best fits your organization's needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(tierFeatures).map(([tier, features]) => (
                <div 
                  key={tier}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    orgData.tier === tier ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setOrgData(prev => ({ ...prev, tier: tier as OrganizationTier }))}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold capitalize">{tier}</h3>
                    {orgData.tier === tier && (
                      <Badge variant="default">Selected</Badge>
                    )}
                  </div>
                  <ul className="space-y-1">
                    {features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and access policies for your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Domain Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Only allow users with your organization's email domain
                  </p>
                </div>
                <Button
                  variant={orgData.settings?.requireDomainEmail ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOrgData(prev => ({
                    ...prev,
                    settings: {
                      ...prev.settings!,
                      requireDomainEmail: !prev.settings?.requireDomainEmail
                    }
                  }))}
                >
                  {orgData.settings?.requireDomainEmail ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Single Sign-On (SSO)</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable SSO integration for streamlined access
                  </p>
                </div>
                <Button
                  variant={orgData.settings?.enableSSO ? "default" : "outline"}
                  size="sm"
                  disabled={orgData.tier === 'starter'}
                  onClick={() => setOrgData(prev => ({
                    ...prev,
                    settings: {
                      ...prev.settings!,
                      enableSSO: !prev.settings?.enableSSO
                    }
                  }))}
                >
                  {orgData.settings?.enableSSO ? "Enabled" : "Disabled"}
                </Button>
              </div>

              {orgData.tier === 'starter' && (
                <p className="text-sm text-amber-600">
                  SSO is available with Professional plans and above
                </p>
              )}
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Review & Confirm
              </CardTitle>
              <CardDescription>
                Review your organization setup before proceeding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Organization Name</Label>
                  <p className="text-sm text-muted-foreground">{orgData.name}</p>
                </div>
                <div>
                  <Label className="font-semibold">Primary Domain</Label>
                  <p className="text-sm text-muted-foreground">{orgData.domain}</p>
                </div>
                <div>
                  <Label className="font-semibold">Plan</Label>
                  <p className="text-sm text-muted-foreground capitalize">{orgData.tier}</p>
                </div>
                <div>
                  <Label className="font-semibold">Max Users</Label>
                  <p className="text-sm text-muted-foreground">
                    {orgData.tier === 'starter' ? '10' : 
                     orgData.tier === 'professional' ? '100' : 
                     orgData.tier === 'enterprise' ? 'Unlimited' : 'Custom'}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="font-semibold">Security Settings</Label>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={orgData.settings?.requireDomainEmail ? "text-green-500" : "text-gray-400"}>
                      {orgData.settings?.requireDomainEmail ? "✓" : "○"}
                    </span>
                    <span className="text-sm">Domain email required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={orgData.settings?.enableSSO ? "text-green-500" : "text-gray-400"}>
                      {orgData.settings?.enableSSO ? "✓" : "○"}
                    </span>
                    <span className="text-sm">Single Sign-On enabled</span>
                  </div>
                </div>
              </div>

              {orgData.settings?.allowedDomains && orgData.settings.allowedDomains.length > 0 && (
                <div>
                  <Label className="font-semibold">Additional Domains</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {orgData.settings.allowedDomains.map((domain, index) => (
                      <Badge key={index} variant="outline">{domain}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Organization Setup</h1>
        <p className="text-muted-foreground">
          Configure your organization to get started with the call center platform
        </p>
      </div>

      <div className="flex items-center justify-center space-x-2">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNum <= step 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {stepNum}
            </div>
            {stepNum < 4 && (
              <div className={`w-8 h-0.5 ${stepNum < step ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {renderStep()}

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious} 
          disabled={step === 1}
        >
          Previous
        </Button>
        <Button onClick={handleNext}>
          {step === 4 ? 'Create Organization' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
