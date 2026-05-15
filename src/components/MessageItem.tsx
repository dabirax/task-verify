import { Check, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Message } from '../types';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  senderName?: string;
  senderAvatar?: string | null;
}

export function MessageItem({
  message,
  isOwn,
  senderName,
  senderAvatar,
}: MessageItemProps) {
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      {!isOwn && senderAvatar && (
        <img
          src={senderAvatar}
          alt={senderName}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      )}

      <div className={`flex flex-col gap-1 max-w-xs ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && senderName && (
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 px-3">
            {senderName}
          </p>
        )}

        <div
          className={`px-4 py-2 rounded-2xl break-words ${
            isOwn
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none'
          }`}
        >
          <p className="text-sm">{message.body}</p>
        </div>

        <div className="flex items-center gap-2 px-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatTime(message.created_at)}
          </span>
          {isOwn && (
            <>
              {message.is_read ? (
                <CheckCheck className="w-3 h-3 text-blue-600" />
              ) : (
                <Check className="w-3 h-3 text-slate-400" />
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
