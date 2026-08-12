'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/data/blogData';
import { Search, Calendar, Clock, ArrowRight, Tag, User } from 'lucide-react';

interface BlogFilterProps {
  posts: BlogPost[];
}

const CATEGORIES = ['All', 'Product Updates', 'Business', 'Security', 'Developer', 'Company News'];

export const BlogFilter: React.FC<BlogFilterProps> = ({ posts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10">
      
      {/* Search and Category Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles & guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

      </div>

      {/* Article Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800 space-y-3">
          <p className="text-slate-400 text-base">No articles found matching &quot;{searchQuery}&quot;.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs font-semibold text-blue-400 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between space-y-5 border border-slate-800 group"
            >
              <div className="space-y-4">
                {/* Category Pill & Reading Time */}
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full bg-blue-950/80 text-blue-400 font-semibold border border-blue-800/60">
                    {post.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                {/* Article Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                {/* Excerpt */}
                <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Author & Date */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-900/60 flex items-center justify-center text-blue-300 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{post.author.name}</div>
                    <div className="text-[10px] text-slate-400">{post.date}</div>
                  </div>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
};
