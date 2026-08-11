"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ExternalLink, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getDictionary } from "@/lib/dictionary";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "../ui/Button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  navItems: Array<{ labelKey: string; href: string; defaultLabel: string }>;
}

export function MobileNav({ isOpen, onClose, locale, navItems }: MobileNavProps) {
  const pathname = usePathname();
  const dict = getDictionary(locale as "en" | "am");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl flex flex-col justify-between p-6 z-10 border-l border-slate-200"
          >
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    AP
                  </div>
                  <div>
                    <span className="text-base font-bold text-slate-900 tracking-tight">AddisPay</span>
                    <span className="block text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">
                      Fintech
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Switcher bar */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
                <span className="text-xs font-medium text-slate-600">Language / ቋንቋ</span>
                <LanguageSwitcher currentLocale={locale} />
              </div>

              {/* Nav links list */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const href = `/${locale}/${item.href}`;
                  const isActive = pathname.startsWith(href);
                  const label =
                    dict.nav[item.labelKey as keyof typeof dict.nav] || item.defaultLabel;

                  return (
                    <Link
                      key={item.href}
                      href={href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{label}</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <a
                href="https://merchant.addispay.et"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
              >
                <Button variant="primary" size="md" fullWidth rightIcon={<ExternalLink className="w-4 h-4" />}>
                  {dict.nav.merchantPortal}
                </Button>
              </a>

              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>PCI-DSS Level 1 Certified</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
