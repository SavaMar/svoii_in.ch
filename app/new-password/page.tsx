"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, CheckCircle, AlertTriangle } from "lucide-react";
import {
  validatePassword,
  getPasswordStrengthColor,
  getPasswordStrengthText,
  getRequirementColor,
  getRequirementIcon,
} from "@/app/utils/passwordValidation";

export default function NewPasswordPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    email?: string;
  } | null>(null);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: [] as string[],
    strength: "weak" as "weak" | "medium" | "strong",
    requirements: [] as Array<{ text: string; isMet: boolean }>,
  });
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  useEffect(() => {
    // Check if user is authenticated (should be authenticated from email link)
    const checkUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        setError(
          "Користувач не авторизований. Будь ласка, пройдіть процес скидання пароля знову."
        );
        return;
      }

      // Check if this is a password reset session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        setUser(currentUser);
      } else {
        setError(
          "Невалідна сесія. Будь ласка, пройдіть процес скидання пароля знову."
        );
      }
    };

    checkUser();
  }, [supabase]);

  const handleNewPasswordChange = (newPassword: string) => {
    setNewPassword(newPassword);
    if (newPassword.length > 0) {
      const validation = validatePassword(newPassword);
      setPasswordValidation(validation);
      setShowPasswordRequirements(true);
    } else {
      setPasswordValidation({
        isValid: false,
        errors: [],
        strength: "weak",
        requirements: [],
      });
      setShowPasswordRequirements(false);
    }
  };

  const handlePasswordSet = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      setError("Будь ласка, введіть новий пароль");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Будь ласка, підтвердіть новий пароль");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    // Validate new password
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setPasswordValidation(validation);
      setShowPasswordRequirements(true);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Update user password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error("Password update error:", updateError);
        throw new Error(updateError.message);
      }

      setSuccess(true);

      // Redirect to profile after 3 seconds
      setTimeout(() => {
        router.push("/profile");
      }, 3000);
    } catch (err) {
      console.error("Password set error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Помилка встановлення нового пароля. Спробуйте ще раз.");
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
            <CardTitle className="text-2xl">Пароль успішно змінено!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Ваш пароль успішно змінено. Тепер ви можете використовувати
                новий пароль для входу.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Вас буде перенаправлено на сторінку профілю через кілька секунд.
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

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Помилка</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => router.push("/forgot-password")}
              className="w-full"
            >
              Спробувати ще раз
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
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Встановлення нового пароля</CardTitle>
          <p className="text-gray-600">
            Введіть новий пароль для вашого облікового запису. Пароль повинен
            бути надійним та містити мінімум 8 символів.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSet} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Новий пароль</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => handleNewPasswordChange(e.target.value)}
                required
                placeholder="Введіть новий пароль"
              />
              {(showPasswordRequirements ||
                !passwordValidation.isValid ||
                newPassword.length > 0) && (
                <div
                  className={`mt-2 space-y-2 ${!passwordValidation.isValid ? "p-3 border border-red-200 rounded-md bg-red-50" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${getPasswordStrengthColor(passwordValidation.strength)}`}
                    >
                      Сила пароля:{" "}
                      {getPasswordStrengthText(passwordValidation.strength)}
                    </span>
                  </div>
                  <div
                    className={`text-xs space-y-1 ${!passwordValidation.isValid ? "text-red-600" : "text-gray-600"}`}
                  >
                    <p className="font-medium">Вимоги до пароля:</p>
                    <ul className="space-y-1">
                      {passwordValidation.requirements?.map(
                        (requirement, index) => (
                          <li
                            key={index}
                            className={`flex items-center gap-2 ${getRequirementColor(requirement.isMet)}`}
                          >
                            <span className="font-bold">
                              {getRequirementIcon(requirement.isMet)}
                            </span>
                            {requirement.text}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">
                Підтвердження нового пароля
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Повторіть новий пароль"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Встановлення..." : "Встановити новий пароль"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
