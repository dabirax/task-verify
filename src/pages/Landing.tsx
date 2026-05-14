import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Smartphone, 
  BrainCircuit, 
  Target, 
  CreditCard, 
  Banknote, 
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  BarChart3,
  Globe,
  Languages,
  Users,
  Briefcase,
  Building2,
  Handshake,
  Shield,
  Landmark,
  Store,
  Repeat,
  Radio,
  WifiOff,
  Hash,
  MapPin,
  Star,
  Clock,
  PieChart as PieChartIcon,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Progress } from '../components/ui/progress'
import { useTasks } from '../hooks/useTasks'
import { useWorkers } from '../hooks/useWorkers'
import { formatNaira, formatRating, getInitials } from '../utils/formatters'
import TaskCard from '../components/TaskCard'
import WorkerCard from '../components/WorkerCard'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 24)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const nodes = [
  { id: 'workers', label: 'Workers & Artisans', icon: Users, color: 'from-emerald-400 to-emerald-600', x: 50, y: 12, flows: ['Find verified jobs', 'Build trust ratings', 'Receive instant payment', 'Access micro-loans'] },
  { id: 'traders', label: 'Traders & SMEs', icon: Store, color: 'from-blue-400 to-blue-600', x: 85, y: 40, flows: ['Hire verified labor', 'Reach new customers', 'Build sales history', 'Access trade credit'] },
  { id: 'finance', label: 'Finance & Banks', icon: Landmark, color: 'from-violet-400 to-violet-600', x: 68, y: 80, flows: ['Alt-credit scoring', 'Savings products', 'Insurance policies', 'Micro-lending'] },
  { id: 'government', label: 'Government', icon: Building2, color: 'from-orange-400 to-orange-600', x: 18, y: 80, flows: ['Employment heatmaps', 'Sector insights', 'Tax formalization', 'Policy analytics'] },
  { id: 'ai', label: 'AI Core', icon: BrainCircuit, color: 'from-rose-400 to-pink-600', x: 8, y: 40, flows: ['Matching engine', 'Fraud detection', 'Demand prediction', 'Credit scoring'] },
]

export default function Landing() {
  const { tasks: services } = useTasks()
  const { workers } = useWorkers()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-emerald-50 opacity-60 blur-3xl translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-50 opacity-50 blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="page-container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
          <div>


            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-navy-900 leading-[1.05] tracking-tight mb-6">
              Powering Africa's<br />
              <span className="gradient-text">Informal Economy</span><br />
              with AI
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 leading-relaxed mb-8 max-w-lg font-medium">
              One ecosystem connecting work, trade, trust, and finance — built for 400 million Africans outside the formal economy.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-10">
              <Link to="/signup">
                <Button className="h-14 px-8 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-lg shadow-xl shadow-navy-100 group">
                  Get Started <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#ecosystem">
                <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-200 text-slate-600 font-bold text-lg">
                  Explore Ecosystem
                </Button>
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4">
              {[
                { label: 'Verified Workers', value: 98700, suffix: '+' },
                { label: 'Services Delivered', value: 47230, suffix: '+' },
                { label: 'Payments Paid (₦)', value: 7100, suffix: 'M' },
              ].map((s) => (
                <div key={s.label} className="border border-slate-100 rounded-[2rem] p-5 bg-white/60 backdrop-blur-sm shadow-sm">
                  <div className="text-2xl font-black text-navy-900">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="relative hidden lg:block h-[520px]">
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-blue-600 shadow-glow-emerald flex items-center justify-center z-10">
              <div className="text-center text-white">
                <ShieldCheck className="w-10 h-10 mb-1 mx-auto" />
                <div className="font-black text-[10px]">TASKVERIFY</div>
              </div>
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-dashed border-slate-200 animate-spin-slow" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-dashed border-slate-100" />
            
            {[
              { top: '8%', left: '60%', label: 'Amaka matched', sub: '92% fit · Cleaning' },
              { top: '32%', left: '72%', label: '₦25,000 escrowed', sub: 'Squad VA · Secured' },
              { top: '58%', left: '58%', label: 'Trust Score 920', sub: '40 jobs · 96% on-time' },
              { top: '75%', left: '70%', label: 'Loan approved', sub: '₦150K · Low risk' },
            ].map((card, i) => (
              <motion.div key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
                style={{ top: card.top, left: card.left }}
                className="absolute bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-4 min-w-[180px] z-20">
                <div className="text-sm font-black text-navy-900">{card.label}</div>
                <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{card.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM VISUALIZATION */}
      <section id="ecosystem" className="py-16 md:py-24 bg-slate-50 overflow-hidden">
        <div className="page-container">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-500 text-white rounded-full px-6 py-1.5 mb-6">The Operating System</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-navy-900 mb-6 leading-tight">One Network.<br /><span className="text-emerald-500">Many Possibilities.</span></h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Every actor in the informal economy — connected, verified, and empowered through a single intelligent layer.</p>
          </div>

          <div className="relative w-full" style={{ height: 600 }}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.map((node) => nodes.filter(n => n.id !== node.id).map(target => (
                <line key={`${node.id}-${target.id}`} x1={`${node.x}%`} y1={`${node.y}%`} x2={`${target.x}%`} y2={`${target.y}%`} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="8 4" opacity="0.4" />
              )))}
              {nodes.map(node => (
                <line key={`center-${node.id}`} x1="50%" y1="50%" x2={`${node.x}%`} y2={`${node.y}%`} stroke="#10b981" strokeWidth="2" strokeDasharray="5 5" opacity="0.2" />
              ))}
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center" style={{ width: 160 }}>
              <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-blue-600 shadow-glow-emerald mx-auto flex flex-col items-center justify-center mb-4 text-white">
                <ShieldCheck className="w-10 h-10 mb-1" />
                <div className="font-black text-[10px] tracking-widest">TASKVERIFY</div>
              </div>
            </div>

            {nodes.map((node, i) => (
              <motion.div key={node.id} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                className="absolute z-20 group cursor-pointer"
                style={{ top: `${node.y}%`, left: `${node.x}%`, transform: 'translate(-50%, -50%)' }}>
                <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${node.color} shadow-2xl shadow-navy-100 flex items-center justify-center text-white mb-3 transition-all group-hover:scale-110`}>
                  <node.icon className="w-8 h-8" />
                </div>
                <div className="text-center text-xs font-black text-navy-900 max-w-[120px] mx-auto leading-tight uppercase tracking-wider">{node.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES (TASKS) */}
      <section id="services" className="py-16 md:py-24 bg-white">
        <div className="page-container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div className="max-w-2xl">
              <Badge className="bg-blue-600 text-white rounded-full px-6 py-1.5 mb-6">Service Marketplace</Badge>
              <h2 className="text-4xl md:text-5xl font-black text-navy-900 mb-6 leading-tight">Verified opportunities<br />for every skilled artisan</h2>
              <p className="text-slate-500 text-lg font-medium">Real-time matching with secured payments. No middle-men, no risks.</p>
            </div>
            <Link to="/signup">
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-200 text-navy-900 font-black uppercase tracking-widest">Post a Service <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 3).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </section>

      {/* WORKERS */}
      <section id="workers" className="py-16 md:py-24 bg-slate-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <Badge className="bg-violet-600 text-white rounded-full px-6 py-1.5 mb-6">Verified Talent</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-navy-900 mb-6">Africa's most reliable workforce</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Every worker is vetted by AI, verified by documents, and rated by their community.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workers.slice(0, 4).map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </div>
      </section>

      {/* ANALYTICS SHOWCASE (For landing) */}
      <section id="analytics" className="py-16 md:py-24 bg-navy-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>
        <div className="page-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 px-6 py-1.5 mb-6 uppercase tracking-widest font-black">AI & Sector Analytics</Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Insight into the<br /><span className="text-emerald-400">Invisible Economy</span></h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
                We capture data that was previously lost. For the first time, see real-time employment rates, sector growth, and economic health across Africa's informal markets.
              </p>
              <div className="space-y-6">
                {[
                  { label: 'Demand Prediction Accuracy', value: 94 },
                  { label: 'Skill Match Confidence', value: 88 },
                  { label: 'Fraud Detection Rate', value: 99.8 },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-300">
                      <span>{item.label}</span>
                      <span className="text-emerald-400">{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-2 bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-black text-xl">Market Velocity</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Inference</div>
                  </div>
               </div>
               <div className="space-y-4">
                 {[
                   { action: 'Worker Match', worker: 'Amaka O.', task: 'Office Cleaning', score: 92, ts: '2 min ago' },
                   { action: 'Credit Score', worker: 'Emeka N.', result: '724 — Good', ts: '8 min ago' },
                   { action: 'Fraud Guard', worker: 'System', result: 'Low risk (12/100)', ts: '15 min ago' },
                 ].map((log, i) => (
                   <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <BrainCircuit className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-xs font-bold">{log.action}: {log.worker}</div>
                          <div className="text-[10px] text-slate-500">{log.result || log.task}</div>
                        </div>
                     </div>
                     <div className="text-[9px] font-bold text-slate-600 uppercase">{log.ts}</div>
                   </div>
                 ))}
               </div>
               <Button className="w-full mt-8 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest">Access Full API</Button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-24 bg-white">
        <div className="page-container text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-navy-900 mb-8 leading-tight tracking-tight">
            Ready to formalize Africa's<br /><span className="gradient-text">informal billions?</span>
          </motion.h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup">
              <Button className="h-16 px-10 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-black text-xl shadow-2xl shadow-navy-200">
                Join as Worker
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" className="h-16 px-10 rounded-2xl border-2 border-slate-200 text-slate-600 font-black text-xl hover:bg-slate-50">
                Post a Service
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
