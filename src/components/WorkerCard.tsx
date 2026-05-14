import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  Eye
} from 'lucide-react';
import type { Worker } from '../types';
import { formatNaira, formatPercent, formatRating, getInitials, getSkillColor, trustScoreLabel } from '../utils/formatters';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

interface WorkerCardProps {
  worker: Worker;
  matchScore?: number;
  matchReasons?: string[];
}

export default function WorkerCard({ worker, matchScore, matchReasons }: WorkerCardProps) {
  const navigate = useNavigate();
  const { label: trustLabel, color: trustColor } = trustScoreLabel(worker.trust_score);
  const successRate = worker.tasks_completed > 0
    ? Math.round((worker.tasks_successful / worker.tasks_completed) * 100)
    : 0;

  const avatarBg = [
    'bg-emerald-50 text-emerald-700',
    'bg-blue-50 text-blue-700',
    'bg-violet-50 text-violet-700',
    'bg-orange-50 text-orange-700',
    'bg-rose-50 text-rose-700',
  ][worker.id % 5];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card 
        onClick={() => navigate(`/workers/${worker.id}`)}
        className="h-full border-slate-100 shadow-xl shadow-navy-100/30 rounded-[2rem] overflow-hidden flex flex-col group transition-all duration-500 hover:shadow-2xl hover:shadow-navy-100/50 cursor-pointer"
      >
        <CardHeader className="p-6 pb-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-14 h-14 rounded-2xl border-2 border-slate-50">
                <AvatarImage src={worker.avatar_url || ''} className="object-cover" />
                <AvatarFallback className={`${avatarBg} rounded-2xl font-black text-lg`}>
                  {getInitials(worker.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-black text-navy-900 text-base group-hover:text-emerald-600 transition-colors">{worker.name}</h3>
                <div className="flex items-center gap-1 mt-0.5 text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{worker.primary_location}</span>
                </div>
              </div>
            </div>
            {worker.is_active && (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 font-bold text-[10px] px-2 py-0.5 gap-1.5 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {worker.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-slate-50 text-slate-500 hover:bg-slate-100 border-none font-bold text-[9px] uppercase tracking-wider px-2 py-0.5">
                {skill}
              </Badge>
            ))}
            {worker.skills.length > 3 && (
              <Badge variant="outline" className="text-[9px] font-bold border-slate-100 text-slate-400">
                +{worker.skills.length - 3}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0 flex-1 space-y-5">
          {/* AI Match Reasons */}
          {matchScore !== undefined && (
            <div className="bg-blue-50/50 rounded-2xl p-3 border border-blue-100/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700">
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">AI Match Identity</span>
                </div>
                <span className="text-xs font-black text-blue-700">{matchScore}%</span>
              </div>
              <Progress value={matchScore} className="h-1.5 bg-blue-100" />
              {matchReasons && matchReasons.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {matchReasons.slice(0, 2).map((reason, i) => (
                    <li key={i} className="text-[10px] text-blue-600/80 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50/50 rounded-2xl p-3 text-center border border-slate-100/50">
              <div className="text-sm font-black text-navy-900">{worker.tasks_completed}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Tasks</div>
            </div>
            <div className="bg-slate-50/50 rounded-2xl p-3 text-center border border-slate-100/50">
              <div className="flex items-center justify-center gap-0.5 text-sm font-black text-navy-900">
                {formatRating(worker.avg_rating)}
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Rating</div>
            </div>
            <div className="bg-slate-50/50 rounded-2xl p-3 text-center border border-slate-100/50">
              <div className="text-sm font-black text-navy-900">{formatPercent(worker.on_time_rate)}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Timing</div>
            </div>
          </div>

          {/* Trust Score & Earnings */}
          <div className="flex items-center justify-between py-1 px-1">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${trustColor} shadow-inner`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-navy-900">{worker.trust_score}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${trustColor}`}>{trustLabel}</span>
                </div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-0.5">Identity Trust</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-navy-900 tracking-tight">{formatNaira(worker.current_month_earnings)}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">This Month</div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Link to={`/workers/${worker.id}`} className="w-full" onClick={(e) => e.stopPropagation()}>
            <Button variant="outline" className="w-full h-11 rounded-2xl border-slate-200 font-black text-xs uppercase tracking-widest hover:bg-navy-900 hover:text-white hover:border-navy-900 group transition-all duration-300 shadow-sm">
              View Profile <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
