import { apiClient } from './apiClient';
import type {
  Worker,
  Task,
  WorkerStats,
  FinancialProfile,
  User,
  WorkerMatch,
  TaskVerificationResult,
  Notification,
  Wallet,
  WalletTransaction,
  CreateTaskPayload,
} from '../types';

// ─── Health ────────────────────────────────────────────────────────────────────
export const api = {
  health: () =>
    apiClient<{ status: string; timestamp: string; environment: string }>('/health'),

  // ─── Auth ────────────────────────────────────────────────────────────────────
  login: (credentials: { email: string; password: string }) =>
    apiClient<{ user: User; token: string }>('/api/v1/auth/login', {
      method: 'POST',
      body: credentials,
    }),

  register: (data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    role?: string;
    worker_id?: number;
  }) =>
    apiClient<{ user: User; token: string }>('/api/v1/auth/register', {
      method: 'POST',
      body: data,
    }),

  // ─── Tasks (Public/General) ──────────────────────────────────────────────────
  getTasks: (params?: { status?: string; location?: string }) =>
    apiClient<Task[]>('/api/v1/tasks', { params }),

  getTask: (id: number) =>
    apiClient<Task>(`/api/v1/tasks/${id}`),

  createTask: (data: CreateTaskPayload) =>
    apiClient<{ task: Task; matches: WorkerMatch[] }>('/api/v1/tasks', {
      method: 'POST',
      body: data,
    }),

  createTaskMultipart: (formData: FormData) =>
    apiClient<{ task: Task; matches: WorkerMatch[] }>('/api/v1/tasks', {
      method: 'POST',
      body: formData,
    }),

  updateTask: (id: number, data: Partial<CreateTaskPayload> | FormData) =>
    apiClient<{ task: Task; message: string }>(`/api/v1/tasks/${id}`, {
      method: 'PATCH',
      body: data,
    }),

  deleteTask: (id: number) =>
    apiClient<void>(`/api/v1/tasks/${id}`, { method: 'DELETE' }),

  recommendWorkers: (id: number) =>
    apiClient<{ task: Task; matches: WorkerMatch[]; message: string }>(`/api/v1/tasks/${id}/recommend-workers`, {
      method: 'POST',
    }),

  getTaskStatus: (id: number) =>
    apiClient<{
      id: number;
      status: string;
      assigned_worker_id: number | null;
      submitted_at: string | null;
      verified_at: string | null;
    }>(`/api/v1/tasks/${id}/status`),

  shortlistWorkers: (id: number, worker_ids: number[]) =>
    apiClient<any>(`/api/v1/tasks/${id}/shortlist`, {
      method: 'POST',
      body: { worker_ids },
    }),

  applyForTask: (id: number, data: { worker_id: number; proposed_price: number; message?: string }) =>
    apiClient<any>(`/api/v1/tasks/${id}/apply`, {
      method: 'POST',
      body: data,
    }),

  confirmWorker: (id: number, worker_id: number) =>
    apiClient<any>(`/api/v1/tasks/${id}/confirm-worker`, {
      method: 'POST',
      body: { worker_id },
    }),

  acceptAssignment: (id: number, worker_id: number) =>
    apiClient<{ task: Task; escrow: any }>(`/api/v1/tasks/${id}/accept-assignment`, {
      method: 'POST',
      body: { worker_id },
    }),

  recommendFinal: (id: number) =>
    apiClient<any>(`/api/v1/tasks/${id}/recommend-final`, { method: 'POST' }),

  assignWorker: (id: number, worker_id: number) =>
    apiClient<{ task: Task; escrow: any }>(`/api/v1/tasks/${id}/assign`, {
      method: 'POST',
      body: { worker_id },
    }),

  submitProof: (id: number, formData: FormData) =>
    apiClient<{ task: Task; verification: TaskVerificationResult }>(`/api/v1/tasks/${id}/submit-proof`, {
      method: 'POST',
      body: formData,
    }),

  fileComplaint: (id: number) =>
    apiClient<{ message: string; task: Task }>(`/api/v1/tasks/${id}/complaint`, {
      method: 'POST',
      body: {},
    }),

  fileDispute: (id: number, message?: string) =>
    apiClient<{ message: string; task: Task }>(`/api/v1/tasks/${id}/dispute`, {
      method: 'POST',
      body: { message },
    }),

  // ─── Workers (Public/General) ────────────────────────────────────────────────
  getWorkers: (params?: { location?: string; skill?: string; minRating?: number }) =>
    apiClient<Worker[]>('/api/v1/workers', { params }),

  getWorker: (id: number) =>
    apiClient<Worker>(`/api/v1/workers/${id}`),

  createWorker: (data: {
    name: string;
    email: string;
    primary_location: string;
    phone?: string;
    skills?: string[];
    bio?: string;
    latitude?: number;
    longitude?: number;
    avatar_url?: string;
  }) =>
    apiClient<Worker>('/api/v1/workers', { method: 'POST', body: data }),

  updateWorker: (id: number, data: Partial<Worker>) =>
    apiClient<Worker>(`/api/v1/workers/${id}`, { method: 'PUT', body: data }),

  getWorkerStats: (id: number) =>
    apiClient<WorkerStats>(`/api/v1/workers/${id}/stats`),

  getWorkerFinancialProfile: (id: number) =>
    apiClient<FinancialProfile>(`/api/v1/workers/${id}/financial-profile`),

  // ─── Worker Profile (Authenticated) ──────────────────────────────────────────
  getWorkerProfileMe: () =>
    apiClient<Worker>('/api/v1/worker-profile/me'),

  createWorkerProfileMe: (data: {
    name: string;
    primary_location: string;
    bio?: string;
  }) =>
    apiClient<Worker>('/api/v1/worker-profile/create', { method: 'POST', body: data }),

  updateWorkerProfileMe: (data: Partial<Worker>) =>
    apiClient<Worker>('/api/v1/worker-profile/me', { method: 'PUT', body: data }),

  // ─── Wallet ──────────────────────────────────────────────────────────────────
  getWallet: () =>
    apiClient<Wallet>('/api/v1/wallet'),

  getWalletTransactions: () =>
    apiClient<WalletTransaction[]>('/api/v1/wallet/transactions'),

  generateVirtualAccount: () =>
    apiClient<{ success: boolean; virtualAccount: string }>('/api/v1/wallet/virtual-account', {
      method: 'POST',
    }),

  requestWithdrawal: (data: {
    amount: number;
    bankCode: string;
    bankAccountNumber: string;
    bankName: string;
  }) =>
    apiClient<{ success: boolean; message: string; wallet: Wallet }>('/api/v1/wallet/withdraw', {
      method: 'POST',
      body: data,
    }),

  // ─── Notifications ───────────────────────────────────────────────────────────
  getNotifications: (params?: { limit?: number; offset?: number }) =>
    apiClient<Notification[]>('/api/v1/notifications', { params }),

  markNotificationRead: (id: number) =>
    apiClient<any>(`/api/v1/notifications/${id}/read`, { method: 'POST' }),

  markAllNotificationsRead: () =>
    apiClient<any>('/api/v1/notifications/read-all', { method: 'POST' }),

  broadcastNotification: (data: { title: string; message: string; targetRole?: string }) =>
    apiClient<any>('/api/v1/notifications/broadcast', { method: 'POST', body: data }),

  sendNotification: (data: { userId: number; title: string; message: string; type?: string; metadata?: object }) =>
    apiClient<any>('/api/v1/notifications/send', { method: 'POST', body: data }),

  // ─── Debug ───────────────────────────────────────────────────────────────────
  getDebugAILogs: () =>
    apiClient<any[]>('/api/v1/debug/ai-logs'),
};
