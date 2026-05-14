import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Worker } from '../types';
import { formatNaira, formatPercent, formatRating, getInitials, getSkillColor, trustScoreLabel } from '../utils/formatters';

interface WorkerCardProps {
  worker: Worker;
  matchScore?: number;
  matchReasons?: string[];
}

export default function WorkerCard({ worker, matchScore, matchReasons }: WorkerCardProps) {
  const { label: trustLabel, color: trustColor } = trustScoreLabel(worker.trust_score);
  const successRate = worker.tasks_completed > 0
    ? Math.round((worker.tasks_successful / worker.tasks_completed) * 100)
    : 0;

  const avatarBg = [
    'from-emerald-400 to-teal-500',
    'from-blue-400 to-indigo-500',
    'from-violet-400 to-purple-500',
    'from-orange-400 to-amber-500',
    'from-pink-400 to-rose-500',
  ][worker.id % 5];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(10,22,40,0.12)' }}
      className="card p-5 flex flex-col gap-4 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarBg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
          {worker.avatar_url ? (
            <img src={worker.avatar_url} alt={worker.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            getInitials(worker.name)
          )}
        </div>

        {/* Name & Location */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-navy-900 text-sm truncate">{worker.name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-xs text-slate-400">{worker.primary_location}</span>
          </div>
        </div>

        {/* Active Badge */}
        <div className="flex flex-col items-end gap-1">
          {worker.is_active && (
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs text-emerald-600 font-medium">Available</span>
            </div>
          )}
          {matchScore !== undefined && (
            <div className="badge bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs">
              {matchScore}% match
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {worker.skills.slice(0, 4).map((skill) => (
          <span key={skill} className={`badge text-xs ${getSkillColor(skill)}`}>
            {skill}
          </span>
        ))}
        {worker.skills.length > 4 && (
          <span className="badge bg-slate-100 text-slate-500 text-xs">+{worker.skills.length - 4}</span>
        )}
      </div>

      {/* AI Match Reasons */}
      {matchReasons && matchReasons.length > 0 && (
        <div className="bg-blue-50 rounded-xl px-3 py-2 border border-blue-100">
          <p className="text-xs text-blue-700 font-medium mb-1">🤖 AI Match Insights</p>
          <ul className="space-y-0.5">
            {matchReasons.slice(0, 2).map((reason, i) => (
              <li key={i} className="text-xs text-blue-600">• {reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-50 rounded-xl p-2.5 text-center">
          <div className="text-base font-bold text-navy-900">{worker.tasks_completed}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Tasks Done</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-2.5 text-center">
          <div className="text-base font-bold text-navy-900">{formatRating(worker.avg_rating)}★</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Avg Rating</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-2.5 text-center">
          <div className="text-base font-bold text-navy-900">{formatPercent(worker.on_time_rate)}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">On-Time</div>
        </div>
      </div>

      {/* Trust Score & Earnings */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-4 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-bold text-navy-900">{worker.trust_score}</span>
            <span className={`text-xs font-semibold ${trustColor}`}>{trustLabel}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 ml-3">Trust Score</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-navy-900">{formatNaira(worker.current_month_earnings)}</div>
          <div className="text-[10px] text-slate-400">This Month</div>
        </div>
      </div>

      {/* Success Rate Bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-slate-400 font-medium">Success Rate</span>
          <span className="text-[10px] font-semibold text-navy-900">{successRate}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${successRate}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
          />
        </div>
      </div>

      {/* CTA */}
      <Link
        to={`/workers`}
        className="btn-secondary text-xs py-2 justify-center group-hover:border-emerald-300 group-hover:text-emerald-700"
      >
        View Full Profile
      </Link>
    </motion.div>
  );
}
