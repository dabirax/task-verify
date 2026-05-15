import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { getInitials, getSkillColor, trustScoreLabel, formatRating, formatPercent, formatNaira } from '../utils/formatters';
import { MapPin, ArrowLeft, Loader2, Star, ShieldCheck, CheckCircle2, TrendingUp, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { QuickMessageModal } from '../components/QuickMessageModal';
import { useAuth } from '../hooks/useAuth';

export default function WorkerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showMessageModal, setShowMessageModal] = useState(false);

  const { data: worker, isLoading: workerLoading } = useQuery({
    queryKey: ['workers', Number(id)],
    queryFn: () => api.getWorker(Number(id)),
    enabled: !!id,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['workers', Number(id), 'stats'],
    queryFn: () => api.getWorkerStats(Number(id)),
    enabled: !!id,
  });

  if (workerLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-4">
        <h2 className="text-2xl font-black text-navy-900">Worker Not Found</h2>
        <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
      </div>
    );
  }

  const avatarBg = [
    'bg-emerald-50 text-emerald-700',
    'bg-blue-50 text-blue-700',
    'bg-violet-50 text-violet-700',
    'bg-orange-50 text-orange-700',
    'bg-rose-50 text-rose-700',
  ][worker.id % 5];

  const { label: trustLabel, color: trustColor } = trustScoreLabel(worker.trust_score);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container pt-32 pb-12 max-w-4xl">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)} 
        className="mb-8 rounded-xl font-bold border-slate-200 text-slate-600"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden mb-8">
        <div className="bg-slate-50 border-b border-slate-100 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <Avatar className="w-32 h-32 border-4 border-white shadow-xl rounded-[2.5rem]">
            <AvatarImage src={worker.avatar_url || ''} className="object-cover" />
            <AvatarFallback className={`${avatarBg} rounded-[2.5rem] font-black text-4xl`}>
              {getInitials(worker.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-navy-900">{worker.name}</h1>
              {worker.is_active && (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black text-[10px] uppercase tracking-widest px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5 inline-block" />
                  Available Now
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 text-slate-500 font-bold text-sm mb-4">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {worker.primary_location}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {worker.skills.map((skill) => (
                <Badge key={skill} variant="outline" className={`font-black uppercase tracking-widest border-none px-3 py-1 ${getSkillColor(skill)}`}>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-lg font-black text-navy-900 mb-4">About Me</h3>
            <p className="text-slate-600 font-medium leading-relaxed mb-8">
              {worker.bio || "No bio provided."}
            </p>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className={`w-8 h-8 ${trustColor.split(' ')[0]}`} />
                 <div>
                   <div className="text-2xl font-black text-navy-900 leading-none">{worker.trust_score}</div>
                   <div className={`text-[10px] font-black uppercase tracking-widest ${trustColor}`}>{trustLabel} Tier</div>
                 </div>
               </div>
               <p className="text-xs text-slate-500 font-medium">This worker's identity and capabilities have been vetted through our AI verification engine.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-navy-900 mb-4">Performance Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm">
                <div className="text-3xl font-black text-navy-900 mb-1">{stats?.tasks_completed || worker.tasks_completed}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tasks Completed
                </div>
              </div>
              <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm">
                <div className="flex items-end gap-1 mb-1">
                   <div className="text-3xl font-black text-navy-900 leading-none">{formatRating(stats?.avg_rating || worker.avg_rating)}</div>
                   <Star className="w-5 h-5 mb-1 text-amber-500 fill-amber-500" />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Average Rating</div>
              </div>
              <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm">
                <div className="text-3xl font-black text-navy-900 mb-1">{formatPercent(stats?.on_time_rate || worker.on_time_rate)}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> On-Time Rate
                </div>
              </div>
            </div>

            {user?.role === 'buyer' && (
              <Button 
                onClick={() => setShowMessageModal(true)}
                className="w-full mt-6 h-12 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-xl shadow-md"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Worker
              </Button>
            )}
          </div>
        </div>

        {showMessageModal && (
          <QuickMessageModal
            isOpen={showMessageModal}
            onClose={() => setShowMessageModal(false)}
            recipientUserId={worker.id?.toString() || ''}
            recipientName={worker.name}
            recipientAvatar={worker.avatar_url}
          />
        )}
      </div>
    </motion.div>
  );
}
