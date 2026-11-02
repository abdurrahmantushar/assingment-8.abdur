
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  Clock,
  Heart,
  Share2,
  CheckCircle2,
  Leaf,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

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
  organizer: {
    id: string;
    name: string;
    email: string;
  };
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function EventDetailsClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const { data: session, isPending } = authClient.useSession();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");
  const [checkingJoin, setCheckingJoin] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/events/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch event");
        }

        setEvent(data.event);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while fetching event."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  useEffect(() => {
    const checkJoinedStatus = async () => {
      if (isPending) return;

      if (!session?.user) {
        setJoined(false);
        setCheckingJoin(false);
        return;
      }

      try {
        setCheckingJoin(true);

        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) return;

        const response = await fetch(`${API_URL}/api/joins/my-events`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to check joined status");
        }

        const joinedEvents = data.joinedEvents || [];

        const alreadyJoined = joinedEvents.some(
          (item: any) =>
            String(item.eventId || item.event?._id) === String(id)
        );

        setJoined(alreadyJoined);
      } catch (error) {
        console.error("Failed to check joined status:", error);
      } finally {
        setCheckingJoin(false);
      }
    };

    if (id) {
      checkJoinedStatus();
    }
  }, [id, session, isPending]);

  const handleJoin = async () => {
    if (!session?.user) {
      toast.error("Please login to join this event.");
      router.push("/auth/login");
      return;
    }

    if (!event || joining || joined) return;

    try {
      setJoining(true);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Authentication failed. Please login again.");
        return;
      }

      const response = await fetch(`${API_URL}/api/joins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          eventId: event._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to join this event.");
      }

      setJoined(true);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              joinedCount: (prev.joinedCount || 0) + 1,
            }
          : prev
      );

      toast.success("You have successfully joined this event!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setJoining(false);
    }
  };

  const handleShare = async () => {
    if (!event) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Event link copied!");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Unable to share this event.");
      }
    }
  };

  if (loading || isPending) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#f8faf6] dark:bg-[#0d160f]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600/20 border-t-green-600" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Loading event details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#f8faf6] px-5 dark:bg-[#0d160f]">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#172117]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400">
            <CalendarDays size={30} />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-gray-900 dark:text-white">
            Event Not Found
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {error || "The event you are looking for does not exist."}
          </p>

          <Link
            href="/upcoming-events"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
          >
            <ArrowLeft size={16} />
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  const isFull = (event.joinedCount || 0) >= event.volunteers;
  const remaining = Math.max(
    event.volunteers - (event.joinedCount || 0),
    0
  );
  const progress =
    event.volunteers > 0
      ? Math.min(
          ((event.joinedCount || 0) / event.volunteers) * 100,
          100
        )
      : 0;

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8faf6] pb-20 dark:bg-[#0d160f]">
      <section className="px-5 pb-6 pt-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/upcoming-events"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-green-700 dark:text-gray-400 dark:hover:text-green-400"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Events
          </Link>
        </div>
      </section>

      <section className="px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="group relative h-[300px] overflow-hidden rounded-3xl bg-gray-200 shadow-xl shadow-green-950/5 sm:h-[400px] lg:h-[480px] dark:bg-[#172117]">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-10 lg:p-12">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-green-600/90 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                <Sparkles size={13} />
                {event.category}
              </span>

              <h1 className="max-w-4xl text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-white/90 sm:text-sm">
                <span className="flex items-center gap-2">
                  <CalendarDays size={17} className="text-green-400" />
                  {formatDate(event.date)}
                </span>

                <span className="flex items-center gap-2">
                  <MapPin size={17} className="text-green-400" />
                  {event.location}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 items-start gap-7 lg:grid-cols-[1fr_360px] lg:gap-9">
            <div className="space-y-6">
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm shadow-gray-900/[0.02] sm:p-8 dark:border-white/10 dark:bg-[#172117]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <Leaf size={22} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
                      Event Overview
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">
                      About This Event
                    </h2>
                  </div>
                </div>

                <p className="mt-6 whitespace-pre-line text-sm leading-8 text-gray-600 dark:text-gray-300 sm:text-base">
                  {event.description}
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm shadow-gray-900/[0.02] sm:p-8 dark:border-white/10 dark:bg-[#172117]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <Heart size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
                      Get Involved
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">
                      Volunteer Information
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#f5faf3] p-4 dark:bg-white/[0.03]">
                    <CheckCircle2
                      size={20}
                      className="mb-3 text-green-600 dark:text-green-400"
                    />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Be Part of the Change
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
                      Join the community and participate in this event.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#f5faf3] p-4 dark:bg-white/[0.03]">
                    <Users
                      size={20}
                      className="mb-3 text-green-600 dark:text-green-400"
                    />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Work Together
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
                      Cooperate with the organizer and fellow volunteers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm shadow-gray-900/[0.02] sm:p-8 dark:border-white/10 dark:bg-[#172117]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <Users size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
                      The People Behind It
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">
                      Event Organizer
                    </h2>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4 rounded-2xl bg-[#f5faf3] p-4 dark:bg-white/[0.03]">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <Leaf size={27} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-gray-900 dark:text-white">
                      {event.organizer?.name || "Event Organizer"}
                    </h3>

                    <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                      {event.organizer?.email || "Email not available"}
                    </p>

                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-green-700 dark:text-green-400">
                      <ShieldCheck size={12} />
                      Community Organizer
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-lg shadow-gray-900/[0.04] dark:border-white/10 dark:bg-[#172117]">
                <div className="bg-gradient-to-br from-green-700 to-green-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-green-100">
                      Event Information
                    </span>
                    <CalendarDays size={22} className="text-green-100" />
                  </div>

                  <p className="mt-4 text-3xl font-extrabold">
                    {remaining}
                  </p>
                  <p className="mt-1 text-sm text-green-100">
                    Volunteer {remaining === 1 ? "spot" : "spots"} remaining
                  </p>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-[11px] font-medium text-green-100">
                    <span>{event.joinedCount || 0} joined</span>
                    <span>{event.volunteers} total spots</span>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-green-50 p-2.5 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      <CalendarDays size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Event Date
                      </p>
                      <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-green-50 p-2.5 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      <Clock size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Event Time
                      </p>
                      <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                        {formatTime(event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-green-50 p-2.5 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      <MapPin size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Location
                      </p>
                      <p className="mt-1 break-words text-sm font-bold text-gray-900 dark:text-white">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-green-50 p-2.5 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      <Users size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Volunteers Joined
                      </p>
                      <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                        {event.joinedCount || 0} / {event.volunteers}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-5 dark:border-white/10">
                    <button
                      onClick={handleJoin}
                      disabled={joining || joined || isFull || checkingJoin}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-green-900/20 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
                    >
                      <Heart size={18} />
                      {checkingJoin
                        ? "Checking..."
                        : joining
                          ? "Joining..."
                          : joined
                            ? "Already Joined"
                            : isFull
                              ? "Event Full"
                              : "Join This Event"}
                    </button>

                    <button
                      onClick={handleShare}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition-all duration-300 hover:border-green-300 hover:bg-green-50 hover:text-green-700 dark:border-white/10 dark:text-gray-300 dark:hover:border-green-800 dark:hover:bg-green-500/10 dark:hover:text-green-400"
                    >
                      <Share2 size={17} />
                      Share Event
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-green-200/70 bg-green-50/70 p-5 dark:border-green-800/30 dark:bg-green-500/[0.06]">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
                  <Heart size={17} />
                  <h3 className="text-sm font-bold">Make a Difference</h3>
                </div>

                <p className="mt-2 text-xs leading-6 text-green-800/70 dark:text-green-300/70">
                  Every volunteer makes a meaningful contribution. Be part of
                  something positive in your community.
                </p>

                <Link
                  href="/upcoming-events"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-green-800 transition hover:gap-2.5 dark:text-green-400"
                >
                  Explore more events
                  <ArrowRight size={14} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
