'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const partners = [
  { name: 'Cbe Birr', logo: '/images/partners/cbebirr.png' },
  { name: 'Telebirr', logo: '/images/partners/telebirr.png' },
  { name: 'Mpesa', logo: '/images/partners/mpesa.png' },
  { name: 'Etswitch', logo: '/images/partners/etswitch.jpg' },
  { name: 'Kacha', logo: '/images/partners/kacha.png' },
  { name: 'Awash Bank', logo: '/images/partners/awash.jpg' },
];

export const PartnersMarquee: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-10 bg-white border-b border-gray-100 overflow-hidden">
      
      {/* Section Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <p className="text-center text-xs font-black uppercase tracking-widest text-[#00A36D]">
          {t('partners.heading')}
        </p>
      </div>

      {/* Horizontal Scrolling Marquee (Icons Only) */}
      <div className="relative w-full flex overflow-x-hidden">
        <div className="animate-marquee flex items-center gap-12 sm:gap-16 shrink-0 py-2">
          {partners.concat(partners).concat(partners).map((partner, index) => (
            <div
              key={index}
              className="h-10 sm:h-12 w-28 sm:w-36 relative shrink-0 flex items-center justify-center"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                sizes="(max-width: 640px) 112px, 144px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
