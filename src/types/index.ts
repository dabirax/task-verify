export interface Worker {
  id: number;
  external_id?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  skills: string[];
  bio?: string | null;
  primary_location: string;
  latitude: number;
  longitude: number;
  trust_score: number;
  tasks_completed: number;
  tasks_successful: number;
  on_time_rate: number;
  avg_rating: number;
  total_earnings: number;
  current_month_earnings: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  task_uuid: string;
  title: string;
  description: string;
  client_name?: string | null;
  client_email?: string | null;
  required_skills: string[];
  amount_naira: number;
  status: TaskStatus;
  task_location: string;
  location_latitude: number;
  location_longitude: number;
  due_date: string;
  deliverable_spec?: Record<string, unknown> | null;
  assigned_worker_id?: number | null;
  assigned_at?: string | null;
  proof_submission?: Record<string, unknown> | null;
  submitted_at?: string | null;
  ai_verification_result?: Record<string, unknown> | null;
  verified_at?: string | null;
  squad_va_account_number?: string | null;
  squad_payment_ref?: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskStatus =
  | 'posted'
  | 'assigned'
  | 'submitted'
  | 'verified'
  | 'flagged_for_dispute'
  | 'completed'
  | 'complaint_filed'
  | 'disputed';

export interface WorkerStats {
  tasks_completed: number;
  tasks_successful: number;
  on_time_rate: number;
  avg_rating: number;
  total_earnings: number;
  current_month_earnings: number;
  trust_score: number;
}

export interface FinancialProfile {
  credit_score: number;
  loan_eligibility: boolean;
  recommended_loan: number;
  insurance_risk_level: string;
}

export interface WorkerMatch {
  worker_id: number;
  name: string;
  match_score: number;
  reasons: string[];
  distance_km: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
