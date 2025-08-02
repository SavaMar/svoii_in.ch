import { NextResponse } from "next/server";
import { getOrCreateAudience } from "@/app/utils/resend";

export async function GET() {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          error: "RESEND_API_KEY is not configured",
          configured: false,
        },
        { status: 503 },
      );
    }

    console.log("Resend test - API key check:", {
      hasKey: !!process.env.RESEND_API_KEY,
      keyPrefix: process.env.RESEND_API_KEY?.substring(0, 3),
      keyLength: process.env.RESEND_API_KEY?.length,
    });

    // Test audience creation/retrieval
    const audience = await getOrCreateAudience();

    return NextResponse.json({
      success: true,
      configured: true,
      audience: {
        id: audience?.id,
        name: audience?.name,
      },
      message: "Resend is properly configured",
    });
  } catch (error: unknown) {
    console.error("Resend test error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error: `Resend test failed: ${errorMessage}`,
        configured: false,
        details: {
          hasApiKey: !!process.env.RESEND_API_KEY,
          keyPrefix: process.env.RESEND_API_KEY?.substring(0, 3),
        },
      },
      { status: 500 },
    );
  }
}
