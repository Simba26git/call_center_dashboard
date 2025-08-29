import { NextRequest, NextResponse } from "next/server";

// Mock storage for integration settings
// In production, this would be stored in a database
let integrationSettings: Record<string, any> = {};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      settings: integrationSettings
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve integration settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { integrationId, settings } = body;

    if (!integrationId || !settings) {
      return NextResponse.json(
        { success: false, error: "Missing integration ID or settings" },
        { status: 400 }
      );
    }

    // Store the integration settings
    integrationSettings[integrationId] = {
      ...settings,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: "Integration settings saved successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to save integration settings" },
      { status: 500 }
    );
  }
}
