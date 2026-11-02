
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  Sparkles,
  Heart,
} from "lucide-react";

type Event = {
  _id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  volunteers: number;
  image: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatDate = (date: string) => {
  const eventDate = new Date(date);

  return {
    day: eventDate.toLocaleDateString("en-US", {
      day: "2-digit",
    }),
    month: eventDate.toLocaleDateString("en-US", {
      month: "short",
    }),
    year: eventDate.toLocaleDateString("en-US", {
      year: "numeric",
    }),
  };
};

export default function RecentEventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/events/recent`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch recent events");
        }

        setEvents(data.events || []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while fetching events."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEvents();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f9fcf8] to-white px-5 py-14 dark:from-[#101810] dark:via-[#121d14] dark:to-[#101810] sm:px-8 sm:py-16 lg:px-12">
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-green-200/20 blur-[100px] dark:bg-green-500/5" />

      <div className="relative mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-green-700 dark:border-green-800/50 dark:bg-green-500/10 dark:text-green-400">
              <Sparkles size={14} />
              Upcoming Events
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
              Recent Events,{" "}
              <span className="text-green-700 dark:text-green-400">
                Real Impact
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
              Discover upcoming community initiatives and find meaningful
              ways to make a difference together.
            </p>
          </div>

          <Link
            href="/upcoming-events"
            className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm font-bold text-green-700 transition-all duration-300 hover:-translate-y-1 hover:bg-green-700 hover:text-white hover:shadow-lg hover:shadow-green-900/15 dark:border-green-800/50 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white"
          >
            View All Events
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-white/10 dark:bg-[#172117]"
              >
                <div className="h-40 bg-gray-200 dark:bg-white/10 sm:h-44" />
                <div className="space-y-3 p-4">
                  <div className="h-4 rounded bg-gray-200 dark:bg-white/10" />
                  <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-white/10" />
                  <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-10 text-center dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Try Again
              <ArrowRight size={15} />
            </button>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
            {events.map((event) => {
              const { day, month, year } = formatDate(event.date);

              return (
                <article
                  key={event._id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/10 dark:border-white/10 dark:bg-[#172117] dark:hover:border-green-800"
                >
                  <Link
                    href={`/events/${event._id}`}
                    className="relative block h-36 overflow-hidden sm:h-44"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                    <span className="absolute left-3 top-3 max-w-[65%] truncate rounded-full border border-white/20 bg-white/95 px-3 py-1.5 text-[10px] font-bold text-green-800 shadow-sm backdrop-blur-md">
                      {event.category}
                    </span>

                    <div className="absolute right-3 top-3 flex min-w-11 flex-col items-center rounded-xl border border-white/50 bg-white/95 px-2 py-1.5 text-gray-900 shadow-lg backdrop-blur-md">
                      <span className="text-lg font-extrabold leading-5">
                        {day}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-green-700">
                        {month}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] font-medium text-white">
                      <CalendarDays size={12} />
                      {year}
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <Link href={`/events/${event._id}`}>
                      <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400 sm:text-base">
                        {event.title}
                      </h3>
                    </Link>

                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin
                        size={15}
                        className="shrink-0 text-green-600 dark:text-green-400"
                      />
                      <span className="truncate">{event.location}</span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Users
                        size={15}
                        className="shrink-0 text-green-600 dark:text-green-400"
                      />
                      <span>{event.volunteers} Volunteers</span>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-2.5 text-xs font-bold text-green-700 transition-all duration-300 hover:bg-green-700 hover:text-white dark:border-green-800/50 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white"
                    >
                      View Event
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 px-4 py-14 text-center dark:border-white/10 dark:bg-white/[0.02]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400">
              <Heart size={26} />
            </div>

            <p className="text-base font-bold text-gray-900 dark:text-white">
              No upcoming events available
            </p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              New community events will appear here. Stay tuned!
            </p>

            <Link
              href="/upcoming-events"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:underline dark:text-green-400"
            >
              Explore Events
              <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
