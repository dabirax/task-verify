import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/ecosystem', label: 'Ecosystem' },
  { to: '/workers', label: 'Workers' },
  { to: '/tasks', label: 'Opportunities' },
  { to: '/finance', label: 'Finance' },
  { to: '/analytics', label: 'Insights' },
  { to: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useApp();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
            : 'bg-transparent'
        }`}
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-glow-emerald group-hover:shadow-glow-blue transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                  <circle cx="8" cy="8" r="2" fill="white"/>
                </svg>
              </div>
              <div>
                <span className="font-bold text-navy-900 text-sm tracking-tight">TaskVerify</span>
                <span className="hidden sm:block text-[10px] text-slate-400 font-medium -mt-0.5 tracking-widest uppercase">Economic OS</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    location.pathname === link.to
                      ? 'text-navy-900 bg-slate-100 font-semibold'
                      : 'text-slate-500 hover:text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* API Status Dot */}
              <div className="hidden sm:flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow"></div>
                <span className="text-xs text-slate-400 font-medium">Live</span>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all duration-150"
              >
                {darkMode ? (
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>

              {/* CTA */}
              <Link to="/tasks" className="hidden sm:inline-flex btn-primary text-sm py-2 px-4">
                Get Started
              </Link>

              {/* Mobile Hamburger */}
              <button
                className="lg:hidden w-8 h-8 rounded-lg border border-slate-200 flex flex-col items-center justify-center gap-1 hover:bg-slate-50"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Open menu"
              >
                <span className={`w-4 h-0.5 bg-navy-900 transition-transform ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`w-4 h-0.5 bg-navy-900 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-4 h-0.5 bg-navy-900 transition-transform ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-100 shadow-lg lg:hidden overflow-hidden"
          >
            <div className="page-container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.to
                      ? 'text-navy-900 bg-slate-100 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/tasks" className="btn-primary text-sm mt-2 justify-center">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
