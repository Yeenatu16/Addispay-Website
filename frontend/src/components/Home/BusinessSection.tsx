'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  Store,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const BusinessSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-gray-100 relative overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-[#00A36D]/8 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00A36D]/10 border border-[#00A36D]/20 text-[#00A36D] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('merchant.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#101828] tracking-tight leading-tight">
            {t('merchant.title_main')} <br className="hidden sm:inline" />
            <span className="text-[#00A36D]">{t('merchant.title_accent')}</span>
          </h2>

          <p className="text-base sm:text-lg text-[#6A7282] leading-relaxed">
            {t('merchant.subtitle')}
          </p>
        </div>

        {/* Feature Split Block: Left Text & Bullets, Right Dashboard Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20">
          
          {/* Left Column (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            <h3 className="text-2xl sm:text-3xl font-black text-[#101828] leading-snug">
              Unified Merchant Acquiring & Settlement Portal
            </h3>

            <p className="text-[#6A7282] text-base leading-relaxed">
              Designed specifically for Ethiopian merchants. Manage your daily cash flow, initiate automated bank settlements, and track customer transactions seamlessly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { icon: Smartphone, title: 'Mobile Money & QR', desc: 'Telebirr, CBE Birr, Awash Birr, M-Pesa' },
                { icon: CreditCard, title: 'Card Acquiring', desc: 'Visa, Mastercard & Local Bank Cards' },
                { icon: TrendingUp, title: 'Automated Payouts', desc: 'Daily & instant real-time bank settlements' },
                { icon: ShieldCheck, title: 'Multi-User Roles', desc: 'Custom permissions for branch cashiers' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="bg-[#F8FDFB] p-4 rounded-2xl border border-[#E5F5EE] space-y-1.5">
                    <div className="flex items-center gap-2 text-[#00A36D] font-bold text-sm">
                      <Icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <Link
                href="/merchant"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-base shadow-lg shadow-[#00A36D]/20 hover:-translate-y-0.5 transition-all"
              >
                <span>{t('merchant.cta_open')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

          </div>

          {/* Right Column: Dashboard Visual (6 Cols) */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-3 border border-gray-200 shadow-2xl shadow-[#00A36D]/10 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
              
              <div className="bg-gray-100/90 rounded-t-2xl px-4 py-2.5 flex items-center justify-between mb-3 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-white px-6 py-1 rounded-md text-xs font-bold text-gray-600 border border-gray-200">
                  uat.dashboard.addispay.et/merchant
                </div>
                <div className="w-12" />
              </div>

              <div className="relative w-full h-[300px] sm:h-[360px] rounded-b-2xl overflow-hidden bg-gray-50">
                <Image
                  src="/images/merchant_hero.png"
                  alt="Addispay Business Dashboard"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

            </div>
          </div>

        </div>

        {/* Business Solutions Tiers by Scale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Small Business */}
          <div className="bg-[#F8FDFB] p-8 rounded-3xl border border-gray-100 space-y-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-[#E5F5EE] text-[#00A36D] flex items-center justify-center group-hover:bg-[#00A36D] group-hover:text-white transition-colors">
              <Store className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-[#101828]">{t('merchant.f1_t')}</h4>
            <p className="text-sm text-[#6A7282] leading-relaxed">{t('merchant.f1_d')}</p>
            <Link
              href="/merchant"
              className="inline-flex items-center gap-2 text-[#00A36D] font-bold text-xs hover:gap-3 transition-all pt-2"
            >
              <span>{t('products.learn_more')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* E-Commerce */}
          <div className="bg-[#F8FDFB] p-8 rounded-3xl border border-gray-100 space-y-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-[#101828]">{t('merchant.f2_t')}</h4>
            <p className="text-sm text-[#6A7282] leading-relaxed">{t('merchant.f2_d')}</p>
            <Link
              href="/merchant"
              className="inline-flex items-center gap-2 text-blue-700 font-bold text-xs hover:gap-3 transition-all pt-2"
            >
              <span>{t('products.learn_more')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Enterprise */}
          <div className="bg-[#F8FDFB] p-8 rounded-3xl border border-gray-100 space-y-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-[#F5A414] group-hover:text-white transition-colors">
              <Building2 className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-[#101828]">{t('merchant.f3_t')}</h4>
            <p className="text-sm text-[#6A7282] leading-relaxed">{t('merchant.f3_d')}</p>
            <Link
              href="/merchant"
              className="inline-flex items-center gap-2 text-amber-700 font-bold text-xs hover:gap-3 transition-all pt-2"
            >
              <span>{t('products.learn_more')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
