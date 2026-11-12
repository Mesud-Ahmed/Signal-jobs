export default function AdminNotificationsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-slate-800 pb-5">
        <div className="h-8 w-64 bg-slate-800 rounded-lg mb-2" />
        <div className="h-4 w-96 bg-slate-800/60 rounded" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="h-4 w-28 bg-slate-800 rounded" />
            <div className="h-7 w-20 bg-slate-800 rounded" />
          </div>
        ))}
      </div>

      {/* Log Table Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="h-10 bg-slate-950/80 border-b border-slate-800" />
        <div className="divide-y divide-slate-800/60">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-52 bg-slate-800 rounded" />
                <div className="h-3 w-32 bg-slate-800/60 rounded" />
              </div>
              <div className="h-6 w-20 bg-slate-800 rounded-full" />
              <div className="h-4 w-24 bg-slate-800/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

