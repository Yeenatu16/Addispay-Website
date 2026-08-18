import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/SEO/JsonLd';
import { ShareArticleButton } from '@/components/Blog/ShareArticleButton';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { ArrowLeft, Clock, User, ChevronRight } from 'lucide-react';
import { mediaUrl, news } from '@/lib/api';
import { articleCategory, articleReadTime, formatDate } from '@/lib/admin/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://addispay.et';

export async function generateStaticParams() {
  const { articles } = await news.list({ page: 1, limit: 50 });
  return articles.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  let post;
  try {
    post = await news.bySlug(resolvedParams.slug);
  } catch {
    return { title: 'Article Not Found | Addispay Blog' };
  }

  return {
    title: `${post.title} | Addispay Blog`,
    description: post.shortDescription,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.shortDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: 'Addispay',
      publishedTime: new Date(post.publishedAt || post.createdAt).toISOString(),
      authors: ['Addispay Editorial Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.shortDescription,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  let post;
  try {
    post = await news.bySlug(resolvedParams.slug);
  } catch {
    notFound();
  }

  const { articles } = await news.list({ page: 1, limit: 3 });
  const relatedPosts = articles.filter((p) => p.id !== post.id).slice(0, 2);
  const articlePath = `/blog/${post.slug}`;
  const articleUrl = `${SITE_URL}${articlePath}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.shortDescription,
    author: {
      '@type': 'Person',
      name: 'Addispay Editorial Team',
      jobTitle: 'Corporate Communications',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Addispay Financial Technology Share Company',
      logo: `${SITE_URL}/logo.png`,
    },
    datePublished: new Date(post.publishedAt || post.createdAt).toISOString(),
    mainEntityOfPage: articleUrl,
  };

  return (
    <article className="relative bg-[#F8FDFB] py-12 text-[#101828] lg:py-20">
      <JsonLd data={articleJsonLd} />

      <div className="mx-auto max-w-4xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-xs text-[#6A7282]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-semibold text-[#101828] transition-colors hover:text-[#00A36D]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Articles
          </Link>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Blog</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-[#00A36D]">{articleCategory(post)}</span>
          </div>
        </div>

        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#00A36D]/20 bg-[#E5F5EE] px-3.5 py-1 text-xs font-bold text-[#00A36D]">
              {articleCategory(post)}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#6A7282]">
              <Clock className="h-3.5 w-3.5" />
              {articleReadTime(post)}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#101828] sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="flex items-center justify-between rounded-2xl border border-[#E5F5EE] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00A36D]/20 bg-[#E5F5EE] font-bold text-[#00A36D]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#101828]">Addispay Editorial Team</div>
                <div className="text-xs text-[#6A7282]">
                  Published {formatDate(post.publishedAt || post.createdAt)}
                </div>
              </div>
            </div>

            <ShareArticleButton
              title={post.title}
              summary={post.shortDescription}
              path={articlePath}
            />
          </div>
        </header>

        {post.coverImageUrl && (
          <div className="relative h-72 overflow-hidden rounded-3xl border border-[#E5F5EE]">
            <img src={mediaUrl(post.coverImageUrl)} alt={post.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div
          className="article-body max-w-none text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.fullContent) }}
        />

        {relatedPosts.length > 0 && (
          <div className="space-y-6 border-t border-gray-200 pt-10">
            <h3 className="text-xl font-bold text-[#101828]">Related Articles</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {relatedPosts.map((rel) => (
                <div key={rel.id} className="space-y-3 rounded-2xl border border-[#E5F5EE] bg-white p-6">
                  <span className="text-xs font-semibold text-[#00A36D]">{articleCategory(rel)}</span>
                  <h4 className="text-base font-bold text-[#101828] transition-colors hover:text-[#00A36D]">
                    <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                  </h4>
                  <p className="line-clamp-2 text-xs text-[#6A7282]">{rel.shortDescription}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
