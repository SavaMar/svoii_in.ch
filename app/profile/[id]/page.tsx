"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { use } from "react";

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

export default function ProfileViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          .eq("id", resolvedParams.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, resolvedParams.id, supabase, router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>Profile not found</div>;

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

  const getSwissStatusLabel = (status: string | null) => {
    switch (status) {
      case "citizen":
        return "Резидент";
      case "permanent":
        return "Постійний резидент";
      case "temporary":
        return "Тимчасовий резидент";
      case "other":
        return "Інший";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Alert className="mb-8 bg-green-50 border-green-200">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Вся інформація є приватною та не буде передана третім особам
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Профіль користувача</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-500">
                Основна інформація
              </h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Ім&apos;я та прізвище:</span>{" "}
                  {profile.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {user?.email_confirmed_at ? (
                    profile.email
                  ) : (
                    <span className="text-yellow-600">
                      Email не підтверджено. Будь ласка, перевірте вашу пошту
                      для підтвердження.
                    </span>
                  )}
                </p>
                <p>
                  <span className="font-medium">Телефон:</span>{" "}
                  {profile.phone_number}
                </p>
                {profile.nickname && (
                  <p>
                    <span className="font-medium">Нікнейм:</span>{" "}
                    {profile.nickname}
                  </p>
                )}
                {profile.gender && (
                  <p>
                    <span className="font-medium">Стать:</span>{" "}
                    {getGenderLabel(profile.gender)}
                  </p>
                )}
                {profile.date_of_birth && (
                  <p>
                    <span className="font-medium">Дата народження:</span>{" "}
                    {formatDate(profile.date_of_birth)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-500">Місце проживання</h3>
              <div className="mt-2 space-y-2">
                {profile.nationality && (
                  <p>
                    <span className="font-medium">Національність:</span>{" "}
                    {profile.nationality}
                  </p>
                )}
                {profile.country_of_living && (
                  <p>
                    <span className="font-medium">Країна проживання:</span>{" "}
                    {profile.country_of_living}
                  </p>
                )}
                {profile.city && (
                  <p>
                    <span className="font-medium">Місто:</span> {profile.city}
                  </p>
                )}
                {profile.canton && (
                  <p>
                    <span className="font-medium">Кантон:</span>{" "}
                    {profile.canton}
                  </p>
                )}
                {profile.zip_code && (
                  <p>
                    <span className="font-medium">Поштовий індекс:</span>{" "}
                    {profile.zip_code}
                  </p>
                )}
                {profile.swiss_status && (
                  <p>
                    <span className="font-medium">Статус в Швейцарії:</span>{" "}
                    {getSwissStatusLabel(profile.swiss_status)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/profile/edit/${profile.id}`)}
            >
              Редагувати
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
