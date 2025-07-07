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
  MapPin,
  User,
  Calendar,
  Flag,
  Pencil,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES, CANTONS, SWISS_STATUSES } from "@/app/utils/constants";
import { AvatarUpload } from "@/app/components/AvatarUpload";
import { Separator } from "@/components/ui/separator";

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
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [nicknameError, setNicknameError] = useState("");
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

          // Check if user has phone number in profile database
          if (!profileData.phone_number) {
            // Redirect to phone verification page
            window.location.href = "/phone-verification";
            return;
          }

          // Check if profile is incomplete (new user)
          const isIncomplete =
            !profileData.gender ||
            !profileData.date_of_birth ||
            !profileData.nationality ||
            !profileData.country_of_living ||
            !profileData.city;

          if (isIncomplete) {
            // For new users, show the profile page but in edit mode
            setIsEditing(true);
            setIsProfileIncomplete(true);
          }
        } else {
          // If no profile exists, create a new one with data from signup
          const newProfile: Omit<UserProfile, "id"> = {
            user_id: freshUser?.id,
            name: `${freshUser?.user_metadata?.first_name || ""} ${
              freshUser?.user_metadata?.last_name || ""
            }`.trim(),
            email: freshUser?.email || "",
            phone_number: freshUser?.user_metadata?.phone || "",
            nickname: null,
            gender: null,
            date_of_birth: null,
            nationality: null,
            country_of_living: null,
            city: null,
            canton: null,
            zip_code: null,
            swiss_status: null,
            avatar_url: null,
          };

          const { data: insertedData, error: insertError } = await supabase
            .from("userprofile")
            .insert([newProfile])
            .select()
            .single();

          if (insertError) throw insertError;
          setProfile(insertedData);

          // Check if user has phone number in profile database
          if (!insertedData.phone_number) {
            // Redirect to phone verification page
            window.location.href = "/phone-verification";
            return;
          }

          // For new users, show the profile page but in edit mode
          setIsEditing(true);
          setIsProfileIncomplete(true);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError("");
    setNicknameError("");

    try {
      // Check if nickname is unique if it's provided
      if (profile.nickname) {
        const { data: existingNickname } = await supabase
          .from("userprofile")
          .select("id")
          .eq("nickname", profile.nickname)
          .neq("id", profile.id)
          .single();

        if (existingNickname) {
          setNicknameError(
            "Цей нікнейм вже використовується. Будь ласка, виберіть інший."
          );
          setSaving(false);
          return;
        }
      }

      const { id, ...profileWithoutId } = profile;

      const { error } = await supabase
        .from("userprofile")
        .update(profileWithoutId)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Check if profile is now complete
      const updatedProfile = { ...profile, ...profileWithoutId };
      const isComplete =
        updatedProfile.gender &&
        updatedProfile.date_of_birth &&
        updatedProfile.nationality &&
        updatedProfile.country_of_living &&
        updatedProfile.city;

      setIsProfileIncomplete(!isComplete);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

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
      setError("Failed to update avatar");
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

  const showSwissFields = profile?.country_of_living === "switzerland";
  const showResidenceFields = profile?.nationality !== "switzerland";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {isProfileIncomplete && (
        <Alert className="mb-8 bg-gradient-to-r from-red-50 to-red-50/50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Увага!</strong> Для продовження використання додатку
            потрібно заповнити ваш профіль. Будь ласка, заповніть всі
            обов&apos;язкові поля нижче.
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
                  <p className="font-medium">{profile?.phone_number}</p>
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
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Ім&apos;я та прізвище *</Label>
                      <Input
                        id="name"
                        value={profile?.name || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev!,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="nickname">Нікнейм</Label>
                      <Input
                        id="nickname"
                        value={profile?.nickname || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev!,
                            nickname: e.target.value,
                          }))
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Ми будемо використовувати нікнейм замість вашого
                        справжнього імені, якщо ви не хочете показувати його
                        публічно
                      </p>
                      {nicknameError && (
                        <p className="text-sm text-red-500 mt-1">
                          {nicknameError}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="gender">Стать *</Label>
                      <Select
                        value={profile?.gender || ""}
                        onValueChange={(value) =>
                          setProfile((prev) => ({ ...prev!, gender: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Виберіть стать" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Чоловіча</SelectItem>
                          <SelectItem value="female">Жіноча</SelectItem>
                          <SelectItem value="other">Інша</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="date_of_birth">Дата народження *</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={profile?.date_of_birth?.split("T")[0] || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev!,
                            date_of_birth: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nationality">Національність *</Label>
                      <Select
                        value={profile?.nationality || ""}
                        onValueChange={(value) =>
                          setProfile((prev) => ({
                            ...prev!,
                            nationality: value,
                            country_of_living:
                              value === "switzerland"
                                ? "switzerland"
                                : prev?.country_of_living,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Виберіть національність" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem
                              key={country.value}
                              value={country.value}
                            >
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {showResidenceFields && (
                      <div>
                        <Label htmlFor="country_of_living">
                          Країна проживання *
                        </Label>
                        <Select
                          value={profile?.country_of_living || ""}
                          onValueChange={(value) =>
                            setProfile((prev) => ({
                              ...prev!,
                              country_of_living: value,
                              canton:
                                value === "switzerland" ? prev?.canton : null,
                              swiss_status:
                                value === "switzerland"
                                  ? prev?.swiss_status
                                  : null,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Виберіть країну проживання" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {showSwissFields && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="city">Місто *</Label>
                          <Input
                            id="city"
                            value={profile?.city || ""}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev!,
                                city: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="canton">Кантон</Label>
                          <Select
                            value={profile?.canton || ""}
                            onValueChange={(value) =>
                              setProfile((prev) => ({
                                ...prev!,
                                canton: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Виберіть кантон" />
                            </SelectTrigger>
                            <SelectContent>
                              {CANTONS.map((canton) => (
                                <SelectItem
                                  key={canton.value}
                                  value={canton.value}
                                >
                                  {canton.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="zip_code">Поштовий індекс</Label>
                          <Input
                            id="zip_code"
                            value={profile?.zip_code || ""}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev!,
                                zip_code: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="swiss_status">
                            Статус в Швейцарії
                          </Label>
                          <Select
                            value={profile?.swiss_status || ""}
                            onValueChange={(value) =>
                              setProfile((prev) => ({
                                ...prev!,
                                swiss_status: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Виберіть статус" />
                            </SelectTrigger>
                            <SelectContent>
                              {SWISS_STATUSES.map((status) => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                >
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Скасувати
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? "Збереження..." : "Зберегти"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 border border-gray-100">
                        <User className="w-5 h-5 text-cyan-600" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Ім&apos;я та прізвище
                          </p>
                          <p className="font-medium">{profile?.name}</p>
                        </div>
                      </div>

                      {profile?.nickname && (
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 border border-gray-100">
                          <User className="w-5 h-5 text-cyan-600" />
                          <div>
                            <p className="text-sm text-gray-500">Нікнейм</p>
                            <p className="font-medium">{profile.nickname}</p>
                          </div>
                        </div>
                      )}

                      {profile?.gender && (
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 border border-gray-100">
                          <User className="w-5 h-5 text-cyan-600" />
                          <div>
                            <p className="text-sm text-gray-500">Стать</p>
                            <p className="font-medium">
                              {getGenderLabel(profile.gender)}
                            </p>
                          </div>
                        </div>
                      )}

                      {profile?.date_of_birth && (
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 border border-gray-100">
                          <Calendar className="w-5 h-5 text-cyan-600" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Дата народження
                            </p>
                            <p className="font-medium">
                              {formatDate(profile.date_of_birth)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 border border-gray-100">
                        <Flag className="w-5 h-5 text-cyan-600" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Національність
                          </p>
                          <p className="font-medium">
                            {COUNTRIES.find(
                              (c) => c.value === profile?.nationality
                            )?.label || ""}
                          </p>
                        </div>
                      </div>

                      {showResidenceFields && (
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 border border-gray-100">
                          <MapPin className="w-5 h-5 text-cyan-600" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Країна проживання
                            </p>
                            <p className="font-medium">
                              {COUNTRIES.find(
                                (c) => c.value === profile?.country_of_living
                              )?.label || ""}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {showSwissFields && (
                    <>
                      <Separator className="my-6" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {profile?.city && (
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 border border-gray-100">
                              <MapPin className="w-5 h-5 text-cyan-600" />
                              <div>
                                <p className="text-sm text-gray-500">Місто</p>
                                <p className="font-medium">{profile.city}</p>
                              </div>
                            </div>
                          )}

                          {profile?.canton && (
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 border border-gray-100">
                              <MapPin className="w-5 h-5 text-cyan-600" />
                              <div>
                                <p className="text-sm text-gray-500">Кантон</p>
                                <p className="font-medium">
                                  {CANTONS.find(
                                    (c) => c.value === profile.canton
                                  )?.label || ""}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          {profile?.zip_code && (
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 border border-gray-100">
                              <MapPin className="w-5 h-5 text-cyan-600" />
                              <div>
                                <p className="text-sm text-gray-500">
                                  Поштовий індекс
                                </p>
                                <p className="font-medium">
                                  {profile.zip_code}
                                </p>
                              </div>
                            </div>
                          )}

                          {profile?.swiss_status && (
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 border border-gray-100">
                              <Flag className="w-5 h-5 text-cyan-600" />
                              <div>
                                <p className="text-sm text-gray-500">
                                  Статус в Швейцарії
                                </p>
                                <p className="font-medium">
                                  {SWISS_STATUSES.find(
                                    (s) => s.value === profile.swiss_status
                                  )?.label || ""}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button
                          className="w-full bg-linear-to-r/oklab from-indigo-700  to-cyan-500 text-white hover:from-indigo-700 hover:via-indigo-600 hover:to-teal-500 transition-all duration-200 shadow-md"
                          onClick={() => router.push("/community")}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Доєднатися до спільноти
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
