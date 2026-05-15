import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BarChart3, 
  Wallet, 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon,
  Bell,
  MessageCircle,
  Search,
  ChevronDown,
  BrainCircuit,
  Zap,
  Star,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { useConversations } from '../hooks/useMessages';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatNaira, getInitials } from "../utils/formatters";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { data: notifications } = useNotifications({ limit: 5 });
  const { data: conversations } = useConversations();

  const unreadCount = notifications?.filter(n => !n.is_read).length ?? 0;
  const unreadMessagesCount = conversations?.reduce((sum, conv) => sum + conv.unread_count, 0) ?? 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    }
  };

  interface NavLink {
    to?: string;
    id?: string;
    label: string;
    icon: any;
    role?: string;
  }

  const navLinks: NavLink[] = isAuthenticated 
    ? [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/services', label: 'Services', icon: Briefcase },
        { to: '/workers', label: 'Workers', icon: Users },
        { to: '/inbox', label: 'Messages', icon: MessageCircle },
        { to: '/finance', label: 'Finance', icon: Wallet },
        { to: '/admin', label: 'Admin', icon: ShieldCheck, role: 'admin' },
      ]
    : [
        { id: 'hero', label: 'Home', icon: LayoutDashboard },
        { id: 'ecosystem', label: 'Ecosystem', icon: BrainCircuit },
        { id: 'services', label: 'Services', icon: Briefcase },
        { id: 'workers', label: 'Workers', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Use actual notifications from API or fallback
  const displayNotifications = notifications?.length 
    ? notifications.slice(0, 3).map(n => ({
        id: n.id,
        title: n.title,
        desc: n.message,
        icon: Bell, // Simplified icon matching logic for navbar
        color: 'text-blue-500',
        time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
    : [
        { id: 1, title: 'Identity Verified', desc: 'Your trust score increased to 750!', icon: ShieldCheck, color: 'text-emerald-500', time: '2m ago' },
        { id: 2, title: 'New Service Match', desc: 'New "Office Cleaning" opportunity in Ikeja.', icon: Zap, color: 'text-blue-500', time: '15m ago' },
        { id: 3, title: 'Payment Received', desc: '₦15,000 released from Squad Escrow.', icon: Wallet, color: 'text-violet-500', time: '1h ago' },
      ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || isAuthenticated ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-glow-emerald group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-navy-900 leading-none tracking-tight">TASKVERIFY</span>
              <span className="text-[10px] font-bold text-emerald-600 tracking-[0.2em] leading-none mt-1 uppercase">National OS</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.filter(link => !link.role || (link.role === 'admin' && user?.role === 'admin')).map((link) => (
              link.to ? (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    location.pathname === link.to && link.to !== '/'
                      ? 'bg-navy-900 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id!)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-navy-900 transition-all"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="font-bold text-slate-600 hover:text-navy-900">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-navy-900 hover:bg-navy-800 text-white font-black rounded-xl px-6 shadow-xl shadow-navy-100">Join Ecosystem</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-navy-900 hover:bg-slate-100">
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 mt-2 p-0 rounded-[2rem] shadow-2xl border-slate-100 overflow-hidden">
                    <div className="p-4 bg-navy-900 text-white flex items-center justify-between">
                      <h4 className="font-black text-xs uppercase tracking-widest">Live Notifications</h4>
                      {unreadCount > 0 && (
                        <Badge className="bg-emerald-500 text-white border-none text-[9px] font-black">{unreadCount} NEW</Badge>
                      )}
                    </div>
                    <ScrollArea className="h-72">
                      <div className="divide-y divide-slate-50">
                        {displayNotifications.map((n) => (
                          <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-3 cursor-pointer">
                            <div className={`w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 ${n.color}`}>
                              <n.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-xs font-black text-navy-900">{n.title}</div>
                              <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{n.desc}</div>
                              <div className="text-[9px] text-slate-400 font-bold uppercase mt-1.5 tracking-wider">{n.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                      <Link to="/notifications">
                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-blue-600 h-auto py-1">View All Activity</Button>
                      </Link>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Link to="/inbox">
                  <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-navy-900 hover:bg-slate-100">
                    <MessageCircle className="w-5 h-5" />
                    {unreadMessagesCount > 0 && (
                      <Badge className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center p-0 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-full border border-white">
                        {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-3 cursor-pointer pl-2 border-l border-slate-200 group">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-navy-900 leading-none group-hover:text-emerald-600 transition-colors">{user?.full_name}</p>
                        <p className="text-[10px] font-bold text-slate-400 capitalize mt-1 tracking-wider">{user?.role} Profile</p>
                      </div>
                      <Avatar className="w-9 h-9 border-2 border-slate-100 hover:border-emerald-400 transition-all shadow-sm">
                        <AvatarImage src={user?.avatar_url || ''} />
                        <AvatarFallback className="bg-emerald-50 text-emerald-700 font-black">
                          {getInitials(user?.full_name || 'User')}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-navy-900 transition-colors" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60 mt-2 p-2 rounded-[2rem] shadow-2xl border-slate-100">
                    <div className="px-2 py-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Economic ID</p>
                      <p className="text-xs font-bold text-navy-900 truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-slate-50" />
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-xl py-2.5 focus:bg-slate-50 cursor-pointer font-bold text-sm">
                      <UserIcon className="w-4 h-4 mr-3 text-slate-400" /> My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl py-2.5 focus:bg-slate-50 cursor-pointer font-bold text-sm">
                      <Star className="w-4 h-4 mr-3 text-amber-500" /> Trust Rating
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl py-2.5 focus:bg-slate-50 cursor-pointer font-bold text-sm">
                      <Wallet className="w-4 h-4 mr-3 text-blue-500" /> Wallet Hub
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-50" />
                    <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-2.5 focus:bg-red-50 text-red-600 focus:text-red-700 font-black text-sm cursor-pointer">
                      <LogOut className="w-4 h-4 mr-3" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            {isAuthenticated && (
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="text-slate-500 relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  )}
                </Button>
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-slate-100 text-navy-900 transition-colors hover:bg-slate-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.filter(link => !link.role || (link.role === 'admin' && user?.role === 'admin')).map((link) => (
                link.to ? (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-black transition-all ${
                      location.pathname === link.to && link.to !== '/'
                        ? 'bg-navy-900 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id!)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-black text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </a>
                )
              ))}
              <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                      <Button variant="outline" className="w-full justify-center rounded-2xl py-6 font-black uppercase tracking-widest text-xs border-slate-200">Log in</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="block">
                      <Button className="w-full justify-center bg-navy-900 hover:bg-navy-800 text-white rounded-2xl py-6 font-black uppercase tracking-widest text-xs shadow-lg shadow-navy-200">Join Ecosystem</Button>
                    </Link>
                  </>
                ) : (
                  <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-600 font-black px-4 py-4 h-auto hover:bg-red-50 rounded-2xl">
                    <LogOut className="w-5 h-5 mr-3" /> Sign Out
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
