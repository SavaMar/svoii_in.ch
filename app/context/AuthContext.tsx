"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { validatePhoneNumber } from "@/app/utils/phoneValidation";

type UserMetadata = {
  display_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  newsletter_subscribed?: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    metadata: { data: UserMetadata }
  ) => Promise<void>;
  signOut: () => Promise<void>;
  sendOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    router.refresh();
  };

  const signUp = async (
    email: string,
    password: string,
    metadata: { data: UserMetadata }
  ) => {
    console.log("AuthContext: Signing up with metadata:", metadata);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: metadata.data,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.refresh();
  };

  const sendOTP = async (phone: string) => {
    // Validate phone number
    const validation = validatePhoneNumber(phone);
    if (!validation.isValid) {
      throw new Error(validation.error || "Invalid phone number");
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });
    if (error) throw error;
  };

  const verifyOTP = async (phone: string, otp: string) => {
    // Validate phone number
    const validation = validatePhoneNumber(phone);
    if (!validation.isValid) {
      throw new Error(validation.error || "Invalid phone number");
    }

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });
    if (error) throw error;

    // After successful verification, update the user's metadata with the phone number and display name
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    if (currentUser?.user_metadata) {
      const { first_name, last_name } = currentUser.user_metadata;
      const displayName = `${first_name} ${last_name}`.trim();

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          phone,
          display_name: displayName,
          first_name,
          last_name,
        },
      });
      if (updateError) throw updateError;
    }

    // Redirect to profile page after successful verification
    router.push("/profile");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        sendOTP,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
