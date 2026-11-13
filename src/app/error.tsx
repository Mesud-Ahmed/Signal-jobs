"use client";

import { useEffect } from "react";
import Image from "next/image";
import { RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root application error captured:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-1">
          <Image
            src="/logo.png"
            alt="Signal Job"
            width={48}
            height={48}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Something went wrong
          </h1>
          <p className="text-xs text-slate-400">
            A temporary connection or render issue occurred. Reloading the page usually resolves it immediately.
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
            <span>Reload Page</span>
          </Button>
          <Link href="/">
            <Button variant="primary" size="sm" className="gap-2 text-xs">
              <Home className="h-3.5 w-3.5" />
              <span>Go to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

