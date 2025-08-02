import { NextRequest, NextResponse } from "next/server";
import { removeContactFromNewsletter } from "@/app/utils/resend";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    // Remove contact from newsletter
    await removeContactFromNewsletter(email);

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    console.error("Newsletter unsubscription error:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe from newsletter" },
      { status: 500 },
    );
  }
}
