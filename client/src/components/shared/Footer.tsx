'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Leaf,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/upcoming-events" },
  { label: "Create Event", href: "/create-event" },
  { label: "About Us", href: "/about" },
];

const accountLinks = [
  { label: "Login", href: "/auth/login" },
  { label: "Register", href: "/auth/register" },
  { label: "Manage Events", href: "/manage-events" },
  { label: "Joined Events", href: "/joined-events" },
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
const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="bg-[#102b1b] text-white">
      <div className="mx-auto max-w-[1600px] px-5 pb-8 pt-12 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white">
                <Leaf size={23} />
              </span>

              <span className="text-xl font-bold tracking-tight">
                Social<span className="text-green-400">Impact</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-green-100/70">
              Together, we can make a difference. Discover meaningful
              community events, volunteer your time, and help build a
              better world.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-green-100 transition-all duration-300 hover:border-green-400 hover:bg-green-500 hover:text-white"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-base font-bold">Quick Links</h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-sm text-green-100/70 transition-colors hover:text-green-400"
                  >
                    <ArrowUpRight
                      size={14}
                      className="text-green-500"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-base font-bold">Your Account</h3>

            <ul className="space-y-3">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-sm text-green-100/70 transition-colors hover:text-green-400"
                  >
                    <ArrowUpRight
                      size={14}
                      className="text-green-500"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-base font-bold">Contact Us</h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-green-400"
                />
                <a
                  href="mailto:hello@socialimpact.com"
                  className="text-sm text-green-100/70 transition-colors hover:text-green-400"
                >
                  hello@socialimpact.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Phone
                  size={17}
                  className="mt-0.5 shrink-0 text-green-400"
                />
                <a
                  href="tel:+8801700000000"
                  className="text-sm text-green-100/70 transition-colors hover:text-green-400"
                >
                  +880 1700-000000
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-green-400"
                />
                <span className="text-sm text-green-100/70">
                  Bangladesh
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                <p className="text-xs text-green-100/50">
                © {year ?? "2026"} SocialImpact. All rights reserved.
                </p>

            <p className="text-xs text-green-100/50">
              Made with{" "}
              <span className="text-red-400">♥</span>{" "}
              for a better community.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}