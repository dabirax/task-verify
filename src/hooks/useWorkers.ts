import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Worker } from '../types';

interface UseWorkersOptions {
  location?: string;
  skill?: string;
  minRating?: number;
}

export function useWorkers(options: UseWorkersOptions = {}) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getWorkers(options);
      setWorkers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workers');
    } finally {
      setLoading(false);
    }
  }, [options.location, options.skill, options.minRating]);

  useEffect(() => {
    load();
  }, [load]);

  return { workers, loading, error, refetch: load };
}

export function useWorker(id: number) {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getWorker(id)
      .then(setWorker)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { worker, loading, error };
}
