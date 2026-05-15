import { useState, useRef } from 'react';
import { AlertTriangle, Upload, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useDisputeTask } from '../hooks/useBuyerQueries';
import { useApp } from '../context/AppContext';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  taskTitle: string;
  onSuccess?: () => void;
}

export function DisputeModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  onSuccess,
}: DisputeModalProps) {
  const [reason, setReason] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useApp();
  const { mutate: disputeTask, isPending } = useDisputeTask();

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileRemove = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!reason.trim()) {
      addToast('Please provide a reason for the dispute', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('reason', reason.trim());
    files.forEach(file => {
      formData.append('evidence_files', file);
    });

    disputeTask(
      { taskId, formData },
      {
        onSuccess: () => {
          addToast('Dispute filed successfully', 'success');
          setReason('');
          setFiles([]);
          onSuccess?.();
          onClose();
        },
        onError: () => {
          addToast('Failed to file dispute', 'error');
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            File a Dispute
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">
              Task: <span className="font-bold text-slate-900">{taskTitle}</span>
            </p>
            <p className="text-xs text-slate-500">
              Explain why you're disputing this task. Provide clear details and any supporting evidence.
            </p>
          </div>

          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the issue with this task..."
            className="min-h-32 resize-none"
            disabled={isPending}
          />

          <div>
            <label className="text-sm font-medium text-slate-900 mb-2 block">
              Evidence Files (Optional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileAdd}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
              disabled={isPending}
            />
            
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Add Evidence Files
            </Button>

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <span className="text-sm font-medium text-slate-600 truncate">
                      {file.name}
                    </span>
                    <button
                      onClick={() => handleFileRemove(index)}
                      disabled={isPending}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-medium text-amber-800">
              ⚠️ This dispute will be reviewed by our admin team. False claims may result in penalties.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!reason.trim() || isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <AlertTriangle className="w-4 h-4 mr-2" />
              )}
              File Dispute
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
