import { NextRequest, NextResponse } from "next/server";
import { updateContactSubscription } from "@/app/utils/resend";

export async function POST(request: NextRequest) {
  try {
    const { email, unsubscribed } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    if (typeof unsubscribed !== "boolean") {
      return NextResponse.json(
        { error: "Unsubscribed status is required" },
        { status: 400 },
      );
    }

    // Update contact subscription status
    const contact = await updateContactSubscription(email, unsubscribed);

    return NextResponse.json({
      success: true,
      message: unsubscribed
        ? "Successfully unsubscribed from newsletter"
        : "Successfully subscribed to newsletter",
      contact,
    });
  } catch (error) {
    console.error("Newsletter subscription update error:", error);
    return NextResponse.json(
      { error: "Failed to update newsletter subscription" },
      { status: 500 },
    );
  }
}
