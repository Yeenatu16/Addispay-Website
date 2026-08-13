'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Smartphone, Landmark, Zap, BarChart3, Globe2, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const ProductsGrid: React.FC = () => {
  const { t } = useLanguage();

  const products = [
    {
      icon: Globe,
      title: t('products.p1_title'),
      description: t('products.p1_desc'),
      href: '/products',
    },
    {
      icon: Smartphone,
      title: t('products.p2_title'),
      description: t('products.p2_desc'),
      href: '/products',
    },
    {
      icon: Landmark,
      title: t('products.p3_title'),
      description: t('products.p3_desc'),
      href: '/products',
    },
    {
      icon: Zap,
      title: t('products.p4_title'),
      description: t('products.p4_desc'),
      href: '/products',
    },
    {
      icon: BarChart3,
      title: t('products.p5_title'),
      description: t('products.p5_desc'),
      href: '/products',
    },
    {
      icon: Globe2,
      title: t('products.p6_title'),
      description: t('products.p6_desc'),
      href: '/products',
    },
  ];

  return (
    <section id="products" className="py-20 lg:py-28 bg-[#F8FDFB] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00A36D]/10 border border-[#00A36D]/20 text-[#00A36D] text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-[#00A36D]" />
            <span>{t('products.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#101828] tracking-tight leading-tight">
            {t('products.title_main')} <br className="hidden sm:inline" />
            <span className="text-[#00A36D]">{t('products.title_accent')}</span>
          </h2>

          <p className="text-base sm:text-lg text-[#6A7282] leading-relaxed">
            {t('products.subtitle')}
          </p>
        </div>

        {/* 6 Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs hover:shadow-2xl hover:shadow-[#00A36D]/15 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Accent top border glow on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A36D] to-[#F5A414] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#E5F5EE] text-[#00A36D] flex items-center justify-center mb-6 group-hover:bg-[#00A36D] group-hover:text-white transition-all duration-300 transform group-hover:scale-110 shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-[#101828] mb-3 group-hover:text-[#00A36D] transition-colors">
                    {product.title}
                  </h3>

                  <p className="text-[#6A7282] text-sm leading-relaxed mb-6 font-normal">
                    {product.description}
                  </p>
                </div>

                <Link
                  href={product.href}
                  className="inline-flex items-center gap-2 text-[#00A36D] font-bold text-sm hover:gap-3 transition-all pt-2 group/link"
                >
                  <span>{t('products.learn_more')}</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
