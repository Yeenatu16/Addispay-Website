'use client';

import React from 'react';
import Link from 'next/link';
import {
  Globe,
  Smartphone,
  Landmark,
  Zap,
  BarChart3,
  Globe2,
  QrCode,
  Share2,
  Code2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ProductsPage() {
  const { t } = useLanguage();

  const productSuite = [
    {
      icon: Globe,
      tag: 'Core Gateway',
      title: t('products.p1_title'),
      desc: t('products.p1_desc'),
      bullets: [
        'Supports Hosted Checkout & Custom In-App REST API',
        'Accepts Telebirr, CBE Birr, Awash Birr, M-Pesa, Visa & Mastercard',
        'Sub-80ms transaction latency & automatic failover',
      ],
      color: 'bg-emerald-50 text-[#00A36D] border-emerald-100',
    },
    {
      icon: QrCode,
      tag: 'In-Store & Mobile POS',
      title: t('products.pos_title'),
      desc: t('products.pos_desc'),
      bullets: [
        'Addis Merchant Android App — zero hardware required',
        'NFC Contactless & CBE / Telebirr QR scanner',
        'Instant digital receipts & daily cashier reconciliation',
      ],
      color: 'bg-blue-50 text-blue-700 border-blue-100',
    },
    {
      icon: Share2,
      tag: 'Social Commerce',
      title: t('products.links_title'),
      desc: t('products.links_desc'),
      bullets: [
        'Generate 1-click payment links with custom amounts',
        'Share via Telegram, Instagram, WhatsApp, or SMS',
        'No website or coding required — immediate collection',
      ],
      color: 'bg-amber-50 text-amber-700 border-amber-100',
    },
    {
      icon: Landmark,
      tag: 'Merchant Banking',
      title: t('products.p3_title'),
      desc: t('products.p3_desc'),
      bullets: [
        'Automated daily bank settlements or real-time payouts',
        'Unified dashboard for multi-branch store operations',
        'Multi-user role access controls & audit logs',
      ],
      color: 'bg-purple-50 text-purple-700 border-purple-100',
    },
    {
      icon: Code2,
      tag: 'Developer Tools',
      title: t('products.api_title'),
      desc: t('products.api_desc'),
      bullets: [
        'Pre-built WooCommerce & Shopify checkout plugins',
        'SDKs for Python, Node.js, PHP, Go, and Android/iOS',
        'Interactive Sandbox (UAT) environment with full docs',
      ],
      color: 'bg-rose-50 text-rose-700 border-rose-100',
    },
    {
      icon: RefreshCw,
      tag: 'Subscriptions',
      title: t('products.sub_title'),
      desc: t('products.sub_desc'),
      bullets: [
        'Automated recurring billing for schools & utility bills',
        'SaaS & membership subscription management',
        'Failed payment retries & automated customer reminders',
      ],
      color: 'bg-[#E5F5EE] text-[#00A36D] border-[#00A36D]/20',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
      
      {/* Products Hero Header */}
      <div className="bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-16 lg:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00A36D]/10 text-[#00A36D] text-xs font-bold uppercase tracking-wider border border-[#00A36D]/20">
            <Zap className="w-4 h-4 text-[#00A36D]" />
            <span>Addispay Product Suite</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#101828] tracking-tight">
            {t('products.hero_title')}
          </h1>

          <p className="text-base sm:text-lg text-[#6A7282] max-w-2xl mx-auto leading-relaxed">
            {t('products.hero_subtitle')}
          </p>

        </div>
      </div>

      {/* Main Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productSuite.map((product, index) => {
            const Icon = product.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${product.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-gray-100 text-gray-700 tracking-wider">
                      {product.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#101828] mb-3 group-hover:text-[#00A36D] transition-colors">
                    {product.title}
                  </h3>

                  <p className="text-[#6A7282] text-sm leading-relaxed mb-6 font-normal">
                    {product.desc}
                  </p>

                  <ul className="space-y-2.5 mb-8 border-t border-gray-100 pt-4">
                    {product.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-2 text-xs font-semibold text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-[#00A36D] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="https://dashboard.addispay.et/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-gray-50 hover:bg-[#00A36D] text-gray-800 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 group/btn"
                >
                  <span>{t('products.learn_more')}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
