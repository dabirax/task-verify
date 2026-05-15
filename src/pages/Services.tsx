import { useState, useMemo } from 'react'
import { 
  Search, 
  TrendingUp} from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import TaskCard from '../components/TaskCard'
import { SkeletonLoader, ErrorState, EmptyState } from '../components/SkeletonLoader'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

const STATUS_OPTIONS = ['all', 'posted', 'assigned', 'verified', 'completed', 'disputed']

const MOCK_MATCHES: Record<number, { name: string; score: number }> = {
  1: { name: 'Amaka O.', score: 92 },
  2: { name: 'Emeka N.', score: 87 },
  3: { name: 'Fatima A.', score: 78 },
  4: { name: 'Chidi U.', score: 95 },
  5: { name: 'Ngozi K.', score: 83 },
}

export default function Services() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'match'>('date')

  const { tasks, loading, error, refetch } = useTasks({
    status: statusFilter === 'all' ? undefined : statusFilter,
    location: locationFilter === 'all' ? undefined : locationFilter,
  })

  const filtered = useMemo(() => {
    let list = [...tasks]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) => t.title.toLowerCase().includes(q) || t.task_location.toLowerCase().includes(q) || (t.required_skills || []).some((s) => s.toLowerCase().includes(q))
      )
    }
    list.sort((a, b) => {
      if (sortBy === 'amount') return b.amount_naira - a.amount_naira
      if (sortBy === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      return (MOCK_MATCHES[b.id]?.score ?? 0) - (MOCK_MATCHES[a.id]?.score ?? 0)
    })
    return list
  }, [tasks, search, sortBy])

  const openCount = tasks.filter((t) => t.status === 'posted').length
  const totalValue = tasks.reduce((sum, t) => sum + Number(t.amount_naira), 0)

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="page-container">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-navy-900 tracking-tight leading-tight mb-2">
            Available Services
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Browse and apply for verified opportunities in the ecosystem.
          </p>
        </div>

        <div className="space-y-8">
          {/* Filters & Stats Bar */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-navy-100/20 border border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex flex-1 items-center gap-4 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search services, skills, or locations..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-11 h-12 rounded-2xl border-slate-100 focus:ring-navy-900/10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-12 rounded-2xl border-slate-100">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {STATUS_OPTIONS.map(s => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6">
               <div className="text-right hidden sm:block">
                  <div className="text-sm font-black text-navy-900">{openCount} Services</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Now</div>
               </div>
               <Button onClick={() => refetch()} variant="outline" size="icon" className="w-12 h-12 rounded-2xl border-slate-100">
                 <TrendingUp className="w-5 h-5 text-emerald-500" />
               </Button>
            </div>
          </div>

          {/* Main Content */}
          {loading ? (
            <SkeletonLoader type="tasks" />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No services found" description="Try adjusting your filters or search query." />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
