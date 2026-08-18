import { Hero } from '@/components/Home/Hero';
import { PartnersMarquee } from '@/components/Home/PartnersMarquee';
import { ProductsGrid } from '@/components/Home/ProductsGrid';
import { HowItWorksSection } from '@/components/Home/HowItWorksSection';
import { BlogNewsSection } from '@/components/Home/BlogNewsSection';
import { CustomerStoriesSection } from '@/components/Home/CustomerStoriesSection';
import { FAQSection } from '@/components/Home/FAQSection';
import { Reveal } from '@/components/Home/Reveal';

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <Hero />

      <Reveal direction="up">
        <PartnersMarquee />
      </Reveal>

      <Reveal direction="up" delay={80}>
        <ProductsGrid />
      </Reveal>

      <Reveal direction="scale" delay={100}>
        <HowItWorksSection />
      </Reveal>

      <Reveal direction="up" delay={80}>
        <BlogNewsSection />
      </Reveal>

      <Reveal direction="left" delay={100}>
        <CustomerStoriesSection />
      </Reveal>

      <Reveal direction="up" delay={120}>
        <FAQSection />
      </Reveal>
    </div>
  );
}
