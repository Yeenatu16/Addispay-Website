import React from "react";
import { getDictionary } from "@/lib/dictionary";
import { Badge } from "../ui/Badge";

const partners = [
  { name: "Telebirr", label: "Mobile Wallet" },
  { name: "Commercial Bank of Ethiopia", label: "National Bank" },
  { name: "CBE Birr", label: "Mobile Wallet" },
  { name: "Awash Bank", label: "Commercial Bank" },
  { name: "Dashen Bank", label: "Commercial Bank" },
  { name: "EthSwitch", label: "National Switch" },
  { name: "Bank of Abyssinia", label: "Commercial Bank" },
  { name: "Chapa", label: "Fintech Aggregator" },
];

export function PartnerLogosSection({ locale }: { locale: string }) {
  const dict = getDictionary(locale as "en" | "am");

  return (
    <section className="py-16 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="space-y-2 max-w-2xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {dict.partners.title}
          </h3>
          <p className="text-sm text-slate-500">
            {dict.partners.subtitle}
          </p>
        </div>

        {/* Logos Marquee Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 pt-2">
          {partners.map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500/40 hover:bg-white hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-1.5"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-800 font-bold text-xs">
                {p.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight">{p.name}</span>
              <span className="text-[10px] text-slate-400 font-medium">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
