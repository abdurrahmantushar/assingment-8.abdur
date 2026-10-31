
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
    month: "long",
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
    <main className="min-h-screen bg-[#f8faf6] dark:bg-[#0d160f]">
      <section className="border-b border-green-100 bg-[#f0f7ed] px-5 py-14 dark:border-white/5 dark:bg-[#142319] sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1.5 text-xs font-semibold text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-400">
              <CalendarDays size={14} />
              Make a Difference
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Discover Upcoming{" "}
              <span className="text-green-700 dark:text-green-400">
                Events
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
              Find meaningful community events, connect with volunteers,
              and be part of something that creates a positive impact.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Explore Events
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Find an event and start making an impact.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events or location..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10 dark:border-white/10 dark:bg-[#172117] dark:text-white"
              />
            </div>
          </div>

          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
            <SlidersHorizontal
              size={17}
              className="mr-1 shrink-0 text-gray-500 dark:text-gray-400"
            />

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  activeCategory === category
                    ? "bg-green-700 text-white shadow-md shadow-green-900/10"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-700 dark:border-white/10 dark:bg-[#172117] dark:text-gray-300 dark:hover:text-green-400"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {loading ? "..." : filteredEvents.length}
              </span>{" "}
              events
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#172117]"
                >
                  <div className="h-48 bg-gray-200 dark:bg-white/10" />
                  <div className="space-y-4 p-4">
                    <div className="h-3 w-28 rounded bg-gray-200 dark:bg-white/10" />
                    <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-white/10" />
                    <div className="h-10 rounded bg-gray-200 dark:bg-white/10" />
                    <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-white px-5 py-16 text-center dark:border-red-900/40 dark:bg-[#172117]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Unable to load events
              </h3>
              <p className="mt-2 text-sm text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-5 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Try Again
              </button>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEvents.map((event) => (
                <article
                  key={event._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/5 dark:border-white/10 dark:bg-[#172117] dark:hover:border-green-800"
                >
                  <Link
                    href={`/events/${event._id}`}
                    className="relative block h-48 overflow-hidden"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-green-700 shadow-sm">
                      {event.category}
                    </span>

                    <span className="absolute bottom-3 right-3 rounded-lg bg-white/95 p-2 text-green-700 shadow-sm transition-colors group-hover:bg-green-700 group-hover:text-white">
                      <ArrowUpRight size={17} />
                    </span>
                  </Link>

                  <div className="p-4">
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium text-green-700 dark:text-green-400">
                      <CalendarDays size={14} />
                      {formatDate(event.date)}
                    </div>

                    <Link href={`/events/${event._id}`}>
                      <h3 className="mb-2 line-clamp-1 text-base font-bold text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
                        {event.title}
                      </h3>
                    </Link>

                    <p className="mb-4 line-clamp-2 min-h-10 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {event.description}
                    </p>

                    <div className="flex flex-col gap-2 border-t border-gray-100 pt-3 dark:border-white/10">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin
                          size={14}
                          className="shrink-0 text-green-600"
                        />
                        <span className="truncate">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Users
                          size={14}
                          className="shrink-0 text-green-600"
                        />
                        {event.joinedCount || 0} / {event.volunteers} volunteers joined
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-white/10 dark:bg-[#172117]">
              <Search size={35} className="mx-auto mb-3 text-gray-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                No events found
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try another search term or select a different category.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-5 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
