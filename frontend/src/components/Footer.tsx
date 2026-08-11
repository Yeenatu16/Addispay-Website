'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ExternalLink,
  Smartphone,
  Send,
  FileText,
  BookOpen,
} from 'lucide-react';
import AddisPayLogo from './AddisPayLogo';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <footer className="bg-[#F1FAF7] border-t border-[#E5F5EE] pt-16 pb-12 text-[#101828]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#00A36D]/15">
          
          {/* Column 1: Brand & App Download Badges (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <AddisPayLogo animated={true} size="md" />

            <p className="text-[#1A1F36] text-sm leading-relaxed max-w-sm font-normal">
              Providing a one touch end to end commercial transaction experience for consumers and businesses in Africa.
            </p>

            {/* App & Soft POS Download Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="https://play.google.com/store/apps/details?id=com.addispay.merchant"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#00A36D] hover:bg-[#008959] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#00A36D]/20 hover:-translate-y-0.5"
              >
                <Smartphone className="w-4 h-4 text-white" />
                <span>Download Soft POS</span>
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.addispay.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#101828] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:-translate-y-0.5"
              >
                <Smartphone className="w-4 h-4 text-white" />
                <span>Addispay App</span>
              </a>
            </div>

            {/* Social Media Links with Pure SVG Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me/addispay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#00A36D] hover:border-[#00A36D] transition-all shadow-2xs"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com/company/addispay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#00A36D] hover:border-[#00A36D] transition-all shadow-2xs"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>

              <a
                href="https://twitter.com/addispay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#00A36D] hover:border-[#00A36D] transition-all shadow-2xs"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a
                href="https://facebook.com/addispay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#00A36D] hover:border-[#00A36D] transition-all shadow-2xs"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>

          </div>

          {/* Column 2: resources */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#00A36D]">
              resources
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href="https://devportal.addispay.et/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1A1F36] hover:text-[#00A36D] transition-colors inline-flex items-center gap-1 font-semibold"
                >
                  <span>Documentations</span>
                  <ExternalLink className="w-3 h-3 text-[#00A36D]" />
                </a>
              </li>
              <li>
                <Link href="/brochure" className="text-[#1A1F36] hover:text-[#00A36D] transition-colors">
                  Brochure &amp; Gallery
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#1A1F36] hover:text-[#00A36D] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#1A1F36] hover:text-[#00A36D] transition-colors">
                  Blog &amp; News
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: legal */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#00A36D]">
              legal
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/doc" className="text-[#1A1F36] hover:text-[#00A36D] transition-colors">
                  Documents
                </Link>
              </li>
              <li>
                <a
                  href="https://addispay.et/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1A1F36] hover:text-[#00A36D] transition-colors inline-flex items-center gap-1"
                >
                  <span>Privacy Policy</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://addispay.et/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1A1F36] hover:text-[#00A36D] transition-colors inline-flex items-center gap-1"
                >
                  <span>Terms &amp; Conditions</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <Link
                  href="/merchant-agreement"
                  className="text-[#00A36D] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Merchant Service Agreement</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: more */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#00A36D]">
              more
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/contact" className="text-[#1A1F36] hover:text-[#00A36D] transition-colors font-semibold">
                  Become a Partner
                </Link>
              </li>
              <li>
                <a
                  href="https://dashboard.addispay.et/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00A36D] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Become a Merchant</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="/about" className="text-[#1A1F36] hover:text-[#00A36D] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-[#1A1F36] hover:text-[#00A36D] transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Column 5: Get in touch & Contact Information */}
        <div className="py-8 border-b border-[#00A36D]/15 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-2">
            <h3 className="text-lg font-black text-[#101828]">Get in touch</h3>
            <p className="text-xs text-gray-600 font-medium">
              Questions or feedback we love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#00A36D] shrink-0" />
              <span>+251116685873</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#00A36D] shrink-0" />
              <span>support@addispay.et</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00A36D] shrink-0" />
              <span>Near Lem Hotel Efrata Building 4th Floor</span>
            </div>
          </div>

        </div>

        {/* Bottom Rights & Merchant Agreement Badge */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <p>© {new Date().getFullYear()} Addispay Financial Technology Share Company. All rights reserved.</p>
            <span className="hidden md:inline text-gray-300">·</span>
            <Link
              href="/merchant-agreement"
              className="text-[#00A36D] font-bold hover:underline inline-flex items-center gap-1 bg-[#E5F5EE] px-3.5 py-1.5 rounded-full border border-[#00A36D]/20 shadow-2xs"
            >
              <span>Merchant Service Agreement</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
