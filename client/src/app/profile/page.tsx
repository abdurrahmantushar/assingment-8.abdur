"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, UserRound, Mail, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const user = session?.user;
  const role = (user as typeof user & { role?: string } | null)?.role;

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/auth/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!selectedImage) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(selectedImage);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [selectedImage]);

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select a profile photo");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(selectedImage.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed");
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

        console.log("JWT Token:", tokenData?.token);
        console.log("Token Error:", tokenError);

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication token not found");
      }

      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch(`${API_URL}/api/profile/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image upload failed");
      }

      const { error } = await authClient.updateUser({
        image: data.image,
      });

      if (error) {
        throw new Error(error.message || "Failed to update profile photo");
      }

      setSelectedImage(null);
      toast.success("Profile photo updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setUploading(false);
    }
  };

  if (isPending || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8faf6] dark:bg-[#0d160f]">
        <Loader2 size={32} className="animate-spin text-green-700" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faf6] px-5 py-12 dark:bg-[#0d160f] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            View your account information and manage your profile photo.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#172117]">
          <div className="bg-[#f0f7ed] px-6 py-10 text-center dark:bg-[#142319]">
            <div className="relative mx-auto mb-4 h-32 w-32">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-green-100 shadow-md dark:border-[#172117] dark:bg-green-950">
                {preview || user.image ? (
                  <img
                    src={preview || user.image || ""}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={55} className="text-green-700 dark:text-green-400" />
                )}
              </div>

              <label
                htmlFor="profile-image"
                className="absolute bottom-1 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-green-700 text-white shadow-md transition hover:bg-green-800 dark:border-[#172117]"
              >
                <Camera size={17} />
              </label>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700 dark:bg-green-950/50 dark:text-green-400">
              <ShieldCheck size={14} />
              {role || "User"}
            </span>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Account Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 dark:border-white/10">
                  <div className="rounded-lg bg-green-50 p-2.5 text-green-700 dark:bg-green-950/40 dark:text-green-400">
                    <UserRound size={19} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Full Name
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 dark:border-white/10">
                  <div className="rounded-lg bg-green-50 p-2.5 text-green-700 dark:bg-green-950/40 dark:text-green-400">
                    <Mail size={19} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Email Address
                    </p>
                    <p className="mt-1 break-all text-sm font-semibold text-gray-900 dark:text-white">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 dark:border-white/10">
              <label className="mb-3 block text-sm font-semibold text-gray-800 dark:text-gray-200">
                Add Profile Photo
              </label>

              <input
                id="profile-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  setSelectedImage(e.target.files?.[0] || null)
                }
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-green-700 dark:border-white/10 dark:bg-[#0d160f] dark:text-gray-300 dark:file:bg-green-950/40 dark:file:text-green-400"
              />

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                JPG, PNG or WEBP. Maximum file size 5MB.
              </p>

              {selectedImage && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading && (
                    <Loader2 size={17} className="animate-spin" />
                  )}
                  {uploading ? "Uploading..." : "Upload Profile Photo"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}