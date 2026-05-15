# Antogravity Frontend Integration Guide

## 1) Purpose
This document is the implementation handoff for Antogravity to integrate all currently available backend endpoints into the frontend.

Scope:
- Complete API surface currently mounted in backend
- Auth and role-based access behavior
- UI-to-endpoint mapping
- Request/response examples for high-impact flows
- Integration checklist and QA matrix

Source of truth used for this guide:
- Live route files under src/routes
- Mounted route prefixes in src/server.ts





## 2) Authentication Contract

Auth endpoints:
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/admin/create

JWT usage:
- Header: Authorization: Bearer <token>
- Token includes: id, email, role, worker_id

Roles:
- buyer
- worker
- admin

Frontend requirements:
- Keep auth token in secure storage (prefer httpOnly cookie if gateway supports it, else encrypted local storage strategy)
- Attach token to all protected endpoints
- Enforce role-aware routing in frontend


## 3) Global Response and Error Handling

Common success codes:
- 200 OK
- 201 Created

Common errors:
- 400 validation/input errors
- 401 missing/invalid token
- 403 role/ownership failure
- 404 resource not found
- 409 conflict (duplicate/active application)
- 500 server error

Standard error shape used by most routes:
- { "error": "message" }
- Some routes include details/metadata keys

Frontend handling rules:
- 401: force re-login
- 403: show permission-specific messaging
- 404: show not found or not visible to this user
- 409: show conflict CTA


## 4) Route Prefixes Mounted in Server

- /api/v1/auth
- /api/v1/buyer
- /api/v1/admin
- /api/v1/worker-profile
- /api/v1/tasks
- /api/v1/workers
- /api/v1/webhooks
- /api/v1/wallet
- /api/v1/notifications
- /mock-squad (non-production)

Additional utility endpoints:
- GET /health
- GET /api/v1/debug/ai-logs
- GET /api/docs
- GET /api/docs.json
- GET /uploads/<filename>


## 5) Endpoint Catalog (Live Routes)

## 5.1 Auth
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/admin/create

## 5.2 Public Workers Directory
- GET /api/v1/workers
- GET /api/v1/workers/:id
- POST /api/v1/workers
- PUT /api/v1/workers/:id
- GET /api/v1/workers/:id/stats
- GET /api/v1/workers/:id/financial-profile

## 5.3 Shared Task Lifecycle (/api/v1/tasks)
- GET /api/v1/tasks
- GET /api/v1/tasks/:id
- POST /api/v1/tasks
- POST /api/v1/tasks/:id/recommend-workers
- PATCH /api/v1/tasks/:id
- DELETE /api/v1/tasks/:id
- POST /api/v1/tasks/:id/shortlist
- POST /api/v1/tasks/:id/apply
- POST /api/v1/tasks/:id/confirm-worker
- POST /api/v1/tasks/:id/accept-assignment
- POST /api/v1/tasks/:id/recommend-final
- POST /api/v1/tasks/:id/submit-proof
- POST /api/v1/tasks/:id/complaint
- POST /api/v1/tasks/:id/dispute
- GET /api/v1/tasks/:id/status

## 5.4 Buyer Scoped Routes (/api/v1/buyer)
- GET /api/v1/buyer/tasks
- POST /api/v1/buyer/tasks
- GET /api/v1/buyer/tasks/:id
- POST /api/v1/buyer/tasks/:id/assign
- POST /api/v1/buyer/tasks/:id/dispute
- POST /api/v1/buyer/tasks/:id/release-funds
- GET /api/v1/buyer/tasks/:id/dispute-window
- GET /api/v1/buyer/disputes

## 5.5 Worker Profile Scoped Routes (/api/v1/worker-profile)
- POST /api/v1/worker-profile/create
- GET /api/v1/worker-profile/me
- GET /api/v1/worker-profile/me/credit-score
- GET /api/v1/worker-profile/me/kyc
- POST /api/v1/worker-profile/me/kyc
- GET /api/v1/worker-profile/me/loans
- POST /api/v1/worker-profile/me/loans
- GET /api/v1/worker-profile/me/insurance
- POST /api/v1/worker-profile/me/insurance
- GET /api/v1/worker-profile/me/tasks
- GET /api/v1/worker-profile/me/tasks/:id
- POST /api/v1/worker-profile/me/tasks/:id/request-release

## 5.6 Wallet
- GET /api/v1/wallet
- GET /api/v1/wallet/transactions
- POST /api/v1/wallet/virtual-account
- POST /api/v1/wallet/withdraw

## 5.7 Notifications
- GET /api/v1/notifications
- POST /api/v1/notifications/:id/read
- POST /api/v1/notifications/read-all
- POST /api/v1/notifications/broadcast (admin)
- POST /api/v1/notifications/send (admin)

## 5.8 Webhooks (Backend/Infra driven)
- POST /api/v1/webhooks/squad
- POST /api/v1/webhooks/verification
- GET /api/v1/webhooks/health

## 5.9 Admin (/api/v1/admin)
- GET /api/v1/admin/dashboard
- GET /api/v1/admin/users
- GET /api/v1/admin/users/:id
- PATCH /api/v1/admin/users/:id
- POST /api/v1/admin/users
- DELETE /api/v1/admin/users/:id
- GET /api/v1/admin/tasks
- GET /api/v1/admin/tasks/:id
- PATCH /api/v1/admin/tasks/:id/status
- POST /api/v1/admin/tasks/:id/release-funds
- POST /api/v1/admin/tasks/:id/refund
- GET /api/v1/admin/disputes
- GET /api/v1/admin/disputes/:id
- PATCH /api/v1/admin/disputes/:id/resolve
- PATCH /api/v1/admin/tasks/:id/resolve-worker-release-request
- GET /api/v1/admin/pending-release-requests
- GET /api/v1/admin/workers
- PATCH /api/v1/admin/workers/:id
- GET /api/v1/admin/escrow
- PATCH /api/v1/admin/escrow/:id/status
- GET /api/v1/admin/ai-logs
- GET /api/v1/admin/audit-logs
- POST /api/v1/admin/tasks/:id/extend-dispute-window
- GET /api/v1/admin/kyc
- GET /api/v1/admin/kyc/:id
- PATCH /api/v1/admin/kyc/:id/review
- GET /api/v1/admin/loans
- GET /api/v1/admin/loans/:id
- PATCH /api/v1/admin/loans/:id/review
- PATCH /api/v1/admin/loans/:id/disburse
- GET /api/v1/admin/insurance
- GET /api/v1/admin/insurance/:id
- PATCH /api/v1/admin/insurance/:id/review


## 6) Critical Frontend Flows (Must Implement)

### 6.1 Buyer Task Posting + AI Recommendations
1. POST /api/v1/tasks
2. Read response.task and response.matches
3. Render recommended workers immediately from matches
4. Persisted recommendations also available as task.ai_recommendations

Important payload flexibility supported by backend:
- required_skills may be:
  - array
  - comma-separated string
  - JSON-string array
- deliverable spec may be sent as:
  - deliverable_spec object
  - deliverable_spec JSON string
  - deliverableSpec alias (camelCase)

### 6.2 Buyer "Refresh AI Recommendations" Button
Use this endpoint for the button action:
- POST /api/v1/tasks/:id/recommend-workers

Expected response:
- task (updated with ai_recommendations)
- matches (latest ranked workers)

### 6.3 Buyer Task Edit/Delete
Edit:
- PATCH /api/v1/tasks/:id
Delete:
- DELETE /api/v1/tasks/:id

Editable/deletable states:
- posted
- shortlisted
- applications_open
- selection_in_progress

Frontend should disable edit/delete UI outside these statuses.

### 6.4 Worker Release Request (AI Rejection Escalation)
- POST /api/v1/worker-profile/me/tasks/:id/request-release

Use when worker disputes AI outcome and asks admin review.
Status transitions toward pending_release_of_funds.

### 6.5 Admin Resolution Queue
- GET /api/v1/admin/pending-release-requests
- PATCH /api/v1/admin/tasks/:id/resolve-worker-release-request

This is required for admin console implementation.


## 7) High-Impact Request Examples

### 7.1 Create Task (JSON)
POST /api/v1/tasks
{
  "title": "Office cleaning for 2 rooms",
  "description": "Deep clean and sanitize the office space.",
  "required_skills": ["cleaning"],
  "amount_naira": 25000,
  "task_location": "Ikeja, Lagos",
  "location_latitude": 6.6018,
  "location_longitude": 3.3515,
  "due_date": "2026-05-21T10:00:00Z",
  "deliverable_spec": {
    "photos_required": true,
    "minimum_photos": 3,
    "notes": "Upload before photos"
  },
  "client_name": "TaskVerify Client",
  "client_email": "client@example.com"
}

### 7.2 Update Task
PATCH /api/v1/tasks/:id
{
  "title": "Updated title",
  "required_skills": "cleaning,deep-clean",
  "amount_naira": 30000,
  "deliverable_spec": {
    "photos_required": true,
    "minimum_photos": 5
  }
}

### 7.3 Refresh Recommendations
POST /api/v1/tasks/:id/recommend-workers
(no body required)

### 7.4 Shortlist Workers
POST /api/v1/tasks/:id/shortlist
{
  "worker_ids": [3, 5, 9]
}

### 7.5 Worker Applies
POST /api/v1/tasks/:id/apply
{
  "worker_id": 3,
  "proposed_price": 22000,
  "message": "I can complete this within 24 hours"
}

### 7.6 Worker Request Release
POST /api/v1/worker-profile/me/tasks/:id/request-release
{
  "reason": "AI verification missed required evidence that was uploaded"
}


## 8) Frontend Screen to Endpoint Mapping

Buyer app:
- Dashboard list: GET /api/v1/tasks or GET /api/v1/buyer/tasks
- Task create form: POST /api/v1/tasks
- Task edit modal: PATCH /api/v1/tasks/:id
- Task delete action: DELETE /api/v1/tasks/:id
- AI recommend button: POST /api/v1/tasks/:id/recommend-workers
- Shortlist modal: POST /api/v1/tasks/:id/shortlist
- Confirm worker: POST /api/v1/tasks/:id/confirm-worker
- Manual release funds: POST /api/v1/buyer/tasks/:id/release-funds
- Disputes tab: GET /api/v1/buyer/disputes

Worker app:
- Profile create: POST /api/v1/worker-profile/create
- Credit score card: GET /api/v1/worker-profile/me/credit-score
- KYC flow: GET/POST /api/v1/worker-profile/me/kyc
- Loans: GET/POST /api/v1/worker-profile/me/loans
- Insurance: GET/POST /api/v1/worker-profile/me/insurance
- My tasks: GET /api/v1/worker-profile/me/tasks
- Task details: GET /api/v1/worker-profile/me/tasks/:id
- Submit proof: POST /api/v1/tasks/:id/submit-proof
- Request release: POST /api/v1/worker-profile/me/tasks/:id/request-release

Admin app:
- Dashboard: GET /api/v1/admin/dashboard
- Users CRUD: /api/v1/admin/users...
- Task operations: /api/v1/admin/tasks...
- Pending worker release queue: GET /api/v1/admin/pending-release-requests
- Resolve worker release: PATCH /api/v1/admin/tasks/:id/resolve-worker-release-request
- Disputes/KYC/Loans/Insurance review tabs: corresponding admin endpoints
- Notifications broadcast: POST /api/v1/notifications/broadcast


## 9) Integration Notes and Caveats

1. Use /api/docs.json to generate typed API client contracts.
2. Route-level truth is in src/routes and may be ahead of older docs in some places.
3. Legacy note:
- OpenAPI may include /api/v1/tasks/:id/assign, but current live task router does not define it.
- Use buyer assignment flow through POST /api/v1/buyer/tasks/:id/assign or the shortlist/confirm/accept flow.
4. Task visibility is role-aware in /api/v1/tasks endpoints.
5. Some endpoints return 404 for authorization-limited visibility to avoid leaking resource existence.


## 10) Recommended Frontend API Layer Structure

Create domain clients:
- authApi
- tasksApi
- buyerApi
- workerProfileApi
- walletApi
- notificationsApi
- adminApi

Each client should provide:
- request function with auth header injection
- typed success/error models
- retry policy for idempotent GETs
- centralized 401 handling and token refresh/logout


## 11) Antogravity Delivery Checklist

Phase 1 (Must ship first):
- Auth integration (register/login/logout)
- Buyer task CRUD with recommend-workers button
- Worker task views + submit proof + request-release
- Admin pending-release queue + resolve action
- Notifications list/read/read-all

Phase 2:
- Full buyer dispute and dispute-window UX
- Wallet pages (balance, transactions, withdraw, virtual account)
- Worker KYC/Loans/Insurance pages

Phase 3:
- Full admin operations (users, escrow, KYC, loans, insurance, audits, AI logs)

Definition of done:
- Every endpoint in Section 5 mapped to at least one frontend action or explicit deferred tag
- Role guards implemented on route and component level
- End-to-end smoke tests for buyer, worker, admin happy paths


## 12) QA Smoke Test Matrix

Buyer:
- Can create task and receive matches
- Can refresh recommendations
- Can edit/delete only in editable statuses
- Can shortlist and confirm worker

Worker:
- Can view assigned tasks
- Can submit proof
- Can request release when status is flagged_for_dispute or verified

Admin:
- Sees pending release requests
- Can approve/reject worker release requests
- Can review disputes and force status updates

Notifications:
- List returns user-specific notifications
- Mark one/all as read works

Wallet:
- Balance and transaction history load
- Withdrawal validates amount and returns error details for invalid flows


## 13) Contact Handoff Note

This document is prepared as the direct implementation guide for Antogravity frontend integration.
If schema-level typing is needed, consume /api/docs.json and generate client SDK models.
For behavioral conflicts, trust live route handlers in src/routes over stale docs.