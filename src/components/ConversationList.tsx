import { motion } from 'framer-motion';
import { MessageCircle, Loader } from 'lucide-react';
import { Badge } from './ui/badge';
import type { Conversation } from '../types';

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  onSelectConversation: (conv: Conversation) => void;
  selectedConversationKey?: string;
}

export function ConversationList({
  conversations,
  isLoading,
  onSelectConversation,
  selectedConversationKey,
}: ConversationListProps) {
  const getConversationKey = (conv: Conversation) =>
    `${conv.other_user_id}:${conv.task_id ?? 'global'}`;

  const getMessagePreview = (lastMessage: unknown) => {
    if (typeof lastMessage === 'string') return lastMessage;
    if (lastMessage && typeof lastMessage === 'object' && 'body' in lastMessage) {
      const body = (lastMessage as { body?: unknown }).body;
      return typeof body === 'string' ? body : 'No messages yet';
    }
    return 'No messages yet';
  };

  const formatTime = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <MessageCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          No conversations yet
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
          Start messaging workers or buyers
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {conversations.map((conv, index) => (
        <motion.button
          key={getConversationKey(conv)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelectConversation(conv)}
          className={`w-full p-4 text-left transition-all hover:bg-blue-50 dark:hover:bg-slate-800 ${
            selectedConversationKey === getConversationKey(conv)
              ? 'bg-blue-100 dark:bg-slate-800'
              : 'bg-white dark:bg-slate-900'
          }`}
        >
          <div className="flex items-start gap-3">
            {conv.other_user_avatar && (
              <img
                src={conv.other_user_avatar}
                alt={conv.other_user_name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                  {conv.other_user_name}
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                  {formatTime(conv.last_message_at)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                  {conv.is_sender_last && (
                    <span className="font-medium text-slate-900 dark:text-white">You: </span>
                  )}
                  {getMessagePreview(conv.last_message)}
                </p>
                {conv.unread_count > 0 && (
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0">
                    {conv.unread_count}
                  </Badge>
                )}
              </div>

              {conv.task_id && (
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Task #{conv.task_id}
                </p>
              )}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
