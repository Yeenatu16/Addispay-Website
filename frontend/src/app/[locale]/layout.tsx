import type { ReactNode } from "react";
import { supportedLocales } from "@/lib/locales";
import { notFound } from "next/navigation";

export const generateStaticParams = () => supportedLocales.map((locale) => ({ locale }));

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!supportedLocales.includes(locale as any)) {
    notFound();
  }

  return <>{children}</>;
}
