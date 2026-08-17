'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { EmptyState, Pagination, Spinner } from '@/components/ui';
import { mediaUrl, news, type NewsArticle } from '@/lib/api';
import { articleCategory, articleReadTime, formatDate } from '@/lib/admin/utils';

export default function BlogPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [featured, setFeatured] = useState<NewsArticle | null>(null);
  const [emptyMessage, setEmptyMessage] = useState('No news available at this time.');
  const [loading, setLoading] = useState(true);
  const pageSize = 6;

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      news.list({ page, limit: pageSize, search: searchTerm || undefined }),
      news.homepage(),
    ])
      .then(([listData, homeData]) => {
        if (!active) return;
        setArticles(listData.articles);
        setTotal(listData.total);
        setFeatured(homeData.featured);
        setEmptyMessage(homeData.emptyMessage);
      })
      .catch(() => {
        if (!active) return;
        setArticles([]);
        setTotal(0);
        setFeatured(null);
        setEmptyMessage('News is temporarily unavailable. Please try again later.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, searchTerm]);

  const latestUpdates = useMemo(() => articles.slice(0, 4), [articles]);

  return (
    <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
      
      {/* Blog Hero Header */}
      <div className="bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-16 lg:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00A36D]/10 text-[#00A36D] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-[#00A36D]" />
            <span>{t('blog.badge')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#101828] tracking-tight">
            {t('blog.title')}
          </h1>

          <p className="text-base sm:text-lg text-[#6A7282] max-w-2xl mx-auto leading-relaxed">
            {t('blog.subtitle')}
          </p>

          {/* Search Input */}
          <div className="max-w-md mx-auto pt-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setPage(1);
                  setSearchTerm(e.target.value);
                }}
                placeholder={t('blog.search_placeholder')}
                className="w-full bg-white pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:border-[#00A36D] text-sm text-gray-800 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Featured Story */}
        {!loading && featured && (
        <div className="mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-[#00A36D] mb-4 block">
            {t('blog.featured')}
          </span>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 hover:shadow-2xl transition-shadow">
            <div className="relative h-64 lg:h-auto min-h-[300px]">
              <Image
                src={mediaUrl(featured.coverImageUrl) || '/images/blog_qr_launch.png'}
                alt="Addispay QR Launch"
                fill
                className="object-cover"
              />
            </div>

            <div className="p-8 lg:p-12 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#00A36D] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  {articleCategory(featured)}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {formatDate(featured.publishedAt || featured.createdAt)} · {articleReadTime(featured)}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#101828] leading-snug">
                {featured.title}
              </h2>

              <p className="text-[#6A7282] text-sm leading-relaxed">
                {featured.shortDescription}
              </p>

              <div className="pt-2">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-2 text-[#00A36D] font-bold text-sm hover:gap-3 transition-all"
                >
                  <span>{t('blog.read_more')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Latest Articles Grid + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Articles (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="text-xl font-bold text-[#101828]">{t('blog.latest_articles')}</h3>
              <span className="text-xs text-gray-500 font-semibold">{total} articles</span>
            </div>

            {loading ? (
              <Spinner label="Loading published articles..." />
            ) : articles.length === 0 ? (
              <EmptyState title="No articles found" description={emptyMessage} />
            ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((art) => (
                <Link
                  key={art.id}
                  href={`/blog/${art.slug}`}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={mediaUrl(art.coverImageUrl) || '/images/blog_sme_growth.png'}
                        alt={art.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#00A36D] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                        {articleCategory(art)}
                      </span>
                    </div>

                    <div className="p-6 space-y-2">
                      <h4 className="font-bold text-[#101828] text-base group-hover:text-[#00A36D] transition-colors leading-snug line-clamp-2">
                        {art.title}
                      </h4>
                      <p className="text-xs text-[#6A7282] leading-relaxed line-clamp-2">
                        {art.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs text-gray-400 font-medium">
                    <span>{formatDate(art.publishedAt || art.createdAt)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#00A36D]" /> {articleReadTime(art)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="pt-8">
              <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
            </div>
            </>
            )}
          </div>

          {/* Sidebar Updates (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
              <h3 className="font-bold text-lg text-[#101828] border-b border-gray-100 pb-3">
                {t('blog.latest_updates')}
              </h3>

              <div className="space-y-4">
                {latestUpdates.map((item) => (
                  <div key={item.id} className="space-y-1 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold text-[#00A36D] uppercase">{articleCategory(item)}</span>
                    <Link href={`/blog/${item.slug}`} className="block text-xs font-bold text-gray-800 hover:text-[#00A36D] transition-colors leading-snug">
                      {item.title}
                    </Link>
                    <span className="text-[10px] text-gray-400 block">{formatDate(item.publishedAt || item.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
