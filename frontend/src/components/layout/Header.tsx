"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ExternalLink, ArrowRight } from "lucide-react";
import { getDictionary } from "@/lib/dictionary";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { Button } from "../ui/Button";

const navItems = [
  { labelKey: "home", href: "home", defaultLabel: "Home" },
  { labelKey: "products", href: "products", defaultLabel: "Products" },
  { labelKey: "business", href: "business", defaultLabel: "Business Solutions" },
  { labelKey: "news", href: "news", defaultLabel: "News" },
  { labelKey: "blogs", href: "blogs", defaultLabel: "Blogs" },
  { labelKey: "careers", href: "carrers", defaultLabel: "Careers" },
  { labelKey: "aboutus", href: "aboutus", defaultLabel: "About Us" },
  { labelKey: "contactus", href: "contactus", defaultLabel: "Contact Us" },
];

export function Header({ locale }: { locale: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const dict = getDictionary(locale as "en" | "am");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3"
            : "bg-white/80 backdrop-blur-sm border-b border-slate-200/50 py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href={`/${locale}/home`} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-slate-900 flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-105 transition-transform">
              AP
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                Addis<span className="text-emerald-600">Pay</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none">
                Fintech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const href = `/${locale}/${item.href}`;
              const isActive = pathname.startsWith(href);
              const label =
                dict.nav[item.labelKey as keyof typeof dict.nav] || item.defaultLabel;

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <a
              href="https://merchant.addispay.et"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                {dict.nav.merchantPortal}
              </Button>
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher currentLocale={locale} />
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        locale={locale}
        navItems={navItems}
      />
    </>
  );
}
