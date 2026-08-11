import React from "react";
import Link from "next/link";
import { CreditCard, Smartphone, QrCode, FileText, Code2, Send, ArrowRight } from "lucide-react";
import { getDictionary } from "@/lib/dictionary";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";

const productsList = [
  {
    icon: CreditCard,
    title: "AddisPay Payment Gateway",
    badge: "Core Platform",
    description: "Unified web checkout supporting international Visa/Mastercard and domestic debit cards across Ethiopia.",
  },
  {
    icon: Smartphone,
    title: "Mobile Money Aggregator",
    badge: "Multi-Wallet",
    description: "Accept Telebirr, CBE Birr, Chapa, and M-Pesa through a single API contract with automatic currency conversion.",
  },
  {
    icon: QrCode,
    title: "Dynamic QR Payments",
    badge: "Contactless",
    description: "Generate static and dynamic QR codes for instant point-of-sale scanning and mobile wallet payments.",
  },
  {
    icon: FileText,
    title: "Smart Invoicing & Links",
    badge: "No-Code",
    description: "Create professional invoices and shareable payment links via SMS, Email, Telegram, or WhatsApp in seconds.",
  },
  {
    icon: Code2,
    title: "Developer APIs & SDKs",
    badge: "Developer First",
    description: "Comprehensive libraries for Node.js, Python, PHP, Java, React Native, and Flutter with sandbox testing.",
  },
  {
    icon: Send,
    title: "Instant Payout Engine",
    badge: "Fast Settlement",
    description: "Automate supplier payouts, employee payroll, and vendor split settlements 24/7 across 18+ local banks.",
  },
];

export function ProductsServicesSection({ locale }: { locale: string }) {
  const dict = getDictionary(locale as "en" | "am");

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="success" size="md">
            {dict.products.tagline}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {dict.products.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {dict.products.subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productsList.map((prod, idx) => {
            const IconComp = prod.icon;
            return (
              <Card
                key={idx}
                variant="interactive"
                className="flex flex-col justify-between h-full group"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" size="sm">
                      {prod.badge}
                    </Badge>
                  </div>
                  <CardTitle>{prod.title}</CardTitle>
                  <CardDescription>{prod.description}</CardDescription>
                </CardHeader>

                <CardFooter className="bg-transparent border-t-0 pt-0">
                  <Link
                    href={`/${locale}/products`}
                    className="inline-flex items-center text-xs font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
