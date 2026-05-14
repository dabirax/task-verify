import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Flame, 
  BrainCircuit, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  Zap,
  Tag
} from 'lucide-react';
import type { Task } from '../types';
import { formatNaira, formatDate, statusConfig, getSkillColor } from '../utils/formatters';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Progress } from './ui/progress';
import { useAuth } from '../hooks/useAuth';
import SubmitProofModal from './SubmitProofModal';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  topMatch?: { name: string; score: number };
  onApply?: (task: Task) => void;
}

export default function TaskCard({ task, topMatch, onApply }: TaskCardProps) {
  const { addToast } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const status = statusConfig[task.status] ?? { label: task.status, bg: 'bg-slate-100', text: 'text-slate-600' };
  const isOpen = task.status === 'posted';
  const isAssignedToMe = task.assigned_worker_id === user?.worker_id && task.status === 'assigned';
  const isWorker = user?.role === 'worker';
  const daysLeft = Math.ceil((new Date(task.due_date).getTime() - Date.now()) / 86400000);
  const isUrgent = daysLeft <= 3 && daysLeft > 0;
  const isPast = daysLeft <= 0;

  const handleApply = () => {
    if (!isOpen) {
      addToast('This task is no longer open for applications.', 'warning');
      return;
    }
    if (onApply) {
      onApply(task);
    } else {
      addToast(`Application submitted for: ${task.title}`, 'success');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card 
        onClick={() => navigate(`/services/${task.id}`)}
        className="h-full border-slate-100 shadow-xl shadow-navy-100/30 rounded-[2rem] overflow-hidden flex flex-col group transition-all duration-500 hover:shadow-2xl hover:shadow-navy-100/50 cursor-pointer"
      >
        <CardHeader className="p-6 pb-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center gap-2">
                {isUrgent && (
                  <Badge className="bg-red-50 text-red-600 border-red-100 animate-pulse font-black text-[9px] uppercase tracking-widest px-2 py-0.5 gap-1">
                    <Flame className="w-3 h-3" /> Urgent
                  </Badge>
                )}
                {task.squad_va_account_number && (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black text-[9px] uppercase tracking-widest px-2 py-0.5 gap-1">
                    <Lock className="w-3 h-3" /> Escrow Secure
                  </Badge>
                )}
              </div>
              <h3 className="font-black text-navy-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                {task.title}
              </h3>
            </div>
            <Badge className={`${status.bg} ${status.text} border-none font-bold text-[10px] uppercase tracking-widest px-2.5 py-1`}>
              {status.label}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{task.task_location}</span>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0 flex-1 space-y-6">
          <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">
            {task.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            <Tag className="w-3 h-3 text-slate-300 self-center" />
            {task.required_skills.map((skill) => (
              <Badge key={skill} variant="outline" className={`text-[9px] font-black uppercase tracking-widest border-none ${getSkillColor(skill)}`}>
                {skill}
              </Badge>
            ))}
          </div>

          {/* AI Match Synthesis */}
          {topMatch && isOpen && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700">
                  <BrainCircuit className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em]">AI Match Analysis</span>
                </div>
                <Badge className="bg-blue-600 text-white border-none font-black text-[10px]">{topMatch.score}%</Badge>
              </div>
              <p className="text-[10px] text-blue-600/80 font-bold leading-relaxed">
                Smart Match: <span className="text-blue-800">{topMatch.name}</span> identified as highest probability fit based on reputation & geo-proximity.
              </p>
              <Progress value={topMatch.score} className="h-1.5 bg-blue-100" />
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-0 border-t border-slate-50 mt-auto">
          <div className="flex items-center justify-between w-full pt-4">
            <div>
              <div className="text-2xl font-black text-navy-900 tracking-tight">{formatNaira(task.amount_naira)}</div>
              <div className={`flex items-center gap-1.5 text-[10px] font-bold mt-1 ${isUrgent ? 'text-red-600' : 'text-slate-400'}`}>
                {isPast ? <Clock className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                {isPast ? 'EXPIRED' : `DUE ${formatDate(task.due_date)}`}
              </div>
            </div>
            
            {isOpen ? (
              <Button 
                onClick={(e) => { e.stopPropagation(); handleApply(); }}
                className="h-12 px-6 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-navy-100"
              >
                Smart Apply <Zap className="ml-2 w-4 h-4 text-emerald-400 fill-emerald-400" />
              </Button>
            ) : isAssignedToMe ? (
              <Button 
                onClick={(e) => { e.stopPropagation(); setShowSubmitModal(true); }}
                className="h-12 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-emerald-100"
              >
                Submit Proof <CheckCircle2 className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button 
                disabled
                onClick={(e) => e.stopPropagation()}
                className="h-12 px-6 rounded-2xl bg-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest transition-all duration-300"
              >
                {status.label}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <SubmitProofModal 
        taskId={task.id} 
        isOpen={showSubmitModal} 
        onClose={() => setShowSubmitModal(false)} 
      />
    </motion.div>
  );
}
