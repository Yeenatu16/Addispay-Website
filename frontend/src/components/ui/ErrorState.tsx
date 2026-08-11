"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./Button";
import Link from "next/link";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  locale?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred while loading content. Please try again or return to homepage.",
  onRetry,
  showHomeButton = true,
  locale = "en",
}: ErrorStateProps) {
  return (
    <div className="mx-auto max-w-md my-12 p-8 rounded-3xl bg-white border border-rose-100 shadow-xl shadow-rose-900/5 text-center space-y-5">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRetry && (
          <Button variant="primary" size="md" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={onRetry}>
            Try Again
          </Button>
        )}
        {showHomeButton && (
          <Link href={`/${locale}/home`}>
            <Button variant="outline" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export function ErrorAlert({ message, onClose }: { message: string; onClose?: () => void }) {
  return (
    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-rose-600 hover:text-rose-900 font-bold text-xs uppercase"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
