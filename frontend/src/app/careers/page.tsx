'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Search, Send, X, Upload } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Alert, EmptyState, Input, Pagination, Spinner, Textarea } from '@/components/ui';
import { careers, errorMessage, JOB_TYPE_LABELS, type JobPosting } from '@/lib/api';
import { requirementsToLines } from '@/lib/admin/utils';

export default function CareersPage() {
  const { t } = useLanguage();
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeJobModal, setActiveJobModal] = useState<JobPosting | null>(null);
  const [applied, setApplied] = useState<boolean>(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    linkedinUrl: '',
    portfolioUrl: '',
    coverLetter: '',
  });
  const pageSize = 6;

  useEffect(() => {
    let active = true;
    careers
      .openJobs()
      .then((data) => {
        if (active) setJobs(data);
      })
      .catch(() => {
        if (active) setJobs([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const departments = useMemo(
    () => ['All', ...Array.from(new Set(jobs.map((job) => job.department)))],
    [jobs],
  );

  const filteredJobs = jobs.filter((job) => {
    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });
  const pagedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJobModal || !cvFile) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const upload = await careers.uploadCv(cvFile);
      await careers.apply({
        jobId: activeJobModal.id,
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        linkedinUrl: form.linkedinUrl || undefined,
        portfolioUrl: form.portfolioUrl || undefined,
        coverLetter: form.coverLetter,
        cvUrl: upload.url,
      });
      setApplied(true);
    } catch (error) {
      setSubmitError(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-16 lg:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00A36D]/10 text-[#00A36D] text-xs font-bold uppercase tracking-wider border border-[#00A36D]/20">
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
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
          {loading ? (
            <Spinner label="Loading open roles..." />
          ) : pagedJobs.length === 0 ? (
            <EmptyState title="No open roles match your search" description="Try a different keyword or department filter." />
          ) : pagedJobs.map((job) => (
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
                    {JOB_TYPE_LABELS[job.jobType]}
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
                    <Briefcase className="w-3.5 h-3.5 text-[#00A36D]" /> {JOB_TYPE_LABELS[job.jobType]}
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
          {!loading && filteredJobs.length > pageSize && (
            <Pagination page={page} total={filteredJobs.length} pageSize={pageSize} onPageChange={setPage} />
          )}
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
                {activeJobModal.location} · {JOB_TYPE_LABELS[activeJobModal.jobType]}
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <h4 className="font-bold text-sm text-[#101828]">Job Overview:</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{activeJobModal.description}</p>
              
              <h4 className="font-bold text-sm text-[#101828] pt-2">Key Requirements:</h4>
              <ul className="space-y-1.5">
                {requirementsToLines(activeJobModal.requirements).map((req, i) => (
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
                <p className="text-xs text-[#6A7282]">Thank you for applying for {activeJobModal.title}. Our HR team will reach out shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 border-t border-gray-100 pt-4">
                <h4 className="font-bold text-sm text-[#101828]">Submit Application</h4>
                {submitError && <Alert tone="error">{submitError}</Alert>}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Full Name *"
                  />
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Email Address *"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    type="text"
                    required
                    value={form.phoneNumber}
                    onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="Phone Number (e.g. 0911234567) *"
                  />
                  <Input
                    type="url"
                    value={form.linkedinUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                    placeholder="LinkedIn URL"
                  />
                </div>

                <Input
                  type="url"
                  value={form.portfolioUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
                  placeholder="Portfolio URL"
                />

                <Textarea
                  rows={3}
                  required
                  value={form.coverLetter}
                  onChange={(e) => setForm((prev) => ({ ...prev, coverLetter: e.target.value }))}
                  placeholder="Cover Note / Why Addispay?"
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Upload CV/Resume *
                  </label>
                  <div className="relative">
                    <label
                      htmlFor="cv-file"
                      className="w-full bg-[#F8FDFB] px-4 py-3 rounded-xl border border-dashed border-gray-200 hover:border-[#00A36D] focus:outline-none transition-all flex items-center justify-between cursor-pointer text-xs font-medium text-gray-500"
                    >
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-[#00A36D]" />
                        <span>{cvFile ? cvFile.name : 'Upload PDF or Word Document (Max 5MB)'}</span>
                      </div>
                      {cvFile && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setCvFile(null);
                          }}
                          className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                          title="Remove file"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </label>
                    <input
                      type="file"
                      id="cv-file"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCvFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                    disabled={submitting || !cvFile}
                    className="w-full py-3.5 rounded-xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
