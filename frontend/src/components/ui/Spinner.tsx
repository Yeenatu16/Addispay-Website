import React from "react";
import { Loader2 } from "lucide-react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: string;
}

export function Spinner({ size = "md", className = "", color = "text-emerald-600" }: SpinnerProps) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return <Loader2 className={`animate-spin ${sizeMap[size]} ${color} ${className}`} />;
}

export function PageLoading({ message = "Loading AddisPay..." }: { message?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
        <div className="absolute w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
          AP
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600 animate-pulse">{message}</p>
    </div>
  );
}
