"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 hover:from-emerald-700 hover:via-teal-700 hover:to-slate-950 text-white focus:ring-teal-500 border border-emerald-500/20 shadow-emerald-900/10",
      secondary:
        "bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-700 shadow-slate-900/10",
      outline:
        "border-2 border-slate-300 hover:border-slate-800 bg-white hover:bg-slate-50 text-slate-800 focus:ring-slate-400",
      ghost:
        "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 focus:ring-slate-300 shadow-none",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-rose-900/10",
      gold:
        "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold focus:ring-amber-400 border border-amber-400/30",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 min-h-[34px]",
      md: "text-sm px-4 py-2.5 gap-2 min-h-[42px]",
      lg: "text-base px-6 py-3 gap-2.5 min-h-[48px]",
      xl: "text-lg px-8 py-4 gap-3 min-h-[56px]",
    };

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
