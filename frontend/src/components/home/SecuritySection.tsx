import React from "react";
import { ShieldCheck, Lock, AlertOctagon, Headset, CheckCircle2 } from "lucide-react";
import { getDictionary } from "@/lib/dictionary";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

export function SecuritySection({ locale }: { locale: string }) {
  const dict = getDictionary(locale as "en" | "am");

  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: dict.security.feature1Title,
      description: dict.security.feature1Desc,
    },
    {
      icon: Lock,
      title: dict.security.feature2Title,
      description: dict.security.feature2Desc,
    },
    {
      icon: AlertOctagon,
      title: dict.security.feature3Title,
      description: dict.security.feature3Desc,
    },
    {
      icon: Headset,
      title: dict.security.feature4Title,
      description: dict.security.feature4Desc,
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <Badge variant="gold" size="md">
              {dict.security.tagline}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              {dict.security.title}
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              {dict.security.subtitle}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">Continuous vulnerability audits & penetration testing</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">ISO 27001 Information Security Standard certified</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">Redundant server clusters across multiple geographic regions</span>
              </div>
            </div>
          </div>

          {/* Right Security Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {securityFeatures.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 transition-all space-y-3"
                >
                  <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 w-fit">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
