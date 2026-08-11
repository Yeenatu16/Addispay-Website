'use client';

import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Search, Sparkles, Send, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface JobOpening {
  id: string;
  title: string;
  department: 'Engineering' | 'Product & Design' | 'Operations & Sales' | 'Compliance & Legal';
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
}

export const jobPositions: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Senior Fintech Software Engineer (Node.js & Python)',
    department: 'Engineering',
    location: 'Addis Ababa (Hybrid)',
    type: 'Full-time',
    experience: '4+ years',
    description: 'We are looking for a Senior Backend Engineer to build high-scale, ultra-low latency transaction systems and payment gateway APIs.',
    requirements: [
      'Experience with distributed backend systems, PostgreSQL, Redis, and Kafka',
      'Solid background in payment processing, webhooks, and idempotent APIs',
      'Knowledge of PCI-DSS compliance and financial data security standards',
    ],
  },
  {
    id: 'job-2',
    title: 'Lead DevOps & Site Reliability Engineer',
    department: 'Engineering',
    location: 'Addis Ababa (On-site)',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Lead our cloud infrastructure reliability, Kubernetes deployments, monitoring, and automated disaster recovery systems.',
    requirements: [
      'Hands-on experience with Docker, Kubernetes, Terraform, and AWS/Cloud',
      'Proficiency in Prometheus, Grafana, and ELK stack log monitoring',
      'Experience maintaining 99.99% system availability SLA',
    ],
  },
  {
    id: 'job-3',
    title: 'Product Manager — Payment Gateway & POS',
    department: 'Product & Design',
    location: 'Addis Ababa (On-site)',
    type: 'Full-time',
    experience: '3+ years',
    description: 'Drive the product roadmap for Addis Merchant POS, contactless NFC payments, and merchant dashboard tools.',
    requirements: [
      'Proven track record delivering B2B fintech or mobile wallet products',
      'Strong UX mindset and data-driven approach to product analytics',
      'Excellent stakeholder management and merchant empathy',
    ],
  },
  {
    id: 'job-4',
    title: 'Merchant Success & Onboarding Lead',
    department: 'Operations & Sales',
    location: 'Addis Ababa (On-site)',
    type: 'Full-time',
    experience: '2+ years',
    description: 'Manage onboarding, merchant support, and customer satisfaction for over 50,000 retail and enterprise partners.',
    requirements: [
      'Strong problem-solving skills and customer service orientation',
      'Fluency in Amharic, Afaan Oromoo, and English',
      'Experience in merchant training and SLA resolution',
    ],
  },
  {
    id: 'job-5',
    title: 'Head of Regulatory Compliance & NBE Reporting',
    department: 'Compliance & Legal',
    location: 'Addis Ababa (On-site)',
    type: 'Full-time',
    experience: '6+ years',
    description: 'Ensure total adherence to National Bank of Ethiopia (NBE) payment system operator regulations, AML/CFT policies, and audit frameworks.',
    requirements: [
      'Degree in Law, Finance, or Risk Management',
      'Deep understanding of NBE PSO directives (NPS/PSO/007/2022)',
      'Experience engaging regulatory authorities and managing compliance audits',
    ],
  },
];

export default function CareersPage() {
  const { t } = useLanguage();
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeJobModal, setActiveJobModal] = useState<JobOpening | null>(null);
  const [applied, setApplied] = useState<boolean>(false);

  const departments = ['All', 'Engineering', 'Product & Design', 'Operations & Sales', 'Compliance & Legal'];

  const filteredJobs = jobPositions.filter((job) => {
    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      setActiveJobModal(null);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-16 lg:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00A36D]/10 text-[#00A36D] text-xs font-bold uppercase tracking-wider border border-[#00A36D]/20">
            <Sparkles className="w-3.5 h-3.5 fill-[#00A36D]" />
            <span>{t('careers.badge')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#101828] tracking-tight">
            {t('careers.title')}
          </h1>

          <p className="text-base sm:text-lg text-[#6A7282] max-w-2xl mx-auto leading-relaxed">
            {t('careers.subtitle')}
          </p>

          {/* Search & Filter Bar */}
          <div className="max-w-xl mx-auto pt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search open roles..."
                className="w-full bg-white pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:border-[#00A36D] text-sm text-gray-800 font-medium"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Department Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedDept === dept
                  ? 'bg-[#00A36D] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        <div className="mt-8 space-y-6 max-w-4xl mx-auto">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-3 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#E5F5EE] text-[#00A36D] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                    {job.department}
                  </span>
                  <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {job.type}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#101828]">{job.title}</h3>

                <p className="text-xs text-[#6A7282] leading-relaxed line-clamp-2">
                  {job.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00A36D]" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-[#00A36D]" /> {job.experience}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveJobModal(job)}
                className="px-6 py-3 rounded-xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-xs shadow-md shadow-[#00A36D]/20 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>{t('careers.apply_now')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Application Modal */}
      {activeJobModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setActiveJobModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase bg-[#E5F5EE] text-[#00A36D] px-3 py-1 rounded-full">
                {activeJobModal.department}
              </span>
              <h2 className="text-2xl font-black text-[#101828]">{activeJobModal.title}</h2>
              <div className="text-xs text-gray-500 font-semibold">
                {activeJobModal.location} · {activeJobModal.type} · {activeJobModal.experience}
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <h4 className="font-bold text-sm text-[#101828]">Job Overview:</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{activeJobModal.description}</p>
              
              <h4 className="font-bold text-sm text-[#101828] pt-2">Key Requirements:</h4>
              <ul className="space-y-1.5">
                {activeJobModal.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#00A36D] shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Application Form */}
            {applied ? (
              <div className="bg-[#E5F5EE] border border-[#00A36D]/30 p-6 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#00A36D] mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-[#101828]">Application Submitted!</h3>
                <p className="text-xs text-[#6A7282]">
                  Thank you for applying for {activeJobModal.title}. Our HR team will reach out shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 border-t border-gray-100 pt-4">
                <h4 className="font-bold text-sm text-[#101828]">Submit Application</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    className="w-full bg-[#F8FDFB] px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#00A36D] text-xs font-medium"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    className="w-full bg-[#F8FDFB] px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#00A36D] text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Phone Number (e.g. 0911234567) *"
                    className="w-full bg-[#F8FDFB] px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#00A36D] text-xs font-medium"
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn / Portfolio URL"
                    className="w-full bg-[#F8FDFB] px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#00A36D] text-xs font-medium"
                  />
                </div>

                <textarea
                  rows={3}
                  placeholder="Cover Note / Why Addispay?"
                  className="w-full bg-[#F8FDFB] px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#00A36D] text-xs font-medium"
                />

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
