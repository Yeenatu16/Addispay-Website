'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Newspaper,
  Plus,
  Trash2,
  LogOut,
  X,
  Loader2,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
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

const initialArticles: ArticleItem[] = [
  { id: 'art-1', title: 'Addispay Launches Instant QR Payment for 50,000+ Merchants', tag: 'Product', author: 'Bethlehem Tilahun', date: 'Aug 4, 2026', status: 'Published', views: 3420 },
  { id: 'art-2', title: 'How Ethiopian SMEs Are Growing 3x Faster with Digital Payments', tag: 'Growth', author: 'Bethlehem Tilahun', date: 'Aug 2, 2026', status: 'Published', views: 2890 },
  { id: 'art-3', title: 'Bank-Grade Security: How Addispay Keeps Every Transaction Safe', tag: 'Security', author: 'Security Office', date: 'Aug 1, 2026', status: 'Published', views: 1950 },
  { id: 'art-4', title: 'Addispay API v3: Faster Webhooks, Better SDKs, Zero Downtime', tag: 'Developer', author: 'Dev Team', date: 'Jul 31, 2026', status: 'Draft', views: 640 },
];

export default function BlogWriterDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const { currentUser, logout } = useAdmin();

  // Redirect to login or appropriate dashboard if not Blog Writer (Super Admins are redirected to their own dashboard or allowed here - let's allow Super Admin to see it or redirect to /admin/super, but since they have their own, let's redirect them to super)
  useEffect(() => {
    if (!currentUser) {
      router.push('/admin/login');
      return;
    }
    if (currentUser.role !== 'Blog Writer') {
      if (currentUser.role === 'Super Admin') {
        router.push('/admin/super');
      } else if (currentUser.role === 'Career Writer') {
        router.push('/admin/careers');
      }
    }
  }, [currentUser, router]);

  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);

  // Modals
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('Product');

  if (!currentUser || currentUser.role !== 'Blog Writer') {
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
                  <span className="text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase bg-[#00A36D] text-white">
                    Blog Writer Workspace
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
          </div>

        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black bg-[#00A36D] text-white shadow-sm">
              <Newspaper className="w-4 h-4" />
              <span>Blog Articles ({articles.length})</span>
            </div>
          </div>

          <button
            onClick={() => setShowArticleModal(true)}
            className="px-6 py-3 rounded-2xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Article</span>
          </button>
        </div>

        {/* Blog Articles Inventory */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#101828]">Blog Articles Inventory</h3>
            <span className="text-xs text-gray-500 font-semibold">Author: {currentUser.name}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FDFB] border-b border-gray-100 text-gray-700 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category Tag</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#101828] max-w-sm leading-snug">
                      {art.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#E5F5EE] text-[#00A36D] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                        {art.tag}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{art.author}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                          art.status === 'Published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">{art.views.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setArticles(articles.filter((a) => a.id !== art.id))}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Delete Article"
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

    </div>
  );
}
