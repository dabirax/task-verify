import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWorkers } from '../hooks/useWorkers'
import { useTasks } from '../hooks/useTasks'
import { formatNaira, formatDate, statusConfig, getInitials } from '../utils/formatters'
import { kpiMetrics } from '../utils/analyticsData'
import { useApp } from '../context/AppContext'

const AI_LOGS = [
  { id: 1, action: 'Worker Match', worker: 'Amaka Okafor', task: 'Office Cleaning', score: 92, model: 'gemini-flash', ts: '2 min ago' },
  { id: 2, action: 'Credit Score', worker: 'Emeka Nwosu', result: '724 — Good', model: 'alt-credit-v2', ts: '8 min ago' },
  { id: 3, action: 'Fraud Detection', worker: 'Unknown', result: 'Low risk (12/100)', model: 'fraud-guard', ts: '15 min ago' },
  { id: 4, action: 'Proof Verification', worker: 'Fatima Abubakar', task: 'Delivery Run', score: 88, model: 'gemini-flash', ts: '22 min ago' },
  { id: 5, action: 'Dispute Analysis', worker: 'Chidi Uchenna', result: 'Resolved — Worker favored', model: 'dispute-ai', ts: '1h ago' },
]

const FLAGGED = [
  { id: 101, type: 'Suspicious Proof', worker: 'User #1042', amount: 45000, status: 'Under Review', risk: 'high' },
  { id: 102, type: 'Double Application', worker: 'User #2187', amount: 18000, status: 'Pending', risk: 'medium' },
  { id: 103, type: 'Location Mismatch', worker: 'User #0934', amount: 32000, status: 'Resolved', risk: 'low' },
]

const VERIFY_QUEUE = [
  { id: 1, name: 'Ngozi Kalu', location: 'Aba, Abia', skills: ['Tailoring', 'Sewing'], joined: '2025-12-08', docs: 'Submitted' },
  { id: 2, name: 'Ibrahim Musa', location: 'Kano', skills: ['Welding', 'Fabrication'], joined: '2025-12-09', docs: 'Pending' },
  { id: 3, name: 'Blessing Obi', location: 'Benin City', skills: ['Cleaning', 'Catering'], joined: '2025-12-10', docs: 'Submitted' },
]

const riskBadge: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-emerald-100 text-emerald-700',
}

export default function Admin() {
  const { addToast } = useApp()
  const { workers } = useWorkers()
  const { tasks } = useTasks()
  const [activeTab, setActiveTab] = useState<'overview' | 'verify' | 'disputes' | 'ai'>('overview')

  const openTasks = tasks.filter((t) => t.status === 'posted').length
  const disputedTasks = tasks.filter((t) => ['disputed', 'complaint_filed', 'flagged_for_dispute'].includes(t.status)).length
  const totalWorkers = workers.length || kpiMetrics.totalWorkers

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <section className="pt-16 pb-10 bg-gradient-to-b from-navy-950 to-navy-900 text-white">
        <div className="page-container">
          <span className="badge bg-red-500/20 border border-red-400/30 text-red-300 mb-4">Admin Console</span>
          <h1 className="text-4xl font-black mb-2">Ecosystem Control<br /><span className="text-emerald-400">Center</span></h1>
          <p className="text-slate-400">Verify accounts, resolve disputes, monitor AI decisions, and track ecosystem KPIs.</p>
        </div>
      </section>

      {/* KPI Row */}
      <section className="bg-white border-b border-slate-100 py-6">
        <div className="page-container grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Workers', value: totalWorkers.toLocaleString(), icon: '👷', trend: '+12%' },
            { label: 'Open Tasks', value: openTasks || 12, icon: '📋', trend: '+5%' },
            { label: 'Flagged Transactions', value: FLAGGED.filter((f) => f.status !== 'Resolved').length, icon: '🚨', trend: 'Action needed' },
            { label: 'Disputed Tasks', value: disputedTasks || 3, icon: '⚖️', trend: 'Review queue' },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{kpi.icon}</span>
                <span className="text-xs text-slate-400 font-medium">{kpi.trend}</span>
              </div>
              <div className="text-2xl font-black text-navy-900">{kpi.value}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">{kpi.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-slate-100 sticky top-16 z-30">
        <div className="page-container">
          <div className="flex gap-1 py-3 overflow-x-auto scrollbar-hide">
            {(['overview', 'verify', 'disputes', 'ai'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap capitalize ${activeTab === tab ? 'bg-navy-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                {tab === 'ai' ? 'AI Decision Logs' : tab === 'verify' ? 'Verify Accounts' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="page-container">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                <h3 className="font-bold text-navy-900 mb-4">Recent Tasks</h3>
                <div className="space-y-3">
                  {tasks.slice(0, 6).map((t) => {
                    const sc = statusConfig[t.status] ?? { label: t.status, bg: 'bg-slate-100', text: 'text-slate-600' }
                    return (
                      <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-navy-900 truncate">{t.title}</div>
                          <div className="text-xs text-slate-400">{t.task_location} · {formatNaira(t.amount_naira)}</div>
                        </div>
                        <span className={`badge ml-3 flex-shrink-0 ${sc.bg} ${sc.text}`}>{sc.label}</span>
                      </div>
                    )
                  })}
                  {tasks.length === 0 && <p className="text-sm text-slate-400 text-center py-6">Fetching tasks from API…</p>}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
                <h3 className="font-bold text-navy-900 mb-4">Worker Overview</h3>
                <div className="space-y-3">
                  {workers.slice(0, 6).map((w) => (
                    <div key={w.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {getInitials(w.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-navy-900 truncate">{w.name}</div>
                        <div className="text-xs text-slate-400">{w.primary_location} · Score: {w.trust_score}</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${w.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </div>
                  ))}
                  {workers.length === 0 && <p className="text-sm text-slate-400 text-center py-6">Fetching workers from API…</p>}
                </div>
              </motion.div>
            </div>
          )}

          {/* VERIFY ACCOUNTS */}
          {activeTab === 'verify' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-navy-900">Account Verification Queue</h3>
                <span className="badge bg-yellow-100 text-yellow-700">{VERIFY_QUEUE.filter(q => q.docs === 'Submitted').length} pending</span>
              </div>
              <div className="divide-y divide-slate-50">
                {VERIFY_QUEUE.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                    className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {getInitials(item.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-navy-900 text-sm">{item.name}</div>
                      <div className="text-xs text-slate-400">{item.location} · Joined {formatDate(item.joined)}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.skills.map((s) => <span key={s} className="badge bg-slate-100 text-slate-600 text-[10px]">{s}</span>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`badge text-xs ${item.docs === 'Submitted' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                        Docs: {item.docs}
                      </span>
                      {item.docs === 'Submitted' && (
                        <>
                          <button onClick={() => addToast(`${item.name} verified successfully!`, 'success')}
                            className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 transition-colors">
                            Approve
                          </button>
                          <button onClick={() => addToast(`${item.name} verification rejected.`, 'error')}
                            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors">
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* DISPUTES */}
          {activeTab === 'disputes' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-navy-900">Flagged Transactions</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {FLAGGED.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                    className="px-6 py-4 flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-navy-900 text-sm">#{item.id} — {item.type}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.worker} · {formatNaira(item.amount)}</div>
                    </div>
                    <span className={`badge text-xs ${riskBadge[item.risk]}`}>
                      {item.risk.charAt(0).toUpperCase() + item.risk.slice(1)} Risk
                    </span>
                    <span className={`badge text-xs ${item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.status}
                    </span>
                    {item.status !== 'Resolved' && (
                      <button onClick={() => addToast(`Dispute #${item.id} resolved.`, 'success')}
                        className="px-3 py-1.5 bg-navy-900 text-white rounded-lg text-xs font-semibold hover:bg-navy-800 transition-colors">
                        Resolve
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AI LOGS */}
          {activeTab === 'ai' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-navy-900">AI Decision Synthesis Logs</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {AI_LOGS.map((log, i) => (
                  <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
                    className="px-6 py-4 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">AI</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-navy-900 text-sm">{log.action}</div>
                      <div className="text-xs text-slate-400">
                        {log.worker}{log.task ? ` → "${log.task}"` : ''}
                        {log.score !== undefined ? ` · Confidence: ${log.score}%` : ''}
                        {log.result ? ` · ${log.result}` : ''}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="badge bg-violet-100 text-violet-700 text-[10px]">{log.model}</span>
                      <span className="text-[10px] text-slate-400">{log.ts}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </motion.div>
  )
}
