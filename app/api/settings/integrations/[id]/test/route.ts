import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const integrationId = params.id;
    const body = await request.json();

    // Test connection based on integration type
    let testResult = { success: false, message: "Connection test not implemented" };

    switch (integrationId) {
      case "n8n":
        testResult = await testN8NConnection(body);
        break;
      case "microsoft365":
        testResult = await testMicrosoft365Connection(body);
        break;
      case "openai":
        testResult = await testOpenAIConnection(body);
        break;
      case "twilio":
        testResult = await testTwilioConnection(body);
        break;
      case "stripe":
        testResult = await testStripeConnection(body);
        break;
      default:
        testResult = { success: false, message: "Unknown integration type" };
    }

    return NextResponse.json(testResult);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Connection test failed" },
      { status: 500 }
    );
  }
}

async function testN8NConnection(settings: any) {
  try {
    if (!settings.apiKey || !settings.baseUrl) {
      return { success: false, message: "API key and base URL are required" };
    }

    // Test N8N connection
    const response = await fetch(`${settings.baseUrl}/rest/workflows`, {
      headers: {
        'X-N8N-API-KEY': settings.apiKey,
      },
    });

    if (response.ok) {
      return { success: true, message: "N8N connection successful" };
    } else {
      return { success: false, message: "Failed to connect to N8N instance" };
    }
  } catch (error) {
    return { success: false, message: "N8N connection test failed" };
  }
}

async function testMicrosoft365Connection(settings: any) {
  try {
    if (!settings.clientId || !settings.clientSecret || !settings.tenantId) {
      return { success: false, message: "Client ID, secret, and tenant ID are required" };
    }

    // In a real implementation, you would test the Microsoft Graph API
    // For now, we'll just validate the format
    if (settings.clientId.length < 30 || settings.tenantId.length < 30) {
      return { success: false, message: "Invalid client ID or tenant ID format" };
    }

    return { success: true, message: "Microsoft 365 configuration appears valid" };
  } catch (error) {
    return { success: false, message: "Microsoft 365 connection test failed" };
  }
}

async function testOpenAIConnection(settings: any) {
  try {
    if (!settings.apiKey) {
      return { success: false, message: "API key is required" };
    }

    if (!settings.apiKey.startsWith('sk-')) {
      return { success: false, message: "Invalid OpenAI API key format" };
    }

    // Test OpenAI API
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${settings.apiKey}`,
      },
    });

    if (response.ok) {
      return { success: true, message: "OpenAI connection successful" };
    } else {
      return { success: false, message: "Invalid OpenAI API key" };
    }
  } catch (error) {
    return { success: false, message: "OpenAI connection test failed" };
  }
}

async function testTwilioConnection(settings: any) {
  try {
    if (!settings.accountSid || !settings.authToken) {
      return { success: false, message: "Account SID and auth token are required" };
    }

    // Test Twilio API
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${settings.accountSid}.json`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${settings.accountSid}:${settings.authToken}`).toString('base64')}`,
      },
    });

    if (response.ok) {
      return { success: true, message: "Twilio connection successful" };
    } else {
      return { success: false, message: "Invalid Twilio credentials" };
    }
  } catch (error) {
    return { success: false, message: "Twilio connection test failed" };
  }
}

async function testStripeConnection(settings: any) {
  try {
    if (!settings.secretKey) {
      return { success: false, message: "Secret key is required" };
    }

    if (!settings.secretKey.startsWith('sk_')) {
      return { success: false, message: "Invalid Stripe secret key format" };
    }

    // Test Stripe API
    const response = await fetch('https://api.stripe.com/v1/account', {
      headers: {
        'Authorization': `Bearer ${settings.secretKey}`,
      },
    });

    if (response.ok) {
      return { success: true, message: "Stripe connection successful" };
    } else {
      return { success: false, message: "Invalid Stripe API key" };
    }
  } catch (error) {
    return { success: false, message: "Stripe connection test failed" };
  }
}
