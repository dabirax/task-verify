import { motion } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  employmentByRegion, topSkillsDemand, earningsTrend, loanRepaymentHealth,
  informalSectorGrowth, kpiMetrics,
} from '../utils/analyticsData'
import { formatNumber } from '../utils/formatters'

const KPI_CARDS = [
  { label: 'Total Workers', value: kpiMetrics.totalWorkers, suffix: '+', icon: '👷', color: 'from-emerald-400 to-emerald-600' },
  { label: 'Active Tasks', value: kpiMetrics.activeTasks, suffix: '', icon: '📋', color: 'from-blue-400 to-blue-600' },
  { label: 'Total Paid Out', value: '₦7.1B', suffix: '', icon: '💸', color: 'from-violet-400 to-violet-600', raw: true },
  { label: 'AI Match Accuracy', value: kpiMetrics.aiMatchAccuracy, suffix: '%', icon: '🤖', color: 'from-orange-400 to-orange-600' },
  { label: 'Loans Disbursed', value: '₦2.3B', suffix: '', icon: '🏦', color: 'from-teal-400 to-teal-600', raw: true },
  { label: 'Formalization Rate', value: kpiMetrics.formalizationRate, suffix: '%', icon: '📄', color: 'from-pink-400 to-pink-600' },
]

export default function Analytics() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-slate-900 to-navy-900 text-white">
        <div className="page-container">
          <span className="badge bg-white/10 border border-white/20 text-white mb-4">National Insights</span>
          <h1 className="text-5xl font-black mb-2 leading-tight">Economic Intelligence<br /><span className="text-emerald-400">Dashboard</span></h1>
          <p className="text-slate-400 text-lg">Real-time pulse of Africa's informal economy — employment, earnings, credit, and growth.</p>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="page-container grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {KPI_CARDS.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="card p-4 text-center">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-xl mx-auto mb-3`}>{kpi.icon}</div>
              <div className="text-2xl font-black text-navy-900">
                {kpi.raw ? kpi.value : `${formatNumber(kpi.value as number)}${kpi.suffix}`}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">{kpi.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="page-container grid lg:grid-cols-2 gap-8">
          {/* Employment by Region */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="card p-6">
            <h3 className="font-bold text-navy-900 mb-1">Employment by Region</h3>
            <p className="text-xs text-slate-400 mb-5">Workers and active jobs per city</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employmentByRegion} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
                <YAxis dataKey="region" type="category" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: any) => [formatNumber(Number(v))]} />
                <Bar dataKey="workers" name="Workers" fill="#10B981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="jobs" name="Jobs" fill="#2563EB" radius={[0, 4, 4, 0]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Earnings Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="card p-6">
            <h3 className="font-bold text-navy-900 mb-1">Average Monthly Earnings Trend</h3>
            <p className="text-xs text-slate-400 mb-5">Worker income growth over 12 months</p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={earningsTrend}>
                <defs>
                  <linearGradient id="earningGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${v / 1000}K`} />
                <Tooltip formatter={(v: unknown) => [`₦${Number(v).toLocaleString()}`, 'Avg Earnings']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="avgEarnings" stroke="#10B981" strokeWidth={2.5} fill="url(#earningGrad)" dot={{ fill: '#10B981', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Skills */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
            className="card p-6">
            <h3 className="font-bold text-navy-900 mb-1">Top Skills Demanded</h3>
            <p className="text-xs text-slate-400 mb-5">Market demand vs available supply</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topSkillsDemand}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="skill" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: unknown) => [formatNumber(Number(v))]} />
                <Bar dataKey="demand" name="Demand" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="supply" name="Supply" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Loan Repayment Health */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="card p-6">
            <h3 className="font-bold text-navy-900 mb-1">Loan Repayment Health</h3>
            <p className="text-xs text-slate-400 mb-5">Portfolio quality across all active borrowers</p>
            <div className="flex gap-6 items-center">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={loanRepaymentHealth} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3}>
                    {loanRepaymentHealth.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: unknown) => [`${v}%`]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 flex flex-col gap-3">
                {loanRepaymentHealth.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: entry.color }} />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600 font-medium">{entry.name}</span>
                        <span className="font-bold text-navy-900">{entry.value}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Informal Sector Growth */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="card p-6 lg:col-span-2">
            <h3 className="font-bold text-navy-900 mb-1">Informal Sector Formalization Growth</h3>
            <p className="text-xs text-slate-400 mb-5">Registered, active users and formally transacting workers over time</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={informalSectorGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: unknown) => [formatNumber(Number(v))]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="registered" name="Registered" stroke="#0A1628" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="active" name="Active" stroke="#10B981" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="formalized" name="Formalized" stroke="#2563EB" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
