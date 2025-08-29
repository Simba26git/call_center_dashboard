"use client"

import { 
  SlackLogo,
  AsanaLogo,
  HubSpotLogo,
  SalesforceLogo,
  MailchimpLogo,
  QuickBooksLogo,
  StripeLogo,
} from "@/components/icons"

export default function LogosTestPage() {
  return (
    <div className="p-8 bg-white">
      <h1 className="text-2xl font-bold mb-8">App Logos Test</h1>
      
      <div className="grid grid-cols-4 gap-8">
        <div className="flex flex-col items-center p-4 border rounded-lg">
          <SlackLogo className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">Slack</span>
        </div>
        
        <div className="flex flex-col items-center p-4 border rounded-lg">
          <AsanaLogo className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">Asana</span>
        </div>
        
        <div className="flex flex-col items-center p-4 border rounded-lg">
          <HubSpotLogo className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">HubSpot</span>
        </div>
        
        <div className="flex flex-col items-center p-4 border rounded-lg">
          <SalesforceLogo className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">Salesforce</span>
        </div>
        
        <div className="flex flex-col items-center p-4 border rounded-lg">
          <MailchimpLogo className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">Mailchimp</span>
        </div>
        
        <div className="flex flex-col items-center p-4 border rounded-lg">
          <QuickBooksLogo className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">QuickBooks</span>
        </div>
        
        <div className="flex flex-col items-center p-4 border rounded-lg">
          <StripeLogo className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">Stripe</span>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Smaller Sizes (sidebar size)</h2>
        <div className="flex gap-4 items-center">
          <SlackLogo className="h-4 w-4" />
          <AsanaLogo className="h-4 w-4" />
          <HubSpotLogo className="h-4 w-4" />
          <SalesforceLogo className="h-4 w-4" />
          <MailchimpLogo className="h-4 w-4" />
          <QuickBooksLogo className="h-4 w-4" />
          <StripeLogo className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}
