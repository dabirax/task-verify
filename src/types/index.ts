export type UserRole = 'worker' | 'employer' | 'admin' | 'guest' | 'buyer';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string | null;
  trust_score?: number;
  worker_id?: number | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    role: UserRole;
    worker_id?: number | null;
  };
}

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
  tier?: string;
  credit_score?: number;
  credit_band?: string;
  economic_profile?: {
    risk_level: string;
    earning_pattern: any[];
    behavioral_score: number;
    identity_verified: boolean;
    reliability_score: number;
    verification_sources: string[];
  };
  financial_profile?: {
    credit_score: number;
    loan_eligibility: boolean;
    recommended_loan: number;
    insurance_risk_level: string;
  };
  created_at: string;
  updated_at: string;
}

export type TaskStatus =
  | 'open'
  | 'shortlisted'
  | 'applications_open'
  | 'selection_in_progress'
  | 'assigned'
  | 'submitted'
  | 'verified'
  | 'flagged_for_dispute'
  | 'completed'
  | 'complaint_filed'
  | 'disputed'
  | 'pending_release_of_funds'
  | 'buyer_disputed'
  | 'posted'
  | 'funded'
  | 'cancelled'
  | 'refunded';

export interface DeliverableSpec {
  photos_required?: boolean;
  minimum_photos?: number;
  reference_image_urls?: string[];
  notes?: string;
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
  deliverable_spec?: DeliverableSpec | null;
  buyer_user_id?: number | null;
  shortlisted_workers?: number[];
  selected_worker_id?: number | null;
  assigned_worker_id?: number | null;
  buyer_confirmed?: boolean;
  worker_confirmed?: boolean;
  assigned_at?: string | null;
  proof_submission?: Record<string, unknown> | null;
  submitted_at?: string | null;
  ai_verification_result?: Record<string, unknown> | null;
  scenario_recommendations?: ScenarioRecommendation[];
  verified_at?: string | null;
  squad_va_account_number?: string | null;
  squad_payment_ref?: string | null;
  escrow?: EscrowAccount | null;
  created_at: string;
  updated_at: string;
}

export interface ScenarioRecommendation {
  use_case: string;
  preferred_worker_id: string;
  why: string;
}

export interface EscrowAccount {
  id: number;
  task_id: number;
  squad_va_number: string;
  squad_bank_code: string;
  squad_bank_name: string;
  amount_naira: number;
  status: 'pending' | 'funded' | 'released' | 'refunded' | 'frozen';
  funded_at?: string | null;
  released_to_worker_at?: string | null;
  refunded_to_client_at?: string | null;
  last_squad_event?: string | null;
  last_squad_event_at?: string | null;
  squad_webhook_count: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  user_id?: number | null;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  target_role?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Wallet {
  id: number;
  owner_id: number;
  owner_type: 'buyer' | 'worker';
  balance: string | number;
  locked_balance: string | number;
  total_earnings?: number | null;
  squad_va_number?: string | null;
  squad_bank_code?: string | null;
}

export interface WalletTransaction {
  id: number;
  wallet_id: number;
  transaction_type: string;
  amount: number;
  description: string;
  created_at: string;
}

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

export interface CreditScore {
  worker_id: number;
  credit_score: number;
  credit_band: 'poor' | 'fair' | 'good' | 'very_good' | 'exceptional';
  tier: 'normal' | 'verified';
  loan_eligible: boolean;
  insurance_eligible: boolean;
  notes?: string;
}

export interface WorkerKyc {
  id: number;
  worker_id: number;
  status: 'pending' | 'approved' | 'rejected';
  nin_submitted: boolean;
  bvn_submitted: boolean;
  address_submitted: boolean;
  submitted_at: string;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
}

export interface WorkerLoan {
  id: number;
  worker_id: number;
  amount_naira: number;
  purpose: string;
  repayment_months: number;
  credit_score_at_application: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'repaid' | 'defaulted';
  created_at: string;
}

export interface WorkerInsurance {
  id: number;
  worker_id: number;
  insurance_type: 'health' | 'income_protection' | 'accident';
  coverage_amount_naira?: number | null;
  status: 'pending' | 'active' | 'rejected' | 'cancelled' | 'expired';
  expires_at?: string | null;
  created_at: string;
}

export interface WorkerMatch {
  worker_id: number;
  name: string;
  match_score: number;
  rank?: number;
  recommendation_reason?: string;
  tradeoff_note?: string;
  use_case_tags?: string[];
  strengths?: string[];
  risks?: string[];
  confidence?: number | null;
  distance_km: number;
}

export interface TaskVerificationResult {
  verified: boolean;
  confidence: number;
  details: string;
  flags: string[];
}

export interface Dispute {
  id: number;
  task_id: number;
  reason?: string;
  status: 'open' | 'resolved_worker' | 'resolved_buyer' | 'escalated';
  resolution?: string;
  resolution_note?: string;
  created_at: string;
  updated_at: string;
}

export interface DisputeWindow {
  seconds_remaining: number;
  is_open: boolean;
  expires_at?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface KYCData {
  nin: string;
  bvn: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country?: string;
}

export interface LoanApplication {
  amount_naira: number;
  purpose: string;
  repayment_months?: number;
}

export interface InsuranceApplication {
  insurance_type: 'health' | 'income_protection' | 'accident';
  coverage_amount_naira?: number;
}

export interface AdminDashboardStats {
  total_workers: number;
  open_tasks: number;
  flagged_tasks: number;
  disputed_tasks: number;
  total_escrow_naira?: number;
  total_tasks?: number;
  total_users?: number;
  verified_tasks?: number;
  completed_tasks?: number;
}

export interface AILog {
  id: number;
  task_id: number;
  event_type: string;
  decision_synthesis: string;
  decision?: string;
  confidence?: number;
  details?: Record<string, unknown>;
  created_at: string;
}

export interface AuditLog {
  id: number;
  actor_id?: number;
  action: string;
  entity_type: string;
  entity_id?: number;
  details?: Record<string, unknown>;
  created_at: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  amount_naira: number;
  task_location: string;
  due_date: string;
  deliverable_spec: DeliverableSpec | string;
  required_skills?: string[];
  client_name?: string;
  client_email?: string;
  location_latitude?: number;
  location_longitude?: number;
}

export interface Message {
  id: number;
  sender_user_id: string | number;
  recipient_user_id: string | number;
  task_id?: number | null;
  body: string;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  other_user_id: string;
  other_user_name: string;
  other_user_avatar?: string | null;
  task_id?: number | null;
  last_message?:
    | string
    | {
        id?: number;
        body?: string;
        created_at?: string;
      }
    | null;
  last_message_at?: string;
  unread_count: number;
  is_sender_last?: boolean;
}

export interface ConversationHistory {
  messages: Message[];
  other_user_id: string;
  other_user_name: string;
  other_user_avatar?: string | null;
  task_id?: number | null;
}

export interface SendMessagePayload {
  recipient_user_id?: string;
  recipient_worker_id?: number;
  body: string;
  task_id?: number;
}
