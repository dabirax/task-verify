import { useState } from 'react';
import { X, Send, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useSendMessage } from '../hooks/useMessages';
import { useApp } from '../context/AppContext';

interface QuickMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientUserId: string;
  recipientName: string;
  recipientAvatar?: string | null;
  taskId?: number;
  onSuccess?: () => void;
}

export function QuickMessageModal({
  isOpen,
  onClose,
  recipientUserId,
  recipientName,
  recipientAvatar,
  taskId,
  onSuccess,
}: QuickMessageModalProps) {
  const [body, setBody] = useState('');
  const { addToast } = useApp();
  const { mutate: sendMessage, isPending } = useSendMessage();

  const handleSend = () => {
    if (!body.trim()) {
      addToast('Please write a message', 'error');
      return;
    }

    sendMessage(
      {
        recipient_user_id: recipientUserId,
        body: body.trim(),
        task_id: taskId,
      },
      {
        onSuccess: () => {
          addToast(`Message sent to ${recipientName}`, 'success');
          setBody('');
          onSuccess?.();
          onClose();
        },
        onError: () => {
          addToast('Failed to send message', 'error');
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {recipientAvatar && (
              <img
                src={recipientAvatar}
                alt={recipientName}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-base font-bold">Message {recipientName}</p>
              {taskId && <p className="text-xs text-slate-500">Task #{taskId}</p>}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`Send a message to ${recipientName}...`}
            className="min-h-24 resize-none"
            disabled={isPending}
            autoFocus
          />

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!body.trim() || isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
