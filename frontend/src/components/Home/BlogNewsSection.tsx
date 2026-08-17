'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { EmptyState, Spinner } from '@/components/ui';
import { mediaUrl, news, type NewsArticle } from '@/lib/api';
import { articleCategory, articleReadTime, formatDate } from '@/lib/admin/utils';

export const BlogNewsSection: React.FC = () => {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [emptyMessage, setEmptyMessage] = useState('No news available at this time.');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    news
      .homepage()
      .then((data) => {
        if (!active) return;
        setArticles(data.latest);
        setEmptyMessage(data.emptyMessage);
      })
      .catch(() => {
        if (!active) return;
        setArticles([]);
        setEmptyMessage('News is temporarily unavailable. Please try again later.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00A36D]/10 text-[#00A36D] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-[#00A36D]" />
              <span>{t('blog.badge')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#101828] tracking-tight">
              {t('blog.title')}
            </h2>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#00A36D] font-bold text-sm hover:gap-3 transition-all"
          >
            <span>{t('blog.read_more')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Spinner label="Loading latest news..." />
        ) : articles.length === 0 ? (
          <EmptyState title="No published stories yet" description={emptyMessage} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.slice(0, 3).map((art) => (
              <Link
                key={art.id}
                href={`/blog/${art.slug}`}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={mediaUrl(art.coverImageUrl) || '/images/blog_security.png'}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#00A36D] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                      {articleCategory(art)}
                    </span>
                  </div>

                  <div className="p-6 space-y-2">
                    <h3 className="font-bold text-[#101828] text-base group-hover:text-[#00A36D] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[#6A7282] line-clamp-2">{art.shortDescription}</p>
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
        )}

      </div>
    </section>
  );
};
