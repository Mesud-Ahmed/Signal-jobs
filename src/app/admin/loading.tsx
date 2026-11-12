export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-slate-800 pb-5">
        <div className="h-8 w-64 bg-slate-800 rounded-lg mb-2" />
        <div className="h-4 w-96 bg-slate-800/60 rounded" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-slate-800 rounded" />
              <div className="h-8 w-8 bg-slate-800 rounded-lg" />
            </div>
            <div className="h-7 w-20 bg-slate-800 rounded" />
            <div className="h-3 w-32 bg-slate-800/60 rounded" />
          </div>
        ))}
      </div>

      {/* Two-Column Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="h-5 w-48 bg-slate-800 rounded mb-4" />
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-lg bg-slate-950/40 border border-slate-800/60"
            >
              <div className="space-y-2">
                <div className="h-4 w-52 bg-slate-800 rounded" />
                <div className="h-3 w-36 bg-slate-800/60 rounded" />
              </div>
              <div className="h-6 w-20 bg-slate-800 rounded-full" />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="h-5 w-40 bg-slate-800 rounded mb-4" />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/60 space-y-2"
            >
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-slate-800 rounded" />
                <div className="h-3 w-16 bg-slate-800/60 rounded" />
              </div>
              <div className="h-3 w-36 bg-slate-800/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

