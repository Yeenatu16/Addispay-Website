"use client";

import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      helperText,
      error,
      fullWidth = true,
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`${fullWidth ? "w-full" : "inline-block"} space-y-1.5`}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-slate-800">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`block w-full rounded-xl border bg-white text-slate-900 text-sm appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed pl-3.5 pr-10 py-2.5 ${
              error
                ? "border-rose-500 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-300 hover:border-slate-400 focus:border-emerald-600"
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs font-medium text-rose-600">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
