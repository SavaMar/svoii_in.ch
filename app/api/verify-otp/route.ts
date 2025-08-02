import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { validatePhoneNumber } from "@/app/utils/phoneValidation";

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, userId } = await request.json();

    if (!phone || !otp || !userId) {
      return NextResponse.json(
        { error: "Phone number, OTP, and user ID are required" },
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

    // Check if OTP matches and is not expired (10 minutes)
    const userOtp = user.user_metadata?.temp_otp;
    const userPhone = user.user_metadata?.temp_phone;
    const otpCreatedAt = user.user_metadata?.otp_created_at;

    if (!userOtp || !userPhone || !otpCreatedAt) {
      return NextResponse.json(
        { error: "No OTP found. Please request a new code." },
        { status: 400 },
      );
    }

    // Check if phone matches
    if (userPhone !== phone) {
      return NextResponse.json(
        { error: "Phone number mismatch" },
        { status: 400 },
      );
    }

    // Check if OTP matches
    if (userOtp !== otp) {
      return NextResponse.json(
        { error: "Код введено не правильно" },
        { status: 400 },
      );
    }

    // Check if OTP is not expired (10 minutes)
    const otpTime = new Date(otpCreatedAt).getTime();
    const currentTime = new Date().getTime();
    const tenMinutes = 10 * 60 * 1000;

    if (currentTime - otpTime > tenMinutes) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new code." },
        { status: 400 },
      );
    }

    // Check if phone number is already in use by another user before clearing OTP
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

    // Clear the temporary OTP data
    await supabase.auth.updateUser({
      data: {
        temp_otp: null,
        temp_phone: null,
        otp_created_at: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 },
    );
  }
}
