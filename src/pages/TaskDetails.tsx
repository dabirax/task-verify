import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { useAssignWorker, useRecommendWorkers, useApplyForTask } from '../hooks/useBuyerQueries';
import { useRequestFundRelease } from '../hooks/useWorkerProfileQueries';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { formatNaira, formatDate, statusConfig, getSkillColor } from '../utils/formatters';
import { MapPin, Calendar, Clock, Lock, CheckCircle2, Zap, ArrowLeft, Loader2, BrainCircuit } from 'lucide-react';
import SubmitProofModal from '../components/SubmitProofModal';
import { useState } from 'react';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const matches = location.state?.matches || [];
  const { addToast } = useApp();
  const queryClient = useQueryClient();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const { data: task, isLoading: taskLoading } = useQuery({
    queryKey: ['tasks', Number(id)],
    queryFn: () => api.getTask(Number(id)),
    enabled: !!id,
  });

  const { data: workers = [] } = useQuery({
    queryKey: ['workers'],
    queryFn: () => api.getWorkers(),
  });

  const assignMutation = useAssignWorker();
  const recommendMutation = useRecommendWorkers();
  const applyMutation = useApplyForTask();
  const requestReleaseMutation = useRequestFundRelease();
  
  const displayMatches = matches.length > 0 ? matches : (task?.ai_recommendations || task?.shortlisted_workers || []);

  if (taskLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-4">
        <h2 className="text-2xl font-black text-navy-900">Task Not Found</h2>
        <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
      </div>
    );
  }

  const status = statusConfig[task.status] ?? { label: task.status, bg: 'bg-slate-100', text: 'text-slate-600' };
  const isOwner = Number(user?.id) === task.buyer_user_id;
  const isAssignedToMe = task.assigned_worker_id === user?.worker_id && task.status === 'assigned';
  const isOpen = task.status === 'posted' || task.status === 'open';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container pt-32 pb-12 max-w-4xl">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)} 
        className="mb-8 rounded-xl font-bold border-slate-200 text-slate-600"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 md:p-12 mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={`${status.bg} ${status.text} border-none font-black text-xs uppercase tracking-widest px-3 py-1.5`}>
                {status.label}
              </Badge>
              {task.squad_va_account_number && (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black text-xs uppercase tracking-widest px-3 py-1.5 gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Escrow Secure
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-navy-900 mb-4">{task.title}</h1>
            <div className="flex items-center gap-4 text-slate-500 font-bold text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {task.task_location}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Due {formatDate(task.due_date)}
              </div>
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-4xl font-black text-navy-900 mb-2">{formatNaira(task.amount_naira)}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fixed Budget</div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none mb-10">
          <h3 className="text-lg font-black text-navy-900 mb-3">Description</h3>
          <p className="text-slate-600 font-medium leading-relaxed">{task.description}</p>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-black text-navy-900 mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {task.required_skills?.map((skill) => (
              <Badge key={skill} variant="outline" className={`font-black uppercase tracking-widest border-none px-3 py-1.5 ${getSkillColor(skill)}`}>
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {task.deliverable_spec && typeof task.deliverable_spec === 'object' && (
          <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-100">
            <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest mb-4">Deliverable Requirements</h3>
            <ul className="space-y-3">
              {(task.deliverable_spec as any).photos_required && (
                <li className="flex items-center gap-2 text-sm font-bold text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 
                  Photos Required (Min: {(task.deliverable_spec as any).minimum_photos})
                </li>
              )}
              {(task.deliverable_spec as any).notes && (
                <li className="flex items-start gap-2 text-sm font-bold text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> 
                  <span>{(task.deliverable_spec as any).notes}</span>
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-end border-t border-slate-100 pt-8 mt-8">
          {isOpen && !isOwner && user?.role === 'worker' && (
            <Button 
              onClick={() => {
                if (user?.worker_id) {
                  applyMutation.mutate({ 
                    taskId: Number(id), 
                    data: { worker_id: user.worker_id, proposed_price: task.amount_naira, message: "I'm ready to do this job!" } 
                  });
                }
              }}
              disabled={applyMutation.isPending}
              className="h-14 px-8 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-xl shadow-navy-100"
            >
              {applyMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Apply for Job <Zap className="ml-2 w-5 h-5 text-emerald-400 fill-emerald-400" />
            </Button>
          )}

          {isAssignedToMe && (
            <div className="flex gap-4">
              {task.status === 'completed' && (
                <Button 
                  onClick={() => {
                    const reason = window.prompt("Why are you requesting a manual release?");
                    if (reason) {
                      requestReleaseMutation.mutate({ taskId: Number(id), reason });
                    }
                  }}
                  disabled={requestReleaseMutation.isPending}
                  variant="outline"
                  className="h-14 px-8 rounded-2xl font-black text-sm uppercase tracking-widest border-slate-200 text-slate-600"
                >
                  {requestReleaseMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  Request Release
                </Button>
              )}
              <Button 
                onClick={() => setShowSubmitModal(true)}
                className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-xl shadow-emerald-100"
              >
                Submit Proof <CheckCircle2 className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {isOwner && isOpen && displayMatches.length > 0 && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <BrainCircuit className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-black text-navy-900">AI Potential Matches</h2>
            </div>
            <Button 
              onClick={() => recommendMutation.mutate(Number(id))}
              disabled={recommendMutation.isPending}
              variant="outline" 
              className="rounded-xl font-bold border-slate-200 text-slate-600"
            >
              {recommendMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2 text-blue-500" />}
              Refresh Matches
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {displayMatches.map((workerOrId: any) => {
              const isMatchObject = typeof workerOrId === 'object';
              const workerId = isMatchObject ? workerOrId.worker_id : workerOrId;
              const workerInfo = isMatchObject ? workerOrId : workers.find(w => w.id === workerId);
              
              return (
                <div key={workerId} className="border border-slate-100 rounded-2xl p-6 bg-slate-50 flex flex-col justify-between hover:border-blue-200 transition-all hover:shadow-md">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-black text-lg text-navy-900">{workerInfo?.name || `Worker #${workerId}`}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                          {isMatchObject && workerInfo.distance_km ? `${workerInfo.distance_km}km away` : workerInfo?.primary_location || 'Unknown Location'}
                        </div>
                      </div>
                      {isMatchObject && workerInfo.match_score && (
                        <Badge className="bg-emerald-100 text-emerald-800 border-none font-black px-3 py-1">
                          {Math.round(workerInfo.match_score)}% Match
                        </Badge>
                      )}
                    </div>
                    {isMatchObject && workerInfo.recommendation_reason && (
                      <p className="text-sm text-slate-600 mt-4 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] uppercase font-black tracking-widest text-blue-500 block mb-1">AI Reason</span>
                        {workerInfo.recommendation_reason}
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={() => assignMutation.mutate({ taskId: Number(id), workerId })}
                    disabled={assignMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs h-12 rounded-xl mt-4"
                  >
                    {assignMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Assign & Create Escrow
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isOwner && isOpen && displayMatches.length === 0 && (
        <div className="bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center mb-8">
           <BrainCircuit className="w-8 h-8 text-slate-300 mx-auto mb-4" />
           <h3 className="text-lg font-black text-navy-900 mb-2">No Matches Found Yet</h3>
           <p className="text-slate-500 font-medium max-w-md mx-auto mb-6">The AI is currently analyzing worker profiles to find the best matches for this task. You can trigger a new search.</p>
           <Button 
             onClick={() => recommendMutation.mutate(Number(id))}
             disabled={recommendMutation.isPending}
             className="bg-navy-900 text-white font-black uppercase tracking-widest text-xs h-12 px-8 rounded-xl"
           >
             {recommendMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2 text-emerald-400" />}
             Find Workers
           </Button>
        </div>
      )}

      <SubmitProofModal 
        taskId={Number(id)} 
        isOpen={showSubmitModal} 
        onClose={() => setShowSubmitModal(false)} 
      />
    </motion.div>
  );
}
