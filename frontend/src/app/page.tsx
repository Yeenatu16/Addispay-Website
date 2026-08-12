import { Hero } from '@/components/Home/Hero';
import { PartnersMarquee } from '@/components/Home/PartnersMarquee';
import { ProductsGrid } from '@/components/Home/ProductsGrid';
import { HowItWorksSection } from '@/components/Home/HowItWorksSection';
import { BlogNewsSection } from '@/components/Home/BlogNewsSection';
import { CustomerStoriesSection } from '@/components/Home/CustomerStoriesSection';
import { FAQSection } from '@/components/Home/FAQSection';

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Partners Marquee */}
      <PartnersMarquee />

      {/* 3. Products Grid */}
      <ProductsGrid />

      {/* 4. How It Works */}
      <HowItWorksSection />

      {/* 5. Blog & News */}
      <BlogNewsSection />

      {/* 6. Customer Stories */}
      <CustomerStoriesSection />

      {/* 7. FAQ */}
      <FAQSection />
    </div>
  );
}
