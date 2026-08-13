'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Newspaper,
  Briefcase,
  Plus,
  Trash2,
  ShieldCheck,
  UserCheck,
  UserPlus,
  LogOut,
  Users,
  X,
  User,
  Loader2,
} from 'lucide-react';
import { useAdmin, AdminRole } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';

interface ArticleItem {
  id: string;
  title: string;
  tag: string;
  author: string;
  date: string;
  status: 'Published' | 'Draft';
  views: number;
}

interface JobItem {
  id: string;
  title: string;
  department: string;
  location: string;
  applicationsCount: number;
  status: 'Active' | 'Closed';
}

const initialArticles: ArticleItem[] = [
  { id: 'art-1', title: 'Addispay Launches Instant QR Payment for 50,000+ Merchants', tag: 'Product', author: 'Bethlehem Tilahun', date: 'Aug 4, 2026', status: 'Published', views: 3420 },
  { id: 'art-2', title: 'How Ethiopian SMEs Are Growing 3x Faster with Digital Payments', tag: 'Growth', author: 'Bethlehem Tilahun', date: 'Aug 2, 2026', status: 'Published', views: 2890 },
  { id: 'art-3', title: 'Bank-Grade Security: How Addispay Keeps Every Transaction Safe', tag: 'Security', author: 'Security Office', date: 'Aug 1, 2026', status: 'Published', views: 1950 },
  { id: 'art-4', title: 'Addispay API v3: Faster Webhooks, Better SDKs, Zero Downtime', tag: 'Developer', author: 'Dev Team', date: 'Jul 31, 2026', status: 'Draft', views: 640 },
];

const initialJobs: JobItem[] = [
  { id: 'job-1', title: 'Senior Fintech Software Engineer (Node.js & Python)', department: 'Engineering', location: 'Addis Ababa (Hybrid)', applicationsCount: 42, status: 'Active' },
  { id: 'job-2', title: 'Lead DevOps & SRE', department: 'Engineering', location: 'Addis Ababa (On-site)', applicationsCount: 18, status: 'Active' },
  { id: 'job-3', title: 'Product Manager — Payments', department: 'Product & Design', location: 'Addis Ababa (On-site)', applicationsCount: 29, status: 'Active' },
  { id: 'job-4', title: 'Merchant Onboarding Lead', department: 'Operations & Sales', location: 'Addis Ababa (On-site)', applicationsCount: 54, status: 'Active' },
];

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const { currentUser, logout, teamMembers, addTeamMember, toggleTeamMemberStatus, removeTeamMember } = useAdmin();

  // Redirect to appropriate dashboard if not Super Admin
  useEffect(() => {
    if (!currentUser) {
      router.push('/admin/login');
      return;
    }
    if (currentUser.role !== 'Super Admin') {
      if (currentUser.role === 'Blog Writer') {
        router.push('/admin/blog');
      } else if (currentUser.role === 'Career Writer') {
        router.push('/admin/careers');
      }
    }
  }, [currentUser, router]);

  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [jobs, setJobs] = useState<JobItem[]>(initialJobs);

  // Modals
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('Product');

  const [showJobModal, setShowJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Engineering');

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<AdminRole>('Blog Writer');

  if (!currentUser || currentUser.role !== 'Super Admin') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#00A36D] animate-spin" />
        <p className="text-sm font-bold text-gray-700">Verifying authorization...</p>
      </div>
    );
  }

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const newArt: ArticleItem = {
      id: `art-${Date.now()}`,
      title: newTitle,
      tag: newTag,
      author: currentUser.name,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Published',
      views: 0,
    };
    setArticles([newArt, ...articles]);
    setNewTitle('');
    setShowArticleModal(false);
  };

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

  const handleGrantAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail || !newMemberName) return;
    addTeamMember(newMemberName, newMemberEmail, newMemberRole);
    setNewMemberName('');
    setNewMemberEmail('');
    setShowTeamModal(false);
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
                    Super Admin
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
              <div className="text-xs text-gray-500 font-semibold">Total Articles</div>
              <div className="text-2xl font-black text-[#00A36D]">{articles.length}</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-1">
              <div className="text-xs text-gray-500 font-semibold">Active Job Openings</div>
              <div className="text-2xl font-black text-[#F5A414]">
                {jobs.filter((j) => j.status === 'Active').length}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-1">
              <div className="text-xs text-gray-500 font-semibold">Authorized Team</div>
              <div className="text-2xl font-black text-[#101828]">{teamMembers.length} Members</div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Unified Workspace Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Row 1: Blog & Jobs Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Section A: Blog Articles Inventory */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#00A36D]" />
                <h3 className="text-lg font-bold text-[#101828]">Blog Articles</h3>
              </div>
              <button
                onClick={() => setShowArticleModal(true)}
                className="px-4 py-2 rounded-xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Article</span>
              </button>
            </div>

            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FDFB] border-b border-gray-100 text-gray-700 font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Tag</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#101828] max-w-[200px] truncate leading-snug">
                        {art.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-[#E5F5EE] text-[#00A36D] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                          {art.tag}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 truncate max-w-[100px]">{art.author}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setArticles(articles.filter((a) => a.id !== art.id))}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section B: Job Openings Inventory */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#F5A414]" />
                <h3 className="text-lg font-bold text-[#101828]">Careers & Jobs</h3>
              </div>
              <button
                onClick={() => setShowJobModal(true)}
                className="px-4 py-2 rounded-xl bg-[#F5A414] hover:bg-[#e0930f] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Job</span>
              </button>
            </div>

            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FDFB] border-b border-gray-100 text-gray-700 font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Job Title</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#101828] max-w-[200px] truncate">{job.title}</td>
                      <td className="px-6 py-4">
                        <span className="bg-[#E5F5EE] text-[#00A36D] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                          {job.department}
                        </span>
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
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase transition-all ${
                            job.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {job.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setJobs(jobs.filter((j) => j.id !== job.id))}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Row 2: Team Permissions Control (Full-Width) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#101828]" />
                <h3 className="text-lg font-bold text-[#101828]">Authorized Team Permissions</h3>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Add email addresses and assign Blog Writer or Career Writer permissions.</p>
            </div>

            <button
              onClick={() => setShowTeamModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#00A36D] text-white font-bold text-xs shadow-sm hover:bg-[#008959] transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Grant Email Access</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FDFB] border-b border-gray-100 text-gray-700 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Authorized Email</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4">Access Status</th>
                  <th className="px-6 py-4">Added Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#101828] flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{member.name}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#00A36D]">{member.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                          member.role === 'Super Admin'
                            ? 'bg-amber-100 text-amber-800'
                            : member.role === 'Blog Writer'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleTeamMemberStatus(member.id)}
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                          member.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {member.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{member.addedDate}</td>
                    <td className="px-6 py-4 text-right">
                      {member.role !== 'Super Admin' && (
                        <button
                          onClick={() => removeTeamMember(member.id)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Revoke & Delete Access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Grant Email Access Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 relative animate-in zoom-in-95 duration-200 border border-gray-100 shadow-2xl">
            <button
              onClick={() => setShowTeamModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#101828]">Grant Email Access & Role</h3>
              <p className="text-xs text-[#6A7282]">Authorize new staff members to access Blog or Career management.</p>
            </div>

            <form onSubmit={handleGrantAccess} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Bethlehem Tilahun"
                  className="w-full bg-[#F8FDFB] px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#00A36D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Email Address to Authorize *</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="e.g. writer@addispay.et"
                  className="w-full bg-[#F8FDFB] px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#00A36D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Select Assigned Role *</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as AdminRole)}
                  className="w-full bg-[#F8FDFB] px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#00A36D] outline-none"
                >
                  <option value="Blog Writer">Blog Writer (Access to Blog Articles Only)</option>
                  <option value="Career Writer">Career Writer (Access to Job Openings Only)</option>
                  <option value="Super Admin">Super Admin (Full Control & Team Permissions)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#00A36D] text-white font-bold text-xs shadow-md hover:bg-[#008959] transition-all flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Grant Email Permission</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Article Modal */}
      {showArticleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 relative animate-in zoom-in-95 duration-200 border border-gray-100 shadow-2xl">
            <button onClick={() => setShowArticleModal(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black text-[#101828]">Create Blog Article</h3>
            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Article Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter article title..."
                  className="w-full bg-[#F8FDFB] px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#00A36D] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Category Tag *</label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full bg-[#F8FDFB] px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#00A36D] outline-none"
                >
                  <option value="Product">Product</option>
                  <option value="Growth">Growth</option>
                  <option value="Security">Security</option>
                  <option value="Developer">Developer</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3.5 rounded-2xl bg-[#00A36D] text-white font-bold text-xs shadow-md hover:bg-[#008959] transition-all">
                Publish Article
              </button>
            </form>
          </div>
        </div>
      )}

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
