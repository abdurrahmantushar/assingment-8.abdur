
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
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
    <section className="bg-white px-5 pb-10 pt-7 dark:bg-[#101810] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
              <CalendarDays size={14} />
              Upcoming Events
            </div>

            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              Recent Upcoming Events
            </h2>
          </div>

          <Link
            href="/upcoming-events"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-green-700 transition hover:gap-2.5 dark:text-green-400 sm:text-sm"
          >
            View All Events
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-white/10 dark:bg-[#172117]"
              >
                <div className="h-36 bg-gray-200 dark:bg-white/10 sm:h-32" />
                <div className="space-y-3 p-3">
                  <div className="h-4 rounded bg-gray-200 dark:bg-white/10" />
                  <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-white/10" />
                  <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-semibold text-green-700 dark:text-green-400"
            >
              Try Again
            </button>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {events.map((event) => {
              const { day, month } = formatDate(event.date);

              return (
                <article
                  key={event._id}
                  className="group min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#172117]"
                >
                  <Link
                    href={`/events/${event._id}`}
                    className="relative block h-36 overflow-hidden sm:h-32 lg:h-32"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <span className="absolute left-2 top-2 max-w-[calc(100%-4rem)] truncate rounded-md bg-white/95 px-2 py-1 text-[10px] font-semibold text-green-800 shadow-sm">
                      {event.category}
                    </span>

                    <div className="absolute right-2 top-2 flex min-w-8 flex-col items-center rounded-md bg-white px-1.5 py-1 text-gray-900 shadow-sm">
                      <span className="text-sm font-bold leading-4">
                        {day}
                      </span>
                      <span className="text-[9px] font-medium">
                        {month}
                      </span>
                    </div>
                  </Link>

                  <div className="p-2.5 sm:p-3">
                    <Link href={`/events/${event._id}`}>
                      <h3 className="line-clamp-2 min-h-10 text-xs font-bold leading-5 text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
                        {event.title}
                      </h3>
                    </Link>

                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                      <MapPin
                        size={12}
                        className="shrink-0 text-green-600 dark:text-green-400"
                      />
                      <span className="truncate">{event.location}</span>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                      <Users
                        size={12}
                        className="shrink-0 text-green-600 dark:text-green-400"
                      />
                      <span>{event.volunteers} Volunteers</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 px-4 py-10 text-center dark:border-white/10">
            <CalendarDays
              size={28}
              className="mx-auto mb-2 text-gray-400"
            />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              No upcoming events available
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              New community events will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
