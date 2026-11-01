
"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="h-28 min-w-[75%] animate-pulse rounded-xl bg-secondary sm:h-32 sm:min-w-[32%] lg:min-w-[calc((100%-60px)/6)]"
          />
        ))}
      </div>
    );
  }

  if (galleryImages.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No gallery images available yet.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-end gap-3">
        <button
          type="button"
          aria-label="Previous gallery images"
          onClick={() => carouselApi?.scrollPrev()}
          disabled={!carouselApi?.canScrollPrev()}
          className="group flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-card text-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft
            size={20}
            strokeWidth={2.2}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
        </button>

        <button
          type="button"
          aria-label="Next gallery images"
          onClick={() => carouselApi?.scrollNext()}
          disabled={!carouselApi?.canScrollNext()}
          className="group flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight
            size={20}
            strokeWidth={2.2}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </button>
      </div>

      <Carousel
        setApi={setCarouselApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {galleryImages.map((item) => (
            <CarouselItem
              key={item._id}
              className="basis-[75%] pl-3 sm:basis-1/3 lg:basis-1/6"
            >
              <div className="group relative h-28 overflow-hidden rounded-xl sm:h-32">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute bottom-3 left-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-xs font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[10px] text-white/80">
                    {item.category}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
