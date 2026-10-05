'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useSafeReducedMotion } from '@/lib/useSafeReducedMotion';

type Direction = 'up' | 'left' | 'scale';

const hiddenByDirection: Record<Direction, { opacity: number; x?: number; y?: number; scale?: number }> = {
  up: { opacity: 0, y: 36 },
  left: { opacity: 0, x: -36 },
  scale: { opacity: 0, scale: 0.96 },
};

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useSafeReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={hiddenByDirection[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.7,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
