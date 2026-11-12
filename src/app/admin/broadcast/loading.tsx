export default function AdminBroadcastLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-slate-800 pb-5">
        <div className="h-8 w-60 bg-slate-800 rounded-lg mb-2" />
        <div className="h-4 w-96 bg-slate-800/60 rounded" />
      </div>

      {/* Audience Filter Box Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="h-5 w-48 bg-slate-800 rounded mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-9 w-full bg-slate-800/60 rounded-lg" />
          <div className="h-9 w-full bg-slate-800/60 rounded-lg" />
          <div className="h-9 w-full bg-slate-800/60 rounded-lg" />
        </div>
      </div>

      {/* Message Compose Box Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="h-5 w-40 bg-slate-800 rounded" />
        <div className="h-36 w-full bg-slate-800/60 rounded-lg" />
        <div className="flex justify-end">
          <div className="h-9 w-36 bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

