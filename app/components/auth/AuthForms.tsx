"use client";

import { useState } from "react";

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

import { validatePhoneNumber } from "@/app/utils/phoneValidation";
import {
  validatePassword,
  getPasswordStrengthColor,
  getPasswordStrengthText,
  getRequirementColor,
  getRequirementIcon,
} from "@/app/utils/passwordValidation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

interface AuthFormsProps {
  onClose?: () => void;
}

export function AuthForms({ onClose }: AuthFormsProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletterAccepted, setNewsletterAccepted] = useState(true);
  const [activeTab, setActiveTab] = useState("signin");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: [] as string[],
    strength: "weak" as "weak" | "medium" | "strong",
    requirements: [] as Array<{ text: string; isMet: boolean }>,
  });
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("Будь ласка, прийміть умови використання");
      return;
    }

    // Validate password
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setPasswordValidation(validation);
      setShowPasswordRequirements(true);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const displayName = `${firstName} ${lastName}`.trim();

      console.log("Signing up with data:", {
        email,
        displayName,
        firstName,
        lastName,
        newsletterAccepted,
      });

      // Create user with email and metadata
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            display_name: displayName,
            first_name: firstName,
            last_name: lastName,
            newsletter_subscribed: newsletterAccepted,
          },
        },
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        throw signUpError;
      }

      if (data.user) {
        console.log("User created successfully:", data.user.id);

        // Subscribe to newsletter if accepted
        if (newsletterAccepted) {
          try {
            console.log("Attempting to subscribe to newsletter:", {
              email,
              firstName,
              lastName,
            });

            const response = await fetch("/api/newsletter/subscribe", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
                firstName,
                lastName,
              }),
            });

            const responseData = await response.json();
            console.log("Newsletter subscription response:", {
              status: response.status,
              data: responseData,
            });

            if (!response.ok) {
              console.error(
                "Newsletter subscription failed:",
                responseData.error
              );
            } else {
              console.log(
                "Successfully subscribed to newsletter:",
                responseData
              );
            }
          } catch (newsletterError) {
            console.error("Newsletter subscription failed:", newsletterError);
            // Don't block signup if newsletter subscription fails
          }
        }

        // Show email confirmation message and redirect to home
        setEmailConfirmationSent(true);
        // After showing the message, redirect to home after a delay
        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      }
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
      console.log("Attempting to sign in with:", { email });

      // First, sign in with email and password
      const { error: signInError, data } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        console.log("Sign in successful, user:", data.user.id);

        // Get user's phone number from metadata
        const userPhone = data.user.user_metadata?.phone;
        console.log("User metadata:", data.user.user_metadata);
        console.log("User phone:", userPhone);

        if (userPhone) {
          // Validate phone number
          const validation = validatePhoneNumber(userPhone);
          if (!validation.isValid) {
            throw new Error(validation.error || "Invalid phone number");
          }

          // Send OTP for phone verification
          const { error: otpError } = await supabase.auth.signInWithOtp({
            phone: userPhone,
          });

          if (otpError) {
            console.error("OTP sending failed:", otpError);
            throw new Error("Не вдалося надіслати SMS код. Спробуйте ще раз.");
          }

          // Show OTP verification form
          setShowOtpVerification(true);
          setError(""); // Clear any previous errors
        } else {
          // No phone number, check if profile is complete
          console.log("No phone number found, checking profile completion");

          // Check if user profile is complete (with a small delay to ensure data is fresh)
          await new Promise((resolve) => setTimeout(resolve, 500));

          const { data: profile, error: profileError } = await supabase
            .from("userprofile")
            .select(
              "gender, date_of_birth, nationality, country_of_living, city"
            )
            .eq("user_id", data.user.id)
            .single();

          console.log("Profile check result:", { profile, profileError });

          if (profileError || !profile) {
            console.log("No profile found, redirecting to profile");
            window.location.href = "/profile";
            return;
          }

          // Check if profile is complete
          const isComplete = !!(
            profile.gender &&
            profile.date_of_birth &&
            profile.nationality &&
            profile.country_of_living &&
            profile.city
          );

          console.log("Profile completion check:", {
            gender: profile.gender,
            date_of_birth: profile.date_of_birth,
            nationality: profile.nationality,
            country_of_living: profile.country_of_living,
            city: profile.city,
            isComplete,
          });

          // If profile is complete, redirect to home immediately
          if (isComplete) {
            console.log("Profile complete, redirecting to home");
            router.push("/");
            return;
          }

          if (!isComplete) {
            console.log("Profile incomplete, redirecting to profile edit");
            router.push("/profile/edit/new");
          } else {
            console.log("Profile complete, redirecting to home");
            router.push("/");
          }
        }
      }
    } catch (err) {
      console.error("Sign in error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Помилка входу. Перевірте ваші дані.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
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

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setError("Будь ласка, введіть код підтвердження");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Get current user to get phone number
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      // Verify OTP code
      const { error: verifyError, data } = await supabase.auth.verifyOtp({
        phone: currentUser?.user_metadata?.phone,
        token: otpCode,
        type: "sms",
      });

      if (verifyError) {
        throw verifyError;
      }

      if (data.user) {
        console.log("OTP verification successful, checking profile completion");

        // Check if user profile is complete
        const { data: profile, error: profileError } = await supabase
          .from("userprofile")
          .select("gender, date_of_birth, nationality, country_of_living, city")
          .eq("user_id", data.user.id)
          .single();

        if (profileError || !profile) {
          console.log("No profile found, redirecting to profile edit");
          router.push("/profile/edit/new");
          return;
        }

        // Check if profile is complete
        const isComplete = !!(
          profile.gender &&
          profile.date_of_birth &&
          profile.nationality &&
          profile.country_of_living &&
          profile.city
        );

        console.log("OTP verification - Profile completion check:", {
          gender: profile.gender,
          date_of_birth: profile.date_of_birth,
          nationality: profile.nationality,
          country_of_living: profile.country_of_living,
          city: profile.city,
          isComplete,
        });

        if (isComplete) {
          console.log("Profile complete, redirecting to home");
          router.push("/");
        } else {
          console.log("Profile incomplete, redirecting to profile");
          router.push("/profile");
        }
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Невірний код підтвердження. Спробуйте ще раз.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Будь ласка, введіть ваш email");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/callback?type=password_recovery`,
        }
      );

      if (resetError) {
        throw resetError;
      }

      setResetEmailSent(true);
    } catch (err) {
      console.error("Password reset error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Помилка відправки email для скидання пароля. Спробуйте ще раз."
        );
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
            {!showForgotPassword && !showOtpVerification ? (
              <form onSubmit={handleEmailSignin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.validity.valueMissing) {
                        target.setCustomValidity(
                          "Будь ласка, введіть ваш email"
                        );
                      } else if (target.validity.typeMismatch) {
                        target.setCustomValidity(
                          "Будь ласка, введіть коректний email"
                        );
                      } else {
                        target.setCustomValidity("");
                      }
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity("");
                    }}
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
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity(
                        "Будь ласка, введіть ваш пароль"
                      );
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity("");
                    }}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Завантаження..." : "Увійти"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      onClose?.();
                      router.push("/forgot-password");
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Я не памʼятаю свій пароль
                  </button>
                </div>
              </form>
            ) : !resetEmailSent ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Введіть ваш email, і ми надішлемо вам посилання для скидання
                  пароля.
                </p>
                <div>
                  <Label htmlFor="resetEmail">Email</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.validity.valueMissing) {
                        target.setCustomValidity(
                          "Будь ласка, введіть ваш email"
                        );
                      } else if (target.validity.typeMismatch) {
                        target.setCustomValidity(
                          "Будь ласка, введіть коректний email"
                        );
                      } else {
                        target.setCustomValidity("");
                      }
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity("");
                    }}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Відправка..." : "Надіслати посилання"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmailSent(false);
                      setError("");
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Повернутися до входу
                  </button>
                </div>
              </form>
            ) : showOtpVerification ? (
              <form onSubmit={handleOtpVerification} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    Ми надіслали SMS код на ваш номер телефону. Введіть код для
                    підтвердження.
                  </p>
                </div>
                <div>
                  <Label htmlFor="otp">Код підтвердження</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Введіть 6-значний код"
                    maxLength={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Перевірка..." : "Підтвердити"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpVerification(false);
                      setOtpCode("");
                      setError("");
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Повернутися до входу
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="text-green-600">
                  <p className="font-medium">Email надіслано!</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Перевірте вашу пошту та перейдіть за посиланням для скидання
                    пароля.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmailSent(false);
                    setError("");
                  }}
                  className="w-full"
                >
                  Повернутися до входу
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="signup">
            {!emailConfirmationSent ? (
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div>
                  <Label htmlFor="firstName">Ім&apos;я</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity("Будь ласка, введіть ваше ім'я");
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity("");
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Прізвище</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity(
                        "Будь ласка, введіть ваше прізвище"
                      );
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity("");
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Прізвище не буде показано публічно без вашого дозволу
                  </p>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.validity.valueMissing) {
                        target.setCustomValidity(
                          "Будь ласка, введіть ваш email"
                        );
                      } else if (target.validity.typeMismatch) {
                        target.setCustomValidity(
                          "Будь ласка, введіть коректний email"
                        );
                      } else {
                        target.setCustomValidity("");
                      }
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity("");
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity(
                        "Будь ласка, введіть ваш пароль"
                      );
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity("");
                    }}
                  />
                  {(showPasswordRequirements ||
                    !passwordValidation.isValid ||
                    password.length > 0) && (
                    <div
                      className={`mt-2 space-y-2 ${!passwordValidation.isValid ? "p-3 border border-red-200 rounded-md bg-red-50" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${getPasswordStrengthColor(
                            passwordValidation.strength
                          )}`}
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={newsletterAccepted}
                    onCheckedChange={(checked) =>
                      setNewsletterAccepted(checked as boolean)
                    }
                  />
                  <Label htmlFor="newsletter" className="text-sm">
                    Я хочу отримувати новини на email
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
              <div className="space-y-4 text-center">
                <div className="text-green-600">
                  <p className="font-medium">Реєстрація успішна!</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Ми надіслали лист підтвердження на вашу електронну пошту.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Будь ласка, перевірте:</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>
                      • Вашу пошту та натисніть на посилання для підтвердження
                    </li>
                    <li>
                      • Папку &quot;Спам&quot; або &quot;Небажана пошта&quot;
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-3">
                    Після підтвердження email ви зможете увійти в систему. Вас
                    буде перенаправлено на головну сторінку через 5 секунд.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setEmailConfirmationSent(false);
                    setError("");
                    // Reset form
                    setEmail("");
                    setPassword("");
                    setFirstName("");
                    setLastName("");
                    setTermsAccepted(false);
                    setNewsletterAccepted(true);
                  }}
                  className="w-full"
                >
                  Повернутися до реєстрації
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </CardContent>
    </Card>
  );
}
