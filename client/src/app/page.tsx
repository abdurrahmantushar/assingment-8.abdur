
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import RecentEventsSection from "@/components/home/RecentEventsSection";
import GallerySection from "@/components/home/GallerySection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection/>
      <RecentEventsSection/>
      <GallerySection/>
      <NewsletterSection/>
    </main>
  );
}
