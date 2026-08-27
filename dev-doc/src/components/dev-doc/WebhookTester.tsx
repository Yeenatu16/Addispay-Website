'use client';

import React, { useState } from 'react';
import { Radio, Send, Check, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { ResponseViewer } from './ResponseViewer';

const EVENTS = [
  {
    type: 'payment.successful',
    description: 'Triggered immediately when customer completes payment on Telebirr, CBE, or Card',
    sample: {
      id: 'evt_20260827_00991',
      event: 'payment.successful',
      apiVersion: '2026-08-01',
      createdAt: '2026-08-27T18:30:00Z',
      data: {
        transactionId: 'TXN_ETB_20260827_88412',
        orderId: 'ORD-2026-88412',
        amount: 1500.0,
        currency: 'ETB',
        fee: 15.0,
        netAmount: 1485.0,
        paymentMethod: 'TELEBIRR',
        payerPhone: '+251911223344',
        status: 'COMPLETED',
        rrn: '884129910243',
        settledAt: '2026-08-27T18:30:00Z',
      },
    },
  },
  {
    type: 'payment.failed',
    description: 'Triggered when customer PIN authentication fails or session expires',
    sample: {
      id: 'evt_20260827_00992',
      event: 'payment.failed',
      apiVersion: '2026-08-01',
      createdAt: '2026-08-27T18:30:00Z',
      data: {
        transactionId: 'TXN_ETB_20260827_88413',
        orderId: 'ORD-2026-88413',
        amount: 850.0,
        currency: 'ETB',
        paymentMethod: 'CBE_BIRR',
        status: 'FAILED',
        failureCode: 'INSUFFICIENT_FUNDS',
        failureReason: 'Payer account does not have sufficient balance',
      },
    },
  },
  {
    type: 'payment.refunded',
    description: 'Triggered when a merchant refund is successfully settled back to customer',
    sample: {
      id: 'evt_20260827_00993',
      event: 'payment.refunded',
      apiVersion: '2026-08-01',
      createdAt: '2026-08-27T18:30:00Z',
      data: {
        refundId: 'REF_20260827_00912',
        originalTransactionId: 'TXN_ETB_20260827_88412',
        amount: 1500.0,
        currency: 'ETB',
        status: 'COMPLETED',
        reason: 'Customer return',
      },
    },
  },
  {
    type: 'payout.completed',
    description: 'Triggered when settlement transfer reaches merchant commercial bank account',
    sample: {
      id: 'evt_20260827_00994',
      event: 'payout.completed',
      apiVersion: '2026-08-01',
      createdAt: '2026-08-27T18:30:00Z',
      data: {
        payoutId: 'PO_20260827_441',
        amount: 50000.0,
        currency: 'ETB',
        destinationBank: 'COMMERCIAL_BANK_OF_ETHIOPIA',
        accountNumber: '1000123456789',
        status: 'SETTLED',
      },
    },
  },
];

export function WebhookTester() {
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [targetUrl, setTargetUrl] = useState('https://webhook.site/7f9a8b1c-addispay-test');
  const [secretKey, setSecretKey] = useState('whsec_test_7f9a8b1c2d3e4f5a6b7c8d9e0f');
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<any>(null);

  const currentEvent = EVENTS[selectedEventIndex] || EVENTS[0];

  const handleSendWebhook = async () => {
    setIsLoading(true);
    setDeliveryResult(null);
    try {
      const res = await fetch('/api/dev-doc/webhook-deliver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl,
          eventType: currentEvent.type,
          secretKey,
          customPayload: currentEvent.sample,
        }),
      });
      const data = await res.json();
      setDeliveryResult(data);
    } catch (err: any) {
      setDeliveryResult({
        status: 'ERROR',
        message: err.message || 'Dispatch failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="not-prose my-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
      {/* Top Banner */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-850 px-6 py-4 text-white dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5A414] text-gray-950 shadow-md shadow-[#F5A414]/30">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Live Webhook Dispatcher & Tester</h3>
            <p className="text-xs text-gray-400">
              Send cryptographically signed test webhooks to your server endpoint
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Event Type Tabs */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Select Webhook Event Type
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {EVENTS.map((ev, idx) => (
              <button
                key={ev.type}
                type="button"
                onClick={() => {
                  setSelectedEventIndex(idx);
                  setDeliveryResult(null);
                }}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  selectedEventIndex === idx
                    ? 'bg-[#00A36D] text-white shadow-md shadow-[#00A36D]/20'
                    : 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                {ev.type}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Description:</span>{' '}
            {currentEvent.description}
          </p>
        </div>

        {/* Inputs */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Your Webhook Receiver URL (<code className="text-[#00A36D]">https://...</code>)
            </label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://api.yourdomain.et/webhooks/addispay"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 font-mono text-xs text-gray-900 focus:border-[#00A36D] focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Webhook Signing Secret (<code className="text-[#00A36D]">whsec_...</code>)
            </label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 font-mono text-xs text-gray-900 focus:border-[#00A36D] focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Payload Preview */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Event Payload JSON Preview
          </label>
          <div className="mt-1 max-h-56 overflow-auto rounded-2xl border border-gray-200 bg-gray-950 p-3.5 font-mono text-xs text-emerald-400 dark:border-gray-800">
            <pre>
              <code>{JSON.stringify(currentEvent.sample, null, 2)}</code>
            </pre>
          </div>
        </div>

        {/* Dispatch Action */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <ShieldCheck className="h-4 w-4 text-[#00A36D]" />
            <span>Dispatched with <code className="text-xs font-mono font-bold">X-AddisPay-Signature</code> header</span>
          </div>

          <button
            type="button"
            onClick={handleSendWebhook}
            disabled={isLoading || !targetUrl}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#00A36D] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-[#00A36D]/25 transition-all hover:-translate-y-0.5 hover:bg-[#008959] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Dispatching Webhook...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Trigger Test Webhook</span>
              </>
            )}
          </button>
        </div>

        {/* Delivery Response Result */}
        {deliveryResult && (
          <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
            {deliveryResult.delivery ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-3.5 dark:border-gray-800 dark:bg-gray-950">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Delivery Status:</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        deliveryResult.delivery.deliveryStatus === 'DELIVERED_SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {deliveryResult.delivery.deliveryStatus} (HTTP {deliveryResult.delivery.statusCode})
                    </span>
                  </div>
                  <span className="font-mono text-xs text-gray-500">
                    Latency: {deliveryResult.delivery.durationMs}ms
                  </span>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-xs dark:border-gray-800 dark:bg-gray-950">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Sent Signature Header:</span>
                  <div className="mt-1 break-all font-mono text-[11px] text-[#00A36D]">
                    {deliveryResult.delivery.signatureHeader}
                  </div>
                </div>

                {deliveryResult.delivery.responseSnippet && (
                  <ResponseViewer
                    data={deliveryResult.delivery.responseSnippet}
                    status={deliveryResult.delivery.statusCode}
                    title="Receiver Endpoint HTTP Response"
                  />
                )}
              </div>
            ) : (
              <ResponseViewer data={deliveryResult} status={500} title="Delivery Error" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
