import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Star, 
  Users,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react'
import { useWorkers } from '../hooks/useWorkers'
import WorkerCard from '../components/WorkerCard'
import { SkeletonLoader, ErrorState, EmptyState } from '../components/SkeletonLoader'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

const ALL_SKILLS = ['cleaning', 'delivery', 'carpentry', 'tailoring', 'cooking', 'driving', 'security', 'tutoring', 'welding', 'phone repair']
const LOCATIONS = ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan', 'Enugu', 'Kaduna', 'Onitsha', 'Benin City', 'Aba']

export default function Workers() {
  const [search, setSearch] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [minRating, setMinRating] = useState('0')
  const [sortBy, setSortBy] = useState<'trust' | 'rating' | 'earnings' | 'jobs'>('trust')

  const { workers, loading, error, refetch } = useWorkers({
    skill: selectedSkill === 'all' ? undefined : selectedSkill,
    location: selectedLocation === 'all' ? undefined : selectedLocation,
    minRating: minRating !== '0' ? Number(minRating) : undefined,
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
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="page-container">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-navy-900 tracking-tight leading-tight mb-2">
            Verified Workers
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Connect with skilled professionals verified by TaskVerify AI.
          </p>
        </div>

        <div className="space-y-8">
          {/* Filters Bar */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-navy-100/20 border border-slate-50 flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search workers by name, skill, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 pl-11 rounded-2xl border-slate-100"
              />
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-3 w-full lg:w-auto">
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="h-12 min-w-[140px] rounded-2xl border-slate-100">
                  <SelectValue placeholder="All Skills" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="all">All Skills</SelectItem>
                  {ALL_SKILLS.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-12 min-w-[140px] rounded-2xl border-slate-100">
                  <SelectValue placeholder="Locations" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="all">All Locations</SelectItem>
                  {LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 rounded-2xl border-slate-100 font-bold text-[10px] uppercase tracking-widest px-4">
                    <ArrowUpDown className="w-3.5 h-3.5 mr-2" /> {sortBy}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl p-2 w-48">
                  <DropdownMenuLabel className="text-[9px] uppercase tracking-widest text-slate-400">Sort Workers</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy('trust')} className="rounded-xl font-bold text-xs uppercase py-2.5">Trust Score</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('rating')} className="rounded-xl font-bold text-xs uppercase py-2.5">Avg Rating</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('earnings')} className="rounded-xl font-bold text-xs uppercase py-2.5">Earnings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('jobs')} className="rounded-xl font-bold text-xs uppercase py-2.5">Jobs Completed</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Members Grid */}
          {loading ? (
            <SkeletonLoader type="workers" />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No workers found" description="Try broadening your search or skill filters." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filtered.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
