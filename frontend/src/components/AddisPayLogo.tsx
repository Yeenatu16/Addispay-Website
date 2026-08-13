'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  href?: string;
}

export default function AddisPayLogo({
  className = '',
  iconOnly = false,
  size = 'md',
  animated = true,
  href = '/',
}: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-xl' },
    md: { icon: 'w-9 h-8.5', text: 'text-2xl' },
    lg: { icon: 'w-11 h-10', text: 'text-3xl' },
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 group cursor-pointer select-none ${className}`}>
      {/* Icon Mark Container - Pixel-Perfect Figma Node 45:3 */}
      <div className={`relative ${sizeClasses.icon} flex items-center justify-center shrink-0`}>
        <div className="relative w-full h-full transform transition-transform duration-300 group-hover:scale-110">
          <svg
            width="36"
            height="34"
            viewBox="0 0 36 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Green Vector (#00A36D) - Node 45:3 */}
            <path
              d="M29.0133 35.5692C28.2304 35.6769 27.5109 35.7615 26.7851 35.8467C25.9978 34.7085 25.2397 33.6235 24.4931 32.5315C22.3656 29.42 20.2447 26.3045 18.1176 23.1928C16.3131 20.553 14.4919 17.9233 12.7091 15.2705C12.4503 14.8855 12.1734 14.7809 11.7277 14.7845C9.61536 14.8013 7.5028 14.7921 5.39031 14.7921C5.12668 14.7921 4.86305 14.7921 4.5 14.7921C4.63476 14.5319 4.70912 14.3499 4.81624 14.1872C7.6716 9.84954 10.5352 5.51676 13.3853 1.17606C14.162 -0.00693524 15.3068 -0.642468 16.7316 -0.68916C18.1758 -0.736485 19.3554 -0.107442 20.1496 1.04433C23.6332 6.0963 27.099 11.1593 30.5716 16.218C31.896 18.1472 33.1886 20.0968 34.5531 22.0004C37.5744 26.2152 36.2344 32.1854 31.2642 34.7531C30.5851 35.1039 29.8083 35.2858 29.0133 35.5692Z"
              fill="#00A36D"
              className={animated ? 'transition-colors duration-300 group-hover:fill-[#00b87c]' : ''}
            />

            {/* Orange Vector (#F5A414) - Node 45:3 */}
            <path
              d="M0.291574 25.9054C1.73042 23.9127 3.14032 21.9608 4.55644 20.0002C7.44699 20.0002 10.3167 20.0002 13.2296 20.0002C15.4568 23.0854 17.6918 26.1816 20 29.3792C17.7504 29.3792 15.6559 29.3792 13.5634 29.3792C12.8469 30.4166 12.0908 31.368 11.1188 32.1714C9.32166 33.6564 7.22925 34.5778 4.8017 34.8823C3.82017 35.0055 2.83978 35.0773 1.86135 34.8644C-0.159895 34.4249 -1.61816 32.9571 -1.93606 31.1159C-2.13478 29.9649 -1.86628 28.9258 -1.18274 27.957C-0.707301 27.2831 -0.219601 26.6162 0.291574 25.9054Z"
              fill="#F5A414"
              className={animated ? 'transition-colors duration-300 group-hover:fill-[#ffb326]' : ''}
            />
          </svg>
        </div>

        {/* Glow effect on hover */}
        {animated && (
          <div className="absolute inset-0 rounded-full bg-[#00A36D]/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        )}
      </div>

      {/* Wordmark */}
      {!iconOnly && (
        <span className={`${sizeClasses.text} font-black tracking-tight flex items-center`}>
          <span className="text-[#101828] transition-colors duration-200 group-hover:text-black">
            addis
          </span>
          <span className="text-[#00A36D] transition-colors duration-200 group-hover:text-[#008959]">
            pay
          </span>
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
