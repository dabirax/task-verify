import { apiClient } from './apiClient';
import type { Message, Conversation, ConversationHistory, SendMessagePayload } from '../types';

export const messagesApi = {
  // Send a new message
  sendMessage: (data: SendMessagePayload) =>
    apiClient<{ message: Message }>(
      '/api/v1/messages',
      { method: 'POST', body: data }
    ),

  // Get list of conversations (inbox)
  getConversations: async (params?: { limit?: number; offset?: number }) => {
    const conversations = await apiClient<Conversation[]>(
      '/api/v1/messages/conversations',
      { params }
    );

    return conversations.map((conv) => {
      const rawLastMessage = conv.last_message;
      const normalizedLastMessage =
        typeof rawLastMessage === 'string'
          ? rawLastMessage
          : rawLastMessage?.body ?? null;
      const normalizedLastMessageAt =
        conv.last_message_at ??
        (typeof rawLastMessage === 'object' ? rawLastMessage?.created_at : undefined);

      return {
        ...conv,
        last_message: normalizedLastMessage,
        last_message_at: normalizedLastMessageAt,
      };
    });
  },

  // Get conversation history with a specific user
  getHistory: async (params: { other_user_id?: string; other_worker_id?: number; task_id?: number; limit?: number; offset?: number }) => {
    const response = await apiClient<ConversationHistory | Message[]>(
      '/api/v1/messages/history',
      { params }
    );

    if (Array.isArray(response)) {
      const messages = [...response].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      return {
        messages,
        other_user_id: params.other_user_id ?? '',
        other_user_name: '',
        other_user_avatar: null,
        task_id: params.task_id ?? null,
      } satisfies ConversationHistory;
    }

    return {
      ...response,
      messages: (response.messages ?? []).slice().sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    };
  },

  // Mark a thread as read
  markHistoryRead: (data: { other_user_id?: string; other_worker_id?: number; task_id?: number }) =>
    apiClient<any>(
      '/api/v1/messages/history/read',
      { method: 'POST', body: data }
    ),
};
