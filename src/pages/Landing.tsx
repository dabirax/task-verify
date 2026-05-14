import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'

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

const steps = [
  { icon: '📱', title: 'Phone / USSD Onboarding', desc: 'Register with any phone — smartphone or basic. No data required.' },
  { icon: '🧠', title: 'AI Builds Economic Identity', desc: 'Your skills, location and history create a dynamic economic profile.' },
  { icon: '🎯', title: 'Matched to Jobs & Services', desc: 'Intelligent matching based on skills, proximity and reliability score.' },
  { icon: '💳', title: 'Payments Build Trust History', desc: 'Every Squad-powered payment adds to your verifiable economic record.' },
  { icon: '🏦', title: 'Trust Unlocks Credit & Insurance', desc: 'Alternative credit scoring opens access to loans and insurance products.' },
  { icon: '📈', title: 'Economy Graph Improves', desc: 'More activity feeds AI models — better matches, better outcomes for all.' },
]

const scaleStages = [
  { stage: 'Pilot', users: '10,000 users', detail: '3 cities · Core features', color: 'from-emerald-400 to-emerald-600' },
  { stage: 'City Rollout', users: '250K users', detail: '12 states · Full feature set', color: 'from-blue-400 to-blue-600' },
  { stage: 'National', users: '5M users', detail: 'All 36 states · Analytics SaaS', color: 'from-violet-400 to-violet-600' },
  { stage: 'Pan-African API', users: '20M+ users', detail: 'Multi-country · B2B platform', color: 'from-orange-400 to-orange-600' },
]

const revenueCards = [
  { icon: '💸', title: 'Transaction Fees', desc: '0.5–1.5% on every escrow payment processed through Squad.' },
  { icon: '🏢', title: 'SME Subscriptions', desc: 'Monthly plans for businesses posting tasks and hiring workers.' },
  { icon: '🤝', title: 'Credit Referral Revenue', desc: 'Commission on loans disbursed via partner banks.' },
  { icon: '🛡️', title: 'Insurance Commissions', desc: 'Referral fees from insurance products sold to workers.' },
  { icon: '🏛️', title: 'Government Analytics SaaS', desc: 'Employment dashboards and sector data sold to agencies.' },
]

const floatingCards = [
  { top: '8%', left: '60%', label: 'Amaka matched', sub: '92% fit · Cleaning', color: 'emerald' },
  { top: '32%', left: '72%', label: '₦25,000 escrowed', sub: 'Squad VA · Secured', color: 'blue' },
  { top: '58%', left: '58%', label: 'Trust Score 920', sub: '40 jobs · 96% on-time', color: 'violet' },
  { top: '75%', left: '70%', label: 'Loan approved', sub: '₦150K · Low risk', color: 'orange' },
]

export default function Landing() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-white">
        {/* BG Gradient Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-emerald-50 opacity-60 blur-3xl translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-50 opacity-50 blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="page-container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Africa's National Economic Operating System
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-navy-900 leading-[1.05] tracking-tight mb-6">
              Powering Africa's<br />
              <span className="gradient-text">Informal Economy</span><br />
              with AI
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-xl text-slate-500 leading-relaxed mb-8 max-w-lg">
              One ecosystem connecting work, trade, trust, and finance — built for 400 million Africans outside the formal economy.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 mb-10">
              <Link to="/ecosystem" className="btn-primary px-8 py-3.5 text-base">
                Explore Platform →
              </Link>
              <Link to="/analytics" className="btn-secondary px-8 py-3.5 text-base">
                Live Dashboard
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4">
              {[
                { label: 'Workers Onboarded', value: 98700, suffix: '+' },
                { label: 'Tasks Completed', value: 47230, suffix: '+' },
                { label: 'Paid Out (₦M)', value: 7100, suffix: 'M' },
              ].map((s) => (
                <div key={s.label} className="border border-slate-100 rounded-2xl p-4 bg-white/60">
                  <div className="text-2xl font-black text-navy-900">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Visual */}
          <div className="relative hidden lg:block h-[520px]">
            {/* Central Hub */}
            <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-blue-600 shadow-glow-emerald flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-white font-black text-sm">TASK</div>
                <div className="text-white/80 font-bold text-xs">VERIFY</div>
              </div>
            </motion.div>
            {/* Orbit Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-dashed border-slate-200 animate-spin-slow" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-dashed border-slate-100" />
            {/* Floating Cards */}
            {floatingCards.map((card, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                transition={{ delay: 0.3 + i * 0.15, y: { duration: 3 + i, repeat: Infinity, ease: 'easeInOut' } }}
                style={{ top: card.top, left: card.left }}
                className="absolute bg-white rounded-2xl shadow-card border border-slate-100 px-4 py-3 min-w-[160px] z-20">
                <div className="text-sm font-semibold text-navy-900">{card.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{card.sub}</div>
              </motion.div>
            ))}
            {/* Node dots */}
            {[
              { top: '15%', left: '20%', label: 'Worker' },
              { top: '70%', left: '15%', label: 'Trader' },
              { top: '80%', left: '55%', label: 'Bank' },
              { top: '20%', left: '75%', label: 'SME' },
            ].map((node, i) => (
              <motion.div key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                style={{ top: node.top, left: node.left }}
                className="absolute flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-glow-emerald" />
                <span className="text-[10px] text-slate-400 font-medium">{node.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-slate-100 bg-slate-50 py-5">
        <div className="page-container flex flex-wrap gap-6 items-center justify-center text-sm text-slate-500">
          {['Squad Escrow Payments', 'Gemini AI Matching', 'Alternative Credit Scoring', 'USSD Onboarding', 'Offline-First Sync', 'Multi-Language Support'].map((f) => (
            <div key={f} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="font-medium">{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24">
        <div className="page-container">
          <div className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="badge bg-navy-50 text-navy-700 border border-navy-100 mb-4">How It Works</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="section-heading mb-4">Six steps from invisible<br />to economically empowered</motion.h2>
            <p className="section-subheading max-w-xl mx-auto">A complete journey from informal worker to creditworthy, insurable, economically active citizen.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-4">{step.icon}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-400">STEP {i + 1}</span>
                </div>
                <h3 className="font-bold text-navy-900 text-lg mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM PREVIEW */}
      <section className="py-24 bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="page-container relative z-10 text-center">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="badge bg-white/10 text-white border border-white/20 mb-6">The Operating System</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            This is not a job board.<br />
            <span className="text-emerald-400">This is not a gig marketplace.</span>
          </motion.h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10">
            TaskVerify is a <strong className="text-white">National Economic Operating System</strong> — connecting workers, traders, finance, and government through a single intelligent layer.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {['Workers & Artisans', 'Traders & SMEs', 'Banks & Insurance', 'Government Agencies'].map((group, i) => (
              <motion.div key={group} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card p-5 text-center">
                <div className="text-2xl mb-2">{['👷', '🏪', '🏦', '🏛️'][i]}</div>
                <div className="text-white font-semibold text-sm">{group}</div>
              </motion.div>
            ))}
          </div>
          <Link to="/ecosystem" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all text-lg">
            Explore the Ecosystem →
          </Link>
        </div>
      </section>

      {/* SCALE ARCHITECTURE */}
      <section className="py-24">
        <div className="page-container">
          <div className="text-center mb-16">
            <span className="badge bg-blue-50 text-blue-700 border border-blue-100 mb-4">Scale Architecture</span>
            <h2 className="section-heading mb-4">Built to grow from pilot<br />to pan-African</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {scaleStages.map((s, i) => (
              <motion.div key={s.stage} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-6 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color}`} />
                <div className="text-3xl font-black text-navy-900 mb-1">{s.stage}</div>
                <div className={`text-lg font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent mb-2`}>{s.users}</div>
                <p className="text-slate-400 text-sm">{s.detail}</p>
              </motion.div>
            ))}
          </div>
          {/* Architecture Diagram */}
          <div className="card p-8 bg-slate-50">
            <h3 className="font-bold text-navy-900 mb-6 text-center">System Architecture</h3>
            <div className="flex flex-wrap justify-center gap-4 items-center">
              {['React Frontend', 'Node.js Services', 'Gemini AI Engine', 'Squad Payment Rails', 'Analytics Warehouse', 'Mobile / USSD'].map((layer, i) => (
                <div key={layer} className="flex items-center gap-3">
                  <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-navy-900 shadow-sm">{layer}</div>
                  {i < 5 && <div className="text-slate-300 font-bold">→</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVENUE MODEL */}
      <section className="py-24 bg-slate-50">
        <div className="page-container">
          <div className="text-center mb-16">
            <span className="badge bg-orange-50 text-orange-700 border border-orange-100 mb-4">Revenue Model</span>
            <h2 className="section-heading mb-4">Noble mission.<br />Sustainable business.</h2>
            <p className="section-subheading">Because good intentions still need a P&L. Here's how TaskVerify generates revenue.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {revenueCards.map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="card p-6 hover:shadow-card-hover transition-all hover:-translate-y-1">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-bold text-navy-900 mb-2">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24">
        <div className="page-container text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-heading mb-4">
            Ready to formalize Africa's<br /><span className="gradient-text">informal billions?</span>
          </motion.h2>
          <p className="section-subheading mb-10 max-w-xl mx-auto">
            Join the ecosystem that's turning economic invisibility into verifiable identity, credit, and opportunity.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/workers" className="btn-primary text-lg px-10 py-4">Join as Worker</Link>
            <Link to="/tasks" className="btn-secondary text-lg px-10 py-4">Post Opportunity</Link>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
