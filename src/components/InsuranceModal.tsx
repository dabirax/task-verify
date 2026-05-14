import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ShieldCheck, Heart, Loader2, Activity, Umbrella } from 'lucide-react';
import { useApplyForInsurance } from '../hooks/useWorkerProfileQueries';
import { useApp } from '../context/AppContext';
import type { InsuranceApplication } from '../types';

interface InsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INSURANCE_TYPES: {
  value: InsuranceApplication['insurance_type'];
  label: string;
  desc: string;
  icon: typeof ShieldCheck;
  color: string;
}[] = [
  {
    value: 'health',
    label: 'Health Insurance',
    desc: 'Medical cover for illness and accidents',
    icon: Heart,
    color: 'text-red-500',
  },
  {
    value: 'income_protection',
    label: 'Income Protection',
    desc: 'Monthly payouts when unable to work',
    icon: Umbrella,
    color: 'text-blue-500',
  },
  {
    value: 'accident',
    label: 'Accident Cover',
    desc: 'Lump-sum on work-related accidents',
    icon: Activity,
    color: 'text-orange-500',
  },
];

export default function InsuranceModal({ isOpen, onClose }: InsuranceModalProps) {
  const { addToast } = useApp();
  const { mutate, isPending } = useApplyForInsurance();

  const [type, setType] = useState<InsuranceApplication['insurance_type']>('health');
  const [coverage, setCoverage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { insurance_type: type, coverage_amount_naira: coverage ? Number(coverage) : undefined },
      {
        onSuccess: () => {
          addToast('Insurance application submitted! Pending review.', 'success');
          onClose();
        },
        onError: (err: Error) => addToast(err.message || 'Insurance application failed', 'error'),
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-violet-700 to-purple-800 p-8 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <ShieldCheck className="w-7 h-7 text-white/80" />
              <DialogTitle className="text-2xl font-black tracking-tight text-white">Apply for Insurance</DialogTitle>
            </div>
            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
              Worker protection plans · Based on your trust tier
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">Choose Plan Type</Label>
            {INSURANCE_TYPES.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    type === t.value
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-slate-100 hover:border-violet-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${type === t.value ? 'bg-violet-100' : ''}`}>
                    <Icon className={`w-5 h-5 ${t.color}`} />
                  </div>
                  <div>
                    <div className="font-black text-navy-900 text-sm">{t.label}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t.desc}</div>
                  </div>
                  {type === t.value && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">
              Coverage Amount (₦) · Optional
            </Label>
            <Input
              type="number" min="10000" placeholder="e.g. 500000"
              value={coverage} onChange={e => setCoverage(e.target.value)}
              className="h-12 rounded-2xl border-slate-100 text-lg font-black"
            />
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Leave blank to use your AI-recommended coverage
            </p>
          </div>

          <Button type="submit" disabled={isPending}
            className="w-full h-14 rounded-2xl bg-violet-700 hover:bg-violet-800 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-violet-100">
            {isPending
              ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting...</>
              : <><ShieldCheck className="w-5 h-5 mr-2" /> Apply for Coverage</>}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
