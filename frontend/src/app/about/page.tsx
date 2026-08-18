'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Target, Eye, ArrowRight, Lightbulb, Lock, HeartHandshake, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const boardMembers = [
  { name: 'Mr. Ewnetu Abera', title: 'Board Chairman', image: '/images/board/ewnetu.jpg' },
  { name: 'Mr. Desta Asmamaw', title: 'Board Member', image: '/images/board/desta.jpg' },
  { name: 'Mr. Mikiyas Tamirat', title: 'Board Member', image: '/images/board/mikiyas.jpg' },
  { name: 'Mr. Abraham Teshome', title: 'Board Member', image: '/images/board/abraham.jpg' },
  { name: 'Mrs. Hiwot Yemane', title: 'Board Member', image: '/images/board/hiwot.jpg' },
  {
    name: 'Mr. Ashenafi Shawol',
    title: 'Chief Executive Officer',
    image: '/images/board/ashenafi.jpg',
    isCEO: true,
  },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-16 lg:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#101828] tracking-tight">
            {t('about.title_main')} <span className="text-[#00A36D]">{t('about.title_accent')}</span>
          </h1>

          <p className="text-base sm:text-lg text-[#6A7282] max-w-2xl mx-auto leading-relaxed">
            {t('about.subtitle')}
          </p>

        </div>
      </div>

      {/* Company Background */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-black uppercase tracking-wider text-[#00A36D]">
              {t('about.who_we_are')}
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-[#101828] leading-tight">
              {t('about.bg_title')}
            </h2>

            <p className="text-[#6A7282] text-base leading-relaxed">
              {t('about.bg_desc')}
            </p>

            <div className="pt-2">
              <Link
                href="/merchant"
                className="inline-flex items-center gap-2 text-[#00A36D] font-bold text-sm hover:gap-3 transition-all"
              >
                <span>{t('products.learn_more')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-[#F8FDFB] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission Card */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xs space-y-6 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#E5F5EE] text-[#00A36D] flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-[#101828]">{t('about.mission_title')}</h3>
              <p className="text-[#6A7282] text-base leading-relaxed">
                {t('about.mission_desc')}
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-[#00A36D] text-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-[#00A36D]/20 space-y-6 hover:scale-[1.01] transition-transform duration-300">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black">{t('about.vision_title')}</h3>
              <p className="text-emerald-50 text-base leading-relaxed font-normal">
                {t('about.vision_desc')}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-[#00A36D]">
              What Drives Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#101828]">{t('about.values_title')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Lightbulb, num: '01', title: t('about.v1_title'), desc: t('about.v1_desc') },
              { icon: Lock, num: '02', title: t('about.v2_title'), desc: t('about.v2_desc') },
              { icon: HeartHandshake, num: '03', title: t('about.v3_title'), desc: t('about.v3_desc') },
              { icon: Users, num: '04', title: t('about.v4_title'), desc: t('about.v4_desc') },
            ].map((val, i) => {
              const Icon = val.icon;
              return (
                <div key={i} className="bg-[#F8FDFB] p-8 rounded-3xl border border-gray-100 space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-[#E5F5EE] text-[#00A36D] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 block">{val.num}</span>
                  <h4 className="font-bold text-lg text-[#101828]">{val.title}</h4>
                  <p className="text-xs text-[#6A7282] leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Board Members & CEO */}
      <section className="py-20 bg-[#F8FDFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-[#00A36D]">
              Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#101828]">
              {t('about.leadership_title')}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {boardMembers.map((member, i) => (
              <div
                key={i}
                className={`bg-white p-6 rounded-3xl border border-gray-100 text-center space-y-3 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all relative ${
                  member.isCEO ? 'ring-2 ring-[#00A36D]' : ''
                }`}
              >
                {member.isCEO && (
                  <span className="absolute top-2 right-2 bg-[#00A36D] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                    CEO
                  </span>
                )}
                
                <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full bg-[#E5F5EE] ring-2 ring-[#E5F5EE] sm:h-24 sm:w-24">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 80px, 96px"
                  />
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-sm text-[#101828] leading-snug">{member.name}</div>
                  <div className="text-[11px] text-[#6A7282] font-semibold">{member.title}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
