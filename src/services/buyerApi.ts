import { apiClient } from './apiClient';
import type { Task, EscrowAccount, Dispute, DisputeWindow, CreateTaskPayload, WorkerMatch } from '../types';

export const buyerApi = {
  getMyTasks: () =>
    apiClient<Task[]>('/api/v1/buyer/tasks'),

  getTaskDetail: (id: number) =>
    apiClient<Task>(`/api/v1/buyer/tasks/${id}`),

  createTask: (data: CreateTaskPayload) =>
    apiClient<{ task: Task; matches: WorkerMatch[] }>('/api/v1/buyer/tasks', {
      method: 'POST',
      body: data,
    }),

  assignWorker: (id: number, worker_id: number) =>
    apiClient<{ task: Task; escrow: EscrowAccount }>(`/api/v1/buyer/tasks/${id}/assign`, {
      method: 'POST',
      body: { worker_id },
    }),

  releaseFunds: (id: number) =>
    apiClient<any>(`/api/v1/buyer/tasks/${id}/release-funds`, { method: 'POST' }),

  disputeTask: (id: number, formData: FormData) =>
    apiClient<any>(`/api/v1/buyer/tasks/${id}/dispute`, {
      method: 'POST',
      body: formData,
    }),

  getDisputeWindow: (id: number) =>
    apiClient<DisputeWindow>(`/api/v1/buyer/tasks/${id}/dispute-window`),

  getDisputes: () =>
    apiClient<Dispute[]>('/api/v1/buyer/disputes'),
};
