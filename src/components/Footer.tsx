import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white mt-24">
      {/* Top CTA Bar */}
      <div className="border-b border-white/10">
        <div className="page-container py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Ready to join the ecosystem?</h2>
            <p className="text-slate-400 text-lg">One platform. Infinite economic possibilities.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/workers" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all duration-200">
              Register as Worker
            </Link>
            <Link to="/tasks" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all duration-200 border border-white/20">
              Post a Task
            </Link>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="page-container py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="8" cy="8" r="2" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-white">TaskVerify</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Africa's National Economic Operating System. Connecting informal workers, traders, and financial services through AI.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {['🇳🇬 English', '🇳🇬 Pidgin', '🇫🇷 Français'].map((lang) => (
              <button key={lang} className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">{lang}</button>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm">Platform</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            {[
              { to: '/ecosystem', label: 'Ecosystem' },
              { to: '/workers', label: 'Worker Marketplace' },
              { to: '/tasks', label: 'Opportunities' },
              { to: '/finance', label: 'AI Finance' },
              { to: '/analytics', label: 'National Insights' },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* For */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm">For</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            {['Informal Traders', 'Artisans & Freelancers', 'Youth Job Seekers', 'SMEs & Employers', 'Banks & Insurance', 'Government Agencies'].map((item) => (
              <li key={item}>
                <span className="hover:text-white transition-colors cursor-default">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Infrastructure */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm">Infrastructure</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            {['USSD Onboarding', 'Squad Escrow Payments', 'AI Credit Scoring', 'Offline-First Sync', 'Cash Agent Network', 'Multi-Language Support'].map((item) => (
              <li key={item}>
                <span className="hover:text-white transition-colors cursor-default">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="page-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 TaskVerify. Built for Africa's 400M informal workers.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Squad API · Gemini AI</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-emerald-400">API Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
