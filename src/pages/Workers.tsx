import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useWorkers } from '../hooks/useWorkers'
import WorkerCard from '../components/WorkerCard'
import { WorkerCardSkeleton, ErrorState, EmptyState } from '../components/SkeletonLoader'

const ALL_SKILLS = ['cleaning', 'delivery', 'carpentry', 'tailoring', 'cooking', 'driving', 'security', 'tutoring', 'welding', 'phone repair']
const LOCATIONS = ['All Locations', 'Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan', 'Enugu', 'Kaduna', 'Onitsha', 'Benin City', 'Aba']

export default function Workers() {
  const [search, setSearch] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState<'trust' | 'rating' | 'earnings' | 'jobs'>('trust')

  const { workers, loading, error, refetch } = useWorkers({
    skill: selectedSkill || undefined,
    location: selectedLocation === 'All Locations' ? undefined : selectedLocation,
    minRating: minRating > 0 ? minRating : undefined,
  })

  const filtered = useMemo(() => {
    let list = [...workers]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (w) => w.name.toLowerCase().includes(q) || w.primary_location.toLowerCase().includes(q) || w.skills.some((s) => s.toLowerCase().includes(q))
      )
    }
    list.sort((a, b) => {
      if (sortBy === 'trust') return b.trust_score - a.trust_score
      if (sortBy === 'rating') return b.avg_rating - a.avg_rating
      if (sortBy === 'earnings') return b.total_earnings - a.total_earnings
      if (sortBy === 'jobs') return b.tasks_completed - a.tasks_completed
      return 0
    })
    return list
  }, [workers, search, sortBy])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="page-container">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">Worker Marketplace</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="section-heading mb-2">Find Verified Workers</motion.h1>
          <p className="section-subheading mb-8">AI-matched talent with verifiable trust scores, ratings, and earnings history.</p>

          {/* Search + Filters */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text" placeholder="Search by name, skill, or location…"
                className="input-field pl-10"
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Skill Filter */}
            <select className="input-field w-auto min-w-[160px]" value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
              <option value="">All Skills</option>
              {ALL_SKILLS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>

            {/* Location */}
            <select className="input-field w-auto min-w-[160px]" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>

            {/* Min Rating */}
            <select className="input-field w-auto min-w-[140px]" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
              <option value={0}>Any Rating</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="page-container">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="text-sm text-slate-500 font-medium">
              {loading ? 'Loading…' : `${filtered.length} workers found`}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Sort by:</span>
              {(['trust', 'rating', 'earnings', 'jobs'] as const).map((s) => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${sortBy === s ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setSelectedSkill('')}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${!selectedSkill ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              All
            </button>
            {ALL_SKILLS.map((skill) => (
              <button key={skill} onClick={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all capitalize ${selectedSkill === skill ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {skill}
              </button>
            ))}
          </div>

          {/* Grid */}
          {error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <WorkerCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState title="No workers found" description="Try adjusting your search filters or check back later." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((worker, i) => (
                <motion.div key={worker.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <WorkerCard worker={worker} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  )
}
