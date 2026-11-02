
'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Phone,
  CalendarPlus,
  TicketCheck,
  UserRound,
  LayoutDashboard,
  HeartHandshake,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/upcoming-events" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: FaInstagram,
  },
  {
    label: "X",
    href: "https://x.com/",
    icon: FaXTwitter,
  },
];

export default function Footer() {
  const router = useRouter();
  const [year, setYear] = useState<number | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const accountLinks = user
    ? [
        { label: "My Profile", href: "/profile", icon: UserRound },
        { label: "Create Event", href: "/create-event", icon: CalendarPlus },
        { label: "Manage Events", href: "/manage-events", icon: LayoutDashboard },
        { label: "Joined Events", href: "/joined-events", icon: TicketCheck },
      ]
    : [
        { label: "Login", href: "/auth/login", icon: UserRound },
        { label: "Register", href: "/auth/register", icon: UserRound },
      ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authClient.signOut();
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#102b1b] text-white">
      <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-green-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-[110px]" />

      <div className="relative mx-auto max-w-[1600px] px-5 pb-7 pt-14 sm:px-8 lg:px-12 lg:pt-16">
        <div className="grid grid-cols-1 gap-11 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg shadow-green-900/30 transition-transform duration-300 hover:rotate-6 hover:scale-105">
                <HeartHandshake size={25} />
              </span>

              <span className="text-2xl font-extrabold tracking-tight">
                Social<span className="text-green-400">Impact</span>
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-green-100/65">
              Together, we can make a difference. Discover meaningful
              community events, volunteer your time, and help build a
              better world.
            </p>

            {user && (
              <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
                <span className="truncate text-xs font-medium text-green-200">
                  Welcome back, {user.name || "Volunteer"}
                </span>
              </div>
            )}

            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-green-100/80 transition-all duration-300 hover:-translate-y-1 hover:border-green-400/50 hover:bg-green-500 hover:text-white"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-white">
              Explore
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-green-100/65 transition-colors duration-300 hover:text-green-400"
                  >
                    <ArrowUpRight
                      size={15}
                      className="text-green-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-white">
              {user ? "Your Account" : "Get Started"}
            </h3>

            <ul className="space-y-4">
              {accountLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-2 text-sm text-green-100/65 transition-colors duration-300 hover:text-green-400"
                  >
                    <Icon
                      size={15}
                      className="text-green-500 transition-transform duration-300 group-hover:scale-110"
                    />
                    {label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            {user && (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="mt-5 inline-flex items-center gap-2 text-sm text-red-300/80 transition-colors hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut size={15} />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            )}

            {!user && isPending && (
              <p className="mt-4 text-xs text-green-100/40">
                Checking account...
              </p>
            )}
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-white">
              Get In Touch
            </h3>

            <p className="mb-5 text-sm leading-6 text-green-100/60">
              Have a question or want to make a difference together?
              We would love to hear from you.
            </p>

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-400">
                  <Mail size={16} />
                </span>
                <div className="min-w-0 pt-1">
                  <p className="mb-1 text-xs text-green-100/40">Email us</p>
                  <a
                    href="mailto:hello@socialimpact.com"
                    className="break-all text-sm text-green-100/80 transition-colors hover:text-green-400"
                  >
                    hello@socialimpact.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-400">
                  <Phone size={16} />
                </span>
                <div className="pt-1">
                  <p className="mb-1 text-xs text-green-100/40">Call us</p>
                  <a
                    href="tel:+8801700000000"
                    className="text-sm text-green-100/80 transition-colors hover:text-green-400"
                  >
                    +880 1700-000000
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-400">
                  <MapPin size={16} />
                </span>
                <div className="pt-1">
                  <p className="mb-1 text-xs text-green-100/40">Location</p>
                  <span className="text-sm text-green-100/80">
                    Bangladesh
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-6 text-green-100/45">
              © {year ?? "2026"} SocialImpact. All rights reserved.
            </p>

            <p className="inline-flex items-center gap-1.5 text-xs text-green-100/50">
              Made with
              <Heart size={13} className="fill-red-400 text-red-400" />
              for a better community.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
