import React from "react";
import * as LucideIcons from "lucide-react";

export type IconName = keyof typeof LucideIcons;

export interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className = "" }: IconProps) {
  const LucideIcon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name];

  if (!LucideIcon) {
    const FallbackIcon = LucideIcons.HelpCircle;
    return <FallbackIcon size={size} className={className} />;
  }

  return <LucideIcon size={size} className={className} />;
}
