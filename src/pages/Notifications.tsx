import { motion } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Mail,
  MailOpen,
  BrainCircuit,
  Briefcase,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../hooks/useNotifications';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { SkeletonLoader, EmptyState } from '../components/SkeletonLoader';
import { useApp } from '../context/AppContext';
import type { Notification } from '../types';

const typeConfig: Record<string, { icon: typeof Bell; bg: string; text: string }> = {
  task_update: { icon: Briefcase, bg: 'bg-blue-50', text: 'text-blue-600' },
  ai_decision: { icon: BrainCircuit, bg: 'bg-violet-50', text: 'text-violet-600' },
  kyc: { icon: ShieldCheck, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  dispute: { icon: AlertTriangle, bg: 'bg-red-50', text: 'text-red-600' },
  payment: { icon: CheckCheck, bg: 'bg-teal-50', text: 'text-teal-600' },
  default: { icon: Info, bg: 'bg-slate-50', text: 'text-slate-500' },
};

function NotificationItem({ n, onRead }: { n: Notification; onRead: (id: number) => void }) {
  const cfg = typeConfig[n.type] ?? typeConfig.default;
  const Icon = cfg.icon;
  const timeAgo = new Date(n.created_at).toLocaleString('en-NG', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-5 p-6 rounded-3xl border transition-all cursor-pointer group ${
        n.is_read
          ? 'bg-white border-slate-50 hover:border-slate-100'
          : 'bg-blue-50/40 border-blue-100 hover:border-blue-200'
      }`}
      onClick={() => !n.is_read && onRead(n.id)}
    >
      <div className={`w-11 h-11 rounded-2xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${cfg.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-sm font-black ${n.is_read ? 'text-slate-600' : 'text-navy-900'}`}>{n.title}</p>
            <p className="text-[11px] font-medium text-slate-400 mt-1 leading-relaxed">{n.message}</p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{timeAgo}</span>
            {!n.is_read && (
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            )}
          </div>
        </div>
        {n.type && (
          <Badge className={`mt-2 ${cfg.bg} ${cfg.text} border-none font-black text-[8px] uppercase tracking-widest`}>
            {n.type.replace(/_/g, ' ')}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}

export default function Notifications() {
  const { addToast } = useApp();
  const { data: notifications, isLoading } = useNotifications({ limit: 50 });
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: markingAll } = useMarkAllNotificationsRead();

  const unreadCount = notifications?.filter(n => !n.is_read).length ?? 0;

  const handleMarkAllRead = () => {
    markAllRead(undefined, {
      onSuccess: () => addToast('All notifications marked as read', 'success'),
      onError: () => addToast('Failed to mark notifications', 'error'),
    });
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="page-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-navy-900 tracking-tight leading-tight mb-2 flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-500" />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Stay updated on tasks, AI decisions, and platform activity.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="h-11 px-6 rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </Button>
          )}
        </div>

        <Card className="border-none shadow-2xl shadow-navy-100/40 rounded-[2.5rem] bg-white overflow-hidden">
          <CardContent className="p-6 space-y-3">
            {isLoading ? (
              <SkeletonLoader type="dashboard" />
            ) : !notifications?.length ? (
              <EmptyState
                title="No notifications yet"
                description="You'll see task updates, AI decisions, and platform alerts here."
              />
            ) : (
              notifications.map(n => (
                <NotificationItem
                  key={n.id}
                  n={n}
                  onRead={id => markRead(id)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
