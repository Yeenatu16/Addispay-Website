"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { supportedLocales, Locale } from "@/lib/locales";

const pathNameMap: Record<string, { en: string; am: string }> = {
  home: { en: "Home", am: "መነሻ" },
  products: { en: "Products", am: "ምርቶች" },
  business: { en: "Business Solutions", am: "የንግድ መፍትሄዎች" },
  news: { en: "News", am: "ዜናዎች" },
  blogs: { en: "Blogs", am: "ብሎግ" },
  carrers: { en: "Careers", am: "ሥራዎች" },
  aboutus: { en: "About Us", am: "ስለ እኛ" },
  contactus: { en: "Contact Us", am: "ያግኙን" },
};

export function Breadcrumbs({ locale }: { locale: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Filter out the locale segment if present
  const pathSegments = segments.filter(
    (seg) => !supportedLocales.includes(seg as Locale)
  );

  if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === "home")) {
    return null; // Don't show breadcrumbs on root homepage
  }

  let currentPath = `/${locale}`;

  const breadcrumbsList = pathSegments.map((seg, idx) => {
    currentPath += `/${seg}`;
    const labelData = pathNameMap[seg];
    const label = labelData
      ? labelData[locale as keyof typeof labelData] || seg
      : seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");

    return {
      label,
      href: currentPath,
      isLast: idx === pathSegments.length - 1,
    };
  });

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
      <ol className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap py-1">
        <li>
          <Link
            href={`/${locale}/home`}
            className="flex items-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Home className="w-3.5 h-3.5 mr-1" />
            <span>{locale === "am" ? "መነሻ" : "Home"}</span>
          </Link>
        </li>

        {breadcrumbsList.map((item) => (
          <li key={item.href} className="flex items-center space-x-2">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {item.isLast ? (
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-slate-900 transition-colors">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
