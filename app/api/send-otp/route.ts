import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { validatePhoneNumber } from "@/app/utils/phoneValidation";

import twilio from "twilio";

export async function POST(request: NextRequest) {
  try {
    const { phone, userId } = await request.json();

    if (!phone || !userId) {
      return NextResponse.json(
        { error: "Phone number and user ID are required" },
        { status: 400 },
      );
    }

    // Validate phone number
    const validation = validatePhoneNumber(phone);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 403 },
      );
    }

    // Verify user is authenticated
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Check if phone number is already in use by another user
    const { data: existingProfile, error: profileError } = await supabase
      .from("userprofile")
      .select("user_id")
      .eq("phone_number", phone)
      .neq("user_id", userId)
      .single();

    if (profileError && profileError.code !== "PGRST116") { // PGRST116 is "not found"
      console.error("Error checking phone number:", profileError);
      return NextResponse.json(
        { error: "Помилка перевірки номеру телефону" },
        { status: 500 },
      );
    }

    if (existingProfile) {
      return NextResponse.json(
        { error: "Цей номер телефону вже використовується іншим користувачем" },
        { status: 400 },
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP temporarily in user metadata (will be cleared after verification)
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        temp_otp: otp,
        temp_phone: phone,
        otp_created_at: new Date().toISOString(),
      },
    });

    if (updateError) {
      console.error("Failed to store temporary OTP:", updateError);
      return NextResponse.json(
        { error: "Failed to generate OTP" },
        { status: 500 },
      );
    }

    // Send SMS via Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );

      await client.messages.create({
        body: `Your verification code is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: phone,
      });
    } else {
      // For development, log the OTP
      console.log(`OTP for ${phone}: ${otp}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 },
    );
  }
}
