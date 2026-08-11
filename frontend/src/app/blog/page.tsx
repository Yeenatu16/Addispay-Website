'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const articles = [
  {
    image: '/images/blog_sme_growth.png',
    tag: 'Growth',
    title: 'How Ethiopian SMEs Are Growing 3x Faster with Digital Payments',
    excerpt: 'An analysis of transaction data from 12,000 small businesses shows that merchants who switched to Addispay increased monthly revenue by 31%.',
    readTime: '7 min read',
    date: 'Aug 2, 2026',
  },
  {
    image: '/images/blog_security.png',
    tag: 'Security',
    title: 'Bank-Grade Security: How Addispay Keeps Every Transaction Safe',
    excerpt: 'We use 256-bit AES encryption, real-time fraud detection, and are fully NBE-licensed under NPS/PSO/007/2022.',
    readTime: '6 min read',
    date: 'Aug 1, 2026',
  },
  {
    image: '/images/blog_api_v3.png',
    tag: 'Developer',
    title: 'Addispay API v3: Faster Webhooks, Better SDKs, Zero Downtime',
    excerpt: 'Our v3 API brings latency down to under 80ms, adds Python and Go SDKs, and introduces idempotency keys.',
    readTime: '8 min read',
    date: 'Jul 31, 2026',
  },
  {
    image: '/images/blog_series_a.png',
    tag: 'Company News',
    title: 'Addispay Closes Series A: ETB 380M to Expand Across East Africa',
    excerpt: 'We are thrilled to announce our Series A round led by Aldar Capital to power expansion across East Africa.',
    readTime: '4 min read',
    date: 'Jul 30, 2026',
  },
  {
    image: '/images/blog_split_payments.png',
    tag: 'Product',
    title: 'Split Payments Are Here: Share Bills Instantly with Anyone',
    excerpt: 'From restaurant tabs to group travel, Addispay’s new Split feature lets you divide any amount in one tap.',
    readTime: '3 min read',
    date: 'Jul 28, 2026',
  },
  {
    image: '/images/blog_woocommerce.png',
    tag: 'Guide',
    title: 'Integrating Addispay into Your WooCommerce Store in 15 Minutes',
    excerpt: 'A step-by-step guide for Ethiopian online retailers: install plugin, configure webhooks, test and go live.',
    readTime: '10 min read',
    date: 'Jul 25, 2026',
  },
];

export default function BlogPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter(
    (art) =>
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
      
      {/* Blog Hero Header */}
      <div className="bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-16 lg:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00A36D]/10 text-[#00A36D] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-[#00A36D]" />
            <span>{t('blog.badge')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#101828] tracking-tight">
            {t('blog.title')}
          </h1>

          <p className="text-base sm:text-lg text-[#6A7282] max-w-2xl mx-auto leading-relaxed">
            {t('blog.subtitle')}
          </p>

          {/* Search Input */}
          <div className="max-w-md mx-auto pt-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('blog.search_placeholder')}
                className="w-full bg-white pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:border-[#00A36D] text-sm text-gray-800 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Featured Story */}
        <div className="mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-[#00A36D] mb-4 block">
            {t('blog.featured')}
          </span>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 hover:shadow-2xl transition-shadow">
            <div className="relative h-64 lg:h-auto min-h-[300px]">
              <Image
                src="/images/blog_qr_launch.png"
                alt="Addispay QR Launch"
                fill
                className="object-cover"
              />
            </div>

            <div className="p-8 lg:p-12 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#00A36D] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  Featured
                </span>
                <span className="text-xs text-gray-500 font-medium">August 4, 2026 · 5 min read</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#101828] leading-snug">
                Addispay Launches Instant QR Payment for 50,000+ Ethiopian Merchants
              </h2>

              <p className="text-[#6A7282] text-sm leading-relaxed">
                Our new QR-based checkout lets customers pay in under 3 seconds — no app download required. Rolling out nationwide to all registered Addispay merchant partners.
              </p>

              <div className="pt-2">
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 text-[#00A36D] font-bold text-sm hover:gap-3 transition-all"
                >
                  <span>{t('blog.read_more')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Articles Grid + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Articles (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="text-xl font-bold text-[#101828]">{t('blog.latest_articles')}</h3>
              <span className="text-xs text-gray-500 font-semibold">{filteredArticles.length} articles</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredArticles.map((art, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={art.image}
                        alt={art.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#00A36D] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                        {art.tag}
                      </span>
                    </div>

                    <div className="p-6 space-y-2">
                      <h4 className="font-bold text-[#101828] text-base group-hover:text-[#00A36D] transition-colors leading-snug line-clamp-2">
                        {art.title}
                      </h4>
                      <p className="text-xs text-[#6A7282] leading-relaxed line-clamp-2">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs text-gray-400 font-medium">
                    <span>{art.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#00A36D]" /> {art.readTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Updates (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
              <h3 className="font-bold text-lg text-[#101828] border-b border-gray-100 pb-3">
                {t('blog.latest_updates')}
              </h3>

              <div className="space-y-4">
                {[
                  { tag: "Security", title: "Two-Factor Authentication Mandatory for Business Accounts", date: "Aug 4, 2026" },
                  { tag: "Product Updates", title: "Dark Mode Lands in the Addispay Mobile App", date: "Aug 2, 2026" },
                  { tag: "Company News", title: "Addispay Named in Forbes Africa FinTech 50 List", date: "Jul 29, 2026" },
                  { tag: "Developer", title: "New Python & Node.js SDK Releases Now Available", date: "Jul 24, 2026" },
                ].map((item, i) => (
                  <div key={i} className="space-y-1 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold text-[#00A36D] uppercase">{item.tag}</span>
                    <h4 className="text-xs font-bold text-gray-800 hover:text-[#00A36D] cursor-pointer transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 block">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
