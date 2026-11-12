export default function AdminSettingsLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-slate-800 pb-4">
        <div className="h-8 w-72 bg-slate-800 rounded-lg mb-2" />
        <div className="h-4 w-96 bg-slate-800/60 rounded" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="h-5 w-48 bg-slate-800 rounded mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex justify-between py-2 border-b border-slate-800/60">
                  <div className="h-3.5 w-24 bg-slate-800 rounded" />
                  <div className="h-3.5 w-32 bg-slate-800/60 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Staff Management Card Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="h-5 w-56 bg-slate-800 rounded" />
        <div className="h-20 w-full bg-slate-800/40 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-9 w-full bg-slate-800/60 rounded-lg" />
          <div className="h-9 w-full bg-slate-800/60 rounded-lg" />
        </div>
      </div>

      {/* Audit Logs Card Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
        <div className="h-5 w-60 bg-slate-800 rounded mb-4" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/60 flex justify-between">
            <div className="h-4 w-40 bg-slate-800 rounded" />
            <div className="h-3.5 w-24 bg-slate-800/60 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

