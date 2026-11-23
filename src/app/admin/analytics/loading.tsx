export default function AdminAnalyticsLoading() {
  return (
    <div className="space-y-8 animate-pulse max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="h-8 w-64 bg-slate-800 rounded-lg mb-2" />
          <div className="h-4 w-96 bg-slate-800/60 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-36 bg-slate-800 rounded-lg" />
          <div className="h-9 w-32 bg-slate-800 rounded-lg" />
        </div>
      </div>

      {/* 4 Summary Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-24 bg-slate-800 rounded" />
              <div className="h-7 w-7 bg-slate-800 rounded-lg" />
            </div>
            <div className="h-8 w-20 bg-slate-800 rounded" />
            <div className="h-4 w-full bg-slate-800/50 rounded pt-1" />
          </div>
        ))}
      </div>

      {/* Source Channels Grid Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="h-5 w-56 bg-slate-800 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <div className="h-3.5 w-28 bg-slate-800 rounded" />
              <div className="h-7 w-16 bg-slate-800 rounded" />
              <div className="h-2 w-full bg-slate-800/40 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="h-12 bg-slate-950/80 border-b border-slate-800" />
        <div className="divide-y divide-slate-800/60">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="p-3.5 flex items-center justify-between gap-4">
              <div className="h-4 w-40 bg-slate-800 rounded" />
              <div className="h-4 w-12 bg-slate-800/60 rounded" />
              <div className="h-4 w-12 bg-slate-800/60 rounded" />
              <div className="h-4 w-12 bg-slate-800/60 rounded" />
              <div className="h-4 w-12 bg-slate-800/60 rounded" />
              <div className="h-4 w-12 bg-slate-800/60 rounded" />
              <div className="h-6 w-14 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
