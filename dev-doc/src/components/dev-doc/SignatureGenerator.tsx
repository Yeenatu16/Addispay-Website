'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Key, Copy, Check, RefreshCw } from 'lucide-react';

export function SignatureGenerator() {
  const [secretKey, setSecretKey] = useState('sk_test_7f9a8b1c2d3e4f5a6b7c8d9e0f');
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [nonce, setNonce] = useState('nonce_882910');
  const [payload, setPayload] = useState('{\n  "amount": 1500,\n  "currency": "ETB",\n  "orderId": "ORD-2026-88219"\n}');
  const [computedSignature, setComputedSignature] = useState('');
  const [canonicalString, setCanonicalString] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dev-doc/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secretKey,
          timestamp,
          nonce,
          rawPayload: payload,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setComputedSignature(data.data.signature);
        setCanonicalString(data.data.canonicalString);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [secretKey, timestamp, nonce, payload]);

  const refreshTimestamp = () => {
    setTimestamp(Math.floor(Date.now() / 1000).toString());
    setNonce('nonce_' + Math.random().toString(36).substring(2, 8));
  };

  const headerValue = `t=${timestamp},n=${nonce},v1=${computedSignature}`;

  const handleCopyHeader = () => {
    navigator.clipboard.writeText(headerValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Interactive HMAC-SHA256 Signature Calculator
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Calculate the X-AddisPay-Signature header in real time for API requests and Webhooks.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refreshTimestamp}
          className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <RefreshCw className="h-3 w-3" />
          <span>New Nonce & Time</span>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Merchant Secret Key (<code className="text-[#00A36D]">sk_test_...</code>)
            </label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-900 focus:border-[#00A36D] focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Timestamp (<code className="text-blue-600">t</code>)
              </label>
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-900 focus:border-[#00A36D] focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Nonce (<code className="text-amber-600">n</code>)
              </label>
              <input
                type="text"
                value={nonce}
                onChange={(e) => setNonce(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-900 focus:border-[#00A36D] focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Raw JSON Request / Webhook Body
            </label>
            <textarea
              rows={4}
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 font-mono text-xs text-gray-900 focus:border-[#00A36D] focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Canonical String-to-Sign:
            </label>
            <div className="mt-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-950 p-2.5 font-mono text-[11px] text-gray-200 dark:border-gray-800">
              <span className="text-emerald-400">{timestamp}</span>.
              <span className="text-amber-400">{nonce}</span>.
              <span className="text-gray-300">{payload.replace(/\s+/g, '')}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Generated <code className="text-[#00A36D]">X-AddisPay-Signature</code> Header:
              </label>
              <button
                type="button"
                onClick={handleCopyHeader}
                className="flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy Header</span>
                  </>
                )}
              </button>
            </div>
            <div className="mt-1 break-all rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 font-mono text-xs font-bold text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
              {headerValue}
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
            <span className="font-bold">Security Rule:</span> The timestamp <code className="font-mono font-bold">t</code> must be within 300 seconds (5 minutes) of current server time to protect against replay attacks.
          </div>
        </div>
      </div>
    </div>
  );
}
