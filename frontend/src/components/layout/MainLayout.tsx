import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Breadcrumbs } from "./Breadcrumbs";

export interface MainLayoutProps {
  children: React.ReactNode;
  locale: string;
  showBreadcrumbs?: boolean;
}

export function MainLayout({ children, locale, showBreadcrumbs = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 selection:bg-emerald-500 selection:text-white">
      <Header locale={locale} />
      {showBreadcrumbs && <Breadcrumbs locale={locale} />}
      <main className="flex-1 w-full">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
