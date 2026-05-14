import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { useSubmitKYC } from '../hooks/useWorkerProfileQueries';
import { useApp } from '../context/AppContext';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KYCModal({ isOpen, onClose }: KYCModalProps) {
  const { addToast } = useApp();
  const { mutate, isPending } = useSubmitKYC();

  const [form, setForm] = useState({
    nin: '', bvn: '', address_line1: '', address_line2: '',
    city: '', state: '', country: 'Nigeria',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.nin.length !== 11) { addToast('NIN must be exactly 11 digits', 'error'); return; }
    if (form.bvn.length !== 11) { addToast('BVN must be exactly 11 digits', 'error'); return; }

    mutate(form, {
      onSuccess: () => {
        addToast('KYC submitted! Pending admin review.', 'success');
        onClose();
      },
      onError: (err: Error) => addToast(err.message || 'KYC submission failed', 'error'),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <ShieldCheck className="w-7 h-7 text-white/80" />
              <DialogTitle className="text-2xl font-black tracking-tight text-white">
                KYC Verification
              </DialogTitle>
            </div>
            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
              NIN &amp; BVN are hashed before storage · Pending admin review
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">NIN (11 digits)</Label>
              <Input required maxLength={11} placeholder="12345678901" value={form.nin} onChange={set('nin')}
                className="h-12 rounded-2xl border-slate-100 font-mono tracking-wider" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">BVN (11 digits)</Label>
              <Input required maxLength={11} placeholder="22345678901" value={form.bvn} onChange={set('bvn')}
                className="h-12 rounded-2xl border-slate-100 font-mono tracking-wider" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">Address Line 1</Label>
            <Input required placeholder="12 Adeola Odeku Street" value={form.address_line1} onChange={set('address_line1')}
              className="h-12 rounded-2xl border-slate-100" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">Address Line 2 (optional)</Label>
            <Input placeholder="Flat 3B, Block A" value={form.address_line2} onChange={set('address_line2')}
              className="h-12 rounded-2xl border-slate-100" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">City</Label>
              <Input required placeholder="Lagos" value={form.city} onChange={set('city')}
                className="h-12 rounded-2xl border-slate-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">State</Label>
              <Input required placeholder="Lagos" value={form.state} onChange={set('state')}
                className="h-12 rounded-2xl border-slate-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">Country</Label>
              <Input value={form.country} onChange={set('country')}
                className="h-12 rounded-2xl border-slate-100" />
            </div>
          </div>

          <div className="pt-2 bg-emerald-50 rounded-2xl p-4 text-[10px] font-bold text-emerald-700 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Your NIN and BVN are hashed with MD5 before storage — never stored in plaintext.
          </div>

          <Button type="submit" disabled={isPending}
            className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100">
            {isPending
              ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting...</>
              : <><ShieldCheck className="w-5 h-5 mr-2" /> Submit KYC</>}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
