"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";
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

interface EditProfileClientProps {
  id: string;
}

export function EditProfileClient({ id }: EditProfileClientProps) {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    async function loadProfile() {
      try {
        if (id === "new") {
          // First check if user already has a profile with phone number
          const { data: existingProfile, error: profileError } = await supabase
            .from("userprofile")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (profileError && profileError.code !== "PGRST116") {
            // PGRST116 is "not found"
            throw profileError;
          }

          if (existingProfile) {
            // User already has a profile, use it
            console.log("Found existing profile:", existingProfile);
            console.log("Phone number in profile:", existingProfile.phone_number);
            setProfile(existingProfile);
            setIsNewUser(false);
          } else {
            // Create a new profile for the current user
            const newProfile: Omit<UserProfile, "id"> = {
              user_id: user?.id,
              name: `${user?.user_metadata?.first_name || ""} ${
                user?.user_metadata?.last_name || ""
              }`.trim(),
              email: user?.email || "",
              phone_number: "", // Will be filled from userprofile if exists
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
            setIsNewUser(true);
          }
        } else {
          // Load existing profile
          const { data, error } = await supabase
            .from("userprofile")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;
          setProfile(data);

          // Check if this is a new user (incomplete profile)
          const isIncomplete =
            !data.gender ||
            !data.date_of_birth ||
            !data.nationality ||
            !data.country_of_living ||
            !data.city;
          setIsNewUser(isIncomplete);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, id, supabase, router]);

  const validateDateOfBirth = (dateString: string) => {
    if (!dateString) return "";

    const selectedDate = new Date(dateString);
    const today = new Date();
    const minAge = 14;
    const maxDate = new Date(
      today.getFullYear() - minAge,
      today.getMonth(),
      today.getDate()
    );

    if (selectedDate > maxDate) {
      return `Вам повинно бути щонайменше ${minAge} років для використання цього сервісу`;
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    // Clear previous errors
    setError("");
    setDateError("");

    // Validate date of birth
    if (profile.date_of_birth) {
      const dateValidationError = validateDateOfBirth(profile.date_of_birth);
      if (dateValidationError) {
        setDateError(dateValidationError);
        return;
      }
    }

    // Validate required fields for new users
    if (isNewUser) {
      if (
        !profile.gender ||
        !profile.date_of_birth ||
        !profile.nationality ||
        !profile.country_of_living ||
        !profile.city
      ) {
        setError("Будь ласка, заповніть всі обов'язкові поля (позначені *)");
        return;
      }
    }

    setSaving(true);
    setError("");

    try {
      // Only include the fields we want to update
      const updateData = {
        name: profile.name,
        nickname: profile.nickname,
        gender: profile.gender,
        date_of_birth: profile.date_of_birth,
        nationality: profile.nationality,
        country_of_living: profile.country_of_living,
        city: profile.city,
        canton: profile.canton,
        zip_code: profile.zip_code,
        swiss_status: profile.swiss_status,
        user_id: user?.id,
      };

      console.log("Updating profile with data:", updateData);

      const { error } = await supabase
        .from("userprofile")
        .update(updateData)
        .eq("id", profile.id);

      if (error) throw error;

      // Redirect to the profile page
      router.push(`/profile`);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {isNewUser && (
        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Будь ласка, заповніть ваш профіль для повного доступу до спільноти
          </AlertDescription>
        </Alert>
      )}

      <Alert className="mb-8 bg-green-50 border-green-200">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Вся інформація є приватною та не буде передана третім особам
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Ім&apos;я та прізвище *</Label>
            <Input
              id="name"
              value={profile.name || ""}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev!, name: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile.email || ""}
              disabled
              className="bg-gray-50"
            />
            {!user?.email_confirmed_at && (
              <p className="text-sm text-yellow-600 mt-1">
                Email не підтверджено
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Номер телефону</Label>
            <Input
              id="phone"
              value={profile.phone_number || ""}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <Label htmlFor="nickname">Нікнейм</Label>
            <Input
              id="nickname"
              value={profile.nickname || ""}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev!, nickname: e.target.value }))
              }
            />
            <p className="text-sm text-gray-500 mt-1">
              Опціонально. Використовується для відображення в спільноті
            </p>
          </div>

          <div>
            <Label htmlFor="gender">Стать *</Label>
            <Select
              value={profile.gender || ""}
              onValueChange={(value) =>
                setProfile((prev) => ({ ...prev!, gender: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Оберіть стать" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="male" value="male">
                  Чоловіча
                </SelectItem>
                <SelectItem key="female" value="female">
                  Жіноча
                </SelectItem>
                <SelectItem key="other" value="other">
                  Інша
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date_of_birth">Дата народження *</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={profile.date_of_birth || ""}
              onChange={(e) => {
                const newDate = e.target.value;
                setProfile((prev) => ({
                  ...prev!,
                  date_of_birth: newDate,
                }));
                // Clear date error when user changes the date
                if (dateError) {
                  setDateError("");
                }
              }}
              required
              max={(() => {
                const today = new Date();
                const minAge = 14;
                const maxDate = new Date(
                  today.getFullYear() - minAge,
                  today.getMonth(),
                  today.getDate()
                );
                return maxDate.toISOString().split("T")[0];
              })()}
            />
            {dateError && (
              <p className="text-sm text-red-600 mt-1">{dateError}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Вам повинно бути щонайменше 14 років
            </p>
          </div>

          <div>
            <Label htmlFor="nationality">Національність *</Label>
            <Select
              value={profile.nationality || ""}
              onValueChange={(value) =>
                setProfile((prev) => ({
                  ...prev!,
                  nationality: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue>
                  {profile.nationality
                    ? COUNTRIES.find((c) => c.code === profile.nationality)
                        ?.name || profile.nationality
                    : "Оберіть національність"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="country_of_living">Країна проживання *</Label>
            <Select
              value={profile.country_of_living || ""}
              onValueChange={(value) =>
                setProfile((prev) => ({
                  ...prev!,
                  country_of_living: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue>
                  {profile.country_of_living
                    ? COUNTRIES.find(
                        (c) => c.code === profile.country_of_living
                      )?.name || profile.country_of_living
                    : "Оберіть країну проживання"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="city">Місто *</Label>
            <Input
              id="city"
              value={profile.city || ""}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev!, city: e.target.value }))
              }
              required
            />
            {profile.country_of_living &&
              profile.country_of_living !== "ukraine" && (
                <p className="text-sm text-blue-600 mt-1">
                  Будь ласка, введіть назву міста латинськими літерами
                </p>
              )}
          </div>

          {profile.country_of_living === "switzerland" && (
            <>
              <div>
                <Label htmlFor="canton">Кантон</Label>
                <Select
                  value={profile.canton || ""}
                  onValueChange={(value) =>
                    setProfile((prev) => ({ ...prev!, canton: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue>
                      {profile.canton
                        ? CANTONS.find((c) => c.code === profile.canton)
                            ?.name || profile.canton
                        : "Оберіть кантон"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CANTONS.map((canton) => (
                      <SelectItem key={canton.code} value={canton.code}>
                        {canton.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="zip_code">Поштовий індекс</Label>
                <Input
                  id="zip_code"
                  value={profile.zip_code || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev!,
                      zip_code: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="swiss_status">Статус в Швейцарії</Label>
                <Select
                  value={profile.swiss_status || ""}
                  onValueChange={(value) =>
                    setProfile((prev) => ({ ...prev!, swiss_status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue>
                      {profile.swiss_status
                        ? SWISS_STATUSES.find(
                            (s) => s.code === profile.swiss_status
                          )?.name || profile.swiss_status
                        : "Оберіть статус"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SWISS_STATUSES.map((status) => (
                      <SelectItem key={status.code} value={status.code}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? "Збереження..." : "Зберегти"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/profile")}
            className="flex-1"
          >
            Скасувати
          </Button>
        </div>
      </form>
    </div>
  );
}
