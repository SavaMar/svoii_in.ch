import { NextRequest, NextResponse } from "next/server";
import { addContactToNewsletter } from "@/app/utils/resend";

export async function POST(request: NextRequest) {
  try {
    console.log("Newsletter subscription API called");
    console.log("Environment check:", {
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 3),
    });

    const { email, firstName, lastName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Add contact to newsletter
    const contact = await addContactToNewsletter({
      email,
      firstName,
      lastName,
      unsubscribed: false,
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
      contact,
    });
  } catch (error: unknown) {
    console.error("Newsletter subscription error:", error);

    // Handle specific error cases
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error("Error details:", {
      message: errorMessage,
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 3),
    });

    if (errorMessage.includes("RESEND_API_KEY")) {
      return NextResponse.json(
        { error: "Newsletter service is not configured" },
        { status: 503 },
      );
    }

    if (errorMessage.includes("already exists")) {
      return NextResponse.json(
        { error: "Email is already subscribed to newsletter" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to subscribe to newsletter", details: errorMessage },
      { status: 500 },
    );
  }
}
