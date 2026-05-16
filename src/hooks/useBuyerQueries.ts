import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { buyerApi } from '../services/buyerApi';
import { api } from '../services/api';
import type { CreateTaskPayload } from '../types';

export function useBuyerTasks(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['buyer', 'tasks'],
    queryFn: buyerApi.getMyTasks,
    ...options,
  });
}

export function useBuyerTask(id: number) {
  return useQuery({
    queryKey: ['buyer', 'tasks', id],
    queryFn: () => buyerApi.getTaskDetail(id),
    enabled: !!id,
  });
}

export function useBuyerDisputes() {
  return useQuery({
    queryKey: ['buyer', 'disputes'],
    queryFn: buyerApi.getDisputes,
  });
}

export function useDisputeWindow(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['buyer', 'dispute-window', id],
    queryFn: () => buyerApi.getDisputeWindow(id),
    enabled: !!id && (options?.enabled ?? true),
    refetchInterval: 30_000,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskPayload) => buyerApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateTaskPayload> | FormData }) =>
      api.updateTask(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks', id] });
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useRecommendWorkers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.recommendWorkers(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(['tasks', id], data.task);
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
    },
  });
}

export function useShortlistWorkers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, workerIds }: { taskId: number; workerIds: number[] }) =>
      api.shortlistWorkers(taskId, workerIds),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
  });
}

export function useApplyForTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: { worker_id: number; proposed_price: number; message?: string } }) =>
      api.applyForTask(taskId, data),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
  });
}

export function useConfirmWorker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, workerId }: { taskId: number; workerId: number }) =>
      api.confirmWorker(taskId, workerId),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks'] });
    },
  });
}

export function useAcceptAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, workerId }: { taskId: number; workerId: number }) =>
      api.acceptAssignment(taskId, workerId),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['worker', 'tasks'] });
    },
  });
}

export function useAssignWorker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, workerId }: { taskId: number; workerId: number }) =>
      buyerApi.assignWorker(taskId, workerId),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks'] });
    },
  });
}

export function useReleaseFunds() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) => buyerApi.releaseFunds(taskId),
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks'] });
    },
  });
}

export function useDisputeTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, formData }: { taskId: number; formData: FormData }) =>
      buyerApi.disputeTask(taskId, formData),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['buyer', 'disputes'] });
    },
  });
}

export function useSubmitProof() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, formData }: { taskId: number; formData: FormData }) =>
      api.submitProof(taskId, formData),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['worker', 'tasks'] });
    },
  });
}

export function useFileComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) => api.fileComplaint(taskId),
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks', taskId] });
    },
  });
}

export function useFileDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, message }: { taskId: number; message?: string }) =>
      api.fileDispute(taskId, message),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'tasks', taskId] });
    },
  });
}
