"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, ChevronDown, Check } from "lucide-react";
import { supportedLocales, localeLabels, Locale } from "@/lib/locales";

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchLocale = (targetLocale: Locale) => {
    setIsOpen(false);
    if (targetLocale === currentLocale) return;

    // Replace current locale segment in pathname (e.g., /en/home -> /am/home)
    const segments = pathname.split("/");
    if (segments.length > 1 && supportedLocales.includes(segments[1] as Locale)) {
      segments[1] = targetLocale;
    } else {
      segments.unshift("", targetLocale);
    }
    const newPath = segments.join("/") || `/${targetLocale}`;
    router.push(newPath);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
        aria-label="Switch Language"
      >
        <Globe className="w-4 h-4 text-emerald-600" />
        <span>{localeLabels[currentLocale as Locale] || "Language"}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-fadeIn">
          {supportedLocales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSwitchLocale(loc)}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors ${
                currentLocale === loc
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>{localeLabels[loc]}</span>
              {currentLocale === loc && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
