"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight, Newspaper } from "lucide-react";
import { getDictionary } from "@/lib/dictionary";
import { NewsArticle } from "@/lib/types";
import { EmptyState } from "../ui/EmptyState";
import { NewsCardSkeleton } from "../ui/Skeleton";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

// Initial published news articles dataset compliant with SRS FR-ADM-007 (Featured news first, descending date)
const defaultArticles: NewsArticle[] = [
  {
    id: "news-1",
    title: "AddisPay Partners with EthSwitch for Instant Interbank Settlement",
    shortDescription: "Ethiopian merchants can now receive direct bank settlements within seconds through AddisPay's unified EthSwitch integration.",
    fullContent: "AddisPay is proud to announce its strategic integration with EthSwitch...",
    coverImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    publishDate: "2026-08-10",
    status: "Published",
    isFeatured: true,
    category: "Partnership",
    readTime: "3 min read",
    author: "AddisPay Media",
  },
  {
    id: "news-2",
    title: "Introducing QR Code Payment API for Retail Stores",
    shortDescription: "New contactless payment API allows merchants to print static QR codes or dynamically display QR codes on POS terminals.",
    fullContent: "Our engineering team has rolled out the QR Payment API...",
    coverImage: "https://images.unsplash.com/photo-1556742049-0a67daf64f42?auto=format&fit=crop&w=800&q=80",
    publishDate: "2026-08-05",
    status: "Published",
    isFeatured: false,
    category: "Product Launch",
    readTime: "4 min read",
    author: "Product Team",
  },
  {
    id: "news-3",
    title: "AddisPay Achieves PCI-DSS Level 1 Certification",
    shortDescription: "We have officially secured the highest international payment security rating, guaranteeing maximum protection for cardholder data.",
    fullContent: "Security remains at the heart of everything we build at AddisPay...",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    publishDate: "2026-07-28",
    status: "Published",
    isFeatured: false,
    category: "Security",
    readTime: "2 min read",
    author: "Security Team",
  },
];

export function LatestNewsSection({ locale }: { locale: string }) {
  const dict = getDictionary(locale as "en" | "am");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate dynamic retrieval via API (SRS FR-DYN-001)
    const timer = setTimeout(() => {
      setArticles(defaultArticles);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-slate-100">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="gold" size="md">
              {dict.news.tagline}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {dict.news.title}
            </h2>
            <p className="text-base text-slate-600">
              {dict.news.subtitle}
            </p>
          </div>

          <div>
            <Link href={`/${locale}/news`}>
              <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {dict.news.viewAll}
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Area: Skeleton vs Articles vs Empty State */}
        <div className="mt-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
            </div>
          ) : articles.length === 0 ? (
            /* SRS FR-DYN-004 Empty state compliance */
            <EmptyState
              icon={<Newspaper className="w-6 h-6 text-slate-400" />}
              title={dict.news.emptyState}
              description={dict.news.emptyDescription}
              actionText="Return to Home"
              actionHref={`/${locale}/home`}
            />
          ) : (
            /* Display 3-5 articles (SRS FR-DYN-002) */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.slice(0, 3).map((article) => (
                <div
                  key={article.id}
                  className="group rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Cover image container */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {article.isFeatured && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="gold" size="sm" dot>
                            Featured
                          </Badge>
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-semibold text-white">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Meta & Title */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          {article.publishDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {article.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <Link
                      href={`/${locale}/news`}
                      className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      <span>{dict.news.readMore}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
