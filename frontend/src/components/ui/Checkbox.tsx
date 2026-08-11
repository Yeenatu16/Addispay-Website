"use client";

import React, { forwardRef } from "react";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", id, checked, disabled, ...props }, ref) => {
    const checkboxId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col space-y-1">
        <label htmlFor={checkboxId} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              checked={checked}
              disabled={disabled}
              className="peer sr-only"
              {...props}
            />
            <div className="w-5 h-5 rounded-md border border-slate-300 bg-white peer-checked:bg-emerald-600 peer-checked:border-emerald-600 peer-focus:ring-2 peer-focus:ring-emerald-500/20 transition-all flex items-center justify-center text-white peer-disabled:bg-slate-100 peer-disabled:border-slate-200">
              <Check className="w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
            </div>
          </div>
          {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
        </label>
        {error && <p className="text-xs font-medium text-rose-600 pl-7">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
