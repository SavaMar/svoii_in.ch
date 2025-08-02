"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Будь ласка, введіть email");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/new-password`,
        }
      );

      if (resetError) {
        throw resetError;
      }

      setSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Помилка відправки листа для скидання пароля. Спробуйте ще раз."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Лист відправлено!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Ми відправили лист з інструкціями для скидання пароля на адресу{" "}
                <strong>{email}</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Перевірте вашу пошту та перейдіть за посиланням у листі для
                скидання пароля.
              </p>
            </div>

            <Button onClick={() => router.push("/")} className="w-full">
              Повернутися на головну
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
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Забули пароль?</CardTitle>
          <p className="text-gray-600">
            Введіть ваш email для отримання інструкцій по скиданню пароля
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Введіть ваш email"
              />
            </div>

            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Відправка..." : "Відправити лист"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => router.push("/")}
                className="text-sm flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Повернутися на головну
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
