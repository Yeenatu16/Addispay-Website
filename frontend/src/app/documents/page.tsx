'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  Eye,
  Calendar,
  X,
  Maximize2,
} from 'lucide-react';
import { documents as documentsApi, errorMessage, mediaUrl, type OfficialDocument } from '@/lib/api';
import { EmptyState, Spinner } from '@/components/ui';

export default function DocumentsPage() {
  const [docs, setDocs] = useState<OfficialDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pdfPreviewModal, setPdfPreviewModal] = useState<OfficialDocument | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await documentsApi.list(30);
        if (!cancelled) {
          setDocs(list);
          setError('');
        }
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(docs.map((d) => d.category).filter(Boolean))).sort();
    return ['All', ...unique];
  }, [docs]);

  const filteredDocs = docs.filter((item) =>
    selectedCategory === 'All' ? true : item.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
      <div className="border-b border-gray-100 bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-4 px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#00A36D]/20 bg-[#00A36D]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#00A36D] uppercase">
            <FileText className="h-3.5 w-3.5" />
            <span>Official Document Library</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-[#101828] sm:text-5xl lg:text-6xl">
            Official PDF Document Library
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#6A7282] sm:text-lg">
            Audit reports, shareholder assemblies, board charters, and NBE licenses — maintained by AddisPay administrators.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href="https://devportal.addispay.et/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#00A36D] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-[#00A36D]/20 transition-all hover:-translate-y-0.5 hover:bg-[#008959]"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Developer API Portal</span>
            </a>

            <Link
              href="/merchant-agreement"
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-7 py-3.5 text-sm font-bold text-gray-800 shadow-xs transition-all hover:-translate-y-0.5 hover:bg-gray-50"
            >
              <ShieldCheck className="h-4 w-4 text-[#00A36D]" />
              <span>Merchant Service Agreement</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#00A36D] text-white shadow-md'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <Spinner label="Loading documents..." />
        ) : error ? (
          <EmptyState title="Could not load documents" description={error} />
        ) : filteredDocs.length === 0 ? (
          <EmptyState
            title="No documents yet"
            description="Official documents will appear here once a Super Admin publishes them."
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc) => {
              const pdfHref = mediaUrl(doc.fileUrl);
              return (
                <div
                  key={doc.id}
                  className="group flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div>
                    <div
                      className="relative mb-5 h-64 w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 transition-all group-hover:border-[#00A36D]/40"
                      onClick={() => setPdfPreviewModal(doc)}
                    >
                      <iframe
                        src={`${pdfHref}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="pointer-events-none h-full w-full border-0"
                        title={doc.title}
                      />

                      <span className="absolute top-3 left-3 rounded-full bg-[#E5F5EE] px-3 py-1 text-[10px] font-extrabold text-[#00A36D] uppercase shadow-xs">
                        {doc.category}
                      </span>

                      <span className="absolute right-3 bottom-3 rounded-lg bg-[#101828] px-2.5 py-1 text-[10px] font-bold text-white">
                        PDF · {doc.fileSize}
                      </span>

                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-all group-hover:bg-black/30">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPdfPreviewModal(doc);
                          }}
                          className="flex items-center gap-1.5 rounded-xl bg-white/90 px-4 py-2 text-xs font-bold text-gray-800 opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                        >
                          <Maximize2 className="h-3.5 w-3.5 text-[#00A36D]" />
                          <span>Full PDF View</span>
                        </button>
                      </div>
                    </div>

                    <div className="mb-6 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#00A36D]">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{doc.dateLabel}</span>
                      </div>
                      <h3 className="text-base leading-snug font-bold text-[#101828] transition-colors group-hover:text-[#00A36D]">
                        {doc.title}
                      </h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-[#6A7282]">{doc.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPdfPreviewModal(doc)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-[#F8FDFB] py-3 text-xs font-bold text-gray-800 transition-colors hover:bg-gray-100"
                    >
                      <Eye className="h-3.5 w-3.5 text-gray-600" />
                      <span>Preview PDF</span>
                    </button>

                    <a
                      href={pdfHref}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#00A36D] py-3 text-xs font-bold text-white shadow-md shadow-[#00A36D]/20 transition-colors hover:bg-[#008959]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {pdfPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative flex h-[92vh] w-full max-w-5xl flex-col justify-between space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="space-y-1">
                <span className="rounded-full bg-[#E5F5EE] px-3 py-1 text-[10px] font-extrabold text-[#00A36D] uppercase">
                  {pdfPreviewModal.category}
                </span>
                <h3 className="text-lg leading-tight font-black text-[#101828] sm:text-xl">{pdfPreviewModal.title}</h3>
              </div>

              <button
                type="button"
                onClick={() => setPdfPreviewModal(null)}
                className="rounded-full p-2.5 text-gray-600 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="w-full flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              <iframe
                src={mediaUrl(pdfPreviewModal.fileUrl)}
                className="h-full w-full border-0"
                title={pdfPreviewModal.title}
              />
            </div>

            <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
              <p className="max-w-xl text-xs text-[#6A7282]">{pdfPreviewModal.description}</p>

              <a
                href={mediaUrl(pdfPreviewModal.fileUrl)}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#00A36D] px-7 py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#008959] sm:w-auto"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF File ({pdfPreviewModal.fileSize})</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
