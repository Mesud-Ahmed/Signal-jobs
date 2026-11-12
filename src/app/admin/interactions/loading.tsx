export default function AdminInteractionsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="h-8 w-56 bg-slate-800 rounded-lg mb-2" />
          <div className="h-4 w-96 bg-slate-800/60 rounded" />
        </div>
        <div className="h-9 w-48 bg-slate-800 rounded-lg" />
      </div>

      {/* Filter and Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="h-9 w-full sm:w-64 bg-slate-800 rounded-lg" />
        <div className="h-9 w-full sm:w-80 bg-slate-800 rounded-lg" />
      </div>

      {/* Table Card Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="h-10 bg-slate-950/80 border-b border-slate-800" />
        <div className="divide-y divide-slate-800/60">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="h-6 w-28 bg-slate-800 rounded-full" />
              <div className="flex items-center gap-2 flex-1">
                <div className="h-7 w-7 rounded-full bg-slate-800" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-36 bg-slate-800 rounded" />
                  <div className="h-3 w-24 bg-slate-800/60 rounded" />
                </div>
              </div>
              <div className="h-4 w-44 bg-slate-800/60 rounded hidden md:block" />
              <div className="h-3.5 w-24 bg-slate-800/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

