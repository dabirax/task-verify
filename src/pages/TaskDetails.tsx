import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { useAssignWorker, useRecommendWorkers, useApplyForTask, useConfirmWorker, useAcceptAssignment, useReleaseFunds, useDisputeWindow, useDeleteTask } from '../hooks/useBuyerQueries';
import { useRequestFundRelease, useWorkerProfile } from '../hooks/useWorkerProfileQueries';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { formatNaira, formatDate, statusConfig, getSkillColor } from '../utils/formatters';
import { MapPin, Calendar, Clock, Lock, CheckCircle2, Zap, ArrowLeft, Loader2, BrainCircuit, Users, Search, MessageCircle, AlertTriangle, Cpu, CheckSquare, Pencil, Trash2 } from 'lucide-react';
import SubmitProofModal from '../components/SubmitProofModal';
import { Input } from '../components/ui/input';
import { useMemo, useRef, useState } from 'react';
import { QuickMessageModal } from '../components/QuickMessageModal';
import { DisputeModal } from '../components/DisputeModal';
import EditTaskModal from '../components/EditTaskModal';
import type { WorkerMatch } from '../types';

type UseCaseFilter = 'best_skill_fit' | 'safest_option' | 'nearest_worker' | 'budget_sensitive';

const USE_CASE_TABS: Array<{ key: UseCaseFilter; label: string }> = [
  { key: 'best_skill_fit', label: 'Best Skill Fit' },
  { key: 'safest_option', label: 'Safest Option' },
  { key: 'nearest_worker', label: 'Nearest Worker' },
  { key: 'budget_sensitive', label: 'Budget Sensitive' },
];

const DEFAULT_RECOMMENDATION_REASON = 'Matched by deterministic engine.';
const DEFAULT_TRADEOFF_NOTE = 'Review trust score and risk before assignment.';

export default function TaskDetails() {
  const { id } = useParams();
  const taskIdNumber = Number(id);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const matches = location.state?.matches || [];
  const { addToast } = useApp();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageWorker, setMessageWorker] = useState<{ id: number; name: string; avatar_url?: string | null } | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState<{ id: number | string; name: string; avatar_url?: string | null; isWorker: boolean } | null>(null);
  const [activeUseCase, setActiveUseCase] = useState<UseCaseFilter>('best_skill_fit');
  const [focusedWorkerId, setFocusedWorkerId] = useState<number | null>(null);
  const workerCardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const { data: workerProfile } = useWorkerProfile({ enabled: user?.role === 'worker' });
  const actualWorkerId = user?.worker_id || workerProfile?.id;

  const { data: task, isLoading: taskLoading } = useQuery({
    queryKey: ['tasks', taskIdNumber],
    queryFn: () => api.getTask(taskIdNumber),
    enabled: !!id,
  });

  const { data: disputeWindow, isLoading: disputeWindowLoading } = useDisputeWindow(taskIdNumber, {
    enabled: user?.role === 'buyer' || user?.role === 'employer',
  });

  const { data: workers = [] } = useQuery({
    queryKey: ['workers'],
    queryFn: () => api.getWorkers(),
  });

  const assignMutation = useAssignWorker();
  const confirmMutation = useConfirmWorker();
  const acceptMutation = useAcceptAssignment();
  const recommendMutation = useRecommendWorkers();
  const applyMutation = useApplyForTask();
  const releaseFundsMutation = useReleaseFunds();
  const deleteTaskMutation = useDeleteTask();
  const requestReleaseMutation = useRequestFundRelease();
  
  const displayMatches = task?.ai_recommendations?.length
    ? task.ai_recommendations
    : (matches.length > 0 ? matches : (task?.shortlisted_workers || []));

  const mappedMatches = useMemo(() => {
    return (displayMatches || []).map((workerOrId) => {
      const isMatchObject = typeof workerOrId === 'object' && workerOrId !== null;
      const raw = (isMatchObject ? workerOrId : {}) as Partial<WorkerMatch>;
      const workerId = isMatchObject ? Number(raw.worker_id) : Number(workerOrId);
      const workerData = workers.find((w) => w.id === workerId);
      const useCaseTags = Array.isArray(raw.use_case_tags) ? raw.use_case_tags : [];
      const strengths = Array.isArray(raw.strengths) ? raw.strengths : [];
      const risks = Array.isArray(raw.risks) ? raw.risks : [];
      const recommendationReason = raw.recommendation_reason || DEFAULT_RECOMMENDATION_REASON;
      const tradeoffNote = raw.tradeoff_note || DEFAULT_TRADEOFF_NOTE;
      const confidence = typeof raw.confidence === 'number' ? raw.confidence : null;
      const metadataSparse = !raw.recommendation_reason || !raw.tradeoff_note || useCaseTags.length === 0;

      return {
        worker_id: workerId,
        name: raw.name || workerData?.name || `Worker #${workerId}`,
        match_score: typeof raw.match_score === 'number' ? raw.match_score : 0,
        rank: raw.rank,
        recommendation_reason: recommendationReason,
        tradeoff_note: tradeoffNote,
        use_case_tags: useCaseTags,
        strengths,
        risks,
        confidence,
        distance_km: typeof raw.distance_km === 'number' ? raw.distance_km : 0,
        avatar_url: workerData?.avatar_url,
        primary_location: workerData?.primary_location || 'Unknown Location',
        metadataSparse,
      };
    });
  }, [displayMatches, workers]);

  const filteredMatches = useMemo(() => {
    return mappedMatches.filter((m) => {
      if (activeUseCase === 'best_skill_fit') {
        return m.use_case_tags.length === 0 || m.use_case_tags.includes(activeUseCase);
      }
      return m.use_case_tags.includes(activeUseCase);
    });
  }, [activeUseCase, mappedMatches]);

  const scenarioRecommendations = Array.isArray(task?.scenario_recommendations) ? task.scenario_recommendations : [];

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
  const isOwner = String(user?.id) === String(task.buyer_user_id);
  const isAssignedToWorker = Boolean(task.assigned_worker_id) && Number(task.assigned_worker_id) === Number(actualWorkerId);
  const isAssignedToMeActive = isAssignedToWorker && task.status === 'assigned';
  const isSelectedWorker = Boolean(task.selected_worker_id) && Number(task.selected_worker_id) === Number(actualWorkerId);
  const isOpen = task.status === 'posted' || task.status === 'open' || task.status === 'selection_in_progress';
  const isSelectionActive = isOwner && (task.status === 'posted' || task.status === 'open' || task.status === 'selected' || task.status === 'selection_in_progress');
  const canEditTask = isOwner && ['posted', 'open', 'selection_in_progress', 'selected'].includes(task.status);
  const canDeleteTask = isOwner && ['posted', 'open', 'selection_in_progress'].includes(task.status);
  const isFlaggedNotVerified =
    task.status === 'flagged_for_dispute' ||
    ((task.ai_verification_result as { verified?: boolean } | null | undefined)?.verified === false);

  const formatRemainingTime = (seconds?: number) => {
    if (!seconds || seconds <= 0) return 'Expired';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container pt-32 pb-12 max-w-7xl">
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
            {isOwner && (
              <div className="flex gap-2 mt-4 md:justify-end">
                <Button
                  onClick={() => setShowEditTaskModal(true)}
                  variant="outline"
                  className={`h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest border-slate-200 text-slate-700 ${!canEditTask ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!canEditTask}
                  title={!canEditTask ? 'Cannot edit once a worker is assigned or task is closed' : 'Edit task'}
                >
                  <Pencil className="w-3.5 h-3.5 mr-2" />
                  Edit Task
                </Button>

                <Button
                  onClick={() => {
                    const confirmed = window.confirm('Delete this task? This action cannot be undone.');
                    if (!confirmed) return;
                    deleteTaskMutation.mutate(task.id, {
                      onSuccess: () => {
                        addToast('Task deleted successfully', 'success');
                        navigate('/services');
                      },
                      onError: (err: unknown) => {
                        const message = err instanceof Error ? err.message : 'Failed to delete task';
                        addToast(message, 'error');
                      },
                    });
                  }}
                  disabled={!canDeleteTask || deleteTaskMutation.isPending}
                  variant="outline"
                  className={`h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest ${!canDeleteTask ? 'border-slate-200 text-slate-400 opacity-50 cursor-not-allowed' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
                  title={!canDeleteTask ? 'Cannot delete after selection has progressed' : 'Delete task'}
                >
                  {deleteTaskMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Trash2 className="w-3.5 h-3.5 mr-2" />}
                  Delete Task
                </Button>
              </div>
            )}
          </div>
        </div>

        {(task.status === 'selected' || task.status === 'selection_in_progress') && isSelectedWorker && (
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="text-lg font-black text-amber-900 mb-1">You've Been Selected! 🎉</h3>
              <p className="text-sm font-medium text-amber-700">The client has confirmed you for this task. Accept the assignment to automatically lock the client's funds into a secure Escrow vault and begin working.</p>
            </div>
            <Button 
              onClick={() => acceptMutation.mutate({ taskId: Number(id), workerId: actualWorkerId! })}
              disabled={acceptMutation.isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-widest px-8 h-12 rounded-xl whitespace-nowrap shadow-md"
            >
              {acceptMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
              Accept & Lock Funds
            </Button>
          </div>
        )}

        {isAssignedToWorker && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-black text-xl shadow-inner">
                {task.client_name?.[0] || 'C'}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Task Client</div>
                <div className="text-lg font-black text-navy-900">{task.client_name || `Client #${task.buyer_user_id}`}</div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="bg-white px-6 py-4 rounded-xl border border-emerald-100 shadow-sm flex flex-col">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Contact Email</div>
                <div className="text-sm font-bold text-navy-900">{task.client_email || 'Not available'}</div>
              </div>
              <Button
                onClick={() => {
                  setMessageRecipient({ id: task.buyer_user_id || '', name: task.client_name || 'Client', avatar_url: undefined, isWorker: false });
                  setShowMessageModal(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest px-6 h-12 rounded-xl whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Client
              </Button>
            </div>
          </div>
        )}

        {isOwner && (task.status === 'selected' || task.status === 'selection_in_progress') && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-10 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-700">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-amber-900 mb-0.5">Awaiting Worker Acceptance</h3>
              <p className="text-sm font-medium text-amber-700">You have confirmed a worker. Your funds will be locked in an escrow vault automatically as soon as they accept.</p>
            </div>
          </div>
        )}

        {isOwner && task.assigned_worker_id && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-black text-xl shadow-inner">
                {workers.find(w => w.id === task.assigned_worker_id)?.name?.[0] || 'W'}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Assigned Worker</div>
                <div className="text-lg font-black text-navy-900">{workers.find(w => w.id === task.assigned_worker_id)?.name || `Worker #${task.assigned_worker_id}`}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                onClick={() => {
                  const workerInfo = workers.find(w => w.id === task.assigned_worker_id);
                  if (!task.assigned_worker_id) return;
                  setMessageWorker({
                    id: task.assigned_worker_id,
                    name: workerInfo?.name || `Worker #${task.assigned_worker_id}`,
                    avatar_url: workerInfo?.avatar_url,
                  });
                  setShowMessageModal(true);
                }}
                className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Worker
              </Button>
            </div>
            
            {task.squad_va_account_number && (
              <div className="bg-white px-6 py-4 rounded-xl border border-indigo-100 shadow-sm flex flex-col w-full md:w-auto">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><Lock className="w-3 h-3 text-emerald-500"/> Escrow Vault</div>
                <div className="text-xl font-black text-navy-900 tracking-wider font-mono">{task.squad_va_account_number}</div>
                <div className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Funds locked & secured</div>
              </div>
            )}
          </div>
        )}

        <div className="prose prose-slate max-w-none mb-10">
          <h3 className="text-lg font-black text-navy-900 mb-3">Description</h3>
          <p className="text-slate-600 font-medium leading-relaxed">{task.description}</p>
        </div>

        {task.ai_verification_result && typeof task.ai_verification_result === 'object' && Object.keys(task.ai_verification_result).length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-10 border border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-navy-900">AI Verification Details</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(task.ai_verification_result as Record<string, any>).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-xl border border-blue-100">
                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 flex items-center gap-2">
                    <CheckSquare className="w-3 h-3" />
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-sm font-bold text-navy-900">
                    {typeof value === 'boolean' ? (
                      <span className={value ? 'text-emerald-600' : 'text-red-600'}>
                        {value ? '✓ Verified' : '✗ Not Verified'}
                      </span>
                    ) : typeof value === 'number' ? (
                      <span>{(value * 100).toFixed(1)}%</span>
                    ) : (
                      <span>{String(value)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
            {(task.deliverable_spec as any).reference_image_urls && ((task.deliverable_spec as any).reference_image_urls as string[]).length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Reference Images</div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {((task.deliverable_spec as any).reference_image_urls as string[]).map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="shrink-0 hover:opacity-80 transition-opacity">
                      <img src={url} alt={`Reference ${i + 1}`} className="w-24 h-24 object-cover rounded-xl shadow-sm border border-slate-200" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end border-t border-slate-100 pt-8 mt-8">
          {isOpen && !isOwner && user?.role === 'worker' && !isSelectedWorker && !isAssignedToWorker && (
            <Button 
              onClick={() => {
                if (actualWorkerId) {
                  applyMutation.mutate({ 
                    taskId: Number(id), 
                    data: { worker_id: actualWorkerId, proposed_price: task.amount_naira, message: "I'm ready to do this job!" } 
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

          {isAssignedToWorker && (
            <div className="flex gap-4">
              {(task.status === 'completed' || task.status === 'pending_release_of_funds') && (
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
              {(task.status === 'assigned' || isFlaggedNotVerified) && (
                <Button 
                  onClick={() => setShowSubmitModal(true)}
                  className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-xl shadow-emerald-100"
                >
                  Submit Proof <CheckCircle2 className="ml-2 w-5 h-5" />
                </Button>
              )}
              {(task.status === 'verified' || task.status === 'submitted' || task.status === 'completed' || task.status === 'pending_release_of_funds' || isFlaggedNotVerified) && (
                <Button 
                  onClick={() => setShowDisputeModal(true)}
                  variant="outline"
                  className="h-14 px-8 rounded-2xl font-black text-sm uppercase tracking-widest border-red-200 text-red-600 hover:bg-red-50"
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Dispute Task
                </Button>
              )}
            </div>
          )}

          {isOwner && (
            <div className="flex gap-4">
              {(task.status === 'submitted' || task.status === 'verified' || task.status === 'pending_release_of_funds') && (
                <div className={`h-14 px-5 rounded-2xl border flex items-center gap-2 ${
                  disputeWindow?.is_open
                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}>
                  <Clock className="w-4 h-4" />
                  <div className="leading-tight">
                    <div className="text-[10px] font-black uppercase tracking-widest">Dispute Window</div>
                    <div className="text-xs font-bold">
                      {disputeWindowLoading
                        ? 'Checking...'
                        : disputeWindow?.is_open
                          ? formatRemainingTime(disputeWindow.seconds_remaining)
                          : 'Closed'}
                    </div>
                  </div>
                </div>
              )}

              {(task.status === 'submitted' || task.status === 'verified' || task.status === 'pending_release_of_funds' || isFlaggedNotVerified) && (
                <Button
                  onClick={() => setShowDisputeModal(true)}
                  disabled={!isFlaggedNotVerified && !disputeWindow?.is_open}
                  variant="outline"
                  className="h-14 px-8 rounded-2xl font-black text-sm uppercase tracking-widest border-red-200 text-red-600 hover:bg-red-50"
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Dispute Task
                </Button>
              )}

              {(task.status === 'verified' || task.status === 'pending_release_of_funds' || isFlaggedNotVerified) && (
                <Button
                  onClick={() => releaseFundsMutation.mutate(taskIdNumber, {
                    onSuccess: () => addToast('Funds released to worker successfully', 'success'),
                    onError: () => addToast('Failed to release funds', 'error'),
                  })}
                  disabled={releaseFundsMutation.isPending}
                  className="h-14 px-8 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-black text-sm uppercase tracking-widest"
                >
                  {releaseFundsMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Lock className="w-5 h-5 mr-2" />}
                  Force Release Funds
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {isSelectionActive && (
        <div className="grid lg:grid-cols-3 gap-6 mb-8 items-start">
          
          {/* Column 1: AI Matches */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-6 flex flex-col max-h-[800px]">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-3">
                <BrainCircuit className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-black text-navy-900">AI Matches</h2>
              </div>
              <Button 
                onClick={() => recommendMutation.mutate(Number(id))}
                disabled={recommendMutation.isPending}
                variant="outline" 
                className="w-full rounded-xl font-bold border-slate-200 text-slate-600"
              >
                {recommendMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2 text-blue-500" />}
                Refresh Matches
              </Button>

              <div className="grid grid-cols-2 gap-2">
                {USE_CASE_TABS.map((tab) => (
                  <Button
                    key={tab.key}
                    type="button"
                    variant="outline"
                    onClick={() => setActiveUseCase(tab.key)}
                    className={`h-9 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      activeUseCase === tab.key
                        ? 'border-blue-500 text-blue-700 bg-blue-50'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              {scenarioRecommendations.length > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">Scenario Recommendations</div>
                  {scenarioRecommendations.map((scenario) => {
                    const preferredId = Number(scenario.preferred_worker_id);
                    return (
                      <button
                        key={`${scenario.use_case}-${scenario.preferred_worker_id}`}
                        type="button"
                        className="w-full text-left bg-white rounded-lg border border-blue-100 p-2 hover:border-blue-300"
                        onClick={() => {
                          const scenarioKey = scenario.use_case as UseCaseFilter;
                          if (USE_CASE_TABS.some((tab) => tab.key === scenarioKey)) {
                            setActiveUseCase(scenarioKey);
                          }
                          setFocusedWorkerId(preferredId);
                          workerCardRefs.current[preferredId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                      >
                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-700">{scenario.use_case}</div>
                        <div className="text-xs font-bold text-slate-700 mt-1">Worker #{scenario.preferred_worker_id}</div>
                        <div className="text-xs text-slate-600 mt-1">{scenario.why}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {filteredMatches.length > 0 ? filteredMatches.map((workerInfo) => {
                const workerId = workerInfo.worker_id;

                return (
                  <div
                    key={workerId}
                    ref={(el) => {
                      workerCardRefs.current[workerId] = el;
                    }}
                    className={`border rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-md ${
                    task.selected_worker_id === workerId 
                      ? 'border-amber-300 bg-amber-50/50 shadow-sm relative' 
                      : focusedWorkerId === workerId
                        ? 'border-blue-300 bg-blue-50/40 shadow-sm relative'
                      : 'border-slate-100 bg-slate-50 hover:border-blue-200'
                  }`}
                  >
                    {task.selected_worker_id === workerId && (
                      <div className="absolute -top-3 -right-3 bg-amber-500 text-white rounded-full p-1.5 shadow-md">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-black text-lg text-navy-900">{workerInfo.name || `Worker #${workerId}`}</div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                            {workerInfo.distance_km ? `${workerInfo.distance_km}km away` : workerInfo.primary_location}
                          </div>
                        </div>
                        {workerInfo.match_score > 0 && (
                          <Badge className="bg-emerald-100 text-emerald-800 border-none font-black px-3 py-1">
                            {Math.round(workerInfo.match_score)}% Match
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-slate-600 mt-4 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] uppercase font-black tracking-widest text-blue-500 block mb-1">Recommendation</span>
                        {workerInfo.recommendation_reason}
                      </p>

                      <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
                        <span className="text-[10px] uppercase font-black tracking-widest text-amber-700 block mb-1">Skill vs Trust Tradeoff</span>
                        <p className="text-sm text-amber-900 font-medium">{workerInfo.tradeoff_note}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {workerInfo.use_case_tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] uppercase tracking-widest font-black border-blue-200 text-blue-700 bg-blue-50">
                            {tag}
                          </Badge>
                        ))}
                        {workerInfo.confidence !== null && (
                          <Badge className="bg-slate-900 text-white border-none text-[10px] uppercase tracking-widest font-black">
                            Confidence {Math.round(workerInfo.confidence)}
                          </Badge>
                        )}
                        {workerInfo.metadataSparse && (
                          <Badge className="bg-amber-100 text-amber-800 border-none text-[10px] uppercase tracking-widest font-black">
                            Sparse AI Metadata
                          </Badge>
                        )}
                      </div>

                      <details className="mt-3 bg-white border border-slate-100 rounded-xl p-3">
                        <summary className="cursor-pointer text-[10px] uppercase tracking-widest font-black text-slate-500">Strengths & Risks</summary>
                        <div className="mt-2 grid grid-cols-1 gap-3">
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1">Strengths</div>
                            {workerInfo.strengths.length > 0 ? (
                              <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
                                {workerInfo.strengths.map((item, idx) => (
                                  <li key={`${workerId}-s-${idx}`}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <div className="text-xs text-slate-500">No strengths provided.</div>
                            )}
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-rose-700 mb-1">Risks</div>
                            {workerInfo.risks.length > 0 ? (
                              <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
                                {workerInfo.risks.map((item, idx) => (
                                  <li key={`${workerId}-r-${idx}`}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <div className="text-xs text-slate-500">No risks provided.</div>
                            )}
                          </div>
                        </div>
                      </details>
                    </div>
                    <Button 
                      onClick={() => confirmMutation.mutate({ taskId: Number(id), workerId: workerId })}
                      disabled={confirmMutation.isPending || task.selected_worker_id === workerId}
                      className={`w-full font-black uppercase tracking-widest text-xs h-12 rounded-xl mt-4 ${
                        task.selected_worker_id === workerId
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {confirmMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {task.selected_worker_id === workerId ? 'Pending Acceptance' : 'Confirm Worker'}
                    </Button>
                    <Button 
                      onClick={() => {
                        setMessageWorker({ id: workerId, name: workerInfo.name || `Worker #${workerId}`, avatar_url: workerInfo.avatar_url });
                        setShowMessageModal(true);
                      }}
                      variant="outline"
                      className="w-full font-black uppercase tracking-widest text-xs h-12 rounded-xl mt-2 border-slate-200 text-slate-600"
                    >
                      <MessageCircle className="w-3 h-3 mr-2" /> Message
                    </Button>
                  </div>
                );
              }) : (
                <div className="text-center py-10 text-slate-400 font-medium">No matches found for this use-case.</div>
              )}
            </div>
          </div>
          {/* Column 2: Manual Worker Search */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-6 flex flex-col max-h-[800px]">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-black text-navy-900">Search Hub</h2>
            </div>
            
            <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search workers by name, skills, or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-slate-50 border-none rounded-xl text-base font-medium"
            />
          </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {workers
              .filter(w => 
                !searchTerm || 
                w.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                w.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
                w.primary_location?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(worker => (
                <div key={worker.id} className={`border rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-md ${
                  task.selected_worker_id === worker.id
                    ? 'border-amber-300 bg-amber-50/50 shadow-sm relative'
                    : 'border-slate-100 bg-slate-50 hover:border-indigo-200'
                }`}>
                  {task.selected_worker_id === worker.id && (
                    <div className="absolute -top-3 -right-3 bg-amber-500 text-white rounded-full p-1.5 shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  <div className="mb-4">
                    <div className="font-black text-lg text-navy-900">{worker.name}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                      {worker.primary_location || 'Unknown Location'}
                    </div>
                    {worker.skills && worker.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {worker.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} className="bg-white text-slate-600 border border-slate-200 text-[9px] uppercase font-bold px-2 py-0.5">
                            {skill}
                          </Badge>
                        ))}
                        {worker.skills.length > 3 && (
                          <Badge className="bg-white text-slate-600 border border-slate-200 text-[9px] uppercase font-bold px-2 py-0.5">
                            +{worker.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={() => confirmMutation.mutate({ taskId: Number(id), workerId: worker.id })}
                    disabled={confirmMutation.isPending || task.selected_worker_id === worker.id}
                    className={`w-full font-black uppercase tracking-widest text-xs h-12 rounded-xl mt-4 ${
                      task.selected_worker_id === worker.id
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {confirmMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {task.selected_worker_id === worker.id ? 'Pending Acceptance' : 'Confirm Worker'}
                  </Button>
                  <Button 
                    onClick={() => {
                      setMessageWorker({ id: worker.id, name: worker.name, avatar_url: worker.avatar_url });
                      setShowMessageModal(true);
                    }}
                    variant="outline"
                    className="w-full font-black uppercase tracking-widest text-xs h-12 rounded-xl mt-2 border-slate-200 text-slate-600"
                  >
                    <MessageCircle className="w-3 h-3 mr-2" /> Message
                  </Button>
                </div>
              ))}
            {workers.filter(w => 
                !searchTerm || 
                w.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                w.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
                w.primary_location?.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-10 text-slate-400 font-medium">
                  No workers found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Pending Acceptance */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-6 flex flex-col max-h-[800px]">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-black text-navy-900">Pending</h2>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {task.selected_worker_id ? workers.filter(w => w.id === task.selected_worker_id).map(worker => (
                <div key={worker.id} className="border border-amber-300 bg-amber-50/50 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative">
                  <div className="absolute -top-3 -right-3 bg-amber-500 text-white rounded-full p-1.5 shadow-md">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="mb-4">
                    <div className="font-black text-lg text-amber-900">{worker.name}</div>
                    <div className="text-xs font-bold text-amber-700 uppercase tracking-widest mt-1">
                      {worker.primary_location || 'Unknown Location'}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-100 text-sm font-medium text-amber-800 text-center">
                    Awaiting worker's response to lock escrow.
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-slate-400 font-medium">
                  No workers are currently pending acceptance. Select a worker from the AI matches or Search Hub to proceed.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      <SubmitProofModal 
        taskId={Number(id)} 
        isOpen={showSubmitModal} 
        onClose={() => setShowSubmitModal(false)} 
      />

      {showMessageModal && (messageWorker || messageRecipient) && (
        <QuickMessageModal
          isOpen={showMessageModal}
          onClose={() => {
            setShowMessageModal(false);
            setMessageWorker(null);
            setMessageRecipient(null);
          }}
          recipientUserId={messageWorker?.id?.toString() || messageRecipient?.id?.toString() || ''}
          recipientName={messageWorker?.name || messageRecipient?.name || ''}
          recipientAvatar={messageWorker?.avatar_url || messageRecipient?.avatar_url}
          taskId={Number(id)}
        />
      )}

      <DisputeModal
        isOpen={showDisputeModal}
        onClose={() => setShowDisputeModal(false)}
        taskId={Number(id)}
        taskTitle={task.title}
      />

      <EditTaskModal
        isOpen={showEditTaskModal}
        onClose={() => setShowEditTaskModal(false)}
        task={task}
      />
    </motion.div>
  );
}
