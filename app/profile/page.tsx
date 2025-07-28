"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Mail, Phone, User, Pencil, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AvatarUpload } from "@/app/components/AvatarUpload";
import { Separator } from "@/components/ui/separator";
import { COUNTRIES, CANTONS, SWISS_STATUSES } from "@/app/utils/constants";

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

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 border border-gray-100">
                <Phone className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="text-sm text-gray-500">Телефон</p>
                  <p className="font-medium">
                    {profile?.phone_number || "Не вказано"}
                  </p>
                </div>
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
        </div>
      </div>
    </div>
  );
}
