import { Link } from 'react-router-dom';
import { ShieldCheck, Globe, Zap, Heart, ArrowUpRight, } from 'lucide-react';
import { Button } from './ui/button';

export default function Footer() {
  const handleAnchorClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-navy-950 text-white mt-24">
      {/* Top CTA Bar */}
      <div className="border-b border-white/5 bg-navy-950/50 backdrop-blur-sm">
        <div className="page-container py-20 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-4xl font-black mb-3 tracking-tight">Ready to join the ecosystem?</h2>
            <p className="text-slate-400 text-xl font-medium">One platform. Infinite economic possibilities for Africa.</p>
          </div>
          <div className="flex gap-4 flex-wrap w-full lg:w-auto">
            <Link to="/signup" className="flex-1 lg:flex-none">
              <Button className="w-full h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-base shadow-xl shadow-emerald-500/10">
                Join as Worker
              </Button>
            </Link>
            <Link to="/signup" className="flex-1 lg:flex-none">
              <Button variant="outline" className="w-full h-14 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-base">
                Request a Service
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="page-container py-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight">TASKVERIFY</span>
              <span className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] leading-none mt-1 uppercase">National OS</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm font-medium">
            Africa's National Economic Operating System. Connecting informal workers, traders, and financial services through AI-driven trust and verifiable identities.
          </p>
        </div>

        {/* Platform */}
        <div>
          <h4 className="font-black text-white mb-6 text-xs uppercase tracking-[0.2em]">Platform</h4>
          <ul className="space-y-4 text-sm font-bold text-slate-400">
            {[
              { to: '#ecosystem', label: 'Ecosystem Map', anchor: 'ecosystem' },
              { to: '#workers', label: 'Worker Marketplace', anchor: 'workers' },
              { to: '#services', label: 'Service Hub', anchor: 'services' },
              { to: '#analytics', label: 'National Insights', anchor: 'analytics' },
            ].map((l) => (
              <li key={l.label}>
                <a 
                  href={l.to} 
                  onClick={(e) => {
                    if (window.location.pathname === '/') {
                      e.preventDefault();
                      handleAnchorClick(l.anchor);
                    }
                  }}
                  className="hover:text-emerald-400 transition-colors flex items-center group cursor-pointer"
                >
                  {l.label} <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* For */}
        <div>
          <h4 className="font-black text-white mb-6 text-xs uppercase tracking-[0.2em]">Stakeholders</h4>
          <ul className="space-y-4 text-sm font-bold text-slate-400">
            {['Informal Traders', 'Artisans', 'Freelancers', 'SMEs', 'Banks', 'Government'].map((item) => (
              <li key={item} className="hover:text-white transition-colors cursor-default flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-slate-700" /> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* System */}
        <div>
          <h4 className="font-black text-white mb-6 text-xs uppercase tracking-[0.2em]">Infrastructure</h4>
          <ul className="space-y-4 text-sm font-bold text-slate-400">
            {['USSD Core', 'Squad Escrow', 'AI Scoring', 'Offline Sync', 'Agent Network'].map((item) => (
              <li key={item} className="hover:text-white transition-colors cursor-default flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-slate-700" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-navy-950/80">
        <div className="page-container py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <div className="flex items-center gap-4">
            <p>© 2026 TaskVerify OS</p>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <p className="flex items-center gap-1.5">
              Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for the Informal Millions
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow-emerald" />
              <span className="text-emerald-400">Network: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              <span>EN (NG)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
