'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Smartphone, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSafeReducedMotion } from '@/lib/useSafeReducedMotion';
import { content } from '@/lib/api';
import { youtubeThumbnailUrl } from '@/lib/youtube';

/** Fallback if the homepage settings API is unreachable. */
const DEFAULT_HERO_VIDEO_ID = 'oHFAOehZBRc';

const EASE = [0.16, 1, 0.3, 1] as const;

const copyStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.08 },
  },
};

const copyItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [isMuted, setIsMuted] = useState(true);
  const [videoId, setVideoId] = useState(DEFAULT_HERO_VIDEO_ID);
  const [videoReady, setVideoReady] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(youtubeThumbnailUrl(DEFAULT_HERO_VIDEO_ID, 'maxresdefault'));
  const reduceMotion = useSafeReducedMotion();

  useEffect(() => {
    let cancelled = false;
    content
      .homepage(60)
      .then((settings) => {
        if (!cancelled && settings.heroYoutubeId) {
          setVideoId(settings.heroYoutubeId);
        }
      })
      .catch(() => {
        /* keep default video if API is unavailable */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setVideoReady(false);
    setThumbSrc(youtubeThumbnailUrl(videoId, 'maxresdefault'));
  }, [videoId]);

  return (
    <section className="relative overflow-hidden border-b border-gray-100 bg-[#F8FDFB] px-4 pt-10 pb-20 sm:px-6 lg:px-12 lg:pt-16 lg:pb-28">
      <div className="pointer-events-none absolute top-10 left-1/4 h-[600px] w-[600px] rounded-full bg-radial from-[#00A36D]/12 via-[#00A36D]/3 to-transparent blur-3xl animate-pulse-slow motion-reduce:animate-none" />
      <div className="pointer-events-none absolute right-1/4 bottom-10 h-[500px] w-[500px] rounded-full bg-radial from-[#F5A414]/15 via-[#F5A414]/2 to-transparent blur-3xl animate-float motion-reduce:animate-none" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-14">
        <motion.div
          className="w-full space-y-8 text-center lg:w-[44%] lg:text-left"
          variants={reduceMotion ? undefined : copyStagger}
          initial={reduceMotion ? false : 'hidden'}
          animate={reduceMotion ? undefined : 'show'}
        >
          <motion.div variants={reduceMotion ? undefined : copyItem}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00A36D]/30 bg-[#E5F5EE] px-4 py-2 text-xs font-bold text-[#00A36D] shadow-xs transition-transform duration-200 hover:scale-105">
              <ShieldCheck className="h-4 w-4 text-[#00A36D]" />
              <span>{t('hero.badge')}</span>
            </div>
          </motion.div>

          <motion.div className="space-y-4" variants={reduceMotion ? undefined : copyItem}>
            <h1 className="text-4xl leading-[1.15] font-black tracking-tight text-[#101828] sm:text-5xl lg:text-6xl">
              {t('hero.title_welcome')} <br />
              <span className="text-[#00A36D]">{t('hero.title_brand')}</span>
            </h1>
            <p className="mx-auto max-w-xl text-base leading-relaxed font-normal text-[#6A7282] sm:text-lg lg:mx-0">
              {t('hero.subtitle')}
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start"
            variants={reduceMotion ? undefined : copyItem}
          >
            <a
              href="https://uat.dashboard.addispay.et/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#F5A414] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#F5A414]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#e0930f] hover:shadow-xl active:scale-[0.98] sm:w-auto"
            >
              <span>{t('hero.cta_signup')}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#hero-video"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-7 py-4 text-base font-bold text-gray-800 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] sm:w-auto"
            >
              <Play className="h-4 w-4 fill-gray-700 text-gray-700" />
              <span>{t('hero.cta_demo')}</span>
            </a>
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row lg:justify-start"
            variants={reduceMotion ? undefined : copyItem}
          >
            <a
              href="https://play.google.com/store/apps/details?id=com.addispayspos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-[#00A36D] bg-[#00A36D] px-5 py-2.5 text-white shadow-md shadow-[#00A36D]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#008959] active:scale-[0.98]"
            >
              <Smartphone className="h-6 w-6 text-white" />
              <div className="text-left">
                <div className="text-[10px] leading-tight font-bold text-emerald-100 uppercase">Mobile POS App</div>
                <div className="text-sm leading-tight font-extrabold">Download Soft POS</div>
              </div>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.addispay.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#101828] px-5 py-2.5 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1e293b] active:scale-[0.98]"
            >
              <svg className="h-6 w-6 shrink-0" viewBox="0 0 512 512" aria-hidden>
                <path fill="#00A36D" d="M47.2 24.2C41.7 29.8 38.6 38.3 38.6 49.3v413.4c0 11 3.1 19.5 8.6 25.1l1.4 1.3L277 260.6v-5.2L48.6 22.9l-1.4 1.3z" />
                <path fill="#F5A414" d="M355.7 339.3l-78.7-78.7v-5.2l78.7-78.7 1.8 1 93.3 53c26.6 15.1 26.6 39.9 0 55.1l-93.3 53-1.8 0.5z" />
                <path fill="#00A36D" d="M277 255.4L47.2 488.1c8.7 9.2 23 10.3 39 1.3l269.5-150.1-78.7-78.7-1.8-5.2z" />
                <path fill="#F5A414" d="M277 256.6l78.7-78.7L86.2 27.8C70.2 18.7 55.9 19.8 47.2 29L277 256.6z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] leading-tight font-medium text-gray-300 uppercase">{t('hero.google_play')}</div>
                <div className="text-sm leading-tight font-bold">Google Play</div>
              </div>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          id="hero-video"
          className="relative flex w-full scroll-mt-24 flex-col items-center lg:w-[56%]"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94, x: 28 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
        >
          <div className="hero-video-glow relative w-full max-w-[720px] lg:max-w-none">
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border-4 border-[#101828] bg-[#101828] shadow-2xl shadow-[#00A36D]/25 transition-transform duration-500 hover:scale-[1.015] motion-reduce:transition-none motion-reduce:hover:scale-100">
              {!videoReady && (
                <img
                  src={thumbSrc}
                  alt=""
                  className="absolute inset-0 z-[1] h-full w-full object-cover"
                  onError={() => setThumbSrc(youtubeThumbnailUrl(videoId, 'hqdefault'))}
                />
              )}

              <iframe
                key={videoId}
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0`}
                title="AddisPay platform overview"
                className={`pointer-events-auto relative z-[2] h-full w-full rounded-2xl object-cover transition-opacity duration-300 ${
                  videoReady ? 'opacity-100' : 'opacity-0'
                }`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setVideoReady(true)}
              />

              <div className="pointer-events-auto absolute top-3 right-3 z-10">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="cursor-pointer rounded-xl bg-black/60 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/90 active:scale-95"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
