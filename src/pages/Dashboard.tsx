import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  Wallet, 
  BarChart3, 
  ShieldCheck, 
  TrendingUp, 
  Calendar,
  Bell,
  Search,
  ArrowUpRight,
  Zap,
  Star,
  Clock,
  BrainCircuit,
  LayoutDashboard,
  ShieldAlert,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { formatNaira, getInitials } from '../utils/formatters';
import { Link, useNavigate } from 'react-router-dom';
import { useBuyerTasks } from '../hooks/useBuyerQueries';
import { useWorkerProfile, useWorkerTasks } from '../hooks/useWorkerProfileQueries';
import { useWallet } from '../hooks/useWallet';
import { SkeletonLoader } from '../components/SkeletonLoader';
import CreateTaskModal from '../components/CreateTaskModal';

export default function UserDashboard() {
  const { user } = useAuth();
  
  const isWorker = user?.role === 'worker';
  const isEmployer = user?.role === 'buyer' || user?.role === 'employer';
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

  const { data: buyerTasks, isLoading: loadingBuyerTasks } = useBuyerTasks({ enabled: isEmployer });
  const { data: workerProfile, isLoading: loadingWorkerProfile } = useWorkerProfile({ enabled: isWorker });
  const { data: workerTasks, isLoading: loadingWorkerTasks } = useWorkerTasks({ enabled: isWorker });
  const { data: wallet, isLoading: loadingWallet } = useWallet();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const isLoading = (isEmployer && loadingBuyerTasks) || (isWorker && (loadingWorkerProfile || loadingWorkerTasks)) || loadingWallet;

  const creditScore = workerProfile?.financial_profile?.credit_score ?? workerProfile?.credit_score ?? 0;
  const creditProgress = Math.min((creditScore / 850) * 100, 100);
  const recommendedLoan = workerProfile?.financial_profile?.recommended_loan ?? 150000;

  const stats = isWorker ? [
    { label: 'Total Earnings', value: formatNaira(workerProfile?.total_earnings || 0), icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Completed Services', value: String(workerProfile?.tasks_completed || 0), icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Trust Score', value: workerProfile?.trust_score || user?.trust_score || 0, icon: ShieldCheck, color: 'text-violet-500', bg: 'bg-violet-50' },
    { label: 'Avg Rating', value: `${workerProfile?.avg_rating || 0}★`, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  ] : [
    { label: 'Total Spent', value: formatNaira(buyerTasks?.reduce((acc, task) => acc + task.amount_naira, 0) || 0), icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Services', value: String(buyerTasks?.filter(t => t.status !== 'completed').length || 0), icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Verified Hires', value: String(buyerTasks?.filter(t => t.status === 'verified' || t.status === 'completed').length || 0), icon: Users, color: 'text-violet-500', bg: 'bg-violet-50' },
    { label: 'Success Rate', value: '98%', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const recentItems = isWorker ? (workerTasks?.slice(0, 3).map(task => ({
    title: task.title,
    status: task.status,
    date: new Date(task.created_at).toLocaleDateString(),
    amount: formatNaira(task.amount_naira)
  })) || []) : (buyerTasks?.slice(0, 3).map(task => ({
    title: task.title,
    status: task.status,
    date: new Date(task.created_at).toLocaleDateString(),
    amount: formatNaira(task.amount_naira)
  })) || []);

  if (isLoading) {
    return (
      <div className="pt-32 page-container">
        <SkeletonLoader type="dashboard" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="page-container">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-5">
            <Avatar className="w-16 h-16 rounded-[2rem] border-4 border-white shadow-xl">
              <AvatarImage src={user?.avatar_url || ''} />
              <AvatarFallback className="bg-navy-900 text-white font-black text-xl">
                {getInitials(user?.full_name || 'User')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-black text-navy-900 tracking-tight leading-tight">
                Welcome, {user?.full_name?.split(' ')[0]}!
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5">
                  Verified {user?.role} Identity
                </Badge>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> Trust Score: {workerProfile?.trust_score ?? user?.trust_score ?? 750}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            {isWorker ? (
              <Link to="/services" className="flex-1 md:flex-none">
                <Button className="w-full h-12 px-6 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-navy-100">
                  Find Services <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Button onClick={() => setShowCreateModal(true)} className="flex-1 md:flex-none h-12 px-6 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-navy-100">
                Request Service <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            )}
            <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl border-slate-200 bg-white text-slate-400">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Overview Content */}
        <div className="mt-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {isWorker && !user?.worker_id && (
              <div className="mb-8 bg-amber-50 border border-amber-200 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-amber-100/50">
                <div className="flex items-center gap-5 text-amber-900">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <ShieldAlert className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl mb-1">Worker Profile Required</h3>
                    <p className="text-sm font-bold opacity-80">You need to create a linked worker profile before you can apply for tasks and get paid.</p>
                  </div>
                </div>
                <Link to="/profile" className="w-full md:w-auto">
                  <Button className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-widest text-xs h-14 px-8 rounded-2xl shadow-xl shadow-amber-200">
                    Create Profile Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, i) => (
                <Card key={stat.label} className="border-none shadow-xl shadow-navy-100/20 rounded-[2rem] overflow-hidden group hover:scale-105 transition-all cursor-pointer bg-white">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-black text-navy-900 tracking-tight">{stat.value}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-none shadow-2xl shadow-navy-100/40 rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="font-black text-navy-900 text-xl tracking-tight">
                        {isWorker ? "Recent Services" : "Active Service Postings"}
                      </CardTitle>
                      <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                        Managed via TaskVerify OS
                      </CardDescription>
                    </div>
                    <Link to="/services">
                      <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                        View All <ChevronRight className="ml-1 w-3 h-3" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-4">
                    {recentItems.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-5 rounded-3xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-navy-900 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-navy-900 group-hover:text-blue-700 transition-colors">{item.title}</div>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                              <Clock className="w-3 h-3" /> {item.date}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-navy-900">{item.amount}</div>
                          <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[8px] uppercase tracking-widest mt-1 px-2 py-0.5">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-none shadow-2xl shadow-navy-100/40 rounded-[2.5rem] bg-navy-900 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                     <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]" />
                  </div>
                  <CardContent className="p-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/20 flex-shrink-0 animate-pulse">
                      <BrainCircuit className="w-12 h-12 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-none mb-4 uppercase font-black text-[10px]">AI Optimization</Badge>
                      <h3 className="text-2xl font-black mb-3 tracking-tight">
                        {isWorker 
                          ? "Increase your earnings by 12% next month." 
                          : "Improve hire quality with Skill Verification."}
                      </h3>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                        {isWorker 
                          ? "Based on your activity, we recommend adding 'Basic Electronics Repair' to your profile. There's a 40% surge in demand in Ikeja." 
                          : "Members with verified identity documents are 3x more likely to complete services successfully. Start verifying your candidates now."}
                      </p>
                      <Button className="h-12 px-8 rounded-2xl bg-white text-navy-900 hover:bg-slate-100 font-black text-xs uppercase tracking-widest">
                        View AI Strategy <Zap className="ml-2 w-4 h-4 text-amber-500 fill-amber-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <Card className="border-none shadow-2xl shadow-navy-100/40 rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="font-black text-navy-900 text-xl tracking-tight">Financial Status</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Ecosystem Wallet</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                    <div className="bg-slate-50 rounded-3xl p-6 text-center">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Available Balance</div>
                      <div className="text-4xl font-black text-navy-900 tracking-tight">{formatNaira(Number(wallet?.balance || 0))}</div>
                      <Link to="/finance">
                        <Button variant="ghost" className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest gap-2">
                          Open Wallet Hub <ArrowUpRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>

                    {isWorker && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-navy-900">
                          <span>Credit Progress</span>
                          <span className="text-emerald-600">{creditProgress.toFixed(0)}%</span>
                        </div>
                        <Progress value={creditProgress} className="h-2 bg-slate-100" />
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                          {creditProgress < 100 
                            ? `You are ${100 - Math.round(creditProgress)}% away from unlocking a ${formatNaira(recommendedLoan)} micro-loan with partner banks.`
                            : `You are eligible for a ${formatNaira(recommendedLoan)} micro-loan.`}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-none shadow-2xl shadow-navy-100/40 rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="font-black text-navy-900 text-xl tracking-tight">Economic Calendar</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-4">
                    {[
                      { title: 'Tax Submission', date: 'Dec 15', time: '09:00', type: 'System' },
                      { title: 'Service Deadline', date: 'Dec 18', time: '18:00', type: 'Active' },
                      { title: 'Trust Score Refresh', date: 'Jan 01', time: '00:00', type: 'AI' },
                    ].map((event, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex flex-col items-center justify-center flex-shrink-0 text-navy-900 font-black">
                          <div className="text-[8px] uppercase text-slate-400">{event.date.split(' ')[0]}</div>
                          <div className="text-xs leading-none">{event.date.split(' ')[1]}</div>
                        </div>
                        <div>
                          <div className="text-xs font-black text-navy-900">{event.title}</div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{event.time} · {event.type}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <CreateTaskModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onCreated={(taskId, matches) => {
          navigate(`/services/${taskId}`, { state: { matches } });
        }}
      />
    </motion.div>
  );
}
