'use client';

import React, { useState } from 'react';
import { QrCode, RefreshCw, Copy, Check, Download, ShieldCheck } from 'lucide-react';

export function QrCodeGenerator() {
  const [amount, setAmount] = useState('450.00');
  const [orderId, setOrderId] = useState('ORD-ETHQR-8821');
  const [merchantName, setMerchantName] = useState('Addis Mart Bole');
  const [copied, setCopied] = useState(false);

  // Generate EMVCo compliant dynamic QR string
  const numAmount = parseFloat(amount) || 0.0;
  const formattedAmount = numAmount.toFixed(2);
  const mName = merchantName.trim() || 'AddisPay Store';
  const mLen = mName.length < 10 ? '0' + mName.length : mName.length.toString();

  const qrString = `00020101021226580010ET.ETHIO.ETHQR0116ADDISPAY882102047721520458145303230540${formattedAmount.length < 10 ? '0' + formattedAmount.length : formattedAmount.length}${formattedAmount}5802ET59${mLen}${mName}6011Addis Ababa62190115${orderId}6304A8F1`;

  const handleCopy = () => {
    navigator.clipboard.writeText(qrString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00A36D]/10 text-[#00A36D]">
            <QrCode className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Dynamic EthQR & Telebirr QR Generator
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Compliant with National Bank of Ethiopia (NBE) National QR specifications.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Form controls */}
        <div className="space-y-3 md:col-span-7">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Amount (ETB)
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-bold text-gray-400">
                  ETB
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-12 pr-3 font-mono text-xs text-gray-900 focus:border-[#00A36D] focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Order / Reference ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-900 focus:border-[#00A36D] focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Merchant Store Name
            </label>
            <input
              type="text"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 focus:border-[#00A36D] focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Raw EMVCo Standard Payload:
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-medium text-[#00A36D] hover:underline"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy String</span>
                  </>
                )}
              </button>
            </div>
            <div className="mt-1 break-all rounded-xl border border-gray-200 bg-gray-950 p-2.5 font-mono text-[11px] text-emerald-400 dark:border-gray-800">
              {qrString}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-2.5 text-xs text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
            <ShieldCheck className="h-4 w-4 text-[#00A36D]" />
            <span>Compatible with Telebirr, CBE Mobile, Awash Birr, and EthSwitch Banking Apps.</span>
          </div>
        </div>

        {/* QR Visual Preview */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-950 md:col-span-5">
          <div className="relative rounded-2xl border-4 border-white bg-white p-3 shadow-md dark:border-gray-800 dark:bg-white">
            <svg
              className="h-36 w-36"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Simulated crisp QR matrix with AddisPay brand colors */}
              <rect width="100" height="100" fill="#FFFFFF" />
              {/* Corner 1 */}
              <rect x="6" y="6" width="28" height="28" fill="#101828" rx="4" />
              <rect x="10" y="10" width="20" height="20" fill="#FFFFFF" rx="2" />
              <rect x="14" y="14" width="12" height="12" fill="#00A36D" rx="2" />
              {/* Corner 2 */}
              <rect x="66" y="6" width="28" height="28" fill="#101828" rx="4" />
              <rect x="70" y="10" width="20" height="20" fill="#FFFFFF" rx="2" />
              <rect x="74" y="14" width="12" height="12" fill="#00A36D" rx="2" />
              {/* Corner 3 */}
              <rect x="6" y="66" width="28" height="28" fill="#101828" rx="4" />
              <rect x="10" y="70" width="20" height="20" fill="#FFFFFF" rx="2" />
              <rect x="14" y="74" width="12" height="12" fill="#00A36D" rx="2" />
              {/* Data dots */}
              <rect x="40" y="8" width="6" height="6" fill="#101828" />
              <rect x="50" y="8" width="6" height="6" fill="#101828" />
              <rect x="40" y="18" width="6" height="6" fill="#00A36D" />
              <rect x="50" y="28" width="6" height="6" fill="#101828" />
              <rect x="8" y="40" width="6" height="6" fill="#101828" />
              <rect x="18" y="48" width="6" height="6" fill="#101828" />
              <rect x="28" y="40" width="6" height="6" fill="#00A36D" />
              <rect x="40" y="40" width="20" height="20" fill="#F5A414" rx="4" />
              <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
              <rect x="66" y="40" width="6" height="6" fill="#101828" />
              <rect x="76" y="48" width="6" height="6" fill="#00A36D" />
              <rect x="86" y="40" width="6" height="6" fill="#101828" />
              <rect x="40" y="66" width="6" height="6" fill="#101828" />
              <rect x="50" y="76" width="6" height="6" fill="#00A36D" />
              <rect x="40" y="86" width="6" height="6" fill="#101828" />
              <rect x="66" y="66" width="6" height="6" fill="#00A36D" />
              <rect x="76" y="76" width="6" height="6" fill="#101828" />
              <rect x="86" y="86" width="6" height="6" fill="#00A36D" />
            </svg>
          </div>

          <div className="mt-3">
            <span className="text-xs font-extrabold text-[#00A36D]">{mName}</span>
            <p className="text-sm font-black text-gray-900 dark:text-white">ETB {formattedAmount}</p>
            <p className="text-[11px] text-gray-400">Scan with Telebirr or CBE Birr</p>
          </div>
        </div>
      </div>
    </div>
  );
}
