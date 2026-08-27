'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface ResponseViewerProps {
  data: any;
  status?: number;
  statusText?: string;
  durationMs?: number;
  title?: string;
}

export function ResponseViewer({
  data,
  status = 200,
  statusText = 'OK',
  durationMs,
  title = 'Response Payload',
}: ResponseViewerProps) {
  const [copied, setCopied] = useState(false);

  const formattedJson = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSuccess = status >= 200 && status < 300;

  return (
    <div className="not-prose my-4 overflow-hidden rounded-2xl border border-gray-200 bg-gray-950 font-mono text-xs text-gray-100 shadow-lg dark:border-gray-800">
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900/90 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-300">{title}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
              isSuccess
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {status} {statusText}
          </span>
          {durationMs !== undefined && (
            <span className="text-[11px] text-gray-400">{durationMs}ms</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-lg bg-gray-800 px-2.5 py-1 text-[11px] text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="max-h-96 overflow-auto p-4">
        <pre className="leading-relaxed">
          <code>{formattedJson}</code>
        </pre>
      </div>
    </div>
  );
}
