import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Upload, Camera, CheckCircle2, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useApp } from '../context/AppContext';

interface SubmitProofModalProps {
  taskId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmitProofModal({ taskId, isOpen, onClose }: SubmitProofModalProps) {
  const { addToast } = useApp();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiClient<any>(`/api/v1/tasks/${taskId}/submit-proof`, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (data) => {
      addToast('Proof submitted successfully! AI verification in progress.', 'success');
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to submit proof', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('text', text);
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }
    mutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-navy-900 tracking-tight">Submit Work Proof</DialogTitle>
          <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Submit photos and details to trigger AI verification.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">Completion Details</Label>
            <Textarea 
              placeholder="Describe the work done..." 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="rounded-2xl border-slate-100 min-h-[120px] focus:ring-navy-900/10"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">Photos / Evidence</Label>
            <div className="grid grid-cols-2 gap-4">
              <label className="border-2 border-dashed border-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all group">
                <Input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  onChange={(e) => setFiles(e.target.files)}
                />
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-navy-900 group-hover:text-white transition-all">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add Photos</span>
              </label>
              
              <div className="border-2 border-dashed border-slate-50 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                {files ? (
                  <div className="space-y-1">
                    <div className="text-xs font-black text-navy-900">{files.length} Files</div>
                    <div className="text-[9px] font-bold text-emerald-500 uppercase">Ready to upload</div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-xs font-black text-slate-300">No Files</div>
                    <div className="text-[9px] font-bold text-slate-300 uppercase">Upload required</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="w-full h-14 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-navy-100"
            >
              {mutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-400" />
              )}
              {mutation.isPending ? 'Verifying...' : 'Submit Proof'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
