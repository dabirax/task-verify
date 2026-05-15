import { useEffect, useRef } from 'react';
import { ArrowLeft, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { MessageItem } from './MessageItem';
import { MessageComposer } from './MessageComposer';
import { useConversationHistory, useSendMessage, useMarkHistoryRead } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../context/AppContext';

interface ConversationThreadProps {
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string | null;
  taskId?: number;
  onBack: () => void;
}

export function ConversationThread({
  otherUserId,
  otherUserName,
  otherUserAvatar,
  taskId,
  onBack,
}: ConversationThreadProps) {
  const { user } = useAuth();
  const { addToast } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: history, isLoading } = useConversationHistory(otherUserId, taskId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: markRead } = useMarkHistoryRead();

  // Mark thread as read when opened
  useEffect(() => {
    if (user?.id) {
      markRead({
        other_user_id: otherUserId,
        task_id: taskId,
      });
    }
  }, [otherUserId, taskId, markRead, user?.id]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history?.messages]);

  const handleSend = (body: string) => {
    if (!user?.id) {
      addToast('Not authenticated', 'error');
      return;
    }

    sendMessage(
      {
        recipient_user_id: otherUserId,
        body,
        task_id: taskId,
      },
      {
        onSuccess: () => {
          addToast('Message sent', 'success');
        },
        onError: () => {
          addToast('Failed to send message', 'error');
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-900">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        {otherUserAvatar && (
          <img
            src={otherUserAvatar}
            alt={otherUserName}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {otherUserName}
          </h3>
          {taskId && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Task #{taskId}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : history?.messages && history.messages.length > 0 ? (
          history.messages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              isOwn={String(msg.sender_user_id) === String(user?.id)}
              senderName={String(msg.sender_user_id) === String(user?.id) ? undefined : otherUserName}
              senderAvatar={String(msg.sender_user_id) === String(user?.id) ? undefined : otherUserAvatar}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs mt-1">Start the conversation below</p>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <MessageComposer
        onSend={handleSend}
        isLoading={isSending}
        placeholder={`Message ${otherUserName}...`}
      />
    </motion.div>
  );
}
