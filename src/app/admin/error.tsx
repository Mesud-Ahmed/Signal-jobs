"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin dashboard runtime error captured:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-2xl border border-red-500/20 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Dashboard encountered an issue
          </h2>
          <p className="text-xs text-slate-400">
            {error?.message && !error.message.includes("digest")
              ? error.message
              : "A temporary connection or render issue occurred. Reloading resolves it immediately."}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => reset()}
            className="gap-2 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>
          <Link href="/admin">
            <Button variant="primary" size="sm" className="gap-2 text-xs">
              <Home className="h-3.5 w-3.5" />
              <span>Back to Overview</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

