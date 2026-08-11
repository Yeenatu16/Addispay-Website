'use client';

import React from 'react';
import { ShieldCheck, Lock, Cpu, Code2, Users, CreditCard, TrendingUp, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00A36D]/10 text-[#00A36D] text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>{t('features.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#101828] tracking-tight">
            {t('features.title')}
          </h2>
        </div>

        {/* 4 Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            {
              icon: ShieldCheck,
              title: t('features.f1_title'),
              desc: t('features.f1_desc'),
            },
            {
              icon: Lock,
              title: t('features.f2_title'),
              desc: t('features.f2_desc'),
            },
            {
              icon: Cpu,
              title: t('features.f3_title'),
              desc: t('features.f3_desc'),
            },
            {
              icon: Code2,
              title: t('features.f4_title'),
              desc: t('features.f4_desc'),
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-[#F8FDFB] p-8 rounded-3xl border border-[#E5F5EE] hover:bg-white hover:shadow-xl hover:shadow-[#00A36D]/10 hover:-translate-y-1.5 transition-all duration-300 space-y-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E5F5EE] text-[#00A36D] flex items-center justify-center group-hover:bg-[#00A36D] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#101828]">{item.title}</h3>
                <p className="text-xs text-[#6A7282] leading-relaxed font-normal">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Live Metrics Grid */}
        <div className="bg-[#101828] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#00A36D]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
            {[
              { num: '50,000+', label: t('features.stat_merchants'), icon: Users },
              { num: '28,000+', label: t('features.stat_users'), icon: CreditCard },
              { num: 'ETB 1.2B+', label: t('features.stat_volume'), icon: TrendingUp },
              { num: '99.8%', label: t('features.stat_satisfaction'), icon: Award },
            ].map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div key={i} className="space-y-2 group">
                  <div className="inline-flex p-2.5 rounded-2xl bg-white/10 text-[#F5A414] mb-2 group-hover:scale-110 transition-transform">
                    <StatIcon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">{stat.num}</div>
                  <div className="text-xs text-gray-400 font-semibold">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
