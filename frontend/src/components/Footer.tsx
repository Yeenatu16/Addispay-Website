'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Smartphone,
  Send,
  Headphones,
} from 'lucide-react';
import AddisPayLogo from './AddisPayLogo';
import { useLanguage } from '@/context/LanguageContext';
import { content, errorMessage } from '@/lib/api';

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [email, setEmail] = React.useState('');
  const [subscribing, setSubscribing] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubscribing(true);
    setMessage('');
    setError('');
    try {
      const result = await content.subscribe(email);
      setMessage(result.message);
      setEmail('');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubscribing(false);
    }
  }

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

            <form onSubmit={handleSubscribe} className="space-y-3 rounded-3xl border border-[#00A36D]/15 bg-white p-4 shadow-xs max-w-md">
              <div>
                <h3 className="text-sm font-black text-[#101828]">Stay updated</h3>
                <p className="text-xs text-gray-500">Get product updates, company news, and merchant tips in your inbox.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="flex-1 rounded-xl border border-gray-200 bg-[#F8FDFB] px-4 py-3 text-sm outline-none focus:border-[#00A36D]"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="rounded-xl bg-[#00A36D] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#008959] disabled:opacity-60"
                >
                  {subscribing ? 'Joining...' : 'Subscribe'}
                </button>
              </div>
              {message && <p className="text-xs font-semibold text-emerald-700">{message}</p>}
              {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
            </form>

            {/* App & Soft POS Download Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="https://play.google.com/store/apps/details?id=com.addispayspos"
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
                className="inline-flex items-center gap-2 bg-[#101828] hover:bg-[#1e293b] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:-translate-y-0.5 border border-slate-800"
              >
                {/* Theme Compatible Google Play Store Icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 512 512">
                  <path fill="#00A36D" d="M47.2 24.2C41.7 29.8 38.6 38.3 38.6 49.3v413.4c0 11 3.1 19.5 8.6 25.1l1.4 1.3L277 260.6v-5.2L48.6 22.9l-1.4 1.3z" />
                  <path fill="#F5A414" d="M355.7 339.3l-78.7-78.7v-5.2l78.7-78.7 1.8 1 93.3 53c26.6 15.1 26.6 39.9 0 55.1l-93.3 53-1.8 0.5z" />
                  <path fill="#00A36D" d="M277 255.4L47.2 488.1c8.7 9.2 23 10.3 39 1.3l269.5-150.1-78.7-78.7-1.8-5.2z" />
                  <path fill="#F5A414" d="M277 256.6l78.7-78.7L86.2 27.8C70.2 18.7 55.9 19.8 47.2 29L277 256.6z" />
                </svg>
                <span>Addispay App</span>
              </a>
            </div>

            {/* Social Media Links with Pure SVG Icons */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <a
                href="https://t.me/addispaysc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#00A36D] hover:border-[#00A36D] transition-all shadow-2xs"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>

              <a
                href="https://www.linkedin.com/company/addispay/posts/?feedView=all&viewAsMember=true"
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
                aria-label="Twitter (X)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a
                href="https://facebook.com/addispaysc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#00A36D] hover:border-[#00A36D] transition-all shadow-2xs"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="https://instagram.com/addispay"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#00A36D] hover:border-[#00A36D] transition-all shadow-2xs"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
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
                <Link
                  href="/terms"
                  className="text-[#1A1F36] hover:text-[#00A36D] font-bold transition-colors"
                >
                  Terms &amp; Conditions
                </Link>
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

          {/* Column 4: company & contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#00A36D]">
              company
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/contact" className="text-[#00A36D] font-bold hover:underline">
                  Contact Us
                </Link>
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
              <li>
                <Link href="/contact" className="text-[#1A1F36] hover:text-[#00A36D] transition-colors">
                  Become a Partner
                </Link>
              </li>
              <li>
                <a
                  href="https://uat.dashboard.addispay.et/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1A1F36] hover:text-[#00A36D] transition-colors inline-flex items-center gap-1"
                >
                  <span>Become a Merchant</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Column 5: Get in touch & Call Center 8710 */}
        <div className="py-8 border-b border-[#00A36D]/15 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-lg font-black text-[#101828]">Get in touch</h3>
            <p className="text-xs text-gray-600 font-medium">
              Questions or feedback? We love to hear from you.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-700">
            {/* Call Center Shortcode 8710 */}
            <div className="flex items-center gap-2.5 bg-[#E5F5EE]/60 p-3 rounded-2xl border border-[#00A36D]/20 shadow-2xs">
              <Headphones className="w-5 h-5 text-[#00A36D] shrink-0" />
              <div>
                <div className="text-[10px] text-gray-500 font-bold uppercase">Call Center</div>
                <div className="text-sm font-black text-[#101828]">8710</div>
              </div>
            </div>

            {/* Direct Phone */}
            <div className="flex items-center gap-2.5 bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs">
              <Phone className="w-5 h-5 text-[#00A36D] shrink-0" />
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Phone Support</div>
                <div className="text-xs font-bold text-[#101828]">+251 11 668 5873</div>
              </div>
            </div>

            {/* Email Support */}
            <div className="flex items-center gap-2.5 bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs">
              <Mail className="w-5 h-5 text-[#00A36D] shrink-0" />
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Email Support</div>
                <div className="text-xs font-bold text-[#101828]">support@addispay.et</div>
              </div>
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
