
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Loader2,
  UserRound,
  Mail,
  ShieldCheck,
  Pencil,
  Check,
  ImagePlus,
  Sparkles,
  User,
  ArrowLeft,
} from "lucide-react";
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
  const [name, setName] = useState("");
  const [updatingName, setUpdatingName] = useState(false);

  const user = session?.user;
  const role = (user as typeof user & { role?: string } | null)?.role;

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/auth/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  useEffect(() => {
    if (!selectedImage) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(selectedImage);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [selectedImage]);

  const handleNameUpdate = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Name cannot be empty");
      return;
    }

    if (trimmedName === user?.name) {
      toast.error("No changes detected");
      return;
    }

    try {
      setUpdatingName(true);

      const { error } = await authClient.updateUser({
        name: trimmedName,
      });

      if (error) {
        throw new Error(error.message || "Failed to update name");
      }

      toast.success("Name updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setUpdatingName(false);
    }
  };

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
    <main className="min-h-screen bg-[#f8faf6] px-4 py-10 dark:bg-[#0d160f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        <button
          onClick={() => router.back()}
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700 dark:text-gray-400 dark:hover:text-green-400"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400">
            <Sparkles size={16} />
            ACCOUNT SETTINGS
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
            Manage your personal information and customize your profile.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.5fr]">

          <div className="h-fit overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#172117]">

            <div className="relative h-28 bg-gradient-to-br from-green-600 via-green-700 to-emerald-900">
              <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full border-[25px] border-white/10" />
              <div className="absolute -bottom-14 -left-8 h-32 w-32 rounded-full border-[20px] border-white/10" />
            </div>

            <div className="relative px-6 pb-7 text-center">

              <div className="relative mx-auto -mt-14 mb-4 h-28 w-28">

                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-green-100 shadow-lg dark:border-[#172117] dark:bg-green-950">
                  {preview || user.image ? (
                    <img
                      src={preview || user.image || ""}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={48} className="text-green-700 dark:text-green-400" />
                  )}
                </div>

                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-[3px] border-white bg-green-700 text-white shadow-md transition hover:scale-105 hover:bg-green-800 dark:border-[#172117]"
                >
                  <Camera size={15} />
                </label>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>

              <div className="mt-4 flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-bold capitalize text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-400">
                  <ShieldCheck size={14} />
                  {role || "User"}
                </span>
              </div>

              <div className="mt-7 border-t border-gray-100 pt-5 text-left dark:border-white/10">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Profile Overview
                </p>

                <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3 dark:bg-[#0d160f]">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2 text-green-700 dark:bg-green-950/60 dark:text-green-400">
                      <User size={17} />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Account Type
                    </span>
                  </div>

                  <span className="text-sm font-bold capitalize text-gray-900 dark:text-white">
                    {role || "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#172117] sm:p-8">

              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-green-100 p-3 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                  <Pencil size={20} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Update your personal details.
                  </p>
                </div>
              </div>

              <div className="space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      maxLength={100}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition placeholder:font-normal placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-600/10 dark:border-white/10 dark:bg-[#0d160f] dark:text-white dark:focus:bg-[#111b12]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="h-12 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 pl-11 pr-4 text-sm text-gray-500 outline-none dark:border-white/10 dark:bg-black/20 dark:text-gray-400"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Email address cannot be changed here.
                  </p>
                </div>

                <button
                  onClick={handleNameUpdate}
                  disabled={updatingName || !name.trim() || name.trim() === user.name}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {updatingName ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Check size={17} />
                  )}

                  {updatingName ? "Saving Changes..." : "Save Changes"}
                </button>

              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#172117] sm:p-8">

              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-green-100 p-3 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                  <Camera size={20} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Profile Picture
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Change your profile photo.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-[#0d160f]">

                <div className="flex flex-col items-center text-center">

                  <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400">
                    {preview || user.image ? (
                      <img
                        src={preview || user.image || ""}
                        alt="Selected profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImagePlus size={28} />
                    )}
                  </div>

                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {selectedImage ? selectedImage.name : "Choose a new profile photo"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    JPG, PNG or WEBP · Maximum 5MB
                  </p>

                  <label
                    htmlFor="profile-image"
                    className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700 dark:border-white/10 dark:bg-[#172117] dark:text-gray-300 dark:hover:text-green-400"
                  >
                    <Camera size={16} />
                    Browse Photo
                  </label>

                  <input
                    id="profile-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) =>
                      setSelectedImage(e.target.files?.[0] || null)
                    }
                    className="hidden"
                  />

                </div>
              </div>

              {selectedImage && (
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 px-5 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploading ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Check size={17} />
                    )}
                    {uploading ? "Uploading..." : "Upload Photo"}
                  </button>

                  <button
                    onClick={() => setSelectedImage(null)}
                    disabled={uploading}
                    className="h-11 rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>

                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
