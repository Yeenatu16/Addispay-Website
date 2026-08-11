import React from "react";
import { Star, Quote } from "lucide-react";
import { getDictionary } from "@/lib/dictionary";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Testimonial } from "@/lib/types";

const testimonialsList: Testimonial[] = [
  {
    id: "test-1",
    name: "Abebe Kebede",
    role: "CEO & Co-founder",
    company: "Habesha E-Commerce",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    quote: "Integrating AddisPay was a game changer for us. We enabled Telebirr and CBE Birr payments overnight and saw our checkout conversion jump by 45%.",
    rating: 5,
  },
  {
    id: "test-2",
    name: "Bethlehem Tadesse",
    role: "Head of Digital Products",
    company: "Zemen Tech Solutions",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    quote: "The developer documentation and clean API SDKs saved our team weeks of work. AddisPay's sandbox environment allowed us to test thoroughly before going live.",
    rating: 5,
  },
  {
    id: "test-3",
    name: "Yonas Alemu",
    role: "Managing Director",
    company: "Bole Luxury Hotel",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    quote: "The instant QR code settlement and POS soundbox notifications transformed our front desk payment workflow. Zero delayed transactions!",
    rating: 5,
  },
];

export function TestimonialsSection({ locale }: { locale: string }) {
  const dict = getDictionary(locale as "en" | "am");

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="gold" size="md">
            {dict.testimonials.tagline}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {dict.testimonials.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {dict.testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsList.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-slate-800/80 border border-slate-700/80 p-8 shadow-xl relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-emerald-400 opacity-60" />

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-200 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author info */}
              <div className="pt-6 mt-6 border-t border-slate-700/60 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/50"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-xs text-slate-400">
                    {item.role}, <span className="text-emerald-400 font-semibold">{item.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
