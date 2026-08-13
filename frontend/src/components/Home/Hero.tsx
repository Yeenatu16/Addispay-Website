'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Smartphone, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="bg-[#F8FDFB] pt-10 pb-20 lg:pt-16 lg:pb-28 px-4 sm:px-6 lg:px-12 relative overflow-hidden border-b border-gray-100">
      
      {/* Background Animated Gradient Mesh Glows */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-radial from-[#00A36D]/12 via-[#00A36D]/3 to-transparent pointer-events-none rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-radial from-[#F5A414]/15 via-[#F5A414]/2 to-transparent pointer-events-none rounded-full blur-3xl animate-float" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
        
        {/* Left Column Content */}
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
          
          {/* NBE License Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E5F5EE] border border-[#00A36D]/30 text-[#00A36D] text-xs font-bold shadow-xs hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="w-4 h-4 text-[#00A36D]" />
            <span>{t('hero.badge')}</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#101828] leading-[1.15] tracking-tight">
              {t('hero.title_welcome')} <br />
              <span className="text-[#00A36D] relative inline-block">
                {t('hero.title_brand')}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#F5A414]" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,10 Q50,20 100,10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#6A7282] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <a
              href="https://uat.dashboard.addispay.et/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#F5A414] hover:bg-[#e0930f] text-white font-bold text-base shadow-lg shadow-[#F5A414]/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <span>{t('hero.cta_signup')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-base border border-gray-200 shadow-xs hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Play className="w-4 h-4 fill-gray-700 text-gray-700" />
              <span>{t('hero.cta_demo')}</span>
            </Link>
          </div>

          {/* Soft POS / Google Play Download Badges */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <a
              href="https://play.google.com/store/apps/details?id=com.addispayspos"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#00A36D] hover:bg-[#008959] text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-200 shadow-md shadow-[#00A36D]/20 hover:-translate-y-0.5 border border-[#00A36D]"
            >
              <Smartphone className="w-6 h-6 text-white" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-emerald-100 leading-tight">
                  Mobile POS App
                </div>
                <div className="font-extrabold text-sm leading-tight">
                  Download Soft POS
                </div>
              </div>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.addispay.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#101828] hover:bg-[#1e293b] text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-200 shadow-md hover:-translate-y-0.5 border border-slate-800"
            >
              {/* Theme Compatible Google Play Store Icon */}
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 512 512">
                <path fill="#00A36D" d="M47.2 24.2C41.7 29.8 38.6 38.3 38.6 49.3v413.4c0 11 3.1 19.5 8.6 25.1l1.4 1.3L277 260.6v-5.2L48.6 22.9l-1.4 1.3z" />
                <path fill="#F5A414" d="M355.7 339.3l-78.7-78.7v-5.2l78.7-78.7 1.8 1 93.3 53c26.6 15.1 26.6 39.9 0 55.1l-93.3 53-1.8 0.5z" />
                <path fill="#00A36D" d="M277 255.4L47.2 488.1c8.7 9.2 23 10.3 39 1.3l269.5-150.1-78.7-78.7-1.8-5.2z" />
                <path fill="#F5A414" d="M277 256.6l78.7-78.7L86.2 27.8C70.2 18.7 55.9 19.8 47.2 29L277 256.6z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] uppercase font-medium text-gray-300 leading-tight">
                  {t('hero.google_play')}
                </div>
                <div className="font-bold text-sm leading-tight">
                  Google Play
                </div>
              </div>
            </a>
          </div>

        </div>

        {/* Right Column: Clean Embedded Video Frame */}
        <div className="lg:w-1/2 flex flex-col items-center w-full relative">
          <div className="relative w-full max-w-[540px] aspect-video bg-[#101828] rounded-3xl border-4 border-[#101828] shadow-2xl overflow-hidden shadow-[#00A36D]/20 transform hover:scale-[1.01] transition-transform duration-300">
            
            {/* Embedded YouTube Fintech Overview Video */}
            <iframe
              src={`https://www.youtube-nocookie.com/embed/3Q1fE4Y6F3w?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=3Q1fE4Y6F3w&controls=1&modestbranding=1&rel=0`}
              title="AddisPay Fintech Platform Video"
              className="w-full h-full object-cover rounded-2xl pointer-events-auto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Sound Toggle Button */}
            <div className="absolute top-3 right-3 z-10 pointer-events-auto">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors cursor-pointer"
                aria-label="Toggle Sound"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
