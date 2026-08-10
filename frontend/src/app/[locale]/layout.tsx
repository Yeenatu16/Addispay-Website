import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { supportedLocales } from "@/lib/locales";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const generateStaticParams = () => supportedLocales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale;
  if (!supportedLocales.includes(locale)) {
    return {
      title: "AddisPay",
      description: "AddisPay fintech solutions",
    };
  }

  return {
    title: locale === "am" ? "AddisPay - አማርኛ" : "AddisPay",
    description: "AddisPay fintech solutions",
  };
}

export default function LocaleLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  if (!supportedLocales.includes(params.locale)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader locale={params.locale} />
      {children}
    </div>
  );
}
