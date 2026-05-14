import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Landmark, Loader2, CheckCircle2 } from 'lucide-react';
import { useApplyForLoan } from '../hooks/useWorkerProfileQueries';
import { useApp } from '../context/AppContext';
import { formatNaira } from '../utils/formatters';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxAmount?: number;
}

export default function LoanModal({ isOpen, onClose, maxAmount = 500000 }: LoanModalProps) {
  const { addToast } = useApp();
  const { mutate, isPending } = useApplyForLoan();

  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [months, setMonths] = useState('6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(amount);
    if (amountNum > maxAmount) {
      addToast(`Max eligible loan is ${formatNaira(maxAmount)}`, 'error');
      return;
    }

    mutate(
      { amount_naira: amountNum, purpose, repayment_months: Number(months) },
      {
        onSuccess: () => {
          addToast('Loan application submitted! Pending review.', 'success');
          onClose();
        },
        onError: (err: Error) => addToast(err.message || 'Loan application failed', 'error'),
      }
    );
  };

  const monthlyPayment = amount
    ? Math.ceil(Number(amount) / Number(months)).toLocaleString()
    : '—';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-8 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <Landmark className="w-7 h-7 text-white/80" />
              <DialogTitle className="text-2xl font-black tracking-tight text-white">Apply for a Loan</DialogTitle>
            </div>
            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
              Zero paperwork · Instant disbursement · Based on trust score
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">
              Loan Amount (₦) · Max: {formatNaira(maxAmount)}
            </Label>
            <Input
              required type="number" min="1000" max={maxAmount}
              placeholder="50000"
              value={amount} onChange={e => setAmount(e.target.value)}
              className="h-12 rounded-2xl border-slate-100 text-lg font-black"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">Purpose</Label>
            <Textarea
              required
              placeholder="e.g. Buy work equipment, expand operations..."
              value={purpose} onChange={e => setPurpose(e.target.value)}
              className="rounded-2xl border-slate-100 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">Repayment Period (months)</Label>
            <div className="flex gap-3">
              {['3', '6', '9', '12'].map(m => (
                <button key={m} type="button" onClick={() => setMonths(m)}
                  className={`flex-1 h-12 rounded-2xl font-black text-sm border-2 transition-all ${
                    months === m
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'border-slate-100 text-slate-500 hover:border-blue-300'
                  }`}>
                  {m}mo
                </button>
              ))}
            </div>
          </div>

          {amount && (
            <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">Estimated Monthly Payment</div>
                <div className="text-xl font-black text-navy-900">₦{monthlyPayment}</div>
              </div>
            </div>
          )}

          <Button type="submit" disabled={isPending}
            className="w-full h-14 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100">
            {isPending
              ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting...</>
              : <><Landmark className="w-5 h-5 mr-2" /> Submit Application</>}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
