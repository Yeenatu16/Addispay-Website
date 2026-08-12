import { Hero } from '@/components/Home/Hero';
import { PartnersMarquee } from '@/components/Home/PartnersMarquee';
import { CustomerStoriesSection } from '@/components/Home/CustomerStoriesSection';
import { CtaSection } from '@/components/home/CtaSection';

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Partner / Client Logos */}
      <PartnersMarquee />

      {/* 3. Testimonials & Customer Stories */}
      <CustomerStoriesSection />

      {/* 4. CTA Banner Section */}
      <CtaSection locale="en" />
    </div>
  );
}
