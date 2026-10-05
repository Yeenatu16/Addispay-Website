'use client';

import React from 'react';
import {
  UserPlus,
  LayoutDashboard,
  Code2,
  CreditCard,
  BarChart3,
  Headphones,
  TrendingUp,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useSafeReducedMotion } from '@/lib/useSafeReducedMotion';

const SIGNUP_URL = 'https://uat.dashboard.addispay.et/signup';

const EASE = [0.16, 1, 0.3, 1] as const;

const steps: { icon: LucideIcon; titleKey: string; descKey: string }[] = [
  { icon: UserPlus, titleKey: 'how.step1_title', descKey: 'how.step1_desc' },
  { icon: LayoutDashboard, titleKey: 'how.step2_title', descKey: 'how.step2_desc' },
  { icon: Code2, titleKey: 'how.step3_title', descKey: 'how.step3_desc' },
  { icon: CreditCard, titleKey: 'how.step4_title', descKey: 'how.step4_desc' },
  { icon: BarChart3, titleKey: 'how.step5_title', descKey: 'how.step5_desc' },
  { icon: Headphones, titleKey: 'how.step6_title', descKey: 'how.step6_desc' },
  { icon: TrendingUp, titleKey: 'how.step7_title', descKey: 'how.step7_desc' },
];

export const HowItWorksSection: React.FC = () => {
  const { t } = useLanguage();
  const reduceMotion = useSafeReducedMotion();

  return (
    <section className="border-b border-gray-100 bg-[#F8FDFB] py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 space-y-4">
          <h2 className="text-3xl font-black tracking-tight text-[#101828] sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {t('how.title')}
          </h2>
          <p className="max-w-[65ch] text-base leading-relaxed text-[#6A7282]">
            {t('how.subtitle')}
          </p>
        </div>

        <ol className="relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <motion.li
                key={step.titleKey}
                className="relative flex gap-5 sm:gap-6"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.55,
                  delay: reduceMotion ? 0 : index * 0.06,
                  ease: EASE,
                }}
              >
                <div className="flex w-11 shrink-0 flex-col items-center sm:w-12">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00A36D] text-white shadow-[0_4px_14px_rgba(0,163,109,0.25)] sm:h-12 sm:w-12"
                    aria-hidden
                  >
                    <Icon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" strokeWidth={2} />
                  </div>
                  {!isLast && (
                    <div
                      className="mt-2 w-px flex-1 min-h-[2.5rem] bg-[#00A36D]/20"
                      aria-hidden
                    />
                  )}
                </div>

                <div className={`min-w-0 flex-1 ${isLast ? 'pb-0' : 'pb-10 sm:pb-12'}`}>
                  <h3 className="text-lg font-bold text-[#101828] sm:text-xl">
                    {t(step.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6A7282] sm:text-[0.9375rem]">
                    {t(step.descKey)}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>

        <motion.div
          className="mt-14 border-t border-[#00A36D]/15 pt-10"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <a
            href={SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#00A36D] px-7 py-3.5 text-sm font-bold text-white transition-transform active:scale-[0.98] hover:bg-[#008f5d] sm:text-base"
          >
            {t('hero.cta_signup')}
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
