"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, ExternalLink, CheckCircle2, RefreshCcw, Smartphone, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { getDictionary } from "@/lib/dictionary";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export function HeroSection({ locale }: { locale: string }) {
  const dict = getDictionary(locale as "en" | "am");
  const [activePaymentMethod, setActivePaymentMethod] = useState<"telebirr" | "cbe" | "card">("telebirr");
  const [simState, setSimState] = useState<"idle" | "processing" | "success">("idle");

  const runSimulation = () => {
    setSimState("processing");
    setTimeout(() => {
      setSimState("success");
    }, 1200);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      {/* Background Glow Circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-20">
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-emerald-500 blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-teal-600 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & Actions */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <Badge variant="gold" size="md" className="inline-flex shadow-lg shadow-amber-950/20">
              <Zap className="w-3.5 h-3.5 mr-1 text-amber-900 fill-amber-900" />
              {dict.hero.badge}
            </Badge>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              {dict.hero.titlePrefix}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                {dict.hero.titleHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {dict.hero.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="https://merchant.addispay.et"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="gold"
                  size="xl"
                  fullWidth
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  {dict.hero.ctaPrimary}
                </Button>
              </a>

              <Link href={`/${locale}/products`} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="xl"
                  fullWidth
                  className="bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
                  rightIcon={<ExternalLink className="w-4 h-4" />}
                >
                  {dict.hero.ctaSecondary}
                </Button>
              </Link>
            </div>

            {/* Micro Stats Banner */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{dict.hero.stat1Number}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{dict.hero.stat1Label}</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-300">{dict.hero.stat2Number}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{dict.hero.stat2Label}</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{dict.hero.stat3Number}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{dict.hero.stat3Label}</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">{dict.hero.stat4Number}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{dict.hero.stat4Label}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Payment Simulator Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto max-w-md rounded-3xl bg-slate-900/90 border border-slate-700/80 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl space-y-6"
            >
              {/* Header inside simulator */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    AP
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AddisPay Checkout</h3>
                    <p className="text-[11px] text-slate-400">Order #AP-9824</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-emerald-400">500.00 ETB</span>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2.5">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setActivePaymentMethod("telebirr");
                      setSimState("idle");
                    }}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      activePaymentMethod === "telebirr"
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Telebirr</span>
                  </button>

                  <button
                    onClick={() => {
                      setActivePaymentMethod("cbe");
                      setSimState("idle");
                    }}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      activePaymentMethod === "cbe"
                        ? "bg-teal-600/20 border-teal-500 text-teal-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-teal-400" />
                    <span>CBE Birr</span>
                  </button>

                  <button
                    onClick={() => {
                      setActivePaymentMethod("card");
                      setSimState("idle");
                    }}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      activePaymentMethod === "card"
                        ? "bg-amber-600/20 border-amber-500 text-amber-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Visa / Card</span>
                  </button>
                </div>
              </div>

              {/* Simulation Result Area */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-h-[100px] flex flex-col items-center justify-center space-y-2">
                {simState === "idle" && (
                  <>
                    <p className="text-xs text-slate-400">
                      Click below to test instant payment authorization via{" "}
                      <span className="font-bold text-white capitalize">{activePaymentMethod}</span>
                    </p>
                  </>
                )}

                {simState === "processing" && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 animate-pulse">
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                    <span>Connecting to Bank Gateway...</span>
                  </div>
                )}

                {simState === "success" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 stroke-[2.5]" />
                    <p className="text-xs font-bold text-emerald-300">Payment Successful!</p>
                    <p className="text-[10px] text-slate-400">Ref: TXN-ETB-2026-8890</p>
                  </motion.div>
                )}
              </div>

              {/* Trigger simulation button */}
              <Button
                variant={simState === "success" ? "outline" : "primary"}
                size="md"
                fullWidth
                onClick={() => {
                  if (simState === "success") {
                    setSimState("idle");
                  } else {
                    runSimulation();
                  }
                }}
                isLoading={simState === "processing"}
                loadingText="Processing Payment..."
              >
                {simState === "success" ? "Reset Test" : "Simulate Payment (500 ETB)"}
              </Button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  PCI-DSS Compliant
                </span>
                <span>Uptime 99.99%</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
