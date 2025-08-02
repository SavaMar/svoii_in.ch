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

  console.log("Auth callback called with:", { code: !!code, next, type });

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      // Redirect to login page with error
      return NextResponse.redirect(
        new URL("/?error=auth_callback_failed", requestUrl.origin),
      );
    }

    console.log("User authenticated:", {
      userId: data.user?.id,
      email: data.user?.email,
      passwordSet: data.user?.user_metadata?.password_set,
      type,
    });

    // For password recovery, redirect to confirm-email to set new password
    if (type === "password_recovery") {
      console.log("Password recovery flow, redirecting to confirm-email");
      return NextResponse.redirect(
        new URL("/confirm-email", requestUrl.origin),
      );
    }

    // For new signups, check if user needs to set password
    if (data.user && !data.user.user_metadata?.password_set) {
      console.log(
        "New user needs to set password, redirecting to confirm-email",
      );
      return NextResponse.redirect(
        new URL("/confirm-email", requestUrl.origin),
      );
    }

    // Check if user profile is complete (for regular logins)
    if (
      data.user && type !== "password_recovery" &&
      data.user.user_metadata?.password_set
    ) {
      const profileComplete = await isProfileComplete(supabase, data.user.id);

      if (!profileComplete) {
        console.log("User profile incomplete, redirecting to profile page");
        return NextResponse.redirect(
          new URL("/profile", requestUrl.origin),
        );
      }
    }
  }

  // URL to redirect to after sign in process completes
  console.log("Redirecting to:", next);
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
