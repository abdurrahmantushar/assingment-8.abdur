"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=500&q=85",
    title: "Tree Plantation",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=500&q=85",
    title: "Community Volunteering",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=500&q=85",
    title: "Community Cleanup",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=500&q=85",
    title: "Food Donation",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=500&q=85",
    title: "Helping People",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=500&q=85",
    title: "Education Support",
  },
];

export default function GalleryCarousel() {
  const scrollGallery = (direction: "left" | "right") => {
    document.getElementById("impact-gallery")?.scrollBy({
      left: direction === "right" ? 300 : -300,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="mb-4 hidden items-center gap-2 sm:flex">
        <button
          type="button"
          aria-label="Previous gallery images"
          onClick={() => scrollGallery("left")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-green-600 hover:bg-green-50 hover:text-green-700 dark:border-white/10 dark:text-gray-300 dark:hover:bg-green-500/10"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          aria-label="Next gallery images"
          onClick={() => scrollGallery("right")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-green-600 hover:bg-green-50 hover:text-green-700 dark:border-white/10 dark:text-gray-300 dark:hover:bg-green-500/10"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div
        id="impact-gallery"
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {galleryImages.map((item) => (
          <div
            key={item.id}
            className="group relative h-28 min-w-[75%] snap-start overflow-hidden rounded-xl sm:h-32 sm:min-w-[32%] lg:min-w-[calc((100%-60px)/6)]"
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <p className="absolute bottom-3 left-3 translate-y-2 text-xs font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}