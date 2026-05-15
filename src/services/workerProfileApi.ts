import { apiClient } from './apiClient';
import type {
  Worker,
  CreditScore,
  WorkerKyc,
  WorkerLoan,
  WorkerInsurance,
  KYCData,
  LoanApplication,
  InsuranceApplication,
  Task,
} from '../types';

export const workerProfileApi = {
  // ── Profile ────────────────────────────────────────────────────────────────
  getProfile: () =>
    apiClient<Worker & { tier: string; credit_score?: number; credit_band?: string }>('/api/v1/worker-profile/me'),

  createProfile: (data: {
    name: string;
    primary_location: string;
    phone?: string;
    skills?: string[];
    bio?: string;
    latitude?: number;
    longitude?: number;
    avatar_url?: string;
  }) =>
    apiClient<{ message: string; worker: Worker }>('/api/v1/worker-profile/create', {
      method: 'POST',
      body: data,
    }),
  updateProfile: (data: Partial<{
    name: string;
    phone?: string;
    skills?: string[];
    bio?: string;
    primary_location?: string;
    latitude?: number;
    longitude?: number;
    avatar_url?: string;
  }>) =>
    apiClient<Worker>('/api/v1/worker-profile/me', { method: 'PATCH', body: data }),

  // ── Credit Score ──────────────────────────────────────────────────────────
  getCreditScore: () =>
    apiClient<CreditScore>('/api/v1/worker-profile/me/credit-score'),

  // ── KYC ───────────────────────────────────────────────────────────────────
  getKYCStatus: () =>
    apiClient<WorkerKyc | { status: 'not_submitted' }>('/api/v1/worker-profile/me/kyc'),

  submitKYC: (data: KYCData) =>
    apiClient<WorkerKyc>('/api/v1/worker-profile/me/kyc', {
      method: 'POST',
      body: data,
    }),

  // ── Loans ─────────────────────────────────────────────────────────────────
  getLoans: () =>
    apiClient<WorkerLoan[]>('/api/v1/worker-profile/me/loans'),

  applyForLoan: (data: LoanApplication) =>
    apiClient<WorkerLoan>('/api/v1/worker-profile/me/loans', {
      method: 'POST',
      body: data,
    }),

  // ── Insurance ─────────────────────────────────────────────────────────────
  getInsurance: () =>
    apiClient<WorkerInsurance[]>('/api/v1/worker-profile/me/insurance'),

  applyForInsurance: (data: InsuranceApplication) =>
    apiClient<WorkerInsurance>('/api/v1/worker-profile/me/insurance', {
      method: 'POST',
      body: data,
    }),

  // ── Tasks ─────────────────────────────────────────────────────────────────
  getMyTasks: () =>
    apiClient<Task[]>('/api/v1/worker-profile/me/tasks'),

  getMyTask: (id: number) =>
    apiClient<Task>(`/api/v1/worker-profile/me/tasks/${id}`),

  requestFundRelease: (id: number, reason: string) =>
    apiClient<{ message: string; status: string; next_steps: string[] }>(
      `/api/v1/worker-profile/me/tasks/${id}/request-release`,
      { method: 'POST', body: { reason } }
    ),
};
