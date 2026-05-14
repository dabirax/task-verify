import { apiClient } from './apiClient';
import type { AdminDashboardStats, AILog, AuditLog, Task, EscrowAccount, WorkerKyc, WorkerLoan, WorkerInsurance, Dispute } from '../types';

export const adminApi = {
  // ── Dashboard ─────────────────────────────────────────────────────────────
  getDashboardStats: () =>
    apiClient<AdminDashboardStats>('/api/v1/admin/dashboard'),

  // ── Users ─────────────────────────────────────────────────────────────────
  getUsers: (params?: { role?: string; search?: string; page?: number; limit?: number }) =>
    apiClient<any[]>('/api/v1/admin/users', { params }),

  createUser: (data: { email: string; password: string; full_name: string; role?: string; worker_id?: number }) =>
    apiClient<any>('/api/v1/admin/users', { method: 'POST', body: data }),

  getUser: (id: number) =>
    apiClient<any>(`/api/v1/admin/users/${id}`),

  updateUser: (id: number, data: { role?: string; is_active?: boolean; full_name?: string; phone?: string }) =>
    apiClient<any>(`/api/v1/admin/users/${id}`, { method: 'PATCH', body: data }),

  deactivateUser: (id: number) =>
    apiClient<any>(`/api/v1/admin/users/${id}`, { method: 'DELETE' }),

  // ── Tasks ─────────────────────────────────────────────────────────────────
  getTasks: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient<Task[]>('/api/v1/admin/tasks', { params }),

  getTask: (id: number) =>
    apiClient<Task>(`/api/v1/admin/tasks/${id}`),

  updateTaskStatus: (id: number, data: { status: string; admin_resolution?: string }) =>
    apiClient<any>(`/api/v1/admin/tasks/${id}/status`, { method: 'PATCH', body: data }),

  releaseFunds: (id: number) =>
    apiClient<any>(`/api/v1/admin/tasks/${id}/release-funds`, { method: 'POST' }),

  refundBuyer: (id: number) =>
    apiClient<any>(`/api/v1/admin/tasks/${id}/refund`, { method: 'POST' }),

  extendDisputeWindow: (id: number, hours?: number) =>
    apiClient<any>(`/api/v1/admin/tasks/${id}/extend-dispute-window`, {
      method: 'POST',
      body: { hours: hours ?? 24 },
    }),

  resolveWorkerReleaseRequest: (id: number, data: { decision: 'approve' | 'reject'; reason?: string }) =>
    apiClient<any>(`/api/v1/admin/tasks/${id}/resolve-worker-release-request`, {
      method: 'PATCH',
      body: data,
    }),

  getPendingReleaseRequests: () =>
    apiClient<{ pending_requests: any[]; count: number }>('/api/v1/admin/pending-release-requests'),

  // ── Disputes ──────────────────────────────────────────────────────────────
  getDisputes: (status?: string) =>
    apiClient<Dispute[]>('/api/v1/admin/disputes', { params: { status } }),

  getDispute: (id: number) =>
    apiClient<Dispute>(`/api/v1/admin/disputes/${id}`),

  resolveDispute: (id: number, data: { resolution: string; resolution_note?: string }) =>
    apiClient<any>(`/api/v1/admin/disputes/${id}/resolve`, { method: 'PATCH', body: data }),

  // ── Workers ───────────────────────────────────────────────────────────────
  getWorkers: (params?: { search?: string; is_active?: boolean }) =>
    apiClient<any[]>('/api/v1/admin/workers', { params }),

  updateWorker: (id: number, data: { trust_score?: number; is_active?: boolean; skills?: string[]; bio?: string }) =>
    apiClient<any>(`/api/v1/admin/workers/${id}`, { method: 'PATCH', body: data }),

  // ── Escrow ────────────────────────────────────────────────────────────────
  getEscrows: (status?: string) =>
    apiClient<EscrowAccount[]>('/api/v1/admin/escrow', { params: { status } }),

  updateEscrowStatus: (id: number, status: string) =>
    apiClient<any>(`/api/v1/admin/escrow/${id}/status`, { method: 'PATCH', body: { status } }),

  // ── KYC ───────────────────────────────────────────────────────────────────
  getKYCSubmissions: (status?: string) =>
    apiClient<WorkerKyc[]>('/api/v1/admin/kyc', { params: { status } }),

  getKYCDetail: (id: number) =>
    apiClient<WorkerKyc>(`/api/v1/admin/kyc/${id}`),

  reviewKYC: (id: number, data: { decision: 'approved' | 'rejected'; rejection_reason?: string }) =>
    apiClient<any>(`/api/v1/admin/kyc/${id}/review`, { method: 'PATCH', body: data }),

  // ── Loans ─────────────────────────────────────────────────────────────────
  getLoanApplications: (status?: string) =>
    apiClient<WorkerLoan[]>('/api/v1/admin/loans', { params: { status } }),

  getLoan: (id: number) =>
    apiClient<WorkerLoan>(`/api/v1/admin/loans/${id}`),

  reviewLoan: (id: number, data: { decision: 'approved' | 'rejected'; admin_note?: string; rejection_reason?: string }) =>
    apiClient<any>(`/api/v1/admin/loans/${id}/review`, { method: 'PATCH', body: data }),

  disburseLoan: (id: number) =>
    apiClient<any>(`/api/v1/admin/loans/${id}/disburse`, { method: 'PATCH' }),

  // ── Insurance ─────────────────────────────────────────────────────────────
  getInsuranceApplications: (status?: string) =>
    apiClient<WorkerInsurance[]>('/api/v1/admin/insurance', { params: { status } }),

  getInsurance: (id: number) =>
    apiClient<WorkerInsurance>(`/api/v1/admin/insurance/${id}`),

  reviewInsurance: (id: number, data: { decision: 'active' | 'rejected'; admin_note?: string; rejection_reason?: string; expires_at?: string }) =>
    apiClient<any>(`/api/v1/admin/insurance/${id}/review`, { method: 'PATCH', body: data }),

  // ── AI & Audit Logs ───────────────────────────────────────────────────────
  getAILogs: (limit?: number) =>
    apiClient<AILog[]>('/api/v1/admin/ai-logs', { params: { limit } }),

  getAuditLogs: (params?: { actor_id?: number; action?: string; entity_type?: string; page?: number; limit?: number }) =>
    apiClient<AuditLog[]>('/api/v1/admin/audit-logs', { params }),
};
