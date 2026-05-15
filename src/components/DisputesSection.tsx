import { motion } from 'framer-motion';
import { AlertTriangle, Scale, Clock, CheckCircle2 } from 'lucide-react';
import { useBuyerDisputes } from '../hooks/useBuyerQueries';
import { useAuth } from '../hooks/useAuth';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SkeletonLoader, EmptyState } from './SkeletonLoader';
import { formatDate } from '../utils/formatters';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export function DisputesSection() {
  const { user } = useAuth();
  const { data: disputes, isLoading } = useBuyerDisputes();
  const navigate = useNavigate();

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!disputes || disputes.length === 0) {
    return (
      <div className="rounded-[2rem] border border-slate-100 shadow-xl p-8">
        <EmptyState
          icon={Scale}
          title="No Active Disputes"
          description="You don't have any ongoing disputes. All tasks are proceeding smoothly."
        />
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending Review' };
      case 'resolved':
        return { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Resolved' };
      case 'rejected':
        return { icon: AlertTriangle, bg: 'bg-red-50', text: 'text-red-700', label: 'Rejected' };
      default:
        return { icon: AlertTriangle, bg: 'bg-slate-50', text: 'text-slate-700', label: status };
    }
  };

  return (
    <div className="space-y-4">
      {disputes.map((dispute, index) => {
        const statusConfig = getStatusConfig(dispute.status);
        const StatusIcon = statusConfig.icon;

        return (
          <motion.div
            key={dispute.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-slate-100 rounded-[2rem] hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h3 className="font-black text-slate-900">
                        Task: {dispute.task?.title || `Task #${dispute.task_id}`}
                      </h3>
                    </div>

                    {dispute.reason && (
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <span className="font-bold">Issue: </span>
                        {dispute.reason}
                      </p>
                    )}

                    <div className="flex items-center flex-wrap gap-3 pt-2">
                      <Badge className={`${statusConfig.bg} ${statusConfig.text} border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1`}>
                        {statusConfig.label}
                      </Badge>

                      <span className="text-xs text-slate-400">
                        Filed on {formatDate(dispute.created_at)}
                      </span>

                      {dispute.resolved_at && (
                        <span className="text-xs text-slate-400">
                          Resolved on {formatDate(dispute.resolved_at)}
                        </span>
                      )}
                    </div>

                    {dispute.resolution_note && (
                      <div className="bg-slate-50 rounded-xl p-3 mt-3">
                        <p className="text-xs font-medium text-slate-700">
                          <span className="font-bold">Resolution: </span>
                          {dispute.resolution_note}
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => navigate(`/services/${dispute.task_id}`)}
                    variant="outline"
                    className="h-10 px-4 rounded-lg text-sm font-black uppercase tracking-widest whitespace-nowrap"
                  >
                    View Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
