"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Store, Repeat, Landmark, Building2, CheckCircle2, ArrowRight } from "lucide-react";
import { getDictionary } from "@/lib/dictionary";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

const solutionsList = [
  {
    id: "ecommerce",
    title: "E-Commerce Checkout",
    icon: ShoppingBag,
    badge: "Popular",
    description: "Embed seamless online payment forms into web and mobile stores with 1-click checkout.",
    features: [
      "Instant Telebirr & CBE Birr push notifications",
      "Support for Visa, Mastercard, & local debit cards",
      "Hosted checkout page or white-label API",
      "Real-time order reconciliation",
    ],
  },
  {
    id: "pos",
    title: "Retail & In-Store POS",
    icon: Store,
    badge: "High Growth",
    description: "Accept QR payments and contactless cards directly at cash registers and retail counters.",
    features: [
      "Static & Dynamic QR code generator",
      "Compatible with Android & POS hardware",
      "Instant sms/voice soundbox confirmation",
      "Multi-store staff permissions",
    ],
  },
  {
    id: "subscriptions",
    title: "Recurring & SaaS Billing",
    icon: Repeat,
    badge: "Automated",
    description: "Automate monthly subscriptions, memberships, and recurring customer invoicing.",
    features: [
      "Flexible billing cycles (weekly, monthly, annual)",
      "Automated payment retry & dunning management",
      "Customer portal for plan upgrades",
      "Detailed revenue forecasting analytics",
    ],
  },
  {
    id: "payouts",
    title: "Bulk Enterprise Payouts",
    icon: Landmark,
    badge: "Enterprise",
    description: "Disburse salaries, supplier payments, and merchant settlements in bulk instantly.",
    features: [
      "Direct bank transfer to 18+ Ethiopian banks",
      "Automated mobile money payouts",
      "CSV batch file upload or REST API",
      "Dual-authorization security workflows",
    ],
  },
  {
    id: "utility",
    title: "Schools & Utility Collections",
    icon: Building2,
    badge: "Institutions",
    description: "Streamline tuition fees, government service payments, and utility bill collections.",
    features: [
      "Custom payment portal per institution",
      "Automatic receipt generation & SMS alerts",
      "ERP & student management integration",
      "Detailed audit reporting for accountants",
    ],
  },
];

export function BusinessSolutionsSection({ locale }: { locale: string }) {
  const dict = getDictionary(locale as "en" | "am");
  const [activeTab, setActiveTab] = useState(solutionsList[0].id);

  const selectedSolution = solutionsList.find((s) => s.id === activeTab) || solutionsList[0];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="primary" size="md">
            {dict.solutions.tagline}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {dict.solutions.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {dict.solutions.subtitle}
          </p>
        </div>

        {/* Interactive Tabs navigation */}
        <div className="mt-12 flex items-center justify-center gap-2 flex-wrap pb-4">
          {solutionsList.map((sol) => {
            const IconComp = sol.icon;
            const isSelected = sol.id === activeTab;
            return (
              <button
                key={sol.id}
                onClick={() => setActiveTab(sol.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10 border border-slate-800"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200/70"
                }`}
              >
                <IconComp className={`w-4 h-4 ${isSelected ? "text-emerald-400" : "text-slate-500"}`} />
                <span>{sol.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Solution Display Panel */}
        <div className="mt-8">
          <Card variant="bordered" className="p-8 sm:p-10 border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-100/80 text-emerald-700">
                    <selectedSolution.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <Badge variant="gold" size="sm">
                      {selectedSolution.badge}
                    </Badge>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">
                      {selectedSolution.title}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-600 text-base leading-relaxed">
                  {selectedSolution.description}
                </p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Key Features & Advantages:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedSolution.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs font-medium text-slate-700">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Link href={`/${locale}/business`}>
                    <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Explore Business Solution
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Visual Graphic box */}
              <div className="lg:col-span-5">
                <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                    <span>Integration Status</span>
                    <span className="text-emerald-400 font-semibold">Active & Live</span>
                  </div>

                  <div className="space-y-3 py-2">
                    <div className="p-3 rounded-xl bg-slate-800/80 flex items-center justify-between">
                      <div className="text-xs">
                        <p className="font-semibold text-slate-200">{selectedSolution.title}</p>
                        <p className="text-[10px] text-slate-400">AddisPay Webhook API</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">99.9% Uptime</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/80 flex items-center justify-between">
                      <div className="text-xs">
                        <p className="font-semibold text-slate-200">Local Bank Clearing</p>
                        <p className="text-[10px] text-slate-400">EthSwitch & Telebirr</p>
                      </div>
                      <span className="text-xs font-bold text-teal-300">Instant</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center italic">
                    "Set up in less than 15 minutes with our standard REST SDKs."
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
