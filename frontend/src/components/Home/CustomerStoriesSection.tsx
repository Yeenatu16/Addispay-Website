'use client';

import React from 'react';
import { Quote, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const CustomerStoriesSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00A36D]/10 text-[#00A36D] text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-[#00A36D]" />
            <span>{t('stories.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#101828] tracking-tight">
            {t('stories.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#F8FDFB] p-8 sm:p-10 rounded-3xl border border-[#E5F5EE] shadow-xs hover:shadow-xl transition-all duration-300 space-y-6 relative">
            <Quote className="w-10 h-10 text-[#00A36D]/30" />
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-medium italic">
              &ldquo;{t('stories.quote1')}&rdquo;
            </p>
            <div className="pt-2 border-t border-gray-200/60">
              <div className="font-bold text-[#101828] text-base">{t('stories.author1')}</div>
              <div className="text-xs text-[#00A36D] font-semibold">{t('stories.role1')}</div>
            </div>
          </div>

          <div className="bg-[#F8FDFB] p-8 sm:p-10 rounded-3xl border border-[#E5F5EE] shadow-xs hover:shadow-xl transition-all duration-300 space-y-6 relative">
            <Quote className="w-10 h-10 text-[#00A36D]/30" />
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-medium italic">
              &ldquo;{t('stories.quote2')}&rdquo;
            </p>
            <div className="pt-2 border-t border-gray-200/60">
              <div className="font-bold text-[#101828] text-base">{t('stories.author2')}</div>
              <div className="text-xs text-[#00A36D] font-semibold">{t('stories.role2')}</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
