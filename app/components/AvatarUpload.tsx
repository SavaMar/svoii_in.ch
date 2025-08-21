"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  onAvatarUpdate: (url: string) => void;
}

export function AvatarUpload({
  currentAvatarUrl,
  onAvatarUpdate,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClientComponentClient();

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement("img");
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            0.7
          );
        };
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError("");
      const file = e.target.files?.[0];
      if (!file) return;

      console.log("File selected:", file.name);

      // Check file size (50MB = 50 * 1024 * 1024 bytes)
      if (file.size > 50 * 1024 * 1024) {
        setError("Файл занадто великий. Максимальний розмір - 50MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Будь ласка, виберіть зображення");
        return;
      }

      setUploading(true);

      // Get current user and session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error("Користувач не авторизований");
      }

      const user = session.user;
      if (!user) {
        throw new Error("Користувач не авторизований");
      }

      console.log("User authenticated:", user.email);

      // Compress image before upload
      const compressedFile = await compressImage(file);
      console.log("Original size:", file.size / 1024 / 1024, "MB");
      console.log("Compressed size:", compressedFile.size / 1024 / 1024, "MB");

      // Generate file name using user's email
      const fileExt = "jpg"; // Always use jpg after compression
      const emailPrefix = user.email?.split("@")[0] || "user";
      const fileName = `private/avatar_${emailPrefix}.${fileExt}`;

      console.log("Uploading to path:", fileName);

      // Delete old avatar if exists
      if (currentAvatarUrl) {
        const oldFileName = currentAvatarUrl.split("/").pop();
        if (oldFileName) {
          console.log("Deleting old avatar:", oldFileName);
          await supabase.storage
            .from("avatars")
            .remove([`private/${oldFileName}`]);
        }
      }

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, compressedFile, {
          cacheControl: "3600",
          upsert: true, // Allow overwriting existing file
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(uploadError.message);
      }

      console.log("Upload successful");

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      console.log("Public URL:", publicUrl);

      if (!publicUrl) {
        throw new Error("Failed to get public URL");
      }

      // Add timestamp to URL to prevent caching
      const urlWithTimestamp = `${publicUrl}?t=${Date.now()}`;
      console.log("URL with timestamp:", urlWithTimestamp);

      onAvatarUpdate(urlWithTimestamp);
    } catch (err) {
      console.error("Error uploading avatar:", err);
      setError(
        err instanceof Error ? err.message : "Помилка завантаження аватара"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
        {currentAvatarUrl ? (
          <Image
            src={currentAvatarUrl}
            alt="Avatar"
            fill
            className="object-cover"
            unoptimized
            sizes="128px"
            priority
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center space-y-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <Button
          className="bg-linear-to-r/oklab from-indigo-700  to-blue-500"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Завантаження...
            </>
          ) : (
            "Змінити фото"
          )}
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
