import React from "react";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?:
    | "display"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body-lg"
    | "body-base"
    | "body-sm"
    | "caption"
    | "gradient";
  as?: React.ElementType;
}

export function Typography({
  variant = "body-base",
  as,
  children,
  className = "",
  ...props
}: TypographyProps) {
  const variantMap: Record<string, { Component: React.ElementType; styles: string }> = {
    display: {
      Component: "h1",
      styles: "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]",
    },
    h1: {
      Component: "h1",
      styles: "text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-snug",
    },
    h2: {
      Component: "h2",
      styles: "text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug",
    },
    h3: {
      Component: "h3",
      styles: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 leading-snug",
    },
    h4: {
      Component: "h4",
      styles: "text-lg font-semibold text-slate-900 leading-normal",
    },
    "body-lg": {
      Component: "p",
      styles: "text-lg text-slate-600 leading-relaxed",
    },
    "body-base": {
      Component: "p",
      styles: "text-base text-slate-600 leading-relaxed",
    },
    "body-sm": {
      Component: "p",
      styles: "text-sm text-slate-500 leading-normal",
    },
    caption: {
      Component: "span",
      styles: "text-xs font-medium text-slate-400 uppercase tracking-wider",
    },
    gradient: {
      Component: "span",
      styles: "bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 bg-clip-text text-transparent font-extrabold",
    },
  };

  const selected = variantMap[variant] || variantMap["body-base"];
  const Component = as || selected.Component;

  return (
    <Component className={`${selected.styles} ${className}`} {...props}>
      {children}
    </Component>
  );
}
