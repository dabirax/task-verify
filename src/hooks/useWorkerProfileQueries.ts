import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workerProfileApi } from '../services/workerProfileApi';
import type { KYCData, LoanApplication, InsuranceApplication } from '../types';

// ── Profile ──────────────────────────────────────────────────────────────────
export function useWorkerProfile(options?: Parameters<typeof useQuery>[0]) {
  return useQuery({
    queryKey: ['worker', 'profile'],
    queryFn: workerProfileApi.getProfile,
    ...options,
  } as Parameters<typeof useQuery>[0]);
}

export function useCreateWorkerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workerProfileApi.createProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['worker', 'profile'] }),
  });
}

export function useUpdateWorkerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<import('../types').Worker>) => workerProfileApi.updateProfile(data),
    onSuccess: (data: import('../types').Worker) => {
      queryClient.invalidateQueries({ queryKey: ['worker', 'profile'] });
      queryClient.setQueryData(['worker', 'profile'], data);
    },
  });
}

// ── Credit Score ──────────────────────────────────────────────────────────────
export function useWorkerCreditScore(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['worker', 'credit-score'],
    queryFn: workerProfileApi.getCreditScore,
    ...options,
  });
}

// ── KYC ───────────────────────────────────────────────────────────────────────
export function useWorkerKYC() {
  return useQuery({
    queryKey: ['worker', 'kyc'],
    queryFn: workerProfileApi.getKYCStatus,
  });
}

export function useSubmitKYC() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: KYCData) => workerProfileApi.submitKYC(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['worker', 'kyc'] }),
  });
}

// ── Loans ─────────────────────────────────────────────────────────────────────
export function useWorkerLoans() {
  return useQuery({
    queryKey: ['worker', 'loans'],
    queryFn: workerProfileApi.getLoans,
  });
}

export function useApplyForLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoanApplication) => workerProfileApi.applyForLoan(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['worker', 'loans'] }),
  });
}

// ── Insurance ─────────────────────────────────────────────────────────────────
export function useWorkerInsurance() {
  return useQuery({
    queryKey: ['worker', 'insurance'],
    queryFn: workerProfileApi.getInsurance,
  });
}

export function useApplyForInsurance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsuranceApplication) => workerProfileApi.applyForInsurance(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['worker', 'insurance'] }),
  });
}

// ── Worker Tasks ──────────────────────────────────────────────────────────────
export function useWorkerTasks(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['worker', 'tasks'],
    queryFn: workerProfileApi.getMyTasks,
    ...options,
  });
}

export function useWorkerTask(id: number) {
  return useQuery({
    queryKey: ['worker', 'tasks', id],
    queryFn: () => workerProfileApi.getMyTask(id),
    enabled: !!id,
  });
}

export function useRequestFundRelease() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, reason }: { taskId: number; reason: string }) =>
      workerProfileApi.requestFundRelease(taskId, reason),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['worker', 'tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['worker', 'tasks'] });
    },
  });
}
