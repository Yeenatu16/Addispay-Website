'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * SSR-safe wrapper around Framer Motion's `useReducedMotion()`.
 * Returns `false` during SSR and initial client hydration to prevent attribute/style
 * mismatches, then activates the user's true motion preference after mount.
 */
export function useSafeReducedMotion(): boolean {
  const [mounted, setMounted] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? Boolean(shouldReduce) : false;
}
