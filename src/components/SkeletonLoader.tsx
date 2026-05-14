import { ShieldCheck, AlertCircle, SearchX, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

export function WorkerCardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="animate-pulse bg-slate-100 w-14 h-14 rounded-2xl"></div>
          <div className="space-y-2">
            <div className="animate-pulse bg-slate-100 h-4 w-32 rounded-lg"></div>
            <div className="animate-pulse bg-slate-100 h-3 w-20 rounded-lg"></div>
          </div>
        </div>
        <div className="animate-pulse bg-slate-100 h-6 w-16 rounded-full"></div>
      </div>
      <div className="flex gap-2">
        <div className="animate-pulse bg-slate-100 h-5 w-16 rounded-full"></div>
        <div className="animate-pulse bg-slate-100 h-5 w-20 rounded-full"></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="animate-pulse bg-slate-50 h-14 rounded-2xl"></div>
        <div className="animate-pulse bg-slate-50 h-14 rounded-2xl"></div>
        <div className="animate-pulse bg-slate-50 h-14 rounded-2xl"></div>
      </div>
      <div className="animate-pulse bg-slate-100 h-11 w-full rounded-2xl"></div>
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-3">
          <div className="animate-pulse bg-slate-100 h-6 w-3/4 rounded-lg"></div>
          <div className="animate-pulse bg-slate-100 h-3 w-1/2 rounded-lg"></div>
        </div>
        <div className="animate-pulse bg-slate-100 h-6 w-20 rounded-full"></div>
      </div>
      <div className="animate-pulse bg-blue-50/50 h-24 w-full rounded-2xl"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-100 h-6 w-24 rounded-lg"></div>
          <div className="animate-pulse bg-slate-100 h-3 w-16 rounded-lg"></div>
        </div>
        <div className="animate-pulse bg-slate-100 h-12 w-32 rounded-2xl"></div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col gap-4 shadow-sm">
      <div className="animate-pulse bg-slate-100 h-10 w-10 rounded-xl"></div>
      <div className="space-y-2">
        <div className="animate-pulse bg-slate-100 h-8 w-24 rounded-lg"></div>
        <div className="animate-pulse bg-slate-100 h-3 w-16 rounded-lg"></div>
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-sm">
      <div className="space-y-2">
        <div className="animate-pulse bg-slate-100 h-6 w-48 rounded-lg"></div>
        <div className="animate-pulse bg-slate-100 h-3 w-32 rounded-lg"></div>
      </div>
      <div className="animate-pulse bg-slate-50 rounded-2xl" style={{ height }}></div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-8">
      <div className="relative">
        <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-blue-600 animate-spin-slow flex items-center justify-center shadow-2xl shadow-emerald-500/20">
          <ShieldCheck className="w-10 h-10 text-white animate-pulse" />
        </div>
        <div className="absolute inset-0 w-20 h-20 rounded-[2rem] border-4 border-emerald-500/20 animate-ping"></div>
      </div>
      <div className="flex flex-col items-center gap-3 text-center px-6">
        <h2 className="text-2xl font-black text-navy-900 tracking-tight leading-none uppercase tracking-[0.2em]">Authenticating</h2>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Connecting to National OS Infrastructure…</p>
      </div>
      <div className="flex gap-2">
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
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-6 py-20 text-center px-6">
      <div className="w-20 h-20 rounded-[2rem] bg-red-50 border border-red-100 flex items-center justify-center shadow-xl shadow-red-100/50">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <div>
        <h3 className="text-xl font-black text-navy-900 mb-2 uppercase tracking-widest">System Interruption</h3>
        <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} className="h-12 px-8 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-navy-100">
          <RotateCcw className="w-4 h-4 mr-2" /> Attempt Reconnect
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-6 py-20 text-center px-6">
      <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xl shadow-slate-100/50">
        <SearchX className="w-10 h-10 text-slate-300" />
      </div>
      <div>
        <h3 className="text-xl font-black text-navy-900 mb-2 uppercase tracking-widest">{title}</h3>
        <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function SkeletonLoader({ type }: { type: 'dashboard' | 'tasks' | 'workers' | 'stats' }) {
  if (type === 'dashboard') {
    return (
      <div className="space-y-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 h-[400px] animate-pulse shadow-sm"></div>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 h-[400px] animate-pulse shadow-sm"></div>
        </div>
      </div>
    );
  }
  
  if (type === 'tasks') {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => <TaskCardSkeleton key={i} />)}
      </div>
    );
  }

  if (type === 'workers') {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <WorkerCardSkeleton key={i} />)}
      </div>
    );
  }

  return <StatCardSkeleton />;
}
