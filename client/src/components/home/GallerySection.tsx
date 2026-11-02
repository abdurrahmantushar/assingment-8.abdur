
import { Camera, Sparkles } from "lucide-react";
import GalleryCarousel from "./GalleryCarousel";

export default function GallerySection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f9fcf8] to-white px-5 py-14 dark:from-[#101810] dark:via-[#121d14] dark:to-[#101810] sm:px-8 sm:py-16 lg:px-12">
      <div className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-green-200/20 blur-[100px] dark:bg-green-500/5" />

      <div className="relative mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200/80 bg-green-50 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-green-700 dark:border-green-800/50 dark:bg-green-500/10 dark:text-green-400">
              <Camera size={14} />
              Our Gallery
              <Sparkles size={13} />
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
              Moments That{" "}
              <span className="text-green-700 dark:text-green-400">
                Inspire
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
              Every picture tells a story of kindness, teamwork, and positive
              change. Explore the moments that bring our community together.
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-green-100 bg-green-50/80 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-800/40 dark:bg-green-500/10 dark:text-green-400 sm:flex">
            <HeartIcon />
            <span>Spreading Kindness Together</span>
          </div>
        </div>

        <GalleryCarousel />
      </div>
    </section>
  );
}

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}
