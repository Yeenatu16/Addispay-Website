'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Eye,
  FileCheck,
  Calendar,
  X,
  Maximize2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface OfficialPdfDoc {
  id: string;
  title: string;
  category: 'Audit & Financial' | 'Governance & Legal' | 'Shareholders' | 'NBE Regulatory';
  pdfUrl: string;
  fileSize: string;
  date: string;
  pages: number;
  description: string;
}

// All real downloaded PDF documents from https://addispay.et/documents
const realAddispayPdfs: OfficialPdfDoc[] = [
  {
    id: 'real-pdf-1',
    title: 'Addispay Official Memorandum & Articles of Association',
    category: 'Governance & Legal',
    pdfUrl: '/documents/memorandum.pdf',
    fileSize: '3.2 MB',
    date: 'Official Charter',
    pages: 18,
    description: 'Official establishing charter and legal Memorandum of Association for Addispay Financial Technology S.C.',
  },
  {
    id: 'real-pdf-2',
    title: 'Addispay Board of Directors Annual Executive Report',
    category: 'Governance & Legal',
    pdfUrl: '/documents/AddispayBoard2025Report.pdf',
    fileSize: '20 MB',
    date: '2025 Annual',
    pages: 42,
    description: 'Executive progress report by the Board of Directors detailing payment system operator performance and expansion.',
  },
  {
    id: 'real-pdf-3',
    title: 'Addispay Financial & External Audit Report 2024',
    category: 'Audit & Financial',
    pdfUrl: '/documents/2024auditreport.pdf',
    fileSize: '809 KB',
    date: '2024 Financials',
    pages: 24,
    description: 'Complete audited financial statements, ledger reconciliations, and independent external auditor report for 2024.',
  },
  {
    id: 'real-pdf-4',
    title: 'Addispay Financial & Audit Report 2025',
    category: 'Audit & Financial',
    pdfUrl: '/documents/2025auditreport.pdf',
    fileSize: '3.8 MB',
    date: '2025 Financials',
    pages: 30,
    description: 'Official 2025 financial report and regulatory submission prepared for National Bank of Ethiopia oversight.',
  },
  {
    id: 'real-pdf-5',
    title: '1st Annual General Shareholders Meeting Document',
    category: 'Shareholders',
    pdfUrl: '/documents/1stmeeting.pdf',
    fileSize: '565 KB',
    date: '1st Assembly',
    pages: 14,
    description: 'Official resolutions, meeting minutes, and corporate decisions from the 1st Annual General Shareholders Meeting.',
  },
  {
    id: 'real-pdf-6',
    title: '2nd Annual Shareholders Assembly General Report',
    category: 'Shareholders',
    pdfUrl: '/documents/2ndmeeting.pdf',
    fileSize: '235 KB',
    date: '2nd Assembly',
    pages: 12,
    description: 'Comprehensive report and decisions approved during the 2nd General Assembly of Addispay shareholders.',
  },
  {
    id: 'real-pdf-7',
    title: 'Board of Directors Election Rules & Voting Regulations',
    category: 'Governance & Legal',
    pdfUrl: '/documents/election.pdf',
    fileSize: '726 KB',
    date: 'Governance',
    pages: 16,
    description: 'Regulatory guidelines, candidate qualifications, and voting procedures for Board of Directors elections.',
  },
  {
    id: 'real-pdf-8',
    title: 'Shareholders Assembly Official Meeting Call & Notice',
    category: 'Shareholders',
    pdfUrl: '/documents/2ndcall.pdf',
    fileSize: '200 KB',
    date: 'Official Notice',
    pages: 6,
    description: 'Formal announcement call notice for the General Assembly of Shareholders of Addispay S.C.',
  },
  {
    id: 'real-pdf-9',
    title: 'General Shareholders Convocation Notice PDF',
    category: 'Shareholders',
    pdfUrl: '/documents/call.pdf',
    fileSize: '531 KB',
    date: 'Notice',
    pages: 4,
    description: 'Published convocation notice for extraordinary general shareholder assembly.',
  },
  {
    id: 'real-pdf-10',
    title: 'NBE Payment System Operator License Certificate PDF',
    category: 'NBE Regulatory',
    pdfUrl: '/documents/nbe_payment_operator_license.pdf',
    fileSize: '820 KB',
    date: 'NBE License',
    pages: 2,
    description: 'License Certificate NPS/PSO/007/2022 authorizing Addispay Financial Technology S.C. as a Payment System Operator.',
  },
  {
    id: 'real-pdf-11',
    title: 'Addispay Official Merchant Service Agreement (53 Articles PDF)',
    category: 'Governance & Legal',
    pdfUrl: '/documents/addispay_merchant_service_agreement.pdf',
    fileSize: '1.4 MB',
    date: '2024-2026',
    pages: 14,
    description: 'Legal binding framework governing merchant acquiring, transaction fees, payouts, chargebacks, and NBE compliance.',
  },
];

export default function RealPdfDocumentPortalPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pdfPreviewModal, setPdfPreviewModal] = useState<OfficialPdfDoc | null>(null);

  const categories = ['All', 'Governance & Legal', 'Audit & Financial', 'Shareholders', 'NBE Regulatory'];

  const filteredDocs = realAddispayPdfs.filter((item) =>
    selectedCategory === 'All' ? true : item.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-16 lg:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00A36D]/10 text-[#00A36D] text-xs font-bold uppercase tracking-wider border border-[#00A36D]/20">
            <FileText className="w-3.5 h-3.5" />
            <span>Official addispay.et PDF Document Library</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#101828] tracking-tight">
            Official PDF Document Library
          </h1>

          <p className="text-base sm:text-lg text-[#6A7282] max-w-2xl mx-auto leading-relaxed">
            All 11 official downloaded PDF documents from addispay.et — Audit reports, shareholder meeting assemblies, board charters, and NBE licenses.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://devportal.addispay.et/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-sm shadow-md shadow-[#00A36D]/20 hover:-translate-y-0.5 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Developer API Portal (devportal.addispay.et)</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              href="/merchant-agreement"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm border border-gray-200 shadow-xs hover:-translate-y-0.5 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#00A36D]" />
              <span>Merchant Service Agreement</span>
              <ExternalLink className="w-4 h-4 opacity-60" />
            </Link>
          </div>

        </div>
      </div>

      {/* Category Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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

      {/* Grid of All Real Downloaded PDF Documents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                
                {/* REAL PDF IFRAME PREVIEW CANVAS */}
                <div
                  className="relative w-full h-64 rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden mb-5 cursor-pointer group-hover:border-[#00A36D]/40 transition-all"
                  onClick={() => setPdfPreviewModal(doc)}
                >
                  <iframe
                    src={`${doc.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full border-0 pointer-events-none scale-100"
                    title={doc.title}
                  />

                  {/* Top Badge Overlay */}
                  <span className="absolute top-3 left-3 bg-[#E5F5EE] text-[#00A36D] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase shadow-xs">
                    {doc.category}
                  </span>

                  {/* Size & Page Badge */}
                  <span className="absolute bottom-3 right-3 bg-[#101828] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    PDF · {doc.fileSize}
                  </span>

                  {/* Expand Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPdfPreviewModal(doc);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/90 text-gray-800 font-bold text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#00A36D]" />
                      <span>Full PDF View</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 mb-6">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#00A36D]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{doc.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#101828] group-hover:text-[#00A36D] transition-colors leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-[#6A7282] leading-relaxed line-clamp-2">
                    {doc.description}
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPdfPreviewModal(doc)}
                  className="flex-1 py-3 rounded-xl bg-[#F8FDFB] hover:bg-gray-100 text-gray-800 font-bold text-xs border border-gray-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-gray-600" />
                  <span>Preview PDF</span>
                </button>

                <a
                  href={doc.pdfUrl}
                  download
                  className="flex-1 py-3 rounded-xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#00A36D]/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULL-SCREEN PDF INTERACTIVE PREVIEW MODAL */}
      {pdfPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 relative space-y-4 animate-in zoom-in-95 duration-200 h-[92vh] flex flex-col justify-between border border-gray-100 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="space-y-1">
                <span className="bg-[#E5F5EE] text-[#00A36D] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                  {pdfPreviewModal.category}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#101828] leading-tight">
                  {pdfPreviewModal.title}
                </h3>
              </div>

              <button
                onClick={() => setPdfPreviewModal(null)}
                className="p-2.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal PDF Iframe Canvas */}
            <div className="w-full flex-1 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden">
              <iframe
                src={pdfPreviewModal.pdfUrl}
                className="w-full h-full border-0"
                title={pdfPreviewModal.title}
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#6A7282] max-w-xl">{pdfPreviewModal.description}</p>

              <a
                href={pdfPreviewModal.pdfUrl}
                download
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF File ({pdfPreviewModal.fileSize})</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
