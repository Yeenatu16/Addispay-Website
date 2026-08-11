'use client';

import React from 'react';
import { UserPlus, Sliders, ArrowUpRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const HowItWorksSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-28 bg-[#F8FDFB] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00A36D]/10 text-[#00A36D] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-[#00A36D]" />
            <span>{t('how.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#101828] tracking-tight">
            {t('how.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              icon: UserPlus,
              title: t('how.step1_title'),
              desc: t('how.step1_desc'),
            },
            {
              icon: Sliders,
              title: t('how.step2_title'),
              desc: t('how.step2_desc'),
            },
            {
              icon: ArrowUpRight,
              title: t('how.step3_title'),
              desc: t('how.step3_desc'),
            },
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-5 text-center relative group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#E5F5EE] text-[#00A36D] flex items-center justify-center mx-auto group-hover:bg-[#00A36D] group-hover:text-white transition-all duration-300 transform group-hover:scale-110 shadow-sm">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#101828]">{step.title}</h3>
                <p className="text-sm text-[#6A7282] leading-relaxed font-normal">{step.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
