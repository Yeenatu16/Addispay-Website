'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FaqItem {
  id: string;
  category: 'General' | 'Merchant Onboarding' | 'Payment Integration' | 'Security & Payouts';
  question: string;
  answer: string;
}

// Exact official FAQ questions and answers copied from https://addispay.et/faq
const officialAddispayFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Merchant Onboarding',
    question: 'How do I sign up as a merchant with Addispay?',
    answer: 'Signing up as a merchant with Addispay is easy. Simply visit our website, click on "Sign Up" (https://uat.dashboard.addispay.et/signup), fill in your business registration details, TIN, and bank account information. Once approved, you can start accepting digital payments immediately.',
  },
  {
    id: 'faq-2',
    category: 'General',
    question: 'How can I start accepting payments with Addispay?',
    answer: 'Addispay supports a wide variety of payment channels including Visa, Mastercard, Telebirr, CBE Birr, Awash Birr, M-Pesa, QR code scanning, and Soft POS mobile acquiring. You can choose the payment methods that best suit your business needs.',
  },
  {
    id: 'faq-3',
    category: 'Payment Integration',
    question: 'How do I integrate Addispay with my website or mobile app?',
    answer: 'Integrating Addispay with your website or app is simple. We provide comprehensive developer documentation at https://devportal.addispay.et/ with step-by-step API guides, hosted checkout widgets, WooCommerce plugins, and mobile SDKs.',
  },
  {
    id: 'faq-4',
    category: 'Security & Payouts',
    question: 'How secure are transactions processed through Addispay?',
    answer: 'Addispay takes security seriously. We use bank-grade PCI-DSS compliance, TLS 1.3 encryption, end-to-end tokenization, and real-time fraud monitoring to ensure every transaction is fully protected under National Bank of Ethiopia regulations.',
  },
  {
    id: 'faq-5',
    category: 'General',
    question: 'Can I track and manage my transactions with Addispay?',
    answer: 'Yes, you can track and manage all your transactions in real time through your Addispay Merchant Dashboard. You can view detailed reports, reconcile daily payouts, process customer refunds, and download transaction statements.',
  },
  {
    id: 'faq-6',
    category: 'General',
    question: 'What kind of customer support does Addispay offer?',
    answer: 'Addispay provides 24/7 dedicated customer support. You can reach our support team via phone (+251 116 685 873 / +251 116 684 243), email (support@addispay.et), Telegram (@addispay), or visit our main office in Addis Ababa.',
  },
  {
    id: 'faq-7',
    category: 'Security & Payouts',
    question: 'Are there any hidden fees associated with using Addispay?',
    answer: 'Addispay maintains a transparent fee structure with zero hidden charges. Transaction processing fees are specified in your Fee Schedule and cover acquiring costs, VAT, and bank settlement fees.',
  },
  {
    id: 'faq-8',
    category: 'General',
    question: 'How can I grow my business with Addispay?',
    answer: 'Addispay offers real-time analytics, automated recurring billing, multi-store cashier controls, and instant Soft POS mobile acquiring to help businesses expand customer reach and boost revenue across Ethiopia.',
  },
  {
    id: 'faq-9',
    category: 'Merchant Onboarding',
    question: 'How do I update my account information with Addispay?',
    answer: 'You can update your account information, including business details, payout bank accounts, and authorized representatives, directly through your Merchant Dashboard under Account Settings.',
  },
  {
    id: 'faq-10',
    category: 'Security & Payouts',
    question: 'What should I do if I encounter an issue with a transaction?',
    answer: 'If you encounter any issue, flag the transaction in your Merchant Dashboard or contact our support team immediately at support@addispay.et or +251 116 685 873. Our technical team resolves disputes within 24 hours.',
  },
  {
    id: 'faq-11',
    category: 'Security & Payouts',
    question: 'What is the Payout Schedule for merchant settlements?',
    answer: 'Local transaction settlements are automatically transferred to your designated bank Payout Account within 1 Business Day (T+0 / T+1) in full compliance with National Bank of Ethiopia directives.',
  },
  {
    id: 'faq-12',
    category: 'Payment Integration',
    question: 'What is Addis Merchant Soft POS?',
    answer: 'Addis Merchant Soft POS is a mobile app that transforms any NFC-enabled Android smartphone into a payment terminal, allowing merchants to accept contactless card taps and QR payments without expensive hardware.',
  },
];

export default function OfficialFaqPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const categories = ['All', 'General', 'Merchant Onboarding', 'Payment Integration', 'Security & Payouts'];

  const filteredFaqs = officialAddispayFaqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-16 lg:py-24 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00A36D]/10 text-[#00A36D] text-xs font-bold uppercase tracking-wider border border-[#00A36D]/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Official addispay.et FAQ Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#101828] tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-base sm:text-lg text-[#6A7282] max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about Addispay payment gateway, merchant onboarding, Soft POS mobile acquiring, and API integration.
          </p>

          {/* Search Input Box */}
          <div className="relative max-w-xl mx-auto pt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions (e.g. payout, sign up, API, security)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 shadow-lg text-sm focus:outline-none focus:border-[#00A36D] transition-all"
            />
          </div>

        </div>
      </div>

      {/* Category Pills */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#00A36D] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#101828] hover:text-[#00A36D] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00A36D] shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#00A36D] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-[#6A7282] leading-relaxed border-t border-gray-100/60 bg-[#F8FDFB]/50 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#00A36D]">
                      <span>Category: {faq.category}</span>
                      <a
                        href="https://uat.dashboard.addispay.et/signup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        <span>Learn more</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-800">No matching questions found</h3>
            <p className="text-xs text-gray-500">Try searching for alternative keywords or choose another category.</p>
          </div>
        )}
      </div>

      {/* 24/7 Support Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-[#E5F5EE] rounded-3xl p-8 border border-[#00A36D]/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-black text-[#101828]">Still have questions?</h3>
            <p className="text-xs text-[#6A7282] max-w-md">
              Our dedicated support team is available 24/7 to assist with merchant onboarding, API integration, and transactions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:support@addispay.et"
              className="px-5 py-3 rounded-2xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </a>

            <a
              href="tel:+251116685873"
              className="px-5 py-3 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs border border-gray-200 shadow-xs transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#00A36D]" />
              <span>+251 116 685 873</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
