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

export default function EditProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from("userprofile")
          .select("*")
          .eq("id", params.id)
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
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, params.id, supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

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
            <Label htmlFor="name">Ім&apos;я та прізвище</Label>
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
          </div>

          <div>
            <Label htmlFor="gender">
              Стать {isNewUser && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={profile.gender || ""}
              onValueChange={(value) =>
                setProfile((prev) => ({ ...prev!, gender: value }))
              }
              required={isNewUser}
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
            <Label htmlFor="date_of_birth">
              Дата народження{" "}
              {isNewUser && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="date_of_birth"
              type="date"
              value={profile.date_of_birth?.split("T")[0] || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev!,
                  date_of_birth: e.target.value,
                }))
              }
              required={isNewUser}
            />
          </div>

          <div>
            <Label htmlFor="nationality">
              Національність{" "}
              {isNewUser && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="nationality"
              value={profile.nationality || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev!,
                  nationality: e.target.value,
                }))
              }
              required={isNewUser}
            />
          </div>

          <div>
            <Label htmlFor="country_of_living">
              Країна проживання{" "}
              {isNewUser && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="country_of_living"
              value={profile.country_of_living || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev!,
                  country_of_living: e.target.value,
                }))
              }
              required={isNewUser}
            />
          </div>

          <div>
            <Label htmlFor="city">
              Місто {isNewUser && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="city"
              value={profile.city || ""}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev!, city: e.target.value }))
              }
              required={isNewUser}
            />
          </div>

          <div>
            <Label htmlFor="canton">Кантон</Label>
            <Input
              id="canton"
              value={profile.canton || ""}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev!, canton: e.target.value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="zip_code">Поштовий індекс</Label>
            <Input
              id="zip_code"
              value={profile.zip_code || ""}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev!, zip_code: e.target.value }))
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
                <SelectValue placeholder="Виберіть статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="citizen">Громадянин</SelectItem>
                <SelectItem value="permanent">Постійний резидент</SelectItem>
                <SelectItem value="temporary">Тимчасовий резидент</SelectItem>
                <SelectItem value="other">Інший</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end space-x-4">
          {!isNewUser && (
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/profile`)}
            >
              Скасувати
            </Button>
          )}
          <Button type="submit" disabled={saving}>
            {saving
              ? "Збереження..."
              : isNewUser
              ? "Завершити профіль"
              : "Зберегти"}
          </Button>
        </div>
      </form>
    </div>
  );
}
