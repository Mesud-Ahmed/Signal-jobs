export default function AdminUsersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-slate-800 pb-5">
        <div className="h-8 w-60 bg-slate-800 rounded-lg mb-2" />
        <div className="h-4 w-96 bg-slate-800/60 rounded" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex gap-2 pb-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-slate-800 rounded-lg" />
        ))}
      </div>

      {/* Table Card Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="h-10 bg-slate-950/80 border-b border-slate-800" />
        <div className="divide-y divide-slate-800/60">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-slate-800 rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-slate-800 rounded" />
                  <div className="h-3 w-28 bg-slate-800/60 rounded" />
                </div>
              </div>
              <div className="h-6 w-20 bg-slate-800 rounded-full hidden sm:block" />
              <div className="h-4 w-28 bg-slate-800/60 rounded hidden md:block" />
              <div className="h-6 w-16 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

