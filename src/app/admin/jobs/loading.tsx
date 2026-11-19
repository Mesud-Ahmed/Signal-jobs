export default function AdminJobsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="h-8 w-48 bg-slate-800 rounded-lg mb-2" />
          <div className="h-4 w-72 bg-slate-800/60 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-36 bg-slate-800 rounded-lg" />
          <div className="h-9 w-32 bg-slate-800 rounded-lg" />
        </div>
      </div>

      {/* Notice Skeleton */}
      <div className="h-14 w-full bg-slate-900/60 border border-slate-800 rounded-xl" />

      {/* Filter and Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="h-9 w-full sm:w-64 bg-slate-800 rounded-lg" />
        <div className="h-9 w-full sm:w-72 bg-slate-800 rounded-lg" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="h-10 bg-slate-950/80 border-b border-slate-800" />
        <div className="divide-y divide-slate-800/60">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-60 bg-slate-800 rounded" />
                <div className="h-3 w-32 bg-slate-800/60 rounded" />
              </div>
              <div className="h-4 w-28 bg-slate-800/80 rounded hidden sm:block" />
              <div className="h-6 w-24 bg-slate-800 rounded-full" />
              <div className="h-4 w-20 bg-slate-800/60 rounded hidden md:block" />
              <div className="h-8 w-8 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

