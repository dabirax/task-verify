import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConversationList } from '../components/ConversationList';
import { ConversationThread } from '../components/ConversationThread';
import { useConversations } from '../hooks/useMessages';
import { SkeletonLoader } from '../components/SkeletonLoader';
import type { Conversation } from '../types';

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const { data: conversations, isLoading } = useConversations({ limit: 50 });

  const getConversationKey = (conv: Conversation | null) =>
    conv ? `${conv.other_user_id}:${conv.task_id ?? 'global'}` : undefined;

  const unreadCount =
    conversations?.reduce((sum, conv) => sum + conv.unread_count, 0) ?? 0;

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 bg-white dark:bg-slate-900 border-b shadow-sm">
        <MessageCircle className="w-6 h-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Messages
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full gap-4 p-4 max-w-7xl mx-auto w-full">
          {/* Conversation List */}
          <div className="w-full md:w-80 bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800">
            {isLoading ? (
              <div className="p-4">
                <SkeletonLoader count={3} />
              </div>
            ) : (
              <ConversationList
                conversations={conversations ?? []}
                isLoading={isLoading}
                onSelectConversation={setSelectedConversation}
                selectedConversationKey={getConversationKey(selectedConversation)}
              />
            )}
          </div>

          {/* Thread View */}
          <AnimatePresence mode="wait">
            {selectedConversation ? (
              <div key={getConversationKey(selectedConversation)} className="flex-1">
                <ConversationThread
                  otherUserId={selectedConversation.other_user_id}
                  otherUserName={selectedConversation.other_user_name}
                  otherUserAvatar={selectedConversation.other_user_avatar}
                  taskId={undefined}
                  onBack={() => setSelectedConversation(null)}
                />
              </div>
            ) : (
              <div
                key="empty"
                className="flex-1 hidden md:flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <MessageCircle className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                    Select a conversation
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                    Choose a chat to start messaging
                  </p>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
