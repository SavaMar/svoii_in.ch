"use client";

import { useAuth } from "@/app/context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function WelcomePage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Debug log to see user data
    if (user) {
      console.log("User data:", {
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        confirmed_at: user.confirmed_at,
        user_metadata: user.user_metadata,
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Завантаження...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleResendVerification = async () => {
    try {
      setIsVerifying(true);
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email!,
      });
      if (error) throw error;
      alert("Лист для підтвердження надіслано на вашу електронну пошту");
    } catch (error) {
      console.error("Error resending verification:", error);
      alert("Помилка відправки листа. Спробуйте ще раз.");
    } finally {
      setIsVerifying(false);
    }
  };

  const isEmailVerified = user.user_metadata?.email_verified === true;

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Вітаємо, {user.user_metadata?.first_name || "Користувач"}!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isEmailVerified && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <CardDescription className="text-yellow-800">
                  Будь ласка, підтвердіть вашу електронну пошту для повного
                  доступу до функцій спільноти.
                </CardDescription>
                <Button
                  onClick={handleResendVerification}
                  disabled={isVerifying}
                  className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {isVerifying
                    ? "Відправка..."
                    : "Надіслати лист підтвердження"}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Дякуємо за реєстрацію в Українській Спільноті Швейцарії
            </p>
            <p className="text-sm text-muted-foreground">
              Ваш email: {user.email}
              {isEmailVerified && (
                <span className="ml-2 text-green-600">✓ Підтверджено</span>
              )}
            </p>
            {user.user_metadata?.phone && (
              <p className="text-sm text-muted-foreground">
                Ваш телефон: {user.user_metadata.phone}
                {user.user_metadata?.phone_verified && (
                  <span className="ml-2 text-green-600">✓ Підтверджено</span>
                )}
              </p>
            )}
          </div>

          <div className="grid gap-4">
            <Button
              onClick={() => router.push("/community")}
              className="w-full"
            >
              Перейти до спільноти
            </Button>
            <Button
              onClick={() => router.push("/events")}
              variant="outline"
              className="w-full"
            >
              Переглянути події
            </Button>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              Вийти
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
