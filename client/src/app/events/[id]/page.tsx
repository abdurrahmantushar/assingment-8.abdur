import { Suspense } from "react";
import EventDetailsClient from "@/components/events/EventDetailsClient";

export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-[#f8faf6] dark:bg-[#0d160f]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
        </div>
      }
    >
      <EventDetailsClient />
    </Suspense>
  );
}