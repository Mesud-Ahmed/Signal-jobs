export default function AdminNewJobLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-slate-800 pb-5">
        <div className="h-8 w-56 bg-slate-800 rounded-lg mb-2" />
        <div className="h-4 w-80 bg-slate-800/60 rounded" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <div className="h-9 w-36 bg-slate-800 rounded-lg" />
        <div className="h-9 w-40 bg-slate-800/60 rounded-lg" />
      </div>

      {/* Form Card Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-3.5 w-24 bg-slate-800 rounded" />
            <div className="h-9 w-full bg-slate-800/60 rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="h-3.5 w-24 bg-slate-800 rounded" />
            <div className="h-9 w-full bg-slate-800/60 rounded-lg" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-3.5 w-32 bg-slate-800 rounded" />
          <div className="h-20 w-full bg-slate-800/60 rounded-lg" />
        </div>

        <div className="space-y-2">
          <div className="h-3.5 w-32 bg-slate-800 rounded" />
          <div className="h-32 w-full bg-slate-800/60 rounded-lg" />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <div className="h-9 w-24 bg-slate-800 rounded-lg" />
          <div className="h-9 w-36 bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

