import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface UseWorkersOptions {
  location?: string;
  skill?: string;
  minRating?: number;
}

export function useWorkers(options: UseWorkersOptions = {}) {
  const query = useQuery({
    queryKey: ['workers', options],
    queryFn: () => api.getWorkers(options),
  });

  return {
    workers: query.data || [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refetch: query.refetch,
  };
}

export function useWorker(id: number) {
  const query = useQuery({
    queryKey: ['workers', id],
    queryFn: () => api.getWorker(id),
    enabled: !!id,
  });

  return {
    worker: query.data || null,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refetch: query.refetch,
  };
}
