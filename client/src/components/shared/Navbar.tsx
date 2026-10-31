"use client";

import { useState,useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import {
  CalendarDays,
  ChevronDown,
  CircleUserRound,
  Contact,
  HeartHandshake,
  Home,
  Info,
  LogOut,
  Menu,
  Moon,
  Plus,
  Sun,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type NavbarUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
};

const navLinks = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Upcoming Events",
    href: "/upcoming-events",
    icon: CalendarDays,
  },
  // {
  //   name: "About Us",
  //   href: "/#about",
  //   icon: Info,
  // },
  // {
  //   name: "Contact",
  //   href: "/#contact",
  //   icon: Contact,
  // },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  const user = session?.user as NavbarUser | undefined;
  const isAdmin = user?.role === "admin";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isDark = theme === "dark";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href;
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await authClient.signOut();

      setProfileMenuOpen(false);
      setMobileMenuOpen(false);

      toast.success("Logged out successfully");

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Unable to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  useEffect(() => {
  setMounted(true);
}, []);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const ProfileLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {isAdmin && (
        <Link
          href="/create-event"
          onClick={closeMenus}
          className={`flex items-center gap-3 rounded-xl font-semibold text-green-700 transition hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/50 ${
            mobile ? "px-4 py-3 text-sm" : "px-3 py-2.5 text-sm"
          }`}
        >
          <Plus size={18} />
          Add Event
        </Link>
      )}

      <Link
        href="/manage-events"
        onClick={closeMenus}
        className={`flex items-center gap-3 rounded-xl text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 ${
          mobile ? "px-4 py-3 text-sm" : "px-3 py-2.5 text-sm"
        }`}
      >
        <CalendarDays size={18} />
        Manage Events
      </Link>

      <Link
        href="/joined-events"
        onClick={closeMenus}
        className={`flex items-center gap-3 rounded-xl text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 ${
          mobile ? "px-4 py-3 text-sm" : "px-3 py-2.5 text-sm"
        }`}
      >
        <Users size={18} />
        Joined Events
      </Link>

      <Link
        href="/profile"
        onClick={closeMenus}
        className={`flex items-center gap-3 rounded-xl text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 ${
          mobile ? "px-4 py-3 text-sm" : "px-3 py-2.5 text-sm"
        }`}
      >
        <UserRound size={18} />
        My Profile
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/95">
      <nav className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-4">
          <Link
            href="/"
            onClick={closeMenus}
            className="flex shrink-0 items-center gap-2.5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
              <HeartHandshake size={25} />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Social<span className="text-green-600">Impact</span>
              </h1>
              <p className="text-[10px] font-medium tracking-wider text-gray-500 dark:text-gray-400">
                TOGETHER WE CAN
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                    : "text-gray-600 hover:bg-gray-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-green-400"
                }`}
              >
                {link.name}

              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/create-event"
              onClick={closeMenus}
              className={`relative flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                pathname === "/create-event"
                  ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                  : "text-gray-600 hover:bg-gray-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-green-400"
              }`}
            >
              <Plus size={17} />
              Add Event
            </Link>
          )}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )
            ) : (
              <span className="block h-[19px] w-[19px]" />
            )}
          </button>

            {!isPending &&
              (user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 rounded-full border border-gray-200 p-1.5 pr-3 transition hover:border-green-300 dark:border-gray-700 dark:hover:border-green-700"
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">
                        <CircleUserRound size={21} />
                      </div>
                    )}

                    <span className="max-w-28 truncate text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {user.name}
                    </span>

                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition ${
                        profileMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl shadow-gray-900/10 dark:border-gray-800 dark:bg-gray-900">
                      <div className="flex items-center gap-3 border-b border-gray-100 px-3 py-3 dark:border-gray-800">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">
                            <CircleUserRound size={23} />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                          {isAdmin && (
                            <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase text-green-700 dark:bg-green-900/50 dark:text-green-400">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 py-2">
                        <ProfileLinks />
                      </div>

                      <div className="border-t border-gray-100 pt-2 dark:border-gray-800">
                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={loggingOut}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40"
                        >
                          <LogOut size={18} />
                          {loggingOut ? "Logging out..." : "Logout"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                >
                  <UserRound size={17} />
                  Login
                </Link>
              ))}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
<button
  type="button"
  onClick={toggleTheme}
  aria-label="Toggle theme"
  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"
>
  {mounted ? (
    resolvedTheme === "dark" ? (
      <Sun size={19} />
    ) : (
      <Moon size={19} />
    )
  ) : (
    <span className="block h-[19px] w-[19px]" />
  )}
</button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-200"
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-gray-100 py-4 dark:border-gray-800 lg:hidden">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeMenus}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900"
                    }`}
                  >
                    <Icon size={18} />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {!isPending && (
              <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                {user ? (
                  <>
                    <div className="mb-3 flex items-center gap-3 px-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">
                          <CircleUserRound size={23} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                        {isAdmin && (
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <ProfileLinks mobile />
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      <LogOut size={18} />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={closeMenus}
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    <UserRound size={18} />
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}