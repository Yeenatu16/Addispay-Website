import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, BlogPost } from '@/data/blogData';
import { JsonLd } from '@/components/SEO/JsonLd';
import { ArrowLeft, Clock, Calendar, User, Share2, Tag, ChevronRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return {
      title: 'Article Not Found | Addispay Blog',
    };
  }

  return {
    title: `${post.title} | Addispay Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://addispay.et/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `https://addispay.et/blog/${post.slug}`,
      siteName: 'Addispay',
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Addispay Financial Technology Share Company',
      logo: 'https://addispay.et/logo.png',
    },
    datePublished: new Date(post.date).toISOString(),
    mainEntityOfPage: `https://addispay.et/blog/${post.slug}`,
  };

  return (
    <article className="py-12 lg:py-20 relative">
      <JsonLd data={articleJsonLd} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link & Breadcrumbs */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 hover:text-blue-400 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Articles
          </Link>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Blog</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-blue-400">{post.category}</span>
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-950 text-blue-400 text-xs font-bold border border-blue-800">
              {post.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {post.title}
          </h1>

          {/* Author Box Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900/60 border border-blue-700/50 flex items-center justify-center text-blue-300 font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{post.author.name}</div>
                <div className="text-xs text-slate-400">{post.author.role} · Published {post.date}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Share</span>
              <button
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                aria-label="Share article"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Article Content Container */}
        <div
          className="prose prose-invert prose-blue max-w-none text-slate-300 leading-relaxed space-y-6 text-base"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-blue-400" /> Tags:
          </span>
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-lg">
              #{tag}
            </span>
          ))}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="pt-10 border-t border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <div key={rel.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs text-blue-400 font-semibold">{rel.category}</span>
                  <h4 className="text-base font-bold text-white hover:text-blue-400 transition-colors">
                    <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{rel.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
}
