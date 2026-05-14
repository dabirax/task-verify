import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Task } from '../types';

interface UseTasksOptions {
  status?: string;
  location?: string;
}

export function useTasks(options: UseTasksOptions = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTasks(options);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [options.status, options.location]);

  useEffect(() => {
    load();
  }, [load]);

  return { tasks, loading, error, refetch: load };
}
