'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Apple, Smartphone, ShieldCheck, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [selectedProvider, setSelectedProvider] = useState<'telebirr' | 'cbe' | 'awash' | 'mpesa'>('telebirr');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleSimulatePayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
    }, 1800);
  };

  const handleResetSim = () => {
    setPaymentStatus('idle');
  };

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
              href="https://dashboard.addispay.et/signup"
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
              href="https://play.google.com/store/apps/details?id=com.addispay.merchant"
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
              className="bg-[#101828] hover:bg-black text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-200 shadow-md hover:-translate-y-0.5 border border-gray-800"
            >
              <Smartphone className="w-6 h-6 text-white" />
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

        {/* Right Column: Animated Phone Mockup & Interactive Live Payment Simulator */}
        <div className="lg:w-1/2 flex flex-col items-center w-full relative">
          
          {/* Animated Decorative Floating Badges */}
          <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-gray-200 shadow-xl z-30 hidden sm:flex items-center gap-3 animate-float">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <div className="text-xs font-bold text-gray-800">
              <span className="text-[#00A36D]">Live:</span> 99.99% Uptime
            </div>
          </div>

          <div className="relative w-full max-w-[350px] bg-[#101828] rounded-[2.8rem] border-[10px] border-[#101828] p-4 shadow-2xl overflow-hidden shadow-[#00A36D]/20 transform hover:scale-[1.01] transition-transform duration-300">
            
            {/* Phone Notch */}
            <div className="absolute top-0 inset-x-0 h-5 bg-[#101828] rounded-b-xl w-36 mx-auto z-20" />

            {/* Total Balance Card */}
            <div className="bg-gradient-to-br from-[#00A36D] to-[#008959] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg mt-2">
              <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/15 rounded-full blur-xl pointer-events-none" />
              
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-emerald-100 font-medium tracking-wide">
                    {t('hero.total_balance')}
                  </div>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase">
                    Addispay Merchant
                  </span>
                </div>

                <div className="text-3xl font-black tracking-tight">
                  ETB 45,250.00
                </div>

                <div className="flex gap-3 pt-1">
                  <button className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-2 rounded-xl text-xs transition-colors shadow-inner flex items-center justify-center gap-1">
                    <span>{t('hero.send')}</span>
                  </button>
                  <button className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-2 rounded-xl text-xs transition-colors shadow-inner flex items-center justify-center gap-1">
                    <span>{t('hero.receive')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Payment Checkout Simulator Card */}
            <div className="bg-white rounded-2xl p-4 mt-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#101828]">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5A414]" />
                  <span>{t('hero.sim_title')}</span>
                </div>
                {paymentStatus !== 'idle' && (
                  <button
                    onClick={handleResetSim}
                    className="text-[10px] text-[#00A36D] font-bold underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {paymentStatus === 'idle' && (
                <div className="space-y-3">
                  <div className="text-[11px] text-gray-500 font-semibold">
                    {t('hero.sim_choose_provider')}
                  </div>

                  {/* Provider Selector Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'telebirr', name: t('hero.sim_telebirr'), color: 'bg-blue-50 text-blue-700 border-blue-200' },
                      { id: 'cbe', name: t('hero.sim_cbe'), color: 'bg-purple-50 text-purple-700 border-purple-200' },
                      { id: 'awash', name: t('hero.sim_awash'), color: 'bg-amber-50 text-amber-700 border-amber-200' },
                      { id: 'mpesa', name: t('hero.sim_mpesa'), color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProvider(p.id as any)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                          selectedProvider === p.id
                            ? `${p.color} ring-2 ring-[#00A36D]`
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span>{p.name}</span>
                        {selectedProvider === p.id && <div className="w-2 h-2 rounded-full bg-[#00A36D]" />}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    className="w-full py-2.5 rounded-xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-xs shadow-md shadow-[#00A36D]/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{t('hero.sim_pay_now')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {paymentStatus === 'processing' && (
                <div className="py-6 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-[#00A36D] animate-spin mx-auto" />
                  <div className="text-xs font-bold text-gray-700">
                    {t('hero.sim_processing')}
                  </div>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="py-4 text-center space-y-2 bg-[#E5F5EE] rounded-xl border border-[#00A36D]/30 animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-9 h-9 text-[#00A36D] mx-auto animate-bounce" />
                  <div className="text-xs font-black text-[#101828]">
                    {t('hero.sim_success')}
                  </div>
                  <div className="text-[10px] text-[#00A36D] font-bold">
                    {t('hero.sim_ref')}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
