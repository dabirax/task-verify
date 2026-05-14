import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { api } from '../services/api'
import type { FinancialProfile, WorkerStats } from '../types'
import { formatNaira } from '../utils/formatters'
import { FullPageLoader } from '../components/SkeletonLoader'
import { useApp } from '../context/AppContext'

const WORKER_ID = 1

const earningsMock = [
  { month: 'Jul', earnings: 18000 }, { month: 'Aug', earnings: 22000 },
  { month: 'Sep', earnings: 19500 }, { month: 'Oct', earnings: 28000 },
  { month: 'Nov', earnings: 31000 }, { month: 'Dec', earnings: 32000 },
]

const riskColors: Record<string, { bg: string; text: string; bar: string }> = {
  low: { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-500' },
  high: { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500' },
}

function CreditGauge({ score }: { score: number }) {
  const pct = Math.min(score / 850, 1)
  const color = score >= 700 ? '#10B981' : score >= 580 ? '#F59E0B' : '#EF4444'
  const label = score >= 750 ? 'Excellent' : score >= 700 ? 'Good' : score >= 580 ? 'Fair' : 'Poor'

  return (
    <div className="relative w-48 h-28 mx-auto">
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
        <motion.path
          d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${pct * 251} 251`}
          initial={{ strokeDasharray: '0 251' }}
          animate={{ strokeDasharray: `${pct * 251} 251` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <text x="100" y="100" textAnchor="middle" fontSize="28" fontWeight="900" fill="#0A1628">{score}</text>
        <text x="100" y="116" textAnchor="middle" fontSize="11" fill={color} fontWeight="600">{label}</text>
      </svg>
    </div>
  )
}

export default function Finance() {
  const { addToast } = useApp()
  const [profile, setProfile] = useState<FinancialProfile | null>(null)
  const [stats, setStats] = useState<WorkerStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.getWorkerFinancialProfile(WORKER_ID).catch(() => null),
      api.getWorkerStats(WORKER_ID).catch(() => null),
    ]).then(([fp, ws]) => {
      setProfile(fp as FinancialProfile | null)
      setStats(ws as WorkerStats | null)
      if (!fp) addToast('Using simulated financial data — API warming up.', 'info')
    }).finally(() => setLoading(false))
  }, [])

  // Fallback data
  const creditScore = profile?.credit_score ?? 724
  const loanEligible = profile?.loan_eligibility ?? true
  const recommendedLoan = profile?.recommended_loan ?? 150000
  const riskLevel = (profile?.insurance_risk_level ?? 'low').toLowerCase()
  const risk = riskColors[riskLevel] ?? riskColors.low
  const walletBalance = stats?.current_month_earnings ?? 32000
  const totalEarnings = stats?.total_earnings ?? 180000
  const onTimeRate = stats?.on_time_rate ?? 0.96

  if (loading) return <FullPageLoader />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <section className="pt-16 pb-12 bg-gradient-to-br from-violet-950 via-navy-900 to-blue-950 text-white">
        <div className="page-container">
          <span className="badge bg-white/10 border border-white/20 text-white mb-4">AI Finance Dashboard</span>
          <h1 className="text-5xl font-black mb-2 leading-tight">Your Economic<br /><span className="text-emerald-400">Financial Identity</span></h1>
          <p className="text-slate-400 text-lg">Alternative credit scoring powered by your real work history — not bank statements.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="page-container grid lg:grid-cols-3 gap-6">
          {/* Credit Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card p-6 lg:col-span-1 text-center">
            <h2 className="font-bold text-navy-900 mb-1">Credit Score</h2>
            <p className="text-xs text-slate-400 mb-4">Alternative data-driven scoring</p>
            <CreditGauge score={creditScore} />
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              {[
                { label: 'Work Consistency', pct: 94 },
                { label: 'Payment History', pct: 98 },
                { label: 'Dispute Rate', pct: 100 },
                { label: 'Income Frequency', pct: 88 },
              ].map((factor) => (
                <div key={factor.label} className="text-left">
                  <div className="flex justify-between mb-1 text-[10px] font-medium text-slate-500">
                    <span>{factor.label}</span><span>{factor.pct}%</span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${factor.pct}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Top Row */}
            <div className="grid sm:grid-cols-3 gap-4">
              {/* Wallet */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="card p-5 sm:col-span-1 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <div className="text-xs font-medium opacity-80 mb-1">Wallet Balance</div>
                <div className="text-3xl font-black mb-1">{formatNaira(walletBalance)}</div>
                <div className="text-xs opacity-70">This month's earnings</div>
                <div className="mt-3 text-xs font-medium opacity-80">Total: {formatNaira(totalEarnings)}</div>
              </motion.div>

              {/* Loan Eligibility */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className={`card p-5 ${loanEligible ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                <div className="text-xs font-medium text-slate-500 mb-1">Loan Eligibility</div>
                <div className={`text-2xl font-black mb-1 ${loanEligible ? 'text-emerald-600' : 'text-red-600'}`}>
                  {loanEligible ? '✅ Eligible' : '❌ Not Yet'}
                </div>
                {loanEligible && (
                  <>
                    <div className="text-xs text-slate-500 mb-2">Recommended amount</div>
                    <div className="text-xl font-bold text-navy-900">{formatNaira(recommendedLoan)}</div>
                  </>
                )}
              </motion.div>

              {/* Insurance Risk */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className={`card p-5 ${risk.bg}`}>
                <div className="text-xs font-medium text-slate-500 mb-1">Insurance Risk</div>
                <div className={`text-2xl font-black capitalize mb-2 ${risk.text}`}>{riskLevel} Risk</div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                  <div className={`h-full ${risk.bar} rounded-full`}
                    style={{ width: riskLevel === 'low' ? '25%' : riskLevel === 'medium' ? '60%' : '90%' }} />
                </div>
                <div className="text-xs text-slate-400 mt-2">{riskLevel === 'low' ? 'Premium eligibility' : 'Standard coverage'}</div>
              </motion.div>
            </div>

            {/* Earnings Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="card p-6 flex-1">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-navy-900">Income Trend</h3>
                  <p className="text-xs text-slate-400">Monthly earnings (₦)</p>
                </div>
                <div className="badge bg-emerald-100 text-emerald-700">+42% growth</div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={earningsMock}>
                  <defs>
                    <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${v / 1000}K`} />
                  <Tooltip formatter={(v: unknown) => [`₦${Number(v).toLocaleString()}`, 'Earnings']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Area type="monotone" dataKey="earnings" stroke="#10B981" strokeWidth={2.5} fill="url(#earnGrad)" dot={{ fill: '#10B981', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Performance Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="card p-6 lg:col-span-3">
            <h3 className="font-bold text-navy-900 mb-4">Credit Factors — How Your Score Is Calculated</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'On-Time Rate', value: `${Math.round(onTimeRate * 100)}%`, icon: '⏱️', desc: 'Tasks completed on schedule' },
                { label: 'Tasks Completed', value: stats?.tasks_completed ?? 42, icon: '✅', desc: 'Total verified deliveries' },
                { label: 'Avg Rating', value: `${(stats?.avg_rating ?? 4.8).toFixed(1)}★`, icon: '⭐', desc: 'Customer satisfaction score' },
                { label: 'Dispute Rate', value: '0%', icon: '🛡️', desc: 'Clean transaction history' },
              ].map((metric) => (
                <div key={metric.label} className="flex items-start gap-3">
                  <span className="text-2xl">{metric.icon}</span>
                  <div>
                    <div className="text-2xl font-black text-navy-900">{metric.value}</div>
                    <div className="text-sm font-semibold text-navy-900">{metric.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{metric.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Loan CTA */}
          {loanEligible && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="card p-6 lg:col-span-3 bg-gradient-to-r from-navy-900 to-blue-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="text-2xl font-black mb-1">You qualify for {formatNaira(recommendedLoan)} loan 🎉</div>
                <p className="text-slate-300 text-sm">Based on your work history, trust score, and income consistency. No bank statement needed.</p>
              </div>
              <button className="flex-shrink-0 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all whitespace-nowrap">
                Apply Now →
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </motion.div>
  )
}
