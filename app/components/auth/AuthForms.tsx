"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

export function AuthForms() {
  const { signIn, signUp, sendOTP, verifyOTP } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+41");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("Будь ласка, прийміть умови використання");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const displayName = `${firstName} ${lastName}`.trim();
      // Create user with email and metadata
      await signUp(email, password, {
        data: {
          display_name: displayName,
          first_name: firstName,
          last_name: lastName,
          phone: `${countryCode}${phone}`,
        },
      });
      // Send OTP for phone verification
      await sendOTP(`${countryCode}${phone}`);
      setShowOtpVerification(true);
    } catch (err) {
      console.error("Signup error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Помилка реєстрації. Спробуйте ще раз.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await signIn(email, password);
    } catch {
      setError("Помилка входу. Перевірте ваші дані.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const fullPhone = `${countryCode}${phone}`;
      await verifyOTP(fullPhone, otp);
      setShowOtpVerification(false);
      setOtp("");
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Авторизація</CardTitle>
        <CardDescription>
          {activeTab === "signin"
            ? "Увійдіть до свого облікового запису"
            : "Створіть новий обліковий запис"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Вхід</TabsTrigger>
            <TabsTrigger value="signup">Реєстрація</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleEmailSignin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Завантаження..." : "Увійти"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            {!showOtpVerification ? (
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div>
                  <Label htmlFor="firstName">Ім&apos;я</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Прізвище</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Номер телефону</Label>
                  <div className="flex gap-2">
                    <Input
                      id="countryCode"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-24"
                      required
                    />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) =>
                      setTermsAccepted(checked as boolean)
                    }
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Я погоджуюсь з{" "}
                    <a href="/terms" className="text-primary hover:underline">
                      умовами використання
                    </a>
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !termsAccepted}
                >
                  {loading ? "Завантаження..." : "Зареєструватися"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ми надіслали код підтвердження на ваш телефон {countryCode}
                  {phone}. Будь ласка, введіть його нижче.
                </p>
                <div>
                  <Label htmlFor="otp">Код підтвердження</Label>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Перевірка..." : "Підтвердити"}
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </CardContent>
    </Card>
  );
}
