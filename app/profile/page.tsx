"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Mail,
  Phone,
  User,
  Pencil,
  AlertTriangle,
  Lock,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AvatarUpload } from "@/app/components/AvatarUpload";
import { Separator } from "@/components/ui/separator";
import { COUNTRIES, CANTONS, SWISS_STATUSES } from "@/app/utils/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  validatePhoneNumber,
  getSortedCountries,
} from "@/app/utils/phoneValidation";

interface UserProfile {
  id: number;
  user_id: string | null;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  nickname: string | null;
  gender: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  country_of_living: string | null;
  city: string | null;
  canton: string | null;
  zip_code: string | null;
  swiss_status: string | null;
  avatar_url: string | null;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);

  // Phone update modal state
  const [showPhoneUpdate, setShowPhoneUpdate] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+41");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [phoneSuccess, setPhoneSuccess] = useState(false);

  // Swiss phone modal state
  const [showSwissPhoneModal, setShowSwissPhoneModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    async function loadProfile() {
      try {
        // Get fresh user data to check email verification status
        const {
          data: { user: freshUser },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;

        // If email is now confirmed, update the user in context
        if (freshUser?.email_confirmed_at && !user.email_confirmed_at) {
          // Force a refresh of the auth context
          await supabase.auth.refreshSession();
        }

        const { data: existingProfile, error: fetchError } = await supabase
          .from("userprofile")
          .select("*")
          .eq("user_id", freshUser?.id);

        if (fetchError) {
          console.error("Supabase error:", fetchError);
          throw fetchError;
        }

        if (existingProfile && existingProfile.length > 0) {
          const profileData = existingProfile[0];
          setProfile(profileData);

          // Check if profile is incomplete
          const isIncomplete =
            !profileData.gender ||
            !profileData.date_of_birth ||
            !profileData.nationality ||
            !profileData.country_of_living ||
            !profileData.city;

          setIsProfileIncomplete(isIncomplete);
        } else {
          // If no profile exists, redirect to edit page
          router.push("/profile/edit/new");
          return;
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();

    // Set up an interval to check email verification status
    const intervalId = setInterval(async () => {
      const {
        data: { user: freshUser },
      } = await supabase.auth.getUser();
      if (freshUser?.email_confirmed_at && !user.email_confirmed_at) {
        // Force a refresh of the auth context
        await supabase.auth.refreshSession();
        // Reload the page to update the UI
        window.location.reload();
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [user, supabase, router]);

  const handleAvatarUpdate = async (url: string) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from("userprofile")
        .update({ avatar_url: url })
        .eq("id", profile.id);

      if (error) throw error;

      setProfile((prev) => ({ ...prev!, avatar_url: url }));
    } catch (err) {
      console.error("Error updating avatar:", err);
    }
  };

  const handleSendPhoneOtp = async () => {
    if (!newPhone.trim()) {
      setPhoneError("Будь ласка, введіть номер телефону");
      return;
    }

    const fullPhone = `${countryCode}${newPhone}`;

    // Check if it's the same phone number as current
    if (profile?.phone_number === fullPhone) {
      setPhoneError("Цей номер телефону вже встановлений у вашому профілі");
      return;
    }

    // Validate phone number
    const validation = validatePhoneNumber(fullPhone);
    if (!validation.isValid) {
      setPhoneError(validation.error || "Невірний формат номеру телефону");
      return;
    }

    try {
      setPhoneLoading(true);
      setPhoneError("");

      // Check if phone number is already used by another user
      const { data: existingUser, error: checkError } = await supabase
        .from("userprofile")
        .select("user_id")
        .eq("phone_number", fullPhone)
        .neq("user_id", user?.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is "not found"
        console.error("Error checking phone number:", checkError);
        setPhoneError("Помилка перевірки номеру телефону");
        return;
      }

      if (existingUser) {
        setPhoneError(
          "Цей номер телефону вже використовується іншим користувачем"
        );
        return;
      }

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
        throw new Error(data.error || "Помилка відправки коду");
      }

      setShowOtpInput(true);
      setPhoneError("");
    } catch (err) {
      console.error("Send OTP error:", err);
      if (err instanceof Error) {
        setPhoneError(err.message);
      } else {
        setPhoneError("Помилка відправки коду. Спробуйте ще раз.");
      }
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp.trim()) {
      setPhoneError("Будь ласка, введіть код підтвердження");
      return;
    }

    const fullPhone = `${countryCode}${newPhone}`;

    try {
      setPhoneLoading(true);
      setPhoneError("");

      // Double-check if phone number is still available (in case another user claimed it)
      const { data: existingUser, error: checkError } = await supabase
        .from("userprofile")
        .select("user_id")
        .eq("phone_number", fullPhone)
        .neq("user_id", user?.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is "not found"
        console.error("Error checking phone number:", checkError);
        setPhoneError("Помилка перевірки номеру телефону");
        return;
      }

      if (existingUser) {
        setPhoneError(
          "Цей номер телефону вже використовується іншим користувачем"
        );
        return;
      }

      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: fullPhone,
          otp: phoneOtp,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Помилка перевірки коду");
      }

      // Update profile with new phone number
      if (profile) {
        const { error: updateError } = await supabase
          .from("userprofile")
          .update({ phone_number: fullPhone })
          .eq("id", profile.id);

        if (updateError) throw updateError;

        // Update local state
        setProfile((prev) =>
          prev ? { ...prev, phone_number: fullPhone } : null
        );
      }

      setPhoneSuccess(true);
      setTimeout(() => {
        setShowPhoneUpdate(false);
        setPhoneSuccess(false);
        setShowOtpInput(false);
        setNewPhone("");
        setPhoneOtp("");
        setPhoneError("");
      }, 2000);
    } catch (err) {
      console.error("Verify OTP error:", err);
      if (err instanceof Error) {
        setPhoneError(err.message);
      } else {
        setPhoneError("Помилка перевірки коду. Спробуйте ще раз.");
      }
    } finally {
      setPhoneLoading(false);
    }
  };

  const resetPhoneModal = () => {
    setShowPhoneUpdate(false);
    setPhoneSuccess(false);
    setShowOtpInput(false);
    setNewPhone("");
    setPhoneOtp("");
    setPhoneError("");
    setCountryCode("+41");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("uk-UA");
  };

  const getGenderLabel = (gender: string | null) => {
    switch (gender) {
      case "male":
        return "Чоловіча";
      case "female":
        return "Жіноча";
      case "other":
        return "Інша";
      default:
        return "";
    }
  };

  const getCountryName = (value: string | null) => {
    if (!value) return "";
    const country = COUNTRIES.find((c) => c.code === value);
    return country ? country.name : value;
  };

  const getCantonName = (value: string | null) => {
    if (!value) return "";
    const canton = CANTONS.find((c) => c.code === value);
    return canton ? canton.name : value;
  };

  const getSwissStatusName = (value: string | null) => {
    if (!value) return "";
    const status = SWISS_STATUSES.find((s) => s.code === value);
    return status ? status.name : value;
  };

  const showSwissFields = profile?.country_of_living === "switzerland";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {isProfileIncomplete && (
        <Alert className="mb-8 bg-gradient-to-r from-red-50 to-red-50/50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Увага!</strong> Ваш профіль не повністю заповнений.
            <Button
              variant="link"
              className="p-0 h-auto text-red-800 underline"
              onClick={() =>
                router.push(`/profile/edit/${profile?.id || "new"}`)
              }
            >
              Заповнити профіль
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Alert className="mb-8 bg-gradient-to-r from-cyan-50 to-cyan-50/50 border-cyan-200">
        <Shield className="h-4 w-4 text-cyan-600" />
        <AlertDescription className="text-cyan-800">
          Вся інформація є приватною та не буде передана третім особам
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Avatar and Basic Info */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-cyan-50 to-white border-cyan-100 shadow-sm">
            <CardContent className="pt-6">
              <AvatarUpload
                currentAvatarUrl={profile?.avatar_url}
                onAvatarUpdate={handleAvatarUpdate}
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-600" />
                Контактна інформація
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 border border-gray-100">
                <Mail className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium truncate">
                    {user?.email_confirmed_at ? (
                      profile?.email
                    ) : (
                      <span className="text-yellow-600 flex items-center gap-2">
                        <span className="truncate">{profile?.email}</span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Не підтверджено
                        </span>
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-gray-100">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <Phone className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">Телефон</p>
                    <p className="font-medium truncate">
                      {profile?.phone_number || "Не вказано"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowPhoneUpdate(true)}
                  className="text-cyan-600 hover:text-cyan-700 p-0 h-auto ml-4 flex-shrink-0"
                >
                  Змінити
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-gray-100">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <Lock className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">Пароль</p>
                    <p className="font-medium">••••••••</p>
                  </div>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => router.push("/reset-password")}
                  className="text-cyan-600 hover:text-cyan-700 p-0 h-auto ml-4 flex-shrink-0"
                >
                  Змінити
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Main Profile Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-600" />
                Особиста інформація
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/profile/edit/${profile?.id}`)}
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Редагувати
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Ім&apos;я та прізвище
                    </p>
                    <p className="font-medium">
                      {profile.name || "Не вказано"}
                    </p>
                  </div>

                  {profile.nickname && (
                    <div>
                      <p className="text-sm text-gray-500">Нікнейм</p>
                      <p className="font-medium">{profile.nickname}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500">Стать</p>
                    <p className="font-medium">
                      {getGenderLabel(profile.gender) || "Не вказано"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Дата народження</p>
                    <p className="font-medium">
                      {formatDate(profile.date_of_birth) || "Не вказано"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Національність</p>
                    <p className="font-medium">
                      {getCountryName(profile.nationality) || "Не вказано"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Країна проживання</p>
                    <p className="font-medium">
                      {getCountryName(profile.country_of_living) ||
                        "Не вказано"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Місто</p>
                    <p className="font-medium">
                      {profile.city || "Не вказано"}
                    </p>
                  </div>

                  {showSwissFields && profile.canton && (
                    <div>
                      <p className="text-sm text-gray-500">Кантон</p>
                      <p className="font-medium">
                        {getCantonName(profile.canton)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {showSwissFields &&
                (profile.zip_code || profile.swiss_status) && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profile.zip_code && (
                        <div>
                          <p className="text-sm text-gray-500">
                            Поштовий індекс
                          </p>
                          <p className="font-medium">{profile.zip_code}</p>
                        </div>
                      )}

                      {profile.swiss_status && (
                        <div>
                          <p className="text-sm text-gray-500">
                            Статус у Швейцарії
                          </p>
                          <p className="font-medium">
                            {getSwissStatusName(profile.swiss_status)}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
            </CardContent>
          </Card>

          {/* Action Buttons - Only show if profile is complete */}
          {!isProfileIncomplete && (
            <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-600" />
                  Дії
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Find Friends Button - Only for Swiss residents */}
                  {profile?.country_of_living === "switzerland" && (
                    <Button
                      onClick={() => {
                        // Check if user has Swiss phone number
                        if (profile?.phone_number?.startsWith("+41")) {
                          router.push("/community");
                        } else {
                          setShowSwissPhoneModal(true);
                        }
                      }}
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                    >
                      Знайти друзів
                    </Button>
                  )}

                  {/* Service Provider Button */}
                  <Button
                    onClick={() => router.push("/services")}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    Я хочу надавати послуги
                  </Button>

                  {/* Carrier Button */}
                  <Button
                    onClick={() => router.push("/carriers")}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                  >
                    Я перевізник
                  </Button>

                  {/* Organization Button */}
                  <Button
                    onClick={() => router.push("/organizations")}
                    className="w-full h-12 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
                  >
                    Я організація
                  </Button>

                  {/* Business Button */}
                  <Button
                    onClick={() => router.push("/business")}
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
                  >
                    Я Бізнес
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Phone Update Modal */}
      <Dialog open={showPhoneUpdate} onOpenChange={setShowPhoneUpdate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Оновлення номеру телефону</DialogTitle>
          </DialogHeader>

          {phoneSuccess ? (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Номер телефону успішно оновлено!
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="space-y-4">
              {!showOtpInput ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="countryCode">Код країни</Label>
                      <Select
                        value={countryCode}
                        onValueChange={setCountryCode}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getSortedCountries().map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.flag} {country.name} ({country.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="newPhone">Номер телефону</Label>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-md border">
                          {countryCode}
                        </div>
                        <Input
                          id="newPhone"
                          type="tel"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          placeholder="789 123 456"
                          required
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Введіть номер без коду країни (наприклад: 789 123 456)
                      </p>
                    </div>

                    {phoneError && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertDescription className="text-red-800">
                          {phoneError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={handleSendPhoneOtp}
                        disabled={phoneLoading}
                        className="flex-1"
                      >
                        {phoneLoading ? "Відправка..." : "Відправити код"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetPhoneModal}
                        disabled={phoneLoading}
                      >
                        Скасувати
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phoneOtp">Код підтвердження</Label>
                      <Input
                        id="phoneOtp"
                        type="text"
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value)}
                        placeholder="Введіть код з SMS"
                        maxLength={6}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Код відправлено на номер{" "}
                        <span className="font-medium">
                          {countryCode}
                          {newPhone}
                        </span>
                      </p>
                    </div>

                    {phoneError && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertDescription className="text-red-800">
                          {phoneError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={handleVerifyPhoneOtp}
                        disabled={phoneLoading}
                        className="flex-1"
                      >
                        {phoneLoading ? "Перевірка..." : "Підтвердити"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowOtpInput(false)}
                        disabled={phoneLoading}
                      >
                        Назад
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Swiss Phone Modal */}
      <Dialog open={showSwissPhoneModal} onOpenChange={setShowSwissPhoneModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Швейцарський номер телефону потрібен
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                Для участі в онлайн-спільноті, створення офлайн-подій та
                знаходження друзів, вам потрібно проживати в Швейцарії та мати
                швейцарський номер телефону (+41).
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Будь ласка, оновіть ваш номер телефону на швейцарський номер
                (+41) у розділі &quot;Контактна інформація&quot; вище.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowSwissPhoneModal(false);
                  setShowPhoneUpdate(true);
                }}
                className="flex-1"
              >
                Оновити номер телефону
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSwissPhoneModal(false)}
              >
                Скасувати
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
