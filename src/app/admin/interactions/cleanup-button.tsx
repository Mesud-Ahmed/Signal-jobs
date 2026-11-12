"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InteractionsCleanupButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCleanup = async () => {
    if (
      !confirm(
        "Are you sure you want to permanently delete all interaction logs older than 5 days? This will free up database space and cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/admin/interactions/cleanup", {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to cleanup old logs");
      }

      setMessage(data.message || `Deleted ${data.count} old interaction logs.`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error cleaning up logs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      {message && (
        <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{message}</span>
        </span>
      )}
      {error && (
        <span className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </span>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCleanup}
        disabled={loading}
        className="gap-2 text-xs border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
        <span>Delete Logs (&gt; 5 Days Old)</span>
      </Button>
    </div>
  );
}

