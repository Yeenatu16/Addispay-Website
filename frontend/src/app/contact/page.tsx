'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Headphones } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Alert, Input, Select, Textarea } from '@/components/ui';
import { content, errorMessage } from '@/lib/api';

export default function ContactPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    reason: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await content.contact(form);
      setSubmitted(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
      
      {/* Contact Hero Header */}
      <div className="bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-16 lg:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#101828] tracking-tight">
            {t('contact.title_main')} <span className="text-[#00A36D]">{t('contact.title_accent')}</span>
          </h1>
          <p className="text-base sm:text-lg text-[#6A7282] max-w-2xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Grid: Info Cards + Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Phone */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#E5F5EE] text-[#00A36D] flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#00A36D] uppercase">{t('contact.phone')}</span>
                <div className="font-bold text-sm text-[#101828]">+251 116 684 243</div>
                <div className="font-bold text-sm text-[#101828]">+251 116 685 873</div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#E5F5EE] text-[#00A36D] flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#00A36D] uppercase">{t('contact.email')}</span>
                <div className="font-bold text-sm text-[#101828]">info@addispay.co</div>
                <div className="font-bold text-sm text-[#101828]">support@addispay.et</div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#E5F5EE] text-[#00A36D] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#00A36D] uppercase">{t('contact.address')}</span>
                <div className="font-bold text-sm text-[#101828]">{t('contact.address_val')}</div>
              </div>
            </div>

            {/* Support Guarantee Box */}
            <div className="bg-[#00A36D] text-white p-6 rounded-3xl shadow-xl shadow-[#00A36D]/20 space-y-2">
              <div className="flex items-center gap-2 text-emerald-100 text-xs font-bold uppercase">
                <Headphones className="w-4 h-4 text-emerald-200" />
                <span>24/7 Dedicated Support</span>
              </div>
              <div className="font-extrabold text-base">Always Here to Help Your Business</div>
              <div className="text-xs text-emerald-100">Response time under 2 hours</div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl">
              
              <h2 className="text-2xl font-black text-[#101828] mb-6">{t('contact.form_title')}</h2>

              {submitted ? (
                <div className="bg-[#E5F5EE] border border-[#00A36D]/30 p-8 rounded-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-12 h-12 text-[#00A36D] mx-auto animate-bounce" />
                  <h3 className="text-xl font-bold text-[#101828]">{t('contact.success_title')}</h3>
                  <p className="text-sm text-[#6A7282]">
                    {t('contact.success_desc')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && <Alert tone="error">{error}</Alert>}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                      {t('contact.name_label')} <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder={t('contact.name_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                      {t('contact.email_label')} <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="name@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                      {t('contact.reason_label')} <span className="text-rose-500">*</span>
                    </label>
                    <Select
                      required
                      value={form.reason}
                      onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
                    >
                      <option value="">{t('contact.reason_placeholder')}</option>
                      <option value="merchant">{t('contact.reason_m')}</option>
                      <option value="partner">{t('contact.reason_p')}</option>
                      <option value="support">{t('contact.reason_s')}</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                      {t('contact.message_label')} <span className="text-rose-500">*</span>
                    </label>
                    <Textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder={t('contact.message_placeholder')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-base shadow-lg shadow-[#00A36D]/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Sending...' : t('contact.submit_btn')}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
