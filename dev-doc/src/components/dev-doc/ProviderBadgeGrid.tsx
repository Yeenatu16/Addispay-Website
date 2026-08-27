import React from 'react';
import { Smartphone, CreditCard, QrCode, ShieldCheck, Zap, Radio } from 'lucide-react';

export function ProviderBadgeGrid() {
  const providers = [
    {
      name: 'Telebirr (Ethio Telecom)',
      type: 'Mobile Money & SuperApp',
      settlement: 'Instant (T+0)',
      channels: 'USSD Push (*127#), App H5, Dynamic QR, Mini-App',
      currency: 'ETB',
      color: 'from-blue-600 to-sky-500',
      icon: Smartphone,
      highlight: '45M+ Users',
    },
    {
      name: 'CBE Birr & CBE Mobile',
      type: 'Commercial Bank of Ethiopia',
      settlement: 'Instant (T+0)',
      channels: 'App Push, Account Debit, CBE EthQR',
      currency: 'ETB',
      color: 'from-amber-600 to-yellow-500',
      icon: Smartphone,
      highlight: '1,900+ Branches',
    },
    {
      name: 'Awash Pay / Awash Birr',
      type: 'Awash International Bank',
      settlement: 'Instant (T+0)',
      channels: 'Web Redirect, Awash Birr Wallet, EthQR',
      currency: 'ETB',
      color: 'from-blue-700 to-indigo-600',
      icon: Zap,
      highlight: 'Top Private Bank',
    },
    {
      name: 'Amole (Dashen Bank)',
      type: 'Dashen Bank Digital Banking',
      settlement: 'Instant (T+0)',
      channels: 'Amole App, Direct USSD (*996#), Web Checkout',
      currency: 'ETB',
      color: 'from-sky-700 to-cyan-600',
      icon: Smartphone,
      highlight: 'Omnichannel Wallet',
    },
    {
      name: 'EthSwitch Domestic Cards',
      type: 'National Interoperable Switch',
      settlement: 'Next Day (T+1)',
      channels: 'Domestic ATM/Debit Cards, NBE Switch Rail',
      currency: 'ETB',
      color: 'from-emerald-700 to-teal-600',
      icon: CreditCard,
      highlight: 'All Ethiopian Banks',
    },
    {
      name: 'Visa & Mastercard',
      type: 'International Card Schemes',
      settlement: 'T+2 (FX Locked)',
      channels: '3D-Secure 2.0, Web, In-App, Mobile Wallets',
      currency: 'ETB & USD',
      color: 'from-blue-800 to-indigo-900',
      icon: CreditCard,
      highlight: 'Global Acceptance',
    },
    {
      name: 'Android SoftPOS (mPOS)',
      type: 'Contactless EMV NFC Tap',
      settlement: 'End-of-day Batch (T+0)',
      channels: 'NFC Smartphones, PIN-on-Glass, Offline Capable',
      currency: 'ETB',
      color: 'from-emerald-600 to-green-500',
      icon: Radio,
      highlight: 'No POS Hardware Needed',
    },
    {
      name: 'Dynamic EthQR Standard',
      type: 'NBE National Interoperable QR',
      settlement: 'Instant (T+0)',
      channels: 'Scan-to-Pay on any banking app in Ethiopia',
      currency: 'ETB',
      color: 'from-purple-700 to-indigo-600',
      icon: QrCode,
      highlight: 'NBE Standardized',
    },
  ];

  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {providers.map((p) => {
        const Icon = p.icon;
        return (
          <div
            key={p.name}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} text-white shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{p.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{p.type}</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                {p.highlight}
              </span>
            </div>

            <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Settlement:</span>
                <span className="font-semibold text-[#00A36D]">{p.settlement}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Currencies:</span>
                <span className="font-semibold">{p.currency}</span>
              </div>
              <div className="flex flex-col gap-0.5 pt-1">
                <span className="text-[11px] text-gray-400">Supported Rails:</span>
                <span className="text-[11px] text-gray-700 dark:text-gray-200 font-mono">{p.channels}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
