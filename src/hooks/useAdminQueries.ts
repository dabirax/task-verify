import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';

// ── Dashboard ───────────────────────────────────────────────────────────────
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminApi.getDashboardStats,
  });
}

// ── Users ────────────────────────────────────────────────────────────────────
export function useAdminUsers(params?: { role?: string; search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.getUsers(params),
  });
}

export function useAdminUser(id: number) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => adminApi.getUser(id),
    enabled: !!id,
  });
}

export function useAdminCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useAdminUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useAdminDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deactivateUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

// ── Tasks ────────────────────────────────────────────────────────────────────
export function useAdminTasks(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'tasks', params],
    queryFn: () => adminApi.getTasks(params),
  });
}

export function useAdminTask(id: number) {
  return useQuery({
    queryKey: ['admin', 'tasks', id],
    queryFn: () => adminApi.getTask(id),
    enabled: !!id,
  });
}

export function useAdminUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status: string; admin_resolution?: string } }) =>
      adminApi.updateTaskStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useAdminReleaseFunds() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.releaseFunds(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'tasks'] }),
  });
}

export function useAdminRefundBuyer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.refundBuyer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'tasks'] }),
  });
}

export function useAdminPendingReleaseRequests() {
  return useQuery({
    queryKey: ['admin', 'pending-release-requests'],
    queryFn: adminApi.getPendingReleaseRequests,
  });
}

export function useAdminResolveWorkerRelease() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { decision: 'approve' | 'reject'; reason?: string } }) =>
      adminApi.resolveWorkerReleaseRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-release-requests'] });
    },
  });
}

// ── Disputes ─────────────────────────────────────────────────────────────────
export function useAdminDisputes(status?: string) {
  return useQuery({
    queryKey: ['admin', 'disputes', status],
    queryFn: () => adminApi.getDisputes(status),
  });
}

export function useAdminDispute(id: number) {
  return useQuery({
    queryKey: ['admin', 'disputes', id],
    queryFn: () => adminApi.getDispute(id),
    enabled: !!id,
  });
}

export function useAdminResolveDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { resolution: string; resolution_note?: string } }) =>
      adminApi.resolveDispute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'disputes'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

// ── Workers ──────────────────────────────────────────────────────────────────
export function useAdminWorkers(params?: { search?: string; is_active?: boolean }) {
  return useQuery({
    queryKey: ['admin', 'workers', params],
    queryFn: () => adminApi.getWorkers(params),
  });
}

export function useAdminUpdateWorker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateWorker(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'workers'] }),
  });
}

// ── Escrow ───────────────────────────────────────────────────────────────────
export function useAdminEscrows(status?: string) {
  return useQuery({
    queryKey: ['admin', 'escrows', status],
    queryFn: () => adminApi.getEscrows(status),
  });
}

export function useAdminUpdateEscrowStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => adminApi.updateEscrowStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'escrows'] }),
  });
}

// ── KYC ──────────────────────────────────────────────────────────────────────
export function useAdminKYCSubmissions(status?: string) {
  return useQuery({
    queryKey: ['admin', 'kyc', status],
    queryFn: () => adminApi.getKYCSubmissions(status),
  });
}

export function useAdminKYCDetail(id: number) {
  return useQuery({
    queryKey: ['admin', 'kyc', id],
    queryFn: () => adminApi.getKYCDetail(id),
    enabled: !!id,
  });
}

export function useAdminReviewKYC() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { decision: 'approved' | 'rejected'; rejection_reason?: string } }) =>
      adminApi.reviewKYC(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'kyc'] }),
  });
}

// ── Loans ─────────────────────────────────────────────────────────────────────
export function useAdminLoanApplications(status?: string) {
  return useQuery({
    queryKey: ['admin', 'loans', status],
    queryFn: () => adminApi.getLoanApplications(status),
  });
}

export function useAdminReviewLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.reviewLoan(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'loans'] }),
  });
}

export function useAdminDisburseLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.disburseLoan(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'loans'] }),
  });
}

// ── Insurance ─────────────────────────────────────────────────────────────────
export function useAdminInsuranceApplications(status?: string) {
  return useQuery({
    queryKey: ['admin', 'insurance', status],
    queryFn: () => adminApi.getInsuranceApplications(status),
  });
}

export function useAdminReviewInsurance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.reviewInsurance(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'insurance'] }),
  });
}

// ── AI & Audit Logs ───────────────────────────────────────────────────────────
export function useAdminAILogs(limit?: number) {
  return useQuery({
    queryKey: ['admin', 'ai-logs', limit],
    queryFn: () => adminApi.getAILogs(limit),
  });
}

export function useAdminAuditLogs(params?: { actor_id?: number; action?: string; entity_type?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: () => adminApi.getAuditLogs(params),
  });
}
