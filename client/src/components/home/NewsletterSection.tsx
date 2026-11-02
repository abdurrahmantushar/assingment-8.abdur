
"use client";

import { useState } from "react";
import { ArrowRight, Mail, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      toast.success(
        "Thanks for your interest! Newsletter subscription will be available soon."
      );
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#edf8e9] via-[#f6fbf3] to-[#e8f5e9] px-5 py-16 dark:from-[#142314] dark:via-[#172817] dark:to-[#102010] sm:px-8 sm:py-20 lg:px-12">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-green-300/20 blur-[100px] dark:bg-green-500/10" />

      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-emerald-300/20 blur-[110px] dark:bg-emerald-500/10" />

      <div className="relative mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-10 lg:flex-row lg:gap-16">
        <div className="max-w-2xl text-center lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-green-700 shadow-sm dark:border-green-800/50 dark:bg-green-500/10 dark:text-green-400">
            <Sparkles size={14} />
            Stay Connected
          </div>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-[42px]">
            Get Updates on Events &{" "}
            <span className="text-green-700 dark:text-green-400">
              Community Impact
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base lg:mx-0">
            Subscribe to our newsletter and stay informed about upcoming
            events, volunteer opportunities, and inspiring community stories.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-gray-600 dark:text-gray-400 lg:justify-start">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Community updates
            </span>

            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Volunteer opportunities
            </span>
          </div>
        </div>

        <div className="w-full max-w-xl">
          <div className="rounded-3xl border border-green-100/80 bg-white/80 p-5 shadow-xl shadow-green-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#1b2b1b]/80 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                <Mail size={23} />
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Join Our Newsletter
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Be part of something meaningful.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <label
                htmlFor="newsletter-email"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex h-13 flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 transition-all duration-300 focus-within:border-green-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-500/10 dark:border-white/10 dark:bg-white/5 dark:focus-within:bg-white/[0.08]">
                  <Mail
                    size={19}
                    className="shrink-0 text-green-600 dark:text-green-400"
                  />

                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address"
                    required
                    className="h-full w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-green-700 px-7 text-sm font-bold text-white shadow-lg shadow-green-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-xl hover:shadow-green-900/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-green-600 dark:hover:bg-green-500"
                >
                  {isSubmitting ? "Please wait..." : "Subscribe"}

                  <Send
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </form>

            <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 dark:border-white/10">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                <ArrowRight size={14} />
              </div>

              <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                No spam, just meaningful updates that inspire positive change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
