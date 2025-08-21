import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

// Function to check if user profile is complete
async function isProfileComplete(supabase: SupabaseClient, userId: string) {
  try {
    const { data: profile, error } = await supabase
      .from("userprofile")
      .select("gender, date_of_birth, nationality, country_of_living, city")
      .eq("user_id", userId)
      .single();

    if (error || !profile) {
      return false;
    }

    // Profile is complete if all required fields are filled
    return !!(
      profile.gender &&
      profile.date_of_birth &&
      profile.nationality &&
      profile.country_of_living &&
      profile.city
    );
  } catch (err) {
    console.error("Error checking profile completion:", err);
    return false;
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/profile";
  const type = requestUrl.searchParams.get("type"); // password_recovery or signup
  const token = requestUrl.searchParams.get("token"); // For email confirmation
  const token_hash = requestUrl.searchParams.get("token_hash"); // For email confirmation
  const access_token = requestUrl.searchParams.get("access_token"); // For successful auth

  console.log("Auth callback called with:", { 
    code: !!code, 
    next, 
    type,
    token: !!token,
    token_hash: !!token_hash,
    access_token: !!access_token,
    fullUrl: request.url,
    searchParams: Object.fromEntries(requestUrl.searchParams.entries())
  });

  // Handle access_token (successful authentication)
  if (access_token) {
    console.log("Access token detected, user successfully authenticated");
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      // Get current user to check their status
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error("Error getting user after access token:", userError);
        return NextResponse.redirect(
          new URL("/?error=user_not_found", requestUrl.origin),
        );
      }

      console.log("User authenticated via access token:", {
        userId: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        password_set: user.user_metadata?.password_set,
      });

      // Check if user needs to set password
      if (!user.user_metadata?.password_set) {
        console.log("User needs to set password, redirecting to confirm-password");
        return NextResponse.redirect(
          new URL("/confirm-password", requestUrl.origin),
        );
      }

      // Check if user needs phone verification
      const { data: profile, error: profileError } = await supabase
        .from("userprofile")
        .select("phone_number")
        .eq("user_id", user.id)
        .single();

      if (profileError || !profile?.phone_number) {
        console.log("User needs phone verification, redirecting to phone-verification");
        return NextResponse.redirect(
          new URL("/phone-verification", requestUrl.origin),
        );
      }

      // Check if user profile is complete
      const profileComplete = await isProfileComplete(supabase, user.id);
      if (!profileComplete) {
        console.log("User profile incomplete, redirecting to profile page");
        return NextResponse.redirect(
          new URL("/profile", requestUrl.origin),
        );
      }

      // User is fully authenticated and profile is complete
      console.log("User fully authenticated, redirecting to home");
      return NextResponse.redirect(new URL("/", requestUrl.origin));
      
    } catch (err) {
      console.error("Unexpected error handling access token:", err);
      return NextResponse.redirect(
        new URL("/?error=access_token_error", requestUrl.origin),
      );
    }
  }

  // Handle email confirmation tokens
  if (token && token_hash) {
    console.log("Email confirmation tokens detected, processing email confirmation");
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        token,
        type: 'email',
      });

      if (error) {
        console.error("Email confirmation error:", error);
        return NextResponse.redirect(
          new URL("/?error=email_confirmation_failed", requestUrl.origin),
        );
      }

      console.log("Email confirmed successfully:", {
        userId: data.user?.id,
        email: data.user?.email,
        passwordSet: data.user?.user_metadata?.password_set,
      });

      // After email confirmation, check if user needs to set password or go to phone verification
      if (data.user && !data.user.user_metadata?.password_set) {
        console.log("User needs to set password after email confirmation, redirecting to confirm-password");
        return NextResponse.redirect(
          new URL("/confirm-password", requestUrl.origin),
        );
      } else {
        console.log("User has password set, redirecting to phone verification");
        return NextResponse.redirect(
          new URL("/phone-verification", requestUrl.origin),
        );
      }
    } catch (err) {
      console.error("Unexpected error in email confirmation:", err);
      return NextResponse.redirect(
        new URL("/?error=email_confirmation_failed", requestUrl.origin),
      );
    }
  }

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth callback error:", error);
        // Redirect to login page with error
        return NextResponse.redirect(
          new URL("/?error=auth_callback_failed", requestUrl.origin),
        );
      }

      console.log("User authenticated successfully:", {
        userId: data.user?.id,
        email: data.user?.email,
        passwordSet: data.user?.user_metadata?.password_set,
        type,
        userMetadata: data.user?.user_metadata,
        emailConfirmedAt: data.user?.email_confirmed_at,
      });

      // For password recovery, redirect to confirm-password to set new password
      if (type === "password_recovery") {
        console.log("Password recovery flow, redirecting to confirm-password");
        return NextResponse.redirect(
          new URL("/confirm-password", requestUrl.origin),
        );
      }

      // For new signups, check if user needs to set password
      if (data.user && !data.user.user_metadata?.password_set) {
        console.log(
          "New user needs to set password, redirecting to confirm-password",
        );
        return NextResponse.redirect(
          new URL("/confirm-password", requestUrl.origin),
        );
      }

      // Check if this is a user who just confirmed their email and needs to set password
      if (data.user && data.user.email_confirmed_at && !data.user.user_metadata?.password_set) {
        console.log(
          "User just confirmed email, needs to set password, redirecting to confirm-password",
        );
        return NextResponse.redirect(
          new URL("/confirm-password", requestUrl.origin),
        );
      }

      // For users who have set password, check if they need phone verification
      if (data.user && data.user.user_metadata?.password_set) {
        // Check if user has a verified phone number
        const { data: profile, error: profileError } = await supabase
          .from("userprofile")
          .select("phone_number")
          .eq("user_id", data.user.id)
          .single();

        if (profileError || !profile?.phone_number) {
          console.log("User needs phone verification, redirecting to phone-verification");
          return NextResponse.redirect(
            new URL("/phone-verification", requestUrl.origin),
          );
        }

        // Check if user profile is complete (for regular logins)
        if (type !== "password_recovery") {
          const profileComplete = await isProfileComplete(supabase, data.user.id);

          if (!profileComplete) {
            console.log("User profile incomplete, redirecting to profile page");
            return NextResponse.redirect(
              new URL("/profile", requestUrl.origin),
            );
          }
        }
      }

      // For users who don't have password_set in metadata but are authenticated
      if (data.user && !data.user.user_metadata?.password_set) {
        // Check if user has a verified phone number
        const { data: profile, error: profileError } = await supabase
          .from("userprofile")
          .select("phone_number")
          .eq("user_id", data.user.id)
          .single();

        if (profileError || !profile?.phone_number) {
          console.log("User needs phone verification, redirecting to phone-verification");
          return NextResponse.redirect(
            new URL("/phone-verification", requestUrl.origin),
          );
        }
      }

      // If we get here, redirect to the next URL or default to profile
      console.log("Redirecting to:", next);
      return NextResponse.redirect(new URL(next, requestUrl.origin));
      
    } catch (err) {
      console.error("Unexpected error in auth callback:", err);
      return NextResponse.redirect(
        new URL("/?error=auth_callback_failed", requestUrl.origin),
      );
    }
  }

  // No code or tokens provided, redirect to home
  console.log("No code or tokens provided in auth callback, redirecting to home");
  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
