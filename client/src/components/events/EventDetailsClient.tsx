
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Clock,
  Heart,
  Share2,
  CheckCircle2,
  Leaf,
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
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8faf6] dark:bg-[#0d160f]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8faf6] px-5 dark:bg-[#0d160f]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Event Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {error || "The event you are looking for does not exist."}
          </p>

          <Link
            href="/upcoming-events"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            <ArrowLeft size={16} />
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  const isFull = (event.joinedCount || 0) >= event.volunteers;

  return (
    <main className="min-h-screen bg-[#f8faf6] pb-16 dark:bg-[#0d160f]">
      <section className="px-5 pb-6 pt-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-green-700 dark:text-gray-400 dark:hover:text-green-400"
          >
            <ArrowLeft size={17} />
            Back to Events
          </Link>
        </div>
      </section>

      <section className="px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="relative h-[260px] overflow-hidden rounded-2xl sm:h-[380px] lg:h-[440px]">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-6 left-5 right-5 sm:bottom-10 sm:left-10">
              <span className="mb-4 inline-flex rounded-full bg-green-600 px-4 py-1.5 text-xs font-semibold text-white">
                {event.category}
              </span>

              <h1 className="max-w-3xl text-2xl font-bold text-white sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/90">
                <span className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  {formatDate(event.date)}
                </span>

                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {event.location}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_350px]">
            <div className="space-y-7">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#172117] sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  About This Event
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {event.description}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#172117] sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Volunteer Information
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-green-600"
                    />
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                      Join the community and participate in this event.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-green-600"
                    />
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                      Cooperate with the event organizer and other volunteers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#172117] sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Event Organizer
                </h2>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <Leaf size={24} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {event.organizer?.name || "Event Organizer"}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {event.organizer?.email || "Email not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="h-fit space-y-5 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#172117]">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Event Information
                </h2>

                <div className="mt-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-green-50 p-2 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      <CalendarDays size={19} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Event Date
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-green-50 p-2 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      <Clock size={19} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Event Time
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {formatTime(event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-green-50 p-2 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      <MapPin size={19} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Location
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-green-50 p-2 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      <Users size={19} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Volunteers Joined
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {event.joinedCount || 0} / {event.volunteers}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-6 border-t border-gray-100 dark:border-white/10" />

                <button
                  onClick={handleJoin}
                  disabled={joining || joined || isFull}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  <Heart size={18} />
                  {joining
                    ? "Joining..."
                    : joined
                      ? "Joined Successfully"
                      : isFull
                        ? "Event Full"
                        : "Join This Event"}
                </button>

                <button
                  onClick={handleShare}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-300 hover:text-green-700 dark:border-white/10 dark:text-gray-300 dark:hover:text-green-400"
                >
                  <Share2 size={17} />
                  Share Event
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
