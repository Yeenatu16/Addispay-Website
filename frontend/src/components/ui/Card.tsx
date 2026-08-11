import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "glass" | "gradient" | "interactive";
  hoverable?: boolean;
}

export function Card({
  children,
  variant = "default",
  hoverable = false,
  className = "",
  ...props
}: CardProps) {
  const baseStyles = "rounded-2xl transition-all duration-300 overflow-hidden";

  const variantStyles = {
    default: "bg-white border border-slate-200/80 shadow-sm",
    bordered: "bg-white border-2 border-slate-200 shadow-none",
    glass:
      "bg-white/80 backdrop-blur-md border border-white/50 shadow-lg shadow-slate-900/5",
    gradient:
      "bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white border border-slate-700/50 shadow-xl",
    interactive:
      "bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/50 cursor-pointer transform hover:-translate-y-1",
  };

  const hoverStyles = hoverable && variant !== "interactive" ? "hover:shadow-md hover:-translate-y-0.5" : "";

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-xl font-bold tracking-tight text-slate-900 leading-snug ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`mt-1.5 text-sm text-slate-600 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
