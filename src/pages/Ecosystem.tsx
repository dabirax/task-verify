import { motion } from 'framer-motion'

const nodes = [
  {
    id: 'workers', label: 'Workers & Artisans', icon: '👷', color: 'from-emerald-400 to-emerald-600',
    x: 50, y: 12, flows: ['Find verified jobs', 'Build trust ratings', 'Receive instant payment', 'Access micro-loans'],
  },
  {
    id: 'traders', label: 'Traders & SMEs', icon: '🏪', color: 'from-blue-400 to-blue-600',
    x: 85, y: 40, flows: ['Hire verified labor', 'Reach new customers', 'Build sales history', 'Access trade credit'],
  },
  {
    id: 'finance', label: 'Finance & Banks', icon: '🏦', color: 'from-violet-400 to-violet-600',
    x: 68, y: 80, flows: ['Alt-credit scoring', 'Savings products', 'Insurance policies', 'Micro-lending'],
  },
  {
    id: 'government', label: 'Government', icon: '🏛️', color: 'from-orange-400 to-orange-600',
    x: 18, y: 80, flows: ['Employment heatmaps', 'Sector insights', 'Tax formalization', 'Policy analytics'],
  },
  {
    id: 'ai', label: 'AI Core', icon: '🤖', color: 'from-rose-400 to-pink-600',
    x: 8, y: 40, flows: ['Matching engine', 'Fraud detection', 'Demand prediction', 'Credit scoring'],
  },
]

const centerFeatures = [
  '⚡ Real-time Matching', '🔒 Squad Escrow', '📊 Analytics Layer',
  '🌐 USSD Access', '🔁 Offline Sync', '📱 Mobile-first',
]

export default function Ecosystem() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-navy-950 to-navy-900">
        <div className="page-container text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="badge bg-white/10 text-white border border-white/20 mb-6">The Ecosystem</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            One Network.<br /><span className="text-emerald-400">Many Possibilities.</span>
          </motion.h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            Every actor in the informal economy — connected, verified, and empowered through a single intelligent layer.
          </p>
        </div>
      </section>

      {/* Network Visualization */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="relative w-full" style={{ height: 560 }}>
            {/* SVG connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {nodes.map((node) =>
                nodes.filter((n) => n.id !== node.id).map((target) => (
                  <motion.line
                    key={`${node.id}-${target.id}`}
                    x1={`${node.x}%`} y1={`${node.y}%`}
                    x2={`${target.x}%`} y2={`${target.y}%`}
                    stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="6 4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
                  />
                ))
              )}
              {/* Center connections */}
              {nodes.map((node) => (
                <motion.line key={`center-${node.id}`}
                  x1="50%" y1="50%" x2={`${node.x}%`} y2={`${node.y}%`}
                  stroke="#10b981" strokeWidth="2" strokeDasharray="6 3" strokeOpacity="0.4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
                />
              ))}
            </svg>

            {/* Center Hub */}
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center"
              style={{ width: 140 }}>
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-blue-600 shadow-glow-emerald mx-auto flex items-center justify-center mb-2">
                <div className="text-white font-black text-xs text-center leading-tight">TASK<br />VERIFY</div>
              </div>
              <div className="text-xs font-semibold text-slate-400">Economic Core</div>
            </motion.div>

            {/* Nodes */}
            {nodes.map((node, i) => (
              <motion.div key={node.id}
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.12, type: 'spring' }}
                className="absolute z-20 group cursor-pointer"
                style={{ top: `${node.y}%`, left: `${node.x}%`, transform: 'translate(-50%, -50%)' }}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${node.color} shadow-card flex items-center justify-center text-2xl mb-1 transition-transform group-hover:scale-110`}>
                  {node.icon}
                </div>
                <div className="text-center text-xs font-semibold text-navy-900 max-w-[100px] mx-auto leading-tight">{node.label}</div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-30 w-48 bg-navy-900 text-white rounded-2xl p-3 shadow-xl">
                  <div className="font-semibold text-xs mb-2">{node.label}</div>
                  <ul className="space-y-1">
                    {node.flows.map((f) => (
                      <li key={f} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-navy-900" />
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-400 mt-4">Hover over each node to see what it enables in the ecosystem</p>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-slate-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-4">Platform Infrastructure</h2>
            <p className="section-subheading">The technical layer that makes everything work — reliably and at scale.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {centerFeatures.map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="card p-6 flex items-center gap-4">
                <div className="text-3xl">{f.split(' ')[0]}</div>
                <div className="font-semibold text-navy-900">{f.slice(2)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed flows */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-4">Ecosystem Flows</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {nodes.map((node, i) => (
              <motion.div key={node.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-6 flex gap-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${node.color} flex items-center justify-center text-xl flex-shrink-0`}>
                  {node.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-navy-900 mb-3">{node.label}</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {node.flows.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* African Reality */}
      <section className="py-20 bg-navy-950 text-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Built for African Reality</h2>
            <p className="text-slate-400 text-lg">Not for Silicon Valley demos. For Kano markets, Aba workshops, and Port Harcourt ports.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📡', title: 'Low Bandwidth Mode', desc: 'Core features work on 2G. No data? No problem.' },
              { icon: '📵', title: 'Offline-First Sync', desc: 'Queue actions offline. Auto-sync when connected.' },
              { icon: '*182#', title: 'USSD Onboarding', desc: 'Register and apply for jobs via basic USSD codes.' },
              { icon: '🗣️', title: 'Multi-Language', desc: 'English, Pidgin, Hausa, Igbo, Yoruba, French.' },
              { icon: '💵', title: 'Cash Agent Network', desc: 'Cash in/out through local agents nationwide.' },
              { icon: '🤝', title: 'Trust Circles', desc: 'Community-based references and referrals.' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass-card p-6">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  )
}
