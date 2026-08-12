'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Plus,
  Trash2,
  LogOut,
  X,
  Loader2,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';

interface JobItem {
  id: string;
  title: string;
  department: string;
  location: string;
  applicationsCount: number;
  status: 'Active' | 'Closed';
}

const initialJobs: JobItem[] = [
  { id: 'job-1', title: 'Senior Fintech Software Engineer (Node.js & Python)', department: 'Engineering', location: 'Addis Ababa (Hybrid)', applicationsCount: 42, status: 'Active' },
  { id: 'job-2', title: 'Lead DevOps & Site Reliability Engineer', department: 'Engineering', location: 'Addis Ababa (On-site)', applicationsCount: 18, status: 'Active' },
  { id: 'job-3', title: 'Product Manager — Payment Gateway & POS', department: 'Product & Design', location: 'Addis Ababa (On-site)', applicationsCount: 29, status: 'Active' },
  { id: 'job-4', title: 'Merchant Success & Onboarding Lead', department: 'Operations & Sales', location: 'Addis Ababa (On-site)', applicationsCount: 54, status: 'Active' },
  { id: 'job-5', title: 'Head of Regulatory Compliance & NBE Reporting', department: 'Compliance & Legal', location: 'Addis Ababa (On-site)', applicationsCount: 12, status: 'Active' },
];

export default function CareerWriterDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const { currentUser, logout } = useAdmin();

  // Redirect to login or appropriate dashboard if not Career Writer
  useEffect(() => {
    if (!currentUser) {
      router.push('/admin/login');
      return;
    }
    if (currentUser.role !== 'Career Writer') {
      if (currentUser.role === 'Super Admin') {
        router.push('/admin/super');
      } else if (currentUser.role === 'Blog Writer') {
        router.push('/admin/blog');
      }
    }
  }, [currentUser, router]);

  const [jobs, setJobs] = useState<JobItem[]>(initialJobs);

  // Modals
  const [showJobModal, setShowJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Engineering');

  if (!currentUser || currentUser.role !== 'Career Writer') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#00A36D] animate-spin" />
        <p className="text-sm font-bold text-gray-700">Verifying authorization...</p>
      </div>
    );
  }

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const newJ: JobItem = {
      id: `job-${Date.now()}`,
      title: newJobTitle,
      department: newJobDept,
      location: 'Addis Ababa',
      applicationsCount: 0,
      status: 'Active',
    };
    setJobs([newJ, ...jobs]);
    setNewJobTitle('');
    setShowJobModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
      
      {/* Consistent Hero Header */}
      <div className="bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-12 lg:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* User Profile Badge */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00A36D] text-white flex items-center justify-center font-black text-xl shadow-md">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="text-base font-bold text-[#101828] flex items-center gap-2">
                  <span>{currentUser.name}</span>
                  <span className="text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase bg-[#F5A414] text-white">
                    Career Writer Workspace
                  </span>
                </div>
                <div className="text-xs text-[#6A7282] font-medium">{currentUser.email}</div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                logout();
                router.push('/admin/login');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-600 border border-gray-200 font-bold text-xs shadow-xs transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-1">
              <div className="text-xs text-gray-500 font-semibold">Active Job Openings</div>
              <div className="text-2xl font-black text-[#F5A414]">
                {jobs.filter((j) => j.status === 'Active').length}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black bg-[#00A36D] text-white shadow-sm">
              <Briefcase className="w-4 h-4" />
              <span>Job Openings ({jobs.length})</span>
            </div>
          </div>

          <button
            onClick={() => setShowJobModal(true)}
            className="px-6 py-3 rounded-2xl bg-[#F5A414] hover:bg-[#e0930f] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job Opening</span>
          </button>
        </div>

        {/* Job Openings Inventory */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#101828]">Job Openings Inventory</h3>
            <span className="text-xs text-gray-500 font-semibold">HR Recruiter: {currentUser.name}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FDFB] border-b border-gray-100 text-gray-700 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Applicants</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#101828]">{job.title}</td>
                    <td className="px-6 py-4">
                      <span className="bg-[#E5F5EE] text-[#00A36D] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                        {job.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{job.location}</td>
                    <td className="px-6 py-4 font-bold text-[#00A36D]">
                      {job.applicationsCount} Candidates
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          setJobs(
                            jobs.map((j) =>
                              j.id === job.id
                                ? { ...j, status: j.status === 'Active' ? 'Closed' : 'Active' }
                                : j
                            )
                          )
                        }
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase transition-all ${
                          job.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {job.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setJobs(jobs.filter((j) => j.id !== job.id))}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* New Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 relative animate-in zoom-in-95 duration-200 border border-gray-100 shadow-2xl">
            <button onClick={() => setShowJobModal(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black text-[#101828]">Post New Job Opening</h3>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Job Title *</label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer..."
                  className="w-full bg-[#F8FDFB] px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#00A36D] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Department *</label>
                <select
                  value={newJobDept}
                  onChange={(e) => setNewJobDept(e.target.value)}
                  className="w-full bg-[#F8FDFB] px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#00A36D] outline-none"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="Operations & Sales">Operations & Sales</option>
                  <option value="Compliance & Legal">Compliance & Legal</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3.5 rounded-2xl bg-[#F5A414] text-white font-bold text-xs shadow-md hover:bg-[#e0930f] transition-all">
                Publish Job Opening
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
