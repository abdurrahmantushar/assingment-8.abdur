"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Copy,
  Eye,
  EyeOff,
  Globe,
  Heart,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const { data: session, isPending } = authClient.useSession();
  const [googleLoading, setGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = formData.email.trim();

    if (!email || !formData.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signIn.email({
        email,
        password: formData.password,
        rememberMe,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Login successful!");

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const handleGoogleSignIn = async () => {
  try {
    setGoogleLoading(true);

    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/`,
      errorCallbackURL: `${window.location.origin}/auth/login`,
    });
  } catch (error) {
    console.error("Google sign in error:", error);
    toast.error("Google sign in failed.");
    setGoogleLoading(false);
  }
};

  const inputClass = "w-full rounded-xl border border-gray-200 bg-[#f9fbf8] py-3.5 pl-11 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-600/10 dark:border-white/10 dark:bg-[#17251a] dark:text-white dark:focus:bg-[#1b2b1f]";

    useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/");
      router.refresh();
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
        <div className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-[#153d27] p-10 text-white lg:flex">
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
              Welcome back, changemaker.
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-green-100/75">
              Your community is waiting. Sign in to discover events, connect
              with volunteers, and continue making a difference.
            </p>

            <div className="mt-9 flex flex-wrap gap-5 text-xs text-green-100/80">
              <span className="flex items-center gap-2">
                <Users size={16} className="text-lime-300" />
                Join your community
              </span>

              <span className="flex items-center gap-2">
                <Heart size={16} className="text-lime-300" />
                Continue your impact
              </span>
            </div>
          </div>

          <p className="relative z-10 text-xs text-green-100/50">
            Together, we can make a difference.
          </p>
        </div>

        <div className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-12">
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

            <div className="mb-9">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-green-700 dark:text-green-400">
                Welcome back
              </span>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sign in to your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Enter your details to continue your journey with SocialImpact.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="Enter your password"
                    className={inputClass}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-green-700"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-green-700"
                />
                Remember me
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-700/15 transition hover:-translate-y-0.5 hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}

                {!loading && <ArrowRight size={17} />}
              </button>
            </form>
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-100 dark:bg-white/10" />
              <span className="text-xs font-medium text-gray-400">
                OR CONTINUE WITH
              </span>
              <div className="h-px flex-1 bg-gray-100 dark:bg-white/10" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-700 transition hover:border-green-300 hover:bg-green-50/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#17251a] dark:text-gray-200 dark:hover:bg-green-500/5"
            >
              <Globe size={19} />
              {googleLoading ? "Connecting to Google..." : "Continue with Google"}
            </button>
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-100 dark:bg-white/10" />

              <span className="text-xs text-gray-400">
                New to SocialImpact?
              </span>

              <div className="h-px flex-1 bg-gray-100 dark:bg-white/10" />
            </div>
            <div className="my-6 rounded-2xl border border-green-200 bg-green-50/80 p-4 dark:border-green-500/20 dark:bg-green-500/5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-700 text-white">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Admin Demo Account
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Use these credentials to explore admin features
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2.5 dark:bg-white/5">
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                      Email Address
                    </p>
                    <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                      admin@gmail.com
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("admin@gmail.com");
                      toast.success("Admin email copied!");
                    }}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-500/10 dark:hover:text-green-400"
                    aria-label="Copy admin email"
                  >
                    <Copy size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2.5 dark:bg-white/5">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                      Password
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Admin1234
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("Admin1234");
                      toast.success("Admin password copied!");
                    }}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-500/10 dark:hover:text-green-400"
                    aria-label="Copy admin password"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
            <Link
              href="/auth/register"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 py-3.5 text-sm font-semibold text-green-800 transition hover:bg-green-50 dark:border-green-500/20 dark:text-green-400 dark:hover:bg-green-500/10"
            >
              Create an Account
              <ArrowRight size={16} />
            </Link>

            <p className="mt-8 text-center text-xs text-gray-400">
              By continuing, you agree to our community guidelines.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}