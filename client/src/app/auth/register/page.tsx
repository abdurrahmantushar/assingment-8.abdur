"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  Leaf,
  LockKeyhole,
  Mail,
  UserRound,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name) {
      toast.error("Please enter your full name.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        name,
        email,
        password: formData.password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Unable to create your account.");
        return;
      }

      toast.success("Account created successfully!");

      router.replace("/auth/login");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-[#f9fbf8] py-3.5 pl-11 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-600/10 dark:border-white/10 dark:bg-[#17251a] dark:text-white dark:focus:bg-[#1b2b1f]";

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  if (isPending || session?.user) {
    return (
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f5f8f2] dark:bg-[#0b150e]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent" />
      </main>
    );
  }
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f5f8f2] px-4 py-10 dark:bg-[#0b150e] sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-green-950/5 dark:border-white/10 dark:bg-[#142018] lg:grid-cols-2">
        <div className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden bg-[#153d27] p-10 text-white lg:flex">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-lime-300/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-green-300/10 blur-3xl" />

          <div className="relative z-10 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300 text-green-950">
              <Leaf size={22} />
            </div>
            <span className="text-xl font-bold">SocialImpact</span>
          </div>

          <div className="relative z-10 py-12">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lime-300">
              <Heart size={28} />
            </div>

            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Be part of something bigger than yourself.
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-green-100/75">
              Join a community of people who believe that small acts of
              kindness can create extraordinary change.
            </p>

            <div className="mt-9 flex flex-wrap gap-5 text-xs text-green-100/80">
              <span className="flex items-center gap-2">
                <Users size={16} className="text-lime-300" />
                Connect with people
              </span>

              <span className="flex items-center gap-2">
                <Heart size={16} className="text-lime-300" />
                Make real impact
              </span>
            </div>
          </div>

          <p className="relative z-10 text-xs text-green-100/50">
            Together, we can make a difference.
          </p>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-white">
                  <Leaf size={22} />
                </span>

                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  SocialImpact
                </span>
              </Link>
            </div>

            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-green-700 dark:text-green-400">
                Start your journey
              </span>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Create an account
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Join SocialImpact and start making a difference.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Full Name
                </label>

                <div className="relative">
                  <UserRound
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />

                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={inputClass}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={inputClass}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Minimum 6 characters, including uppercase and lowercase
                  letters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={inputClass}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                <input
                  type="checkbox"
                  required
                  className="mt-1 accent-green-700"
                />

                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-green-700 hover:underline dark:text-green-400"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-green-700 hover:underline dark:text-green-400"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-700/15 transition hover:-translate-y-0.5 hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}

                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-bold text-green-700 hover:underline dark:text-green-400"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}