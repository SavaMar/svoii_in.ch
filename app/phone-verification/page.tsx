"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Shield } from "lucide-react";

export default function PhoneVerificationPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+41");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [phoneVerified, setPhoneVerified] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push("/");
        return;
      }
      setUser(currentUser);
    };
    checkUser();
  }, [supabase, router]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Будь ласка, введіть номер телефону");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const fullPhone = `${countryCode}${phone}`;

      // Call your API endpoint to send OTP via Twilio
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: fullPhone,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Помилка відправки SMS коду");
      }

      setShowOtpInput(true);
      setError("");
    } catch (err) {
      console.error("Error sending OTP:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Помилка відправки SMS коду. Спробуйте ще раз.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Будь ласка, введіть код підтвердження");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const fullPhone = `${countryCode}${phone}`;

      // Call your API endpoint to verify OTP
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: fullPhone,
          otp: otp,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Невірний код підтвердження");
      }

      // Update the userprofile database with the verified phone number
      const { error: updateError } = await supabase
        .from("userprofile")
        .update({ phone_number: fullPhone })
        .eq("user_id", user?.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw new Error("Помилка збереження номеру телефону");
      }

      // Show success message
      setPhoneVerified(true);
    } catch (err) {
      console.error("OTP verification error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Невірний код. Спробуйте ще раз.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Завантаження...</div>;
  }

  if (phoneVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Телефон підтверджено!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Ваш номер телефону успішно підтверджено та додано до вашого
                профілю.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Тепер ви можете використовувати всі функції платформи.
              </p>
            </div>

            <Button onClick={() => router.push("/profile")} className="w-full">
              Перейти до профілю
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Phone className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Підтвердження телефону</CardTitle>
          <p className="text-gray-600">
            Для безпеки платформи потрібно підтвердити ваш номер телефону
          </p>
        </CardHeader>
        <CardContent>
          {showOtpInput ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <Label htmlFor="otp">Код підтвердження</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Введіть 6-значний код"
                  required
                  onInvalid={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.setCustomValidity(
                      "Будь ласка, введіть код підтвердження"
                    );
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.setCustomValidity("");
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Код надіслано на {countryCode}
                  {phone}
                </p>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowOtpInput(false)}
                  disabled={loading}
                  className="flex-1"
                >
                  Назад
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Перевірка..." : "Підтвердити"}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label htmlFor="phone">Номер телефону</Label>
                <div className="flex gap-2">
                  <Input
                    id="countryCode"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-24"
                    required
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity(
                        "Будь ласка, введіть код країни"
                      );
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity("");
                    }}
                  />
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1"
                    placeholder="Номер телефону"
                    required
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity(
                        "Будь ласка, введіть номер телефону"
                      );
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity("");
                    }}
                  />
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Ваш номер телефону не буде показано публічно та
                  використовується тільки для підтвердження особистості.
                </AlertDescription>
              </Alert>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Відправка..." : "Надіслати код"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
