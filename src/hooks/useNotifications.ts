import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../services/notificationsApi';
import { useAuth } from './useAuth';

export function useNotifications(params?: { limit?: number; offset?: number }) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationsApi.getNotifications(params),
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? 60_000 : false, // poll every 60s if authenticated
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationsApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useBroadcastNotification() {
  return useMutation({
    mutationFn: notificationsApi.broadcast,
  });
}

export function useSendNotification() {
  return useMutation({
    mutationFn: notificationsApi.send,
  });
}
