import React from "react";
import { FolderOpen, ArrowRight } from "lucide-react";
import { Button } from "./Button";
import Link from "next/link";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`mx-auto max-w-lg my-8 p-8 rounded-3xl bg-slate-50/80 border border-dashed border-slate-300 text-center space-y-4 ${className}`}
    >
      <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>

      <div className="space-y-1.5">
        <h4 className="text-lg font-semibold text-slate-800">{title}</h4>
        {description && <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">{description}</p>}
      </div>

      {(actionText && (actionHref || onAction)) && (
        <div className="pt-2">
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                {actionText}
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onAction}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
