
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Search,
  Users,
  ArrowUpRight,
  SlidersHorizontal,
  Sparkles,
  Heart,
  ArrowRight,
} from "lucide-react";

type Event = {
  _id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  volunteers: number;
  joinedCount: number;
  image: string;
  description: string;
};

const categories = [
  "All",
  "Donation",
  "Environment",
  "Healthcare",
  "Education",
  "Community",
];

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/events`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch events");
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

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        activeCategory === "All" || event.category === activeCategory;

      const searchText =
        `${event.title} ${event.location} ${event.category}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [events, search, activeCategory]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8faf6] dark:bg-[#0d160f]">
      <section className="relative overflow-hidden border-b border-green-100 bg-gradient-to-br from-[#edf7e9] via-[#f5faf2] to-[#e5f2df] px-5 py-16 dark:border-white/5 dark:from-[#142319] dark:via-[#15271a] dark:to-[#101810] sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-green-300/20 blur-[100px] dark:bg-green-500/10" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-emerald-300/20 blur-[100px] dark:bg-emerald-500/5" />

        <div className="relative mx-auto max-w-[1600px]">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-green-700 shadow-sm backdrop-blur-md dark:border-green-800/50 dark:bg-green-950/30 dark:text-green-400">
              <Sparkles size={14} />
              Make a Difference
            </div>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-6xl">
              Discover Upcoming{" "}
              <span className="text-green-700 dark:text-green-400">
                Events
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base sm:leading-8">
              Find meaningful community events, connect with passionate
              volunteers, and be part of something that creates a lasting
              positive impact.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#explore-events"
                className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-900/15 transition-all duration-300 hover:-translate-y-1 hover:bg-green-800 hover:shadow-xl"
              >
                Explore Events
                <ArrowRight size={17} />
              </a>

              <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                <Heart size={16} className="text-green-600 dark:text-green-400" />
                Small actions create big change
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="explore-events"
        className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
                <CalendarDays size={15} />
                Find Your Next Opportunity
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                Explore Events
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Find an event and start making an impact.
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events or location..."
                className="h-13 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-800 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-white/10 dark:bg-[#172117] dark:text-white dark:focus:border-green-600"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-green-700 hover:text-green-800 dark:text-green-400"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="mb-8 rounded-2xl border border-gray-200/70 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#172117]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex shrink-0 items-center gap-2 px-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                <SlidersHorizontal size={16} />
                Categories
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-300 ${
                      activeCategory === category
                        ? "bg-green-700 text-white shadow-md shadow-green-900/15"
                        : "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-700 dark:bg-white/[0.04] dark:text-gray-300 dark:hover:bg-green-500/10 dark:hover:text-green-400"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Showing{" "}
                <span className="font-extrabold text-gray-900 dark:text-white">
                  {loading ? "..." : filteredEvents.length}
                </span>{" "}
                {filteredEvents.length === 1 ? "event" : "events"}
              </p>
            </div>

            {(search || activeCategory !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="text-xs font-bold text-green-700 transition hover:underline dark:text-green-400"
              >
                Clear all filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#172117]"
                >
                  <div className="h-52 bg-gray-200 dark:bg-white/10" />

                  <div className="space-y-4 p-5">
                    <div className="h-3 w-28 rounded bg-gray-200 dark:bg-white/10" />
                    <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-white/10" />
                    <div className="h-10 rounded bg-gray-200 dark:bg-white/10" />
                    <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-white px-5 py-16 text-center dark:border-red-900/40 dark:bg-[#172117]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/10">
                <CalendarDays size={26} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
                Unable to load events
              </h3>

              <p className="mt-2 text-sm text-red-500">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-800"
              >
                Try Again
              </button>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEvents.map((event) => {
                const progress =
                  event.volunteers > 0
                    ? Math.min(
                        ((event.joinedCount || 0) / event.volunteers) * 100,
                        100
                      )
                    : 0;

                return (
                  <article
                    key={event._id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/10 dark:border-white/10 dark:bg-[#172117] dark:hover:border-green-800"
                  >
                    <Link
                      href={`/events/${event._id}`}
                      className="relative block h-52 overflow-hidden"
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                      <span className="absolute left-4 top-4 max-w-[70%] truncate rounded-full border border-white/20 bg-white/95 px-3 py-1.5 text-[10px] font-bold text-green-800 shadow-sm backdrop-blur-md">
                        {event.category}
                      </span>

                      <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-green-700 shadow-lg transition-all duration-300 group-hover:bg-green-700 group-hover:text-white">
                        <ArrowUpRight size={19} />
                      </span>
                    </Link>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex items-center gap-2 text-xs font-bold text-green-700 dark:text-green-400">
                        <CalendarDays size={15} />
                        {formatDate(event.date)}
                      </div>

                      <Link href={`/events/${event._id}`}>
                        <h3 className="line-clamp-2 min-h-12 text-base font-extrabold leading-6 text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
                          {event.title}
                        </h3>
                      </Link>

                      <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-gray-500 dark:text-gray-400">
                        {event.description}
                      </p>

                      <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 dark:border-white/10">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <MapPin
                            size={15}
                            className="shrink-0 text-green-600 dark:text-green-400"
                          />
                          <span className="truncate">{event.location}</span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Users
                              size={15}
                              className="shrink-0 text-green-600 dark:text-green-400"
                            />
                            <span>
                              {event.joinedCount || 0}/{event.volunteers} joined
                            </span>
                          </div>

                          <span className="text-[10px] font-bold text-green-700 dark:text-green-400">
                            {Math.round(progress)}%
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                          <div
                            className="h-full rounded-full bg-green-600 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <Link
                        href={`/events/${event._id}`}
                        className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-3 text-xs font-bold text-green-700 transition-all duration-300 hover:bg-green-700 hover:text-white dark:border-green-800/50 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white"
                      >
                        View Event Details
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-white/10 dark:bg-[#172117]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                <Search size={30} />
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-gray-900 dark:text-white">
                No events found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
                We couldn't find any events matching your search. Try another
                search term or select a different category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-800"
              >
                Clear Filters
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
