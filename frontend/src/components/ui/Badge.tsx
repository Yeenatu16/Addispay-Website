import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "gold" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  children,
  variant = "primary",
  size = "md",
  dot = false,
  className = "",
  ...props
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-colors";

  const variantStyles = {
    primary: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    secondary: "bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-teal-50 text-teal-700 border border-teal-200/60",
    warning: "bg-amber-50 text-amber-800 border border-amber-200/60",
    danger: "bg-rose-50 text-rose-700 border border-rose-200/60",
    info: "bg-sky-50 text-sky-700 border border-sky-200/60",
    gold: "bg-amber-100/80 text-amber-900 border border-amber-300 font-semibold",
    outline: "bg-transparent text-slate-700 border border-slate-300",
  };

  const sizeStyles = {
    sm: "text-xs px-2.5 py-0.5 gap-1.5",
    md: "text-xs px-3 py-1 gap-2",
  };

  const dotColors = {
    primary: "bg-emerald-500",
    secondary: "bg-slate-500",
    success: "bg-teal-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-sky-500",
    gold: "bg-amber-600",
    outline: "bg-slate-400",
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
