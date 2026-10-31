import { Camera } from "lucide-react";
import GalleryCarousel from "./GalleryCarousel";

export default function GallerySection() {
  return (
    <section className="bg-white px-5 pb-10 pt-3 dark:bg-[#101810] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-4">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
            <Camera size={14} />
            Our Gallery
          </div>

          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            Moments That Inspire
          </h2>
        </div>

        <GalleryCarousel />
      </div>
    </section>
  );
}