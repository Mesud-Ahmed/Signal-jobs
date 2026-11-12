export default function AdminAnalyticsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-slate-800 pb-5">
        <div className="h-8 w-56 bg-slate-800 rounded-lg mb-2" />
        <div className="h-4 w-80 bg-slate-800/60 rounded" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="h-4 w-32 bg-slate-800 rounded" />
            <div className="h-8 w-24 bg-slate-800 rounded" />
            <div className="h-3 w-40 bg-slate-800/60 rounded" />
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="h-5 w-44 bg-slate-800 rounded mb-4" />
            {[...Array(5)].map((_, j) => (
              <div key={j} className="space-y-1.5">
                <div className="flex justify-between">
                  <div className="h-3.5 w-32 bg-slate-800 rounded" />
                  <div className="h-3.5 w-12 bg-slate-800/60 rounded" />
                </div>
                <div className="h-3 w-full bg-slate-800/40 rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

