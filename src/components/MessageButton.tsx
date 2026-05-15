import { MessageCircle, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { useSendMessage } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../context/AppContext';

interface MessageButtonProps {
  recipientUserId: string;
  recipientName: string;
  recipientWorkerId?: number;
  taskId?: number;
  onSuccess?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function MessageButton({
  recipientUserId,
  recipientName,
  recipientWorkerId,
  taskId,
  onSuccess,
  variant = 'outline',
  size = 'sm',
  className,
}: MessageButtonProps) {
  const { user } = useAuth();
  const { addToast } = useApp();
  const { mutate: sendMessage, isPending } = useSendMessage();

  const handleClick = () => {
    if (!user?.id) {
      addToast('Please log in to message', 'error');
      return;
    }

    if (user.id === recipientUserId) {
      addToast('Cannot message yourself', 'error');
      return;
    }

    // Send an empty/opening message or just navigate to inbox with thread
    // For now, we'll just navigate by opening the thread
    // In a full implementation, you might want to trigger a modal or navigate
    addToast(`Opening chat with ${recipientName}...`, 'info');
    onSuccess?.();
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      variant={variant}
      size={size}
      className={className}
      title={`Message ${recipientName}`}
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <MessageCircle className="w-4 h-4" />
      )}
      <span className="hidden sm:inline ml-2">Message</span>
    </Button>
  );
}
