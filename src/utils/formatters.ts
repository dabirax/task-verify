export const formatNaira = (amount: number): string => {
  const value = Number(amount);
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(1)}K`;
  return `₦${value.toLocaleString()}`;
};

export const formatNumber = (n: number): string => {
  const value = Number(n);
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
};

export const formatPercent = (rate: number): string => `${Math.round(Number(rate) * 100)}%`;

export const formatRating = (rating: number): string => Number(rating || 0).toFixed(1);

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatRelativeDate = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

export const trustScoreLabel = (score: number): { label: string; color: string } => {
  const value = Number(score);
  if (value >= 900) return { label: 'Excellent', color: 'text-emerald-600' };
  if (value >= 750) return { label: 'Good', color: 'text-blue-600' };
  if (value >= 600) return { label: 'Fair', color: 'text-yellow-600' };
  return { label: 'Building', color: 'text-orange-500' };
};

export const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  posted: { label: 'Open', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  selection_in_progress: { label: 'Selecting', bg: 'bg-amber-100', text: 'text-amber-700' },
  selected: { label: 'Worker Selected', bg: 'bg-amber-100', text: 'text-amber-700' },
  assigned: { label: 'Assigned', bg: 'bg-blue-100', text: 'text-blue-700' },
  submitted: { label: 'Under Review', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  verified: { label: 'Verified', bg: 'bg-green-100', text: 'text-green-700' },
  flagged_for_dispute: { label: 'Flagged', bg: 'bg-orange-100', text: 'text-orange-700' },
  completed: { label: 'Completed', bg: 'bg-slate-100', text: 'text-slate-600' },
  complaint_filed: { label: 'Complaint', bg: 'bg-red-100', text: 'text-red-700' },
  disputed: { label: 'Disputed', bg: 'bg-red-100', text: 'text-red-800' },
};

export const getInitials = (name: string): string =>
  name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

export const SKILL_COLORS: Record<string, string> = {
  cleaning: 'bg-sky-100 text-sky-700',
  delivery: 'bg-indigo-100 text-indigo-700',
  carpentry: 'bg-amber-100 text-amber-700',
  tailoring: 'bg-pink-100 text-pink-700',
  cooking: 'bg-orange-100 text-orange-700',
  driving: 'bg-blue-100 text-blue-700',
  security: 'bg-red-100 text-red-700',
  tutoring: 'bg-purple-100 text-purple-700',
  welding: 'bg-gray-100 text-gray-700',
  'phone repair': 'bg-teal-100 text-teal-700',
  default: 'bg-slate-100 text-slate-600',
};

export const getSkillColor = (skill: string): string =>
  SKILL_COLORS[skill.toLowerCase()] || SKILL_COLORS.default;
