import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Briefcase, 
  AlertTriangle, 
  Scale, 
  ShieldCheck, 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  FileCheck, 
  Activity,
  ChevronRight,
  MapPin,
  Clock,
  Zap,
  LayoutDashboard,
  ShieldAlert,
  Terminal
} from 'lucide-react'
import { useWorkers } from '../hooks/useWorkers'
import { useTasks } from '../hooks/useTasks'
import { 
  useAdminDashboard, 
  useAdminTasks, 
  useAdminWorkers, 
  useAdminKYCSubmissions, 
  useAdminAILogs 
} from '../hooks/useAdminQueries'
import { formatNaira, formatDate, statusConfig, getInitials } from '../utils/formatters'
import { kpiMetrics } from '../utils/analyticsData'
import { useApp } from '../context/AppContext'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Progress } from '../components/ui/progress'

const riskBadge: Record<string, string> = {
  high: 'bg-red-50 text-red-700 border-red-100',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
}

export default function Admin() {
  const { addToast } = useApp()
  const { data: dashboardStats, isLoading: loadingStats } = useAdminDashboard()
  const { data: adminTasks, isLoading: loadingTasks } = useAdminTasks({ limit: 10 })
  const { data: adminWorkers, isLoading: loadingWorkers } = useAdminWorkers()
  const { data: kycSubmissions, isLoading: loadingKYC } = useAdminKYCSubmissions('pending')
  const { data: aiLogs, isLoading: loadingLogs } = useAdminAILogs(10)
  
  const [activeTab, setActiveTab] = useState('overview')

  const isLoading = loadingStats || loadingTasks || loadingWorkers || loadingKYC || loadingLogs

  if (isLoading) {
    return <div className="p-10 text-center font-black text-slate-400 uppercase tracking-widest">Loading Platform Intelligence...</div>
  }

  const stats = [
    { label: 'Total Workers', value: dashboardStats?.total_workers || 0, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+12%' },
    { label: 'Open Services', value: dashboardStats?.open_tasks || 0, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+5%' },
    { label: 'Flagged Actions', value: dashboardStats?.flagged_tasks || 0, icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50', trend: 'Action needed' },
    { label: 'Disputed Services', value: dashboardStats?.disputed_tasks || 0, icon: Scale, color: 'text-orange-500', bg: 'bg-orange-50', trend: 'Review queue' },
  ]

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="page-container">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-navy-900 tracking-tight leading-tight mb-2">
            Platform Administration
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Monitor ecosystem health, verify participants, and manage system-wide intelligence.
          </p>
        </div>

        <div className="space-y-10">
          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((kpi, i) => (
              <Card key={kpi.label} className="border-none shadow-xl shadow-navy-100/20 rounded-[2rem] overflow-hidden h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                      <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">{kpi.trend}</span>
                  </div>
                  <div className="text-3xl font-black text-navy-900 tracking-tight">{kpi.value}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{kpi.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white p-1 rounded-2xl shadow-xl shadow-navy-100/30 mb-10 h-12 w-full max-w-xl mx-auto flex overflow-hidden">
              <TabsTrigger value="overview" className="flex-1 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] data-[state=active]:bg-navy-900 data-[state=active]:text-white transition-all">
                Overview
              </TabsTrigger>
              <TabsTrigger value="verify" className="flex-1 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] data-[state=active]:bg-navy-900 data-[state=active]:text-white transition-all">
                Verify
              </TabsTrigger>
              <TabsTrigger value="disputes" className="flex-1 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] data-[state=active]:bg-navy-900 data-[state=active]:text-white transition-all">
                Disputes
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex-1 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] data-[state=active]:bg-navy-900 data-[state=active]:text-white transition-all">
                AI Logs
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="overview">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="border-none shadow-2xl shadow-navy-100/40 rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                      <CardTitle className="font-black text-navy-900 text-xl tracking-tight flex items-center gap-3">
                        <Briefcase className="w-6 h-6 text-blue-500" /> Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-2">
                      {adminTasks?.slice(0, 6).map((t: any) => {
                        const sc = statusConfig[t.status] ?? { label: t.status, bg: 'bg-slate-100', text: 'text-slate-600' }
                        return (
                          <div key={t.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 group cursor-pointer hover:px-2 transition-all">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-black text-navy-900 group-hover:text-blue-600 transition-colors">{t.title}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <MapPin className="w-3 h-3 text-slate-300" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.task_location} · {formatNaira(t.amount_naira)}</span>
                              </div>
                            </div>
                            <Badge className={`${sc.bg} ${sc.text} border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5`}>{sc.label}</Badge>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-2xl shadow-navy-100/40 rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                      <CardTitle className="font-black text-navy-900 text-xl tracking-tight flex items-center gap-3">
                        <Users className="w-6 h-6 text-emerald-500" /> Worker Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-2">
                      {adminWorkers?.slice(0, 6).map((w: any) => (
                        <div key={w.id} className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0 group cursor-pointer hover:px-2 transition-all">
                          <Avatar className="w-10 h-10 rounded-xl border-2 border-slate-50">
                            <AvatarFallback className="bg-emerald-50 text-emerald-700 font-black text-xs">{getInitials(w.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-black text-navy-900 group-hover:text-emerald-600 transition-colors">{w.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score: {w.trust_score} · {w.primary_location}</span>
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${w.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="verify">
                <Card className="border-none shadow-2xl shadow-navy-100/40 rounded-[2.5rem] bg-white overflow-hidden">
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                      {kycSubmissions?.map((item: any) => (
                        <div key={item.id} className="p-8 flex items-center gap-6 hover:bg-slate-50/50 transition-colors">
                          <Avatar className="w-14 h-14 rounded-2xl border-2 border-slate-100">
                            <AvatarFallback className="bg-blue-50 text-blue-700 font-black text-lg">{getInitials(item.worker_name || 'User')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-navy-900 text-lg mb-1">{item.worker_name || 'Worker'}</div>
                            <div className="flex items-center gap-3 text-slate-400">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{item.city}, {item.state} · Submitted {formatDate(item.submitted_at)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex gap-2">
                              <Button size="icon" className="w-11 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => addToast(`Review initiated`, 'info')}>
                                <CheckCircle2 className="w-5 h-5" />
                              </Button>
                              <Button size="icon" variant="outline" className="w-11 h-11 rounded-xl border-red-200 text-red-600 hover:bg-red-50" onClick={() => addToast(`Review initiated`, 'info')}>
                                <XCircle className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {kycSubmissions?.length === 0 && (
                        <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No pending KYC submissions</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="disputes">
                <Card className="border-none shadow-2xl shadow-navy-100/40 rounded-[2.5rem] bg-white overflow-hidden">
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                      {adminTasks?.filter((t: any) => ['disputed', 'flagged_for_dispute'].includes(t.status)).map((item: any) => (
                        <div key={item.id} className="p-8 flex items-center gap-6 hover:bg-slate-50/50 transition-colors">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-red-50 text-red-700 border-red-100 border`}>
                            <AlertTriangle className="w-7 h-7" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-navy-900 text-lg">Task #{item.id}: {item.title}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: {item.status} · Amount: {formatNaira(item.amount_naira)}</div>
                          </div>
                          <Button className="h-12 px-6 rounded-2xl bg-navy-900 text-white font-black text-xs uppercase tracking-widest shadow-lg" onClick={() => addToast(`Opening dispute case...`, 'info')}>
                            Review
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai">
                <Card className="border-none shadow-2xl shadow-navy-100/40 rounded-[2.5rem] bg-slate-900 text-white overflow-hidden">
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                      {aiLogs?.map((log: any) => (
                        <div key={log.id} className="p-8 flex items-center gap-6 hover:bg-white/5 transition-colors group">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                            <BrainCircuit className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-white text-lg leading-tight mb-1">{log.event_type}</div>
                            <div className="text-[11px] text-slate-400 font-medium">Task ID: {log.task_id} | Result: {log.decision_synthesis}</div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-white/10 text-white/60 border-none font-black text-[8px] uppercase tracking-widest">GEMINI-3-FLASH</Badge>
                            <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">{new Date(log.created_at).toLocaleTimeString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
