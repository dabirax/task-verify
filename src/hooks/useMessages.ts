import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '../services/messagesApi';
import type { SendMessagePayload, Message } from '../types';

export function useConversations(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['conversations', params],
    queryFn: () => messagesApi.getConversations(params),
    refetchInterval: 30_000, // poll every 30s
  });
}

export function useConversationHistory(
  otherUserId?: string,
  taskId?: number,
  params?: { limit?: number; offset?: number }
) {
  return useQuery({
    queryKey: ['conversation-history', otherUserId, taskId, params],
    queryFn: () =>
      messagesApi.getHistory({
        other_user_id: otherUserId,
        task_id: taskId,
        ...params,
      }),
    enabled: !!otherUserId,
    refetchInterval: 15_000, // poll every 15s while thread is open
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessagePayload) => messagesApi.sendMessage(data),
    onSuccess: () => {
      // Invalidate both conversation list and history to refresh UI
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation-history'] });
    },
  });
}

export function useMarkHistoryRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { other_user_id?: string; other_worker_id?: number; task_id?: number }) =>
      messagesApi.markHistoryRead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation-history'] });
    },
  });
}
