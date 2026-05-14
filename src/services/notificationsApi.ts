import { apiClient } from './apiClient';
import type { Notification } from '../types';

export const notificationsApi = {
  getNotifications: (params?: { limit?: number; offset?: number }) =>
    apiClient<Notification[]>('/api/v1/notifications', { params }),

  markRead: (id: number) =>
    apiClient<any>(`/api/v1/notifications/${id}/read`, { method: 'POST' }),

  markAllRead: () =>
    apiClient<any>('/api/v1/notifications/read-all', { method: 'POST' }),

  broadcast: (data: { title: string; message: string; targetRole?: string }) =>
    apiClient<any>('/api/v1/notifications/broadcast', { method: 'POST', body: data }),

  send: (data: { userId: number; title: string; message: string; type?: string; metadata?: Record<string, unknown> }) =>
    apiClient<any>('/api/v1/notifications/send', { method: 'POST', body: data }),
};
