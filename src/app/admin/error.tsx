"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error details for diagnostics
    console.error("[Admin Error Boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center shadow-2xl shadow-sky-500/5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-5">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h2 className="text-xl font-bold tracking-tight text-white mb-2">
          Temporary Connection Glitch
        </h2>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          The dashboard encountered a transient database reconnect or network blip. You can retry immediately.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => reset()}
            className="w-full sm:w-auto gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Reload Page</span>
          </Button>
        </div>

        {error?.digest && (
          <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
            Error ID: {error.digest}
          </div>
        )}
      </div>
    </div>
  );
}

