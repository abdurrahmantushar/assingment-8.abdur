
"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  ImageIcon,
} from "lucide-react";

type GalleryImage = {
  _id: string;
  image: string;
  title: string;
  category: string;
};

export default function GalleryCarousel() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const response = await fetch(`${API_URL}/api/gallery`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch gallery");
        }

        setGalleryImages(data.galleryImages || []);
      } catch (error) {
        console.error("Gallery fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="aspect-[4/3] animate-pulse rounded-2xl bg-gray-200 dark:bg-white/10"
          />
        ))}
      </div>
    );
  }

  if (galleryImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-5 py-14 text-center dark:border-white/10 dark:bg-white/[0.03]">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
          <Images size={30} />
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          No Gallery Images Yet
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
          Community moments will appear here. Stay connected and check back
          soon for inspiring stories.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Explore moments from our community
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous gallery images"
            onClick={() => carouselApi?.scrollPrev()}
            disabled={!carouselApi?.canScrollPrev()}
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-green-600 hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-900/10 active:scale-95 disabled:pointer-events-none disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-green-500 dark:hover:bg-green-600 dark:hover:text-white"
          >
            <ChevronLeft
              size={20}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
          </button>

          <button
            type="button"
            aria-label="Next gallery images"
            onClick={() => carouselApi?.scrollNext()}
            disabled={!carouselApi?.canScrollNext()}
            className="group flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-white shadow-md shadow-green-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-lg hover:shadow-green-900/20 active:scale-95 disabled:pointer-events-none disabled:opacity-40 dark:bg-green-600 dark:hover:bg-green-500"
          >
            <ChevronRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>

      <Carousel
        setApi={setCarouselApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 sm:-ml-4">
          {galleryImages.map((item) => (
            <CarouselItem
              key={item._id}
              className="basis-[75%] pl-3 sm:basis-1/3 sm:pl-4 lg:basis-1/6"
            >
              <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-900/10 dark:border-white/10 dark:bg-white/5 dark:hover:shadow-black/30">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="absolute left-3 top-3">
                  <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-md">
                    <ImageIcon size={11} />
                    {item.category}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <h3 className="line-clamp-2 text-sm font-bold text-white">
                    {item.title}
                  </h3>

                  <div className="mt-2 h-0.5 w-10 rounded-full bg-green-400 transition-all duration-500 group-hover:w-16" />
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
