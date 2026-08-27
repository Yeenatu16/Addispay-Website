'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  /** When true, shows only the A mark SVG instead of the full wordmark image. */
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  href?: string;
}

const SIZE = {
  sm: { width: 112, height: 30, icon: 'h-7 w-7' },
  md: { width: 148, height: 40, icon: 'h-9 w-9' },
  lg: { width: 196, height: 53, icon: 'h-11 w-11' },
} as const;

export default function AddisPayLogo({
  className = '',
  iconOnly = false,
  size = 'md',
  animated = true,
  href = '/',
}: LogoProps) {
  const dims = SIZE[size];

  const content = iconOnly ? (
    <div className={`relative shrink-0 ${dims.icon} ${className}`}>
      <Image
        src="/addispay_logo_icon.svg"
        alt="AddisPay"
        fill
        className={`object-contain ${animated ? 'transition-transform duration-300 group-hover:scale-105' : ''}`}
        sizes="44px"
        priority
      />
    </div>
  ) : (
    <div
      className={`group relative inline-flex items-center select-none ${className}`}
      style={{ width: dims.width, height: dims.height }}
    >
      <Image
        src="/images/addispay-logo.png"
        alt="AddisPay"
        width={dims.width}
        height={dims.height}
        className={`h-full w-auto object-contain object-left ${
          animated ? 'transition-transform duration-300 group-hover:scale-[1.03]' : ''
        }`}
        sizes={`(max-width: 768px) ${dims.width}px, ${dims.width}px`}
        priority
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center" aria-label="AddisPay home">
        {content}
      </Link>
    );
  }

  return content;
}
