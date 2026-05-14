import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTasks } from '../hooks/useTasks'
import TaskCard from '../components/TaskCard'
import { TaskCardSkeleton, ErrorState, EmptyState } from '../components/SkeletonLoader'
import { statusConfig } from '../utils/formatters'

const STATUS_OPTIONS = ['all', 'posted', 'assigned', 'verified', 'completed', 'disputed']
const LOCATION_OPTIONS = ['All Locations', 'Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan', 'Enugu', 'Kaduna']

// Static AI match preview data
const MOCK_MATCHES: Record<number, { name: string; score: number }> = {
  1: { name: 'Amaka O.', score: 92 },
  2: { name: 'Emeka N.', score: 87 },
  3: { name: 'Fatima A.', score: 78 },
  4: { name: 'Chidi U.', score: 95 },
  5: { name: 'Ngozi K.', score: 83 },
}

export default function Tasks() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('All Locations')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'match'>('date')

  const { tasks, loading, error, refetch } = useTasks({
    status: statusFilter === 'all' ? undefined : statusFilter,
    location: locationFilter === 'All Locations' ? undefined : locationFilter,
  })

  const filtered = useMemo(() => {
    let list = [...tasks]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) => t.title.toLowerCase().includes(q) || t.task_location.toLowerCase().includes(q) || t.required_skills.some((s) => s.toLowerCase().includes(q))
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
  const totalValue = tasks.reduce((sum, t) => sum + t.amount_naira, 0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-blue-50 to-white border-b border-slate-100">
        <div className="page-container">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="badge bg-blue-100 text-blue-700 border border-blue-200 mb-4">Opportunity Hub</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="section-heading mb-2">Find Your Next Opportunity</motion.h1>
          <p className="section-subheading mb-8">AI-matched tasks with Squad-secured escrow payments. Work, verify, get paid.</p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { label: 'Open Tasks', value: loading ? '…' : openCount, icon: '✅', color: 'text-emerald-600' },
              { label: 'Total Value', value: loading ? '…' : `₦${(totalValue / 1000).toFixed(0)}K`, icon: '💰', color: 'text-blue-600' },
              { label: 'Avg AI Match', value: '89%', icon: '🤖', color: 'text-violet-600' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm">
                <span className="text-lg">{stat.icon}</span>
                <div>
                  <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Search tasks, skills, locations…"
                className="input-field pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="input-field w-auto min-w-[160px]" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              {LOCATION_OPTIONS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="page-container">
          {/* Status Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {STATUS_OPTIONS.map((s) => {
              const cfg = s === 'all' ? null : statusConfig[s]
              return (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all capitalize ${statusFilter === s ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {s === 'all' ? 'All Tasks' : cfg?.label ?? s}
                </button>
              )
            })}
          </div>

          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="text-sm text-slate-500 font-medium">
              {loading ? 'Loading…' : `${filtered.length} tasks`}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Sort:</span>
              {(['date', 'amount', 'match'] as const).map((s) => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all capitalize ${sortBy === s ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {s === 'match' ? 'AI Match' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <TaskCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState title="No tasks found" description="Try a different filter or check back soon for new opportunities." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((task, i) => (
                <motion.div key={task.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <TaskCard task={task} topMatch={MOCK_MATCHES[task.id]} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  )
}
