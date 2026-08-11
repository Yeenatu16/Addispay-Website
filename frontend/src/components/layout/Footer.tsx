"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { getDictionary } from "@/lib/dictionary";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer({ locale }: { locale: string }) {
  const dict = getDictionary(locale as "en" | "am");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Bio & Security */}
          <div className="lg:col-span-2 space-y-6">
            <Link href={`/${locale}/home`} className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-500 flex items-center justify-center text-slate-950 font-black text-base shadow-lg">
                AP
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Addis<span className="text-emerald-400">Pay</span>
                </span>
                <span className="block text-[10px] font-semibold text-emerald-400 uppercase tracking-widest leading-none">
                  Fintech Solutions
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {dict.footer.aboutText}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>PCI-DSS Level 1</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                <Lock className="w-4 h-4 text-teal-400" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {dict.footer.productsTitle}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href={`/${locale}/products`} className="hover:text-emerald-400 transition-colors">
                  Payment Gateway
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products`} className="hover:text-emerald-400 transition-colors">
                  Mobile Money Aggregator
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products`} className="hover:text-emerald-400 transition-colors">
                  E-Commerce Checkout
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products`} className="hover:text-emerald-400 transition-colors">
                  QR Code Payment
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products`} className="hover:text-emerald-400 transition-colors">
                  Invoicing & Payment Links
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {dict.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href={`/${locale}/aboutus`} className="hover:text-emerald-400 transition-colors">
                  {dict.nav.aboutus}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/business`} className="hover:text-emerald-400 transition-colors">
                  {dict.nav.business}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/news`} className="hover:text-emerald-400 transition-colors">
                  {dict.nav.news}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blogs`} className="hover:text-emerald-400 transition-colors">
                  {dict.nav.blogs}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/carrers`} className="hover:text-emerald-400 transition-colors">
                  {dict.nav.careers}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {dict.footer.contactTitle}
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{dict.footer.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{dict.footer.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{dict.footer.email}</span>
              </li>
            </ul>

            <div className="pt-2">
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Stay updated
              </label>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5">
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition-colors cursor-pointer"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {year} AddisPay Website. {dict.footer.rights}</p>

          <div className="flex items-center gap-6">
            <Link href={`/${locale}/privacy`} className="hover:text-slate-300 transition-colors">
              {dict.footer.privacyPolicy}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-slate-300 transition-colors">
              {dict.footer.termsOfService}
            </Link>
            <div className="pl-2 border-l border-slate-800">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
