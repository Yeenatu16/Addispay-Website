"use client";

import React, { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <ErrorState
        title="Unexpected Page Error"
        description="We ran into a problem rendering this page. Our engineers have been notified."
        onRetry={reset}
        showHomeButton={true}
      />
    </div>
  );
}
