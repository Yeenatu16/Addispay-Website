import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = "rectangular",
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-slate-200/80 rounded-xl";

  const variantStyles = {
    text: "h-4 w-full rounded-md",
    circular: "rounded-full shrink-0",
    rectangular: "w-full rounded-xl",
    card: "w-full h-48 rounded-2xl",
  };

  const customStyle = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...style,
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={customStyle}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton variant="circular" width={44} height={44} />
        <Skeleton variant="rectangular" width={70} height={24} />
      </div>
      <Skeleton variant="text" width="75%" height={24} />
      <Skeleton variant="text" width="100%" height={16} />
      <Skeleton variant="text" width="90%" height={16} />
      <div className="pt-2 flex items-center justify-between">
        <Skeleton variant="text" width={100} height={14} />
        <Skeleton variant="text" width={80} height={32} />
      </div>
    </div>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm animate-pulse space-y-4">
      <Skeleton variant="rectangular" height={192} />
      <div className="p-6 space-y-3">
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={60} height={20} />
          <Skeleton variant="text" width={80} height={20} />
        </div>
        <Skeleton variant="text" width="85%" height={24} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="70%" height={16} />
      </div>
    </div>
  );
}
