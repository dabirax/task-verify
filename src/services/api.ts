import type { Worker, Task, WorkerStats, FinancialProfile } from '../types';

const BASE_URL = 'https://verify-s.onrender.com';

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = 2
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  } catch (err) {
    clearTimeout(timeout);
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 1500));
      return fetchWithRetry<T>(url, options, retries - 1);
    }
    throw err;
  }
}

export const api = {
  // Health check
  health: () => fetchWithRetry<{ status: string; timestamp: string; environment: string }>(`${BASE_URL}/health`),

  // Tasks
  getTasks: (params?: { status?: string; location?: string }) => {
    const qs = params
      ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]).toString()
      : '';
    return fetchWithRetry<Task[]>(`${BASE_URL}/api/v1/tasks${qs}`);
  },

  getTask: (id: number) => fetchWithRetry<Task>(`${BASE_URL}/api/v1/tasks/${id}`),

  createTask: (data: {
    title: string;
    description: string;
    amount_naira: number;
    task_location: string;
    due_date: string;
    deliverable_spec: Record<string, unknown>;
    required_skills?: string[];
    client_name?: string;
    client_email?: string;
    location_latitude?: number;
    location_longitude?: number;
  }) =>
    fetchWithRetry<{ task: Task; matches: WorkerMatch[] }>(`${BASE_URL}/api/v1/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  getTaskStatus: (id: number) =>
    fetchWithRetry<{ id: number; status: string; assigned_worker_id: number | null; submitted_at: string | null; verified_at: string | null }>(
      `${BASE_URL}/api/v1/tasks/${id}/status`
    ),

  // Workers
  getWorkers: (params?: { location?: string; skill?: string; minRating?: number }) => {
    const qs = params
      ? '?' + new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined && v !== null && v !== '')
            .map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return fetchWithRetry<Worker[]>(`${BASE_URL}/api/v1/workers${qs}`);
  },

  getWorker: (id: number) => fetchWithRetry<Worker>(`${BASE_URL}/api/v1/workers/${id}`),

  getWorkerStats: (id: number) => fetchWithRetry<WorkerStats>(`${BASE_URL}/api/v1/workers/${id}/stats`),

  getWorkerFinancialProfile: (id: number) =>
    fetchWithRetry<FinancialProfile>(`${BASE_URL}/api/v1/workers/${id}/financial-profile`),
};

// Re-export WorkerMatch interface
export interface WorkerMatch {
  worker_id: number;
  name: string;
  match_score: number;
  reasons: string[];
  distance_km: number;
}
