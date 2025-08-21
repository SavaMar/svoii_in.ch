"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Shield, AlertTriangle, Trash2 } from "lucide-react";
import {
  validatePhoneNumber,
  getSortedCountries,
} from "@/app/utils/phoneValidation";

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
  const [showRussianBlocked, setShowRussianBlocked] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [phoneBlocked, setPhoneBlocked] = useState(false);

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

  // Timer effect for resend functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handlePhoneChange = (newPhone: string) => {
    setPhone(newPhone);
    // Reset blocked state when user changes phone number
    if (phoneBlocked) {
      setPhoneBlocked(false);
      setError("");
    }
  };

  const handleCountryCodeChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode);
    // Reset blocked state when user changes country code
    if (phoneBlocked) {
      setPhoneBlocked(false);
      setError("");
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Будь ласка, введіть номер телефону");
      return;
    }

    // Check if phone is blocked due to being already in use
    if (phoneBlocked) {
      setError(
        "Цей номер телефону вже використовується іншим користувачем. Будь ласка, введіть інший номер."
      );
      return;
    }

    // Reset phone blocked state when user tries to send OTP for a new number
    setPhoneBlocked(false);

    // Validate phone number
    const fullPhone = `${countryCode}${phone}`;
    const validation = validatePhoneNumber(fullPhone);

    if (!validation.isValid) {
      if (validation.country === "RU") {
        setShowRussianBlocked(true);
        return;
      } else {
        setError(validation.error || "Невірний формат номеру телефону");
        return;
      }
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
      setResendTimer(60);
      setCanResend(false);
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
        // Check for specific error about phone number already in use
        if (data.error && data.error.includes("вже використовується")) {
          setPhoneBlocked(true);
          setResendTimer(0);
          setCanResend(false);
          throw new Error(data.error);
        }
        throw new Error(data.error || "Код введено не правильно");
      }

      // Double-check if phone number is already in use by another user
      const { data: existingProfile, error: checkError } = await supabase
        .from("userprofile")
        .select("user_id")
        .eq("phone_number", fullPhone)
        .neq("user_id", user?.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is "not found"
        console.error("Error checking phone number uniqueness:", checkError);
        throw new Error("Помилка перевірки номеру телефону");
      }

      if (existingProfile) {
        throw new Error(
          "Цей номер телефону вже використовується іншим користувачем"
        );
      }

      // Update the userprofile database with the verified phone number
      console.log("Updating userprofile with phone number:", fullPhone, "for user:", user?.id);
      
      const { error: updateError } = await supabase
        .from("userprofile")
        .update({ phone_number: fullPhone })
        .eq("user_id", user?.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        console.error("Error details:", {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
        });

        // Check for specific error types
        if (
          updateError.code === "23505" ||
          updateError.message?.includes("duplicate key") ||
          updateError.message?.includes("unique constraint") ||
          updateError.message?.includes("phone_number")
        ) {
          setPhoneBlocked(true);
          setResendTimer(0);
          setCanResend(false);
          throw new Error(
            "Цей номер телефону вже використовується іншим користувачем"
          );
        } else if (
          updateError.code === "23503" ||
          updateError.message?.includes("foreign key")
        ) {
          throw new Error("Помилка збереження: користувач не знайдений");
        } else {
          throw new Error("Помилка збереження номеру телефону");
        }
      }

      // Verify that the phone number was saved correctly
      console.log("Phone number saved successfully:", fullPhone);
      
      // Double-check that the phone number is in the database
      const { data: verifyData, error: verifyError } = await supabase
        .from("userprofile")
        .select("phone_number")
        .eq("user_id", user?.id)
        .single();

      if (verifyError) {
        console.error("Error verifying phone number save:", verifyError);
        throw new Error("Помилка перевірки збереження номеру телефону");
      }

      if (verifyData?.phone_number !== fullPhone) {
        console.error("Phone number verification failed:", {
          expected: fullPhone,
          actual: verifyData?.phone_number
        });
        throw new Error("Помилка збереження номеру телефону");
      }

      console.log("Phone number verified in database:", verifyData.phone_number);

      // Show success message
      setPhoneVerified(true);
      
      // Automatically redirect to profile edit after successful phone verification
      setTimeout(() => {
        router.push("/profile/edit/new");
      }, 2000);
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

  const handleResendOtp = async () => {
    // Check if phone is blocked due to being already in use
    if (phoneBlocked) {
      setError(
        "Цей номер телефону вже використовується іншим користувачем. Будь ласка, введіть інший номер."
      );
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
        // Check for specific error about phone number already in use
        if (data.error && data.error.includes("вже використовується")) {
          setPhoneBlocked(true);
          setResendTimer(0);
          setCanResend(false);
          throw new Error(data.error);
        }
        throw new Error(data.error || "Помилка відправки SMS коду");
      }

      setResendTimer(60);
      setCanResend(false);
      setError("");
    } catch (err) {
      console.error("Error resending OTP:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Помилка відправки SMS коду. Спробуйте ще раз.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      setLoading(true);

      // Call API endpoint to delete user
      const response = await fetch("/api/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Помилка видалення профілю");
      }

      // Sign out and redirect to home
      await supabase.auth.signOut();
      router.push("/");
    } catch (err) {
      console.error("Error deleting profile:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Помилка видалення профілю. Спробуйте ще раз.");
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
              <p className="text-sm text-gray-600">
                Вас буде автоматично перенаправлено на сторінку редагування профілю через кілька секунд.
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

  if (showRussianBlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">
              Обмеження доступу
            </CardTitle>
            <p className="text-gray-600">
              На жаль, ми не працюємо з номерами телефонів з Російської
              Федерації
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Номери телефонів, що починаються з +7 (Російська Федерація), не
                підтримуються на нашій платформі. Будь ласка, використайте номер
                з підтримуваної країни.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <p className="text-sm text-gray-600 font-medium">
                Оберіть один з варіантів:
              </p>

              <div className="space-y-2">
                <Button
                  onClick={() => {
                    handleCountryCodeChange("+41");
                    setShowRussianBlocked(false);
                    setError("");
                  }}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={loading}
                >
                  🇨🇭 Використати швейцарський номер (+41)
                </Button>

                <Button
                  onClick={() => {
                    handleCountryCodeChange("+380");
                    setShowRussianBlocked(false);
                    setError("");
                  }}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={loading}
                >
                  🇺🇦 Використати український номер (+380)
                </Button>

                <Button
                  onClick={() => {
                    handleCountryCodeChange("+44");
                    setShowRussianBlocked(false);
                    setError("");
                  }}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={loading}
                >
                  🇬🇧 Використати британський номер (+44)
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={handleDeleteProfile}
                  variant="destructive"
                  className="w-full"
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {loading ? "Видалення..." : "Видалити профіль"}
                </Button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
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

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Надіслати новий код через {resendTimer} сек
                  </p>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOtp}
                    disabled={loading || !canResend}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Надіслати новий код
                  </Button>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label htmlFor="phone">Номер телефону</Label>
                <div className="flex gap-2">
                  <select
                    id="countryCode"
                    value={countryCode}
                    onChange={(e) => handleCountryCodeChange(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {getSortedCountries().map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
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
                <p className="text-xs text-gray-500 mt-1">
                  Підтримуються номери з країн Європейського Союзу, України та
                  Великобританії
                </p>
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
