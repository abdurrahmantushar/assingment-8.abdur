
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Search,
  Users,
  SlidersHorizontal,
  Pencil,
  Trash2,
  Plus,
  ArrowUpRight,
  X,
  Loader2, AlertTriangle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "react-hot-toast";
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

export default function ManageEventsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(`${API_URL}/api/events/my-events`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch your events");
      }

      setEvents(data.events || []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/auth/login");
      return;
    }

    fetchEvents();
  }, [session, isPending, router, fetchEvents]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        activeCategory === "All" || event.category === activeCategory;

      const searchText =
        `${event.title} ${event.location} ${event.category}`.toLowerCase();

      return (
        matchesCategory &&
        searchText.includes(search.toLowerCase().trim())
      );
    });
  }, [events, search, activeCategory]);

  const handleDelete = async () => {
    if (!selectedEventId) return;

    const id = selectedEventId;

    try {
      setDeletingId(id);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete event");
      }

      setEvents((previous) =>
        previous.filter((event) => event._id !== id)
      );

      toast.success("Event deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedEventId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete event"
      );
    } finally {
      setDeletingId("");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingEvent) return;

    const formData = new FormData(e.currentTarget);
    const title = String(formData.get("title") || "").trim();
    const category = String(formData.get("category") || "");
    const description = String(formData.get("description") || "").trim();
    const date = String(formData.get("date") || "");
    const location = String(formData.get("location") || "").trim();
    const volunteers = Number(formData.get("volunteers"));
    const imageFile = formData.get("image") as File;

    if (
      !title ||
      !category ||
      !description ||
      !date ||
      !location ||
      !Number.isSafeInteger(volunteers) ||
      volunteers < 1
    ) {
      toast.error("Please fill in all fields correctly");
      return;
    }

    if (new Date(date).getTime() <= Date.now()) {
      toast.error("Please select a future event date");
      return;
    }

    if (volunteers < editingEvent.joinedCount) {
      toast.error("Volunteer limit cannot be less than joined volunteers");
      return;
    }

    try {
      setSaving(true);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication token not found");
      }

      const updateData = new FormData();
      updateData.append("title", title);
      updateData.append("category", category);
      updateData.append("description", description);
      updateData.append("date", new Date(date).toISOString());
      updateData.append("location", location);
      updateData.append("volunteers", String(volunteers));

      if (imageFile && imageFile.size > 0) {
        updateData.append("image", imageFile);
      }

      const response = await fetch(
        `${API_URL}/api/events/${editingEvent._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: updateData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update event");
      }

      setEvents((previous) =>
        previous.map((event) =>
          event._id === editingEvent._id
            ? data.event
            : event
        )
      );

      setEditingEvent(null);
      toast.success("Event updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update event"
      );
    } finally {
      setSaving(false);
    }
  };

  if (isPending || (!session?.user && !error)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8faf6] dark:bg-[#0d160f]">
        <Loader2 className="animate-spin text-green-700" size={32} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faf6] dark:bg-[#0d160f]">
      <section className="border-b border-green-100 bg-[#f0f7ed] px-5 py-14 dark:border-white/5 dark:bg-[#142319] sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1.5 text-xs font-semibold text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-400">
                <CalendarDays size={14} />
                Event Dashboard
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
                Manage Your{" "}
                <span className="text-green-700 dark:text-green-400">
                  Events
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
                Manage, update and organize the events you have created.
              </p>
            </div>

            <Link
              href="/create-event"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-green-700 px-5 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              <Plus size={17} />
              Create Event
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Events
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and manage all your created events.
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
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${activeCategory === category
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
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-white px-5 py-16 text-center dark:border-red-900/40 dark:bg-[#172117]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Unable to load your events
              </h3>
              <p className="mt-2 text-sm text-red-500">{error}</p>
              <button
                onClick={fetchEvents}
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

                    <h3 className="mb-2 line-clamp-1 text-base font-bold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>

                    <p className="mb-4 line-clamp-2 min-h-10 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {event.description}
                    </p>

                    <div className="flex flex-col gap-2 border-t border-gray-100 pt-3 dark:border-white/10">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin size={14} className="shrink-0 text-green-600" />
                        <span className="truncate">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Users size={14} className="shrink-0 text-green-600" />
                        {event.joinedCount || 0} / {event.volunteers} volunteers joined
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingEvent(event)}
                        title="Edit event"
                        aria-label="Edit event"
                        className="group flex h-11 w-full items-center justify-center rounded-xl border border-green-100 bg-green-50 text-green-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-500/20 active:translate-y-0 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400 dark:hover:border-green-500 dark:hover:bg-green-600 dark:hover:text-white"
                      >
                        <Pencil
                          size={17}
                          strokeWidth={2}
                          className="transition-transform duration-200 group-hover:scale-110"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEventId(event._id);
                          setDeleteDialogOpen(true);
                        }}
                        title="Delete event"
                        aria-label="Delete event"
                        className="group flex h-11 w-full items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 active:translate-y-0 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:border-red-500 dark:hover:bg-red-500 dark:hover:text-white"
                      >
                        <Trash2
                          size={17}
                          strokeWidth={2}
                          className="transition-transform duration-200 group-hover:scale-110"
                        />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-white/10 dark:bg-[#172117]">
              <CalendarDays size={35} className="mx-auto mb-3 text-gray-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                No events found
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                You have not created any events matching this search.
              </p>
              <Link
                href="/create-event"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                <Plus size={16} />
                Create Event
              </Link>
            </div>
          )}
        </div>
      </section>

      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#172117] sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Event
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update your event information.
                </p>
              </div>

              <button
                onClick={() => setEditingEvent(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-white/10"
                aria-label="Close edit form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Event Title
                </label>
                <input
                  name="title"
                  required
                  defaultValue={editingEvent.title}
                  className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-green-500 dark:border-white/10 dark:bg-[#0d160f] dark:text-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    defaultValue={editingEvent.category}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-green-500 dark:border-white/10 dark:bg-[#0d160f] dark:text-white"
                  >
                    {categories.filter((item) => item !== "All").map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Volunteer Limit
                  </label>
                  <input
                    name="volunteers"
                    type="number"
                    min={Math.max(1, editingEvent.joinedCount)}
                    required
                    defaultValue={editingEvent.volunteers}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-green-500 dark:border-white/10 dark:bg-[#0d160f] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  defaultValue={editingEvent.description}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-green-500 dark:border-white/10 dark:bg-[#0d160f] dark:text-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Event Date
                  </label>
                  <input
                    name="date"
                    type="datetime-local"
                    required
                    defaultValue={new Date(editingEvent.date)
                      .toISOString()
                      .slice(0, 16)}
                    min={new Date(Date.now() + 60000)
                      .toISOString()
                      .slice(0, 16)}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-green-500 dark:border-white/10 dark:bg-[#0d160f] dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    name="location"
                    required
                    defaultValue={editingEvent.location}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-green-500 dark:border-white/10 dark:bg-[#0d160f] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Replace Event Image (Optional)
                </label>
                <input
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-green-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-green-700 dark:border-white/10 dark:bg-[#0d160f] dark:text-gray-300 dark:file:bg-green-950/40 dark:file:text-green-400"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  JPG, PNG or WEBP. Maximum 5 MB.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-white/10 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  disabled={saving}
                  className="h-11 rounded-lg border border-gray-200 px-5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-green-700 px-6 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!deletingId) {
            setDeleteDialogOpen(open);

            if (!open) {
              setSelectedEventId(null);
            }
          }
        }}
      >
        <AlertDialogContent className="max-w-md rounded-2xl border-gray-100 dark:border-white/10 dark:bg-[#142018]">
          <AlertDialogHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <AlertTriangle size={23} />
            </div>

            <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Delete this event?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm leading-6 text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this event? This action cannot be
              undone, and related registrations will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-3 gap-2">
            <AlertDialogCancel
              disabled={!!deletingId}
              className="rounded-xl dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={!!deletingId || !selectedEventId}
              className="rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              <Trash2 size={16} className="mr-2" />
              {deletingId ? "Deleting..." : "Delete Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
