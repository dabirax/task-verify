import { motion } from 'framer-motion';
import type { Task } from '../types';
import { formatNaira, formatDate, statusConfig, getSkillColor } from '../utils/formatters';
import { useApp } from '../context/AppContext';

interface TaskCardProps {
  task: Task;
  topMatch?: { name: string; score: number };
  onApply?: (task: Task) => void;
}

export default function TaskCard({ task, topMatch, onApply }: TaskCardProps) {
  const { addToast } = useApp();
  const status = statusConfig[task.status] ?? { label: task.status, bg: 'bg-slate-100', text: 'text-slate-600' };
  const isOpen = task.status === 'posted';
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(10,22,40,0.12)' }}
      className="card p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isUrgent && (
              <span className="badge bg-red-100 text-red-600 text-[10px] animate-pulse-slow">🔥 Urgent</span>
            )}
          </div>
          <h3 className="font-semibold text-navy-900 text-sm leading-snug">{task.title}</h3>
          <div className="flex items-center gap-1 mt-1">
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-xs text-slate-400">{task.task_location}</span>
          </div>
        </div>
        <span className={`badge flex-shrink-0 ${status.bg} ${status.text}`}>{status.label}</span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{task.description}</p>

      {/* Skills */}
      {task.required_skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] text-slate-400 font-medium self-center">Skills:</span>
          {task.required_skills.map((s) => (
            <span key={s} className={`badge text-xs ${getSkillColor(s)}`}>{s}</span>
          ))}
        </div>
      )}

      {/* AI Match Preview */}
      {topMatch && isOpen && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-3 py-2.5 border border-blue-100 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-bold">AI</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-blue-800 font-semibold truncate">
              {topMatch.score}% fit for {topMatch.name}
            </p>
            <p className="text-[10px] text-blue-500">Based on skills, location & rating</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div>
          <div className="text-lg font-bold text-navy-900">{formatNaira(task.amount_naira)}</div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {isPast
              ? 'Deadline passed'
              : isUrgent
              ? `${daysLeft}d left — urgent!`
              : `Due ${formatDate(task.due_date)}`}
          </div>
        </div>
        <button
          onClick={handleApply}
          disabled={!isOpen}
          className={`text-xs py-2 px-4 rounded-xl font-semibold transition-all duration-200 ${
            isOpen
              ? 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-glow-emerald active:scale-95'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isOpen ? 'Smart Apply →' : task.status === 'completed' ? 'Completed' : 'Unavailable'}
        </button>
      </div>

      {/* Escrow Badge */}
      {task.squad_va_account_number && (
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <div className="w-3 h-3 rounded-full bg-emerald-100 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          </div>
          <span>Funds secured in Squad escrow</span>
        </div>
      )}
    </motion.div>
  );
}
