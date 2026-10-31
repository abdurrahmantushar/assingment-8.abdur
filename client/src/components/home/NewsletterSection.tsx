"use client";

import { useState } from "react";
import { ArrowRight, Mail, Send } from "lucide-react";
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
      toast.success("Thanks for your interest! Newsletter subscription will be available soon.");
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#f0f7ed] px-5 py-12 dark:bg-[#152315] sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-8 lg:flex-row">
        <div className="max-w-xl text-center lg:text-left">
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
            <Mail size={15} />
            Stay Connected
          </div>

          <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-3xl">
            Get Updates on Events &{" "}
            <span className="text-green-700 dark:text-green-400">
              Community Impact
            </span>
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base">
            Subscribe to our newsletter and stay informed about upcoming
            events, volunteer opportunities, and inspiring community stories.
          </p>
        </div>

        <div className="w-full max-w-xl">
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col gap-3 rounded-2xl border border-green-100 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#1b2b1b] sm:flex-row"
          >
            <div className="flex flex-1 items-center gap-3 px-3">
              <Mail
                size={19}
                className="shrink-0 text-green-600 dark:text-green-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address"
                required
                className="h-12 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-700 px-6 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-green-600 dark:hover:bg-green-500"
            >
              {isSubmitting ? "Please wait..." : "Subscribe"}
              <Send size={16} />
            </button>
          </form>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 sm:justify-start">
            No spam, just meaningful updates.
            <ArrowRight size={13} />
          </p>
        </div>
      </div>
    </section>
  );
}