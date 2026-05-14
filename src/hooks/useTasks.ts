import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface UseTasksOptions {
  status?: string;
  location?: string;
}

export function useTasks(options: UseTasksOptions = {}) {
  const query = useQuery({
    queryKey: ['tasks', options],
    queryFn: () => api.getTasks(options),
  });

  return {
    tasks: query.data || [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refetch: query.refetch,
  };
}

export function useTask(id: number) {
  const query = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => api.getTask(id),
    enabled: !!id,
  });

  return {
    task: query.data || null,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refetch: query.refetch,
  };
}
