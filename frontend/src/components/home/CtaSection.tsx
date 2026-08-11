import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { getDictionary } from "@/lib/dictionary";
import { Button } from "../ui/Button";

export function CtaSection({ locale }: { locale: string }) {
  const dict = getDictionary(locale as "en" | "am");

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-8 sm:p-14 overflow-hidden shadow-2xl text-white">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Instant Merchant Onboarding</span>
            </div>

            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {dict.cta.title}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {dict.cta.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <a
                href="https://merchant.addispay.et"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="gold"
                  size="xl"
                  fullWidth
                  rightIcon={<ExternalLink className="w-5 h-5" />}
                >
                  {dict.cta.buttonText}
                </Button>
              </a>

              <Link href={`/${locale}/contactus`} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="xl"
                  fullWidth
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {dict.cta.contactSales}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
