export function WorkerCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="skeleton w-12 h-12 rounded-full"></div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="skeleton h-4 w-32 rounded"></div>
          <div className="skeleton h-3 w-20 rounded"></div>
        </div>
        <div className="skeleton h-6 w-16 rounded-full"></div>
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-5 w-16 rounded-full"></div>
        <div className="skeleton h-5 w-20 rounded-full"></div>
        <div className="skeleton h-5 w-14 rounded-full"></div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="skeleton h-12 rounded-xl"></div>
        <div className="skeleton h-12 rounded-xl"></div>
        <div className="skeleton h-12 rounded-xl"></div>
      </div>
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 flex flex-col gap-2">
          <div className="skeleton h-5 w-3/4 rounded"></div>
          <div className="skeleton h-3 w-1/2 rounded"></div>
        </div>
        <div className="skeleton h-6 w-20 rounded-full"></div>
      </div>
      <div className="skeleton h-10 w-full rounded-lg"></div>
      <div className="flex justify-between items-center">
        <div className="skeleton h-6 w-24 rounded"></div>
        <div className="skeleton h-9 w-28 rounded-xl"></div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-6 flex flex-col gap-3">
      <div className="skeleton h-4 w-24 rounded"></div>
      <div className="skeleton h-8 w-32 rounded"></div>
      <div className="skeleton h-3 w-20 rounded"></div>
    </div>
  );
}

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="skeleton h-5 w-40 rounded"></div>
      <div className="skeleton rounded-xl" style={{ height }}></div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 animate-pulse flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
          <circle cx="8" cy="8" r="2" fill="white"/>
        </svg>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-navy-900 font-semibold">Loading data</p>
        <p className="text-slate-400 text-sm">Connecting to TaskVerify API…</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <div className="text-center">
        <p className="font-semibold text-navy-900 mb-1">Something went wrong</p>
        <p className="text-slate-400 text-sm max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary text-sm py-2 px-5">
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9h6M9 12h4"/>
        </svg>
      </div>
      <div className="text-center">
        <p className="font-semibold text-navy-900 mb-1">{title}</p>
        <p className="text-slate-400 text-sm max-w-xs">{description}</p>
      </div>
    </div>
  );
}
