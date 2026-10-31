
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Heart,
    ImagePlus,
    Leaf,
    Loader2,
    MapPin,
    Sparkles,
    Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const categories = [
    { name: "Donation", icon: "🎁", description: "Help people in need" },
    { name: "Environment", icon: "🌱", description: "Protect our planet" },
    { name: "Healthcare", icon: "❤️", description: "Support better health" },
    { name: "Education", icon: "📚", description: "Share knowledge" },
    { name: "Community", icon: "🤝", description: "Build stronger bonds" },
];

export default function CreateEventPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        date: "",
        time: "",
        location: "",
        volunteers: "",
        image: "",
    });

    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [today, setToday] = useState("");
    const { data: session, isPending } = authClient.useSession();
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!session?.user) {
    toast.error("Please login to create an event");
    router.replace("/auth/login");
    return;
}
    
  if (!formData.category) {
    toast.error("Please select an event category");
    return;
  }

  if (!imageFile) {
    toast.error("Please upload an event image");
    return;
  }

  const selectedDate = new Date(
    `${formData.date}T${formData.time}:00+06:00`
  );

  if (Number.isNaN(selectedDate.getTime())) {
    toast.error("Please select a valid date and time");
    return;
  }

  if (selectedDate.getTime() <= Date.now()) {
    toast.error("Please select a future event date and time");
    return;
  }

  setLoading(true);

  try {
    const { data: tokenData, error: tokenError } =
      await authClient.token();

    if (tokenError || !tokenData?.token) {
      toast.error("Authentication failed. Please login again.");
      return;
    }

    const payload = new FormData();

    payload.append("title", formData.title.trim());
    payload.append("category", formData.category);
    payload.append("description", formData.description.trim());
    payload.append("date", selectedDate.toISOString());
    payload.append("location", formData.location.trim());
    payload.append("volunteers", formData.volunteers);
    payload.append("image", imageFile);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: payload,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create event");
    }

    toast.success(data.message || "Event created successfully!");

    router.push("/upcoming-events");
    router.refresh();
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

    const inputClass =
        "w-full rounded-xl border border-gray-200 bg-[#fafcf9] px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-green-300 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-600/10 dark:border-white/10 dark:bg-[#17251a] dark:text-white dark:placeholder:text-gray-500 dark:focus:bg-[#1b2b1f]";

    const labelClass =
        "mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200";

    const selectedCategory = categories.find(
        (category) => category.name === formData.category
    );

    const previewImage = imagePreview;

    useEffect(() => {
  setToday(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date())
  );
    }, []);

    useEffect(() => {
        if (isPending) return;

        if (!session?.user) {
            router.replace("/auth/login");
        }
    }, [session, isPending, router]);

    if (isPending || !session?.user) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f5f8f2] dark:bg-[#0b150e]">
            <Loader2
                size={34}
                className="animate-spin text-green-700 dark:text-green-400"
            />
        </main>
    );
}
    return (
        <main className="min-h-screen bg-[#f5f8f2] px-4 py-8 dark:bg-[#0b150e] sm:px-6 sm:py-12">
            <div className="mx-auto max-w-[1600px]">
                <Link
                    href="/"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700 dark:text-gray-400 dark:hover:text-green-400"
                >
                    <ArrowLeft size={17} />
                    Back to Home
                </Link>

                <div className="relative mb-9 overflow-hidden rounded-3xl bg-[#153d27] px-6 py-9 text-white sm:px-10 sm:py-12">
                    <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full bg-green-400/10 blur-2xl" />
                    <div className="absolute -bottom-32 right-1/4 h-64 w-64 rounded-full bg-lime-300/10 blur-2xl" />

                    <div className="relative z-10 max-w-2xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-green-100">
                            <Sparkles size={14} />
                            Make something meaningful
                        </div>

                        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                            Every great change
                            <br />
                            starts with an <span className="text-lime-300">event.</span>
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-green-100/80 sm:text-base">
                            Create a community event, bring people together, and turn small
                            acts of kindness into something extraordinary.
                        </p>

                        <div className="mt-7 flex flex-wrap items-center gap-5 text-xs font-medium text-green-100/90">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 size={15} />
                                Easy to organize
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 size={15} />
                                Community focused
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 size={15} />
                                Real impact
                            </span>
                        </div>
                    </div>

                    <div className="absolute bottom-5 right-8 hidden rotate-[-12deg] opacity-20 lg:block">
                        <Leaf size={150} strokeWidth={0.8} />
                    </div>
                </div>

                <div className="grid items-start gap-7 lg:grid-cols-[1fr_350px]">
                    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/10 dark:bg-[#142018]">
                        <div className="border-b border-gray-100 px-5 py-6 dark:border-white/10 sm:px-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                                    <CalendarDays size={21} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Event Details
                                    </h2>
                                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                        Fill in the information to create your event.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-7 p-5 sm:p-8">
                            <div>
                                <label className={labelClass}>Event Title *</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Winter Clothes Distribution"
                                    className={inputClass}
                                    required
                                />
                                <p className="mt-2 text-xs text-gray-400">
                                    Choose a clear title that explains your event.
                                </p>
                            </div>

                            <div>
                                <label className={labelClass}>Choose a Category *</label>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {categories.map((category) => {
                                        const active = formData.category === category.name;

                                        return (
                                            <button
                                                key={category.name}
                                                type="button"
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        category: category.name,
                                                    }))
                                                }
                                                className={`rounded-xl border p-3 text-left transition ${active
                                                        ? "border-green-600 bg-green-50 ring-2 ring-green-600/10 dark:border-green-500 dark:bg-green-500/10"
                                                        : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50 dark:border-white/10 dark:bg-[#17251a] dark:hover:bg-green-500/5"
                                                    }`}
                                            >
                                                <span className="text-2xl">{category.icon}</span>
                                                <span className="mt-2 block text-xs font-bold text-gray-800 dark:text-gray-100">
                                                    {category.name}
                                                </span>
                                                <span className="mt-1 block text-[10px] leading-4 text-gray-400">
                                                    {category.description}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>About This Event *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    placeholder="Tell people what your event is about, why it matters, and how they can contribute..."
                                    rows={5}
                                    className={`${inputClass} resize-none`}
                                    required
                                />
                            </div>

                            <div className="border-t border-gray-100 pt-6 dark:border-white/10">
                                <h3 className="mb-5 text-sm font-bold text-gray-900 dark:text-white">
                                    Date, Time & Location
                                </h3>

                                <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                <label className={labelClass}>
                                    <span className="flex items-center gap-2">
                                    <CalendarDays size={15} className="text-green-700" />
                                    Event Date *
                                    </span>
                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={today}
                                    className={inputClass}
                                    required
                                />
                                </div>

                                    <div>
                                        <label className={labelClass}>
                                            <span className="flex items-center gap-2">
                                                <Clock3 size={15} className="text-green-700" />
                                                Event Time *
                                            </span>
                                        </label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleChange}
                                            className={inputClass}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label className={labelClass}>
                                        <span className="flex items-center gap-2">
                                            <MapPin size={15} className="text-green-700" />
                                            Event Location *
                                        </span>
                                    </label>
                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Enter event venue or full address"
                                        className={inputClass}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6 dark:border-white/10">
                                <h3 className="mb-5 text-sm font-bold text-gray-900 dark:text-white">
                                    Volunteers & Cover Image
                                </h3>

                                <div>
                                    <label className={labelClass}>
                                        <span className="flex items-center gap-2">
                                            <Users size={15} className="text-green-700" />
                                            Volunteer Limit *
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        name="volunteers"
                                        value={formData.volunteers}
                                        onChange={handleChange}
                                        placeholder="e.g. 50"
                                        min="1"
                                        className={inputClass}
                                        required
                                    />
                                </div>

                            <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-2">
                                <ImagePlus size={15} className="text-green-700" />
                                Event Cover Image *
                                </span>
                            </label>

                            <label className="group mt-2 flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-green-200 bg-green-50/50 transition hover:border-green-500 hover:bg-green-50 dark:border-green-500/20 dark:bg-green-500/5 dark:hover:bg-green-500/10">
                                {imagePreview ? (
                                <div className="relative w-full">
                                    <img
                                    src={imagePreview}
                                    alt="Event preview"
                                    className="h-56 w-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                                    <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-800">
                                        Change Image
                                    </span>
                                    </div>
                                </div>
                                ) : (
                                <div className="flex flex-col items-center px-5 py-12 text-center">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                                    <ImagePlus size={27} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                                    Click to upload event image
                                    </span>
                                    <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    PNG, JPG or WEBP · Maximum 5MB
                                    </span>
                                </div>
                                )}

                                <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];

                                    if (!file) return;

                                    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                                    toast.error("Only JPG, PNG and WEBP images are allowed");
                                    e.target.value = "";
                                    return;
                                    }

                                    if (file.size > 5 * 1024 * 1024) {
                                    toast.error("Image size must be less than 5MB");
                                    e.target.value = "";
                                    return;
                                    }

                                    setImageFile(file);
                                    setImagePreview(URL.createObjectURL(file));
                                }}
                                />
                            </label>
                            </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 dark:border-white/10 sm:flex-row sm:justify-end">
                                <Link
                                    href="/"
                                    className="rounded-xl border border-gray-200 px-6 py-3.5 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-700/15 transition hover:-translate-y-0.5 hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? "Creating Event..." : "Create Event"}
                                    {!loading && <ArrowRight size={17} />}
                                </button>
                            </div>
                        </form>
                    </section>

                    <aside className="space-y-5 lg:sticky lg:top-6">
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/10 dark:bg-[#142018]">
                            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/10">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                    Event Preview
                                </h3>
                                <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                                    LIVE PREVIEW
                                </span>
                            </div>

                            <div className="p-4">
                                <div className="relative h-44 overflow-hidden rounded-xl bg-green-50 dark:bg-[#1c3021]">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Event cover preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center gap-2 text-green-700/50 dark:text-green-400/50">
                                            <ImagePlus size={35} strokeWidth={1.5} />
                                            <span className="text-xs font-medium">
                                                Event cover image
                                            </span>
                                        </div>
                                    )}

                                    {selectedCategory && (
                                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-green-800 shadow-sm">
                                            {selectedCategory.icon} {selectedCategory.name}
                                        </span>
                                    )}
                                </div>

                                <div className="px-1 pb-2 pt-4">
                                    <h4 className="break-words text-lg font-bold text-gray-900 dark:text-white">
                                        {formData.title || "Your event title"}
                                    </h4>

                                    <p className="mt-2 line-clamp-3 min-h-12 text-xs leading-5 text-gray-500 dark:text-gray-400">
                                        {formData.description ||
                                            "Your event description will appear here. Tell the community why this event matters."}
                                    </p>

                                    <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 dark:border-white/10">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <CalendarDays size={15} className="text-green-700" />
                                            {formData.date || "Event date"}
                                            {formData.time && ` · ${formData.time}`}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <MapPin size={15} className="text-green-700" />
                                            {formData.location || "Event location"}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <Users size={15} className="text-green-700" />
                                            {formData.volunteers || "0"} volunteer limit
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-green-100 bg-[#edf6e9] p-5 dark:border-green-500/10 dark:bg-[#15271a]">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm dark:bg-green-500/10 dark:text-green-400">
                                <Heart size={19} />
                            </div>
                            <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">
                                Tips for a great event
                            </h3>

                            <ul className="mt-3 space-y-3">
                                {[
                                    "Choose a clear and engaging title.",
                                    "Explain how volunteers can help.",
                                    "Add the exact venue and event time.",
                                    "Use a relevant, high-quality cover image.",
                                ].map((tip) => (
                                    <li
                                        key={tip}
                                        className="flex gap-2 text-xs leading-5 text-gray-600 dark:text-gray-400"
                                    >
                                        <CheckCircle2
                                            size={15}
                                            className="mt-0.5 shrink-0 text-green-700 dark:text-green-400"
                                        />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-2xl bg-[#153d27] p-5 text-white">
                            <div className="flex items-center gap-2 text-lime-300">
                                <Sparkles size={17} />
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    Your impact matters
                                </span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-green-100/80">
                                One event can inspire dozens of people to make a difference.
                                Start something meaningful today.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
