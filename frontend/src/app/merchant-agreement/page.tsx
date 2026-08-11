'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileText,
  Printer,
  Download,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export default function MerchantAgreementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'part1' | 'part2' | 'part3' | 'part4' | 'part5'>('all');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-12 lg:py-16 border-b border-gray-200 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00A36D]/10 text-[#00A36D] text-xs font-bold uppercase tracking-wider border border-[#00A36D]/20">
            <ShieldCheck className="w-4 h-4 text-[#00A36D]" />
            <span>Official Legal Binding Terms</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#101828] tracking-tight">
            Merchant Services Agreement
          </h1>

          <p className="text-sm sm:text-base text-[#6A7282] max-w-2xl mx-auto leading-relaxed">
            Addispay Financial Technology Share Company — Governing terms &amp; conditions for merchants and payment operators in Ethiopia.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs border border-gray-200 shadow-xs transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#00A36D]" />
              <span>Print Agreement</span>
            </button>

            <a
              href="https://dashboard.addispay.et/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-2xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-xs shadow-md shadow-[#00A36D]/20 transition-all flex items-center gap-2"
            >
              <span>Accept &amp; Register Merchant Account</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>

      {/* Main Document Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Document Header Metadata Box */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-[#101828]">ADDISPAY FINANCIAL TECHNOLOGY S.C.</h2>
              <p className="text-xs text-gray-500 font-medium">Licensed by National Bank of Ethiopia · NPS/PSO/007/2022</p>
            </div>
            <span className="text-xs bg-[#E5F5EE] text-[#00A36D] font-extrabold px-3 py-1 rounded-full uppercase">
              Current Version 2024–2026
            </span>
          </div>

          <div className="text-xs text-[#1A1F36] space-y-2 leading-relaxed font-medium">
            <p>
              This Merchant Service Agreement is a legal and binding agreement entered between at Addis Ababa by and between 
              <strong> Addispay Financial Technologies Share Company</strong> (hereinafter called &ldquo;Addispay&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) established under the laws of Ethiopia and duly licensed by the National Bank to facilitate payments and provide payment infrastructure to Merchants, with a registered address: <em>Addis Ababa, Bole Sub City, Woreda 04, Phone No. +251 116 685 873 / +251 116 684 243, P.O. Box 8710 / 16936</em> on one hand;
            </p>
            <p>
              And <strong>The Merchant</strong> (hereinafter referred as &ldquo;Merchant&rdquo;, &ldquo;you&rdquo; or &ldquo;your&rdquo;) who has set up an Addispay account to access the Services offered by Addispay (&ldquo;Addispay Account&rdquo;).
            </p>
            <p>
              The Merchant and Addispay shall hereinafter be individually referred to as &ldquo;Party&rdquo; and collectively as &ldquo;Parties&rdquo;.
            </p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-200 print:hidden">
          {[
            { id: 'all', label: 'All Articles' },
            { id: 'part1', label: 'Part 1: General (Art 1–29)' },
            { id: 'part2', label: 'Part 2: Payment Processing (Art 30–32)' },
            { id: 'part3', label: 'Part 3: Technology & IP (Art 33–36)' },
            { id: 'part4', label: 'Part 4: Settlement & Fees (Art 37–48)' },
            { id: 'part5', label: 'Part 5: Data & Privacy (Art 49–53)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00A36D] text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Legal Text Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xs space-y-8 text-xs text-[#1A1F36] leading-relaxed">
          
          {/* PART ONE: GENERAL */}
          {(activeTab === 'all' || activeTab === 'part1') && (
            <section className="space-y-6">
              <div className="border-b border-[#00A36D]/20 pb-3">
                <h2 className="text-base font-black text-[#00A36D] uppercase tracking-wider">Part One: General Terms &amp; Definitions</h2>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#101828]">1. Definitions</h3>
                <p>Unless the context otherwise requires, the following terms shall have the meanings set forth below:</p>
                <div className="space-y-2 pl-4 border-l-2 border-[#00A36D]/30">
                  <p><strong>1/ &ldquo;Agreement&rdquo;</strong> means this Merchant Services Agreement including application form, annexes, fee schedule, and instructions.</p>
                  <p><strong>2/ &ldquo;Acquiring Bank&rdquo;</strong> means financial institutions and digital banking providers processing payment cards on behalf of merchant.</p>
                  <p><strong>3/ &ldquo;Addispay API&rdquo;</strong> means application programming interface belonging to Addispay for providing Services.</p>
                  <p><strong>4/ &ldquo;Addispay Services&rdquo;</strong> means Payment Services, analytics, and business services offered by Addispay.</p>
                  <p><strong>5/ &ldquo;Applicable Law(s)&rdquo;</strong> means laws, proclamations, regulations of FDRE, including National Bank of Ethiopia (NBE) directives.</p>
                  <p><strong>6/ &ldquo;Card or Payment Card&rdquo;</strong> means credit, debit or payment cards issued by authorized financial institutions.</p>
                  <p><strong>7/ &ldquo;Chargebacks&rdquo;</strong> means reversal of transaction or request for repayment from issuing banks or card schemes.</p>
                  <p><strong>8/ &ldquo;Confidential Information&rdquo;</strong> means proprietary information, financial data, know-how, and technical specifications exchanged under this agreement.</p>
                  <p><strong>9/ &ldquo;Dashboard&rdquo;</strong> means the interactive user interface provided by Addispay for account monitoring.</p>
                  <p><strong>10/ &ldquo;Fee Schedule&rdquo;</strong> means published list of service charges, transaction processing fees, and rates.</p>
                  <p><strong>11/ &ldquo;POS Terminal&rdquo;</strong> means Point-of-Sale device or Android Soft POS mobile application.</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">2. Registration &amp; Permitted Activities</h3>
                <p>1/ Only legal businesses, registered companies, or sole proprietors operating in Ethiopia are eligible to register an Addispay Account.</p>
                <p>2/ Merchant representatives must submit authentic business registration numbers, TIN, trade licenses, and authorized officer identification.</p>
                <p>3/ Merchants must maintain credential security and take reasonable measures to protect POS hardware and mobile devices.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">3. Business Representatives &amp; Underage Restrictions</h3>
                <p>1/ Representatives affirm authority to execute contracts on behalf of the business entity.</p>
                <p>2/ Individuals under 18 years of age are prohibited from creating or operating an Addispay Merchant Account.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">4. Validation &amp; Underwriting</h3>
                <p>Addispay reserves the right to audit merchant business operations, inspect financial statements, verify beneficial ownership, and request credit history from authorized bureaus.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">5. Changes to Business Status</h3>
                <p>Merchants must notify Addispay in writing within 3 days of any structural changes, insolvency proceedings, ownership transfers exceeding 25%, or regulatory investigations.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">6. Customer Relationships &amp; Dispute Liabilities</h3>
                <p>1/ Merchants are solely responsible for product delivery, service quality, customer support, returns, and dispute resolutions.</p>
                <p>2/ Addispay acts as a licensed payment gateway and is not a party to contract disputes regarding merchant merchandise.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">7–12. Termination &amp; Account Suspension</h3>
                <p>Either party may terminate this Agreement by written notice. Addispay may immediately suspend accounts in cases of suspected fraud, NBE directive compliance, or excessive chargeback ratios exceeding 1%.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">13–29. General Legal Framework</h3>
                <p>Covers Intellectual Property, Audit Rights, Force Majeure, Limitation of Liability, Dispute Resolution under Ethiopian Arbitration Proclamation No. 1237/2021, and Applicable Law.</p>
              </div>
            </section>
          )}

          {/* PART TWO: PAYMENT PROCESSING */}
          {(activeTab === 'all' || activeTab === 'part2') && (
            <section className="space-y-6 pt-4 border-t border-gray-200">
              <div className="border-b border-[#00A36D]/20 pb-3">
                <h2 className="text-base font-black text-[#00A36D] uppercase tracking-wider">Part Two: Payment Processing &amp; Terminals</h2>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">30. Specific Payment Methods &amp; Card Rules</h3>
                <p>1/ Merchants must comply with Visa, Mastercard, and Ethiopian local scheme operating rules.</p>
                <p>2/ Merchants must maintain customer service contact details, clear refund policies, and transaction receipts for at least 120 days.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">31. Quick Response (QR) Payments</h3>
                <p>Supports Telebirr, CBE Birr, Awash Birr, and M-Pesa QR code payments in compliance with NBE National QR Standard Guidelines.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">32. Terminal Payments &amp; Soft POS</h3>
                <p>Covers leased physical POS hardware and Android Soft POS contactless mobile application software licensing and maintenance.</p>
              </div>
            </section>
          )}

          {/* PART THREE: TECHNOLOGY */}
          {(activeTab === 'all' || activeTab === 'part3') && (
            <section className="space-y-6 pt-4 border-t border-gray-200">
              <div className="border-b border-[#00A36D]/20 pb-3">
                <h2 className="text-base font-black text-[#00A36D] uppercase tracking-wider">Part Three: Addispay Technology &amp; IP</h2>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">33–36. API, Dashboard &amp; Intellectual Property</h3>
                <p>Addispay exclusively owns all patents, code, API definitions, trademarks, and platform software. Merchants receive a non-exclusive license to integrate APIs solely for commercial payment processing.</p>
              </div>
            </section>
          )}

          {/* PART FOUR: SETTLEMENT, FEES & DISPUTES */}
          {(activeTab === 'all' || activeTab === 'part4') && (
            <section className="space-y-6 pt-4 border-t border-gray-200">
              <div className="border-b border-[#00A36D]/20 pb-3">
                <h2 className="text-base font-black text-[#00A36D] uppercase tracking-wider">Part Four: Settlement, Fees, Taxes &amp; Disputes</h2>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">37. Fees &amp; Rates Schedule</h3>
                <p>Addispay processes transaction fees according to published rate schedules. Fees include VAT as required by Ethiopian Revenue Ministry directives.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">39–40. Payout Schedule &amp; Settlement</h3>
                <p>Local transactions settle into the Merchant designated Payout Account within 1 Business Day (T+1 / T+0) in accordance with NBE Electronic Payment Guidelines.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">41–48. Disputes, Reserves &amp; Refund Processing</h3>
                <p>Covers chargebacks, reserve retentions for high-risk accounts, error reporting timelines (within 6 months), and collection set-offs.</p>
              </div>
            </section>
          )}

          {/* PART FIVE: DATA USAGE & SECURITY */}
          {(activeTab === 'all' || activeTab === 'part5') && (
            <section className="space-y-6 pt-4 border-t border-gray-200">
              <div className="border-b border-[#00A36D]/20 pb-3">
                <h2 className="text-base font-black text-[#00A36D] uppercase tracking-wider">Part Five: Data Usage, Privacy &amp; Security</h2>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#101828]">49–53. Data Protection, Fraud Risk &amp; Security Controls</h3>
                <p>Addispay maintains PCI-DSS compliant infrastructure, TLS 1.3 encryption, and bank-grade tokenization to protect customer payment data and personal data.</p>
              </div>
            </section>
          )}

        </div>

        {/* Footer Contact Details */}
        <div className="bg-[#E5F5EE] rounded-3xl p-6 sm:p-8 mt-8 border border-[#00A36D]/20 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <div>
            <h4 className="text-sm font-black text-[#101828]">Questions regarding this Agreement?</h4>
            <p className="text-xs text-gray-600">Contact Addispay Compliance &amp; Legal Office</p>
          </div>

          <div className="text-xs font-bold text-[#00A36D] text-right space-y-1">
            <div>Email: support@addispay.et · info@addispay.co</div>
            <div>Phone: +251 116 685 873 / +251 116 684 243</div>
            <div>Address: Near Lem Hotel, Efrata Building 4th Floor, Addis Ababa</div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-400 font-medium pt-6">
          © 2024–2026 Addispay Financial Technology Share Company. All rights reserved.
        </div>

      </div>

    </div>
  );
}
