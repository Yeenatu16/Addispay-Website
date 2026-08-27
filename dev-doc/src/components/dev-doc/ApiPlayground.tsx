'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, Check, Copy, Sparkles, Send } from 'lucide-react';
import { ResponseViewer } from './ResponseViewer';

interface PresetOption {
  name: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  defaultBody: string;
}

const PRESETS: PresetOption[] = [
  {
    name: 'Create Hosted Checkout Session',
    method: 'POST',
    endpoint: '/payments/checkout',
    description: 'Initiate payment session and obtain customer redirection URL',
    defaultBody: JSON.stringify(
      {
        amount: 1500.0,
        currency: 'ETB',
        orderId: 'ORD-2026-88219',
        description: 'E-Commerce Purchase (Addis Mart)',
        returnUrl: 'https://merchant.et/checkout/success',
        cancelUrl: 'https://merchant.et/checkout/cancel',
        customer: {
          name: 'Almaz Bekele',
          phoneNumber: '+251911223344',
          email: 'almaz@example.et',
        },
      },
      null,
      2
    ),
  },
  {
    name: 'Direct Debit / Telebirr USSD Push',
    method: 'POST',
    endpoint: '/payments/direct-charge',
    description: 'Trigger instant USSD STK Push prompt to customer mobile phone',
    defaultBody: JSON.stringify(
      {
        amount: 500.0,
        currency: 'ETB',
        paymentMethod: 'TELEBIRR_USSD',
        customerPhone: '+251911223344',
        orderId: 'DIR-77291',
        narration: 'Monthly Telecom Subscription',
      },
      null,
      2
    ),
  },
  {
    name: 'Generate Dynamic EthQR Code',
    method: 'POST',
    endpoint: '/payments/qr/generate',
    description: 'Generate NBE EthQR standard dynamic QR payload and image',
    defaultBody: JSON.stringify(
      {
        amount: 450.0,
        orderId: 'QR-88219',
        storeName: 'Addis Mart Bole Branch',
        expiryMinutes: 15,
      },
      null,
      2
    ),
  },
  {
    name: 'Query Payment Status',
    method: 'POST',
    endpoint: '/payments/TXN_ETB_20260827_88412/status',
    description: 'Retrieve real-time transaction status and settlement info',
    defaultBody: JSON.stringify(
      {
        transactionId: 'TXN_ETB_20260827_88412',
      },
      null,
      2
    ),
  },
  {
    name: 'Process Full / Partial Refund',
    method: 'POST',
    endpoint: '/payments/TXN_ETB_20260827_88412/refund',
    description: 'Refund customer to original payment rail (Telebirr/CBE/Card)',
    defaultBody: JSON.stringify(
      {
        transactionId: 'TXN_ETB_20260827_88412',
        amount: 1500.0,
        reason: 'Customer returned merchandise within 7-day window',
      },
      null,
      2
    ),
  },
  {
    name: 'Get Merchant Balances (ETB / USD)',
    method: 'POST',
    endpoint: '/merchants/balances',
    description: 'Check available and pending settlement balances',
    defaultBody: JSON.stringify({}, null, 2),
  },
  {
    name: 'Authorize SoftPOS Contactless Tap',
    method: 'POST',
    endpoint: '/terminals/softpos/authorize',
    description: 'Process NFC contactless card tap on Android SoftPOS',
    defaultBody: JSON.stringify(
      {
        terminalId: 'TERM-SPOS-0084',
        amount: 890.0,
        currency: 'ETB',
        emvPayload: '9F26089F2701809F100706011203A00000',
      },
      null,
      2
    ),
  },
];

export function ApiPlayground({ defaultPresetIndex = 0 }: { defaultPresetIndex?: number }) {
  const [selectedPreset, setSelectedPreset] = useState(defaultPresetIndex);
  const [apiKey, setApiKey] = useState('sk_test_7f9a8b1c2d3e4f5a6b7c8d9e0f');
  const [idempotencyKey, setIdempotencyKey] = useState('idemp_' + Math.random().toString(36).substring(2, 9));
  const [bodyText, setBodyText] = useState(PRESETS[defaultPresetIndex]?.defaultBody || '{}');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number>(200);
  const [latency, setLatency] = useState<number>(0);

  const preset = PRESETS[selectedPreset] || PRESETS[0];

  const handleSelectPreset = (idx: number) => {
    setSelectedPreset(idx);
    const p = PRESETS[idx];
    setBodyText(p.defaultBody);
    setResponse(null);
  };

  const handleExecute = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    try {
      let parsedBody = {};
      try {
        parsedBody = JSON.parse(bodyText);
      } catch (e) {
        // use raw if not JSON
      }

      const res = await fetch('/api/dev-doc/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          endpoint: preset.endpoint,
          method: preset.method,
          payload: parsedBody,
        }),
      });

      const data = await res.json();
      setResponse(data);
      setResponseStatus(res.status);
      setLatency(Date.now() - startTime);
    } catch (err: any) {
      setResponse({ error: err.message || 'Request failed' });
      setResponseStatus(500);
      setLatency(Date.now() - startTime);
    } finally {
      setIsLoading(false);
    }
  };

  const methodColor = {
    GET: 'bg-emerald-500 text-white',
    POST: 'bg-blue-600 text-white',
    PUT: 'bg-amber-500 text-white',
    DELETE: 'bg-rose-600 text-white',
  }[preset.method];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
      {/* Top Header */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-850 px-6 py-4 text-white dark:border-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00A36D] text-white shadow-md shadow-[#00A36D]/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AddisPay Interactive API Sandbox</h3>
              <p className="text-xs text-gray-400">Live request testing with real Ethiopian rail simulation</p>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedPreset}
              onChange={(e) => handleSelectPreset(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3.5 py-2 text-xs font-semibold text-white focus:border-[#00A36D] focus:outline-none sm:w-64"
            >
              {PRESETS.map((p, idx) => (
                <option key={p.name} value={idx}>
                  {p.method} - {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Console Body */}
      <div className="p-6">
        <p className="mb-4 text-xs text-gray-600 dark:text-gray-300">
          <span className="font-bold text-gray-900 dark:text-white">Action:</span> {preset.description}
        </p>

        {/* URL / Endpoint bar */}
        <div className="flex items-stretch overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
          <span className={`flex items-center px-4 text-xs font-black tracking-wider ${methodColor}`}>
            {preset.method}
          </span>
          <div className="flex flex-1 items-center px-4 py-2.5 font-mono text-xs font-semibold text-gray-900 dark:text-gray-100">
            <span className="text-gray-400">https://api.addispay.et/api/v1</span>
            <span className="text-[#00A36D]">{preset.endpoint}</span>
          </div>
        </div>

        {/* Configuration Row */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Authorization (Secret Key)
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-900 focus:border-[#00A36D] focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Idempotency-Key Header
            </label>
            <input
              type="text"
              value={idempotencyKey}
              onChange={(e) => setIdempotencyKey(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-900 focus:border-[#00A36D] focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </div>
        </div>

        {/* JSON Request Body */}
        {preset.method !== 'GET' && (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Request JSON Body
              </label>
              <button
                type="button"
                onClick={() => setBodyText(preset.defaultBody)}
                className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset to Default</span>
              </button>
            </div>
            <textarea
              rows={7}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-950 p-3 font-mono text-xs text-emerald-400 focus:border-[#00A36D] focus:outline-none dark:border-gray-800"
            />
          </div>
        )}

        {/* Send Request Action Button */}
        <div className="mt-5 flex items-center justify-end">
          <button
            type="button"
            onClick={handleExecute}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#00A36D] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-[#00A36D]/25 transition-all hover:-translate-y-0.5 hover:bg-[#008959] active:translate-y-0 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Executing Simulation...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Send Live Request</span>
              </>
            )}
          </button>
        </div>

        {/* Response section */}
        {response && (
          <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
            <ResponseViewer
              data={response}
              status={responseStatus}
              durationMs={latency}
              title="AddisPay Gateway Response"
            />
          </div>
        )}
      </div>
    </div>
  );
}
