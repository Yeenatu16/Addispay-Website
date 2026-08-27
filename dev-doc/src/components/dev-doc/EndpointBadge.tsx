import React from 'react';

interface EndpointBadgeProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
}

export function EndpointBadge({ method, path }: EndpointBadgeProps) {
  const methodStyles = {
    GET: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800',
    POST: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800',
    PUT: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800',
    DELETE: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800',
    PATCH: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800',
  }[method] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <div className="not-prose my-3 flex flex-wrap items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50/80 px-3.5 py-2 font-mono text-sm dark:border-gray-800 dark:bg-gray-900/60">
      <span className={`rounded-md border px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${methodStyles}`}>
        {method}
      </span>
      <span className="font-semibold text-gray-900 dark:text-gray-100">{path}</span>
    </div>
  );
}
