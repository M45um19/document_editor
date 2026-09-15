"use client";

import { useState, useEffect } from "react";

/**
 * Standard client mount detection hook to prevent Next.js SSR hydration mismatches.
 * Ensures the initial client render matches the server HTML before enabling dynamic client state.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted;
}
