"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

const ACTION_OPTIONS = [
  { value: "all", label: "All Events" },
  { value: "JOB_APPLIED", label: "🔗 View & Apply" },
  { value: "JOB_SAVED", label: "💾 Job Saved" },
  { value: "PREFERENCES_CLICKED", label: "⚙️ Preferences Clicked" },
  { value: "JOB_VIEWED", label: "👁️ Job Viewed (Legacy)" },
  { value: "PROFILE_UPDATED", label: "👤 Profile Updated (Legacy)" },
];

export function InteractionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentAction = searchParams.get("action") || "all";
  const currentQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(currentQ);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // Reset to page 1

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("q", query.trim());
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      {/* Action Selector */}
      <div className="w-full sm:w-64">
        <select
          value={currentAction}
          onChange={(e) => updateParam("action", e.target.value)}
          aria-label="Filter events by action"
          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
        >
          {ACTION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-80">
        <div className="relative w-full">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by username, name, or job..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 pl-9 pr-8 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                updateParam("q", "");
              }}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Button type="submit" variant="secondary" size="sm" disabled={isPending}>
          Search
        </Button>
      </form>
    </div>
  );
}

