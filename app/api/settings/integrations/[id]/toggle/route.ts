import { NextRequest, NextResponse } from "next/server";

// Mock storage for integration settings
let integrationSettings: Record<string, any> = {};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const integrationId = params.id;
    const body = await request.json();
    const { enabled } = body;

    if (!integrationSettings[integrationId]) {
      return NextResponse.json(
        { success: false, error: "Integration not found" },
        { status: 404 }
      );
    }

    integrationSettings[integrationId].enabled = enabled;
    integrationSettings[integrationId].updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `Integration ${enabled ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to toggle integration" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const integrationId = params.id;

    if (!integrationSettings[integrationId]) {
      return NextResponse.json(
        { success: false, error: "Integration not found" },
        { status: 404 }
      );
    }

    delete integrationSettings[integrationId];

    return NextResponse.json({
      success: true,
      message: "Integration deleted successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete integration" },
      { status: 500 }
    );
  }
}
