GradPilot AI — Software Design Document (SDD)

Version 1.0 — Architecture Phase
Prepared by: Principal Architect / CTO perspective
Before diving in: I'm going to push back on a few pieces of your proposed stack and flag risks that don't show up until you're past ~10K users. I'll mark these clearly as ⚠️ Architect's Note throughout rather than silently agreeing. Nothing here blocks you from shipping — these are course corrections, not rewrites.

1. High-Level Architecture
┌─────────────┐      HTTPS/REST      ┌──────────────────┐      SQL (pooled)     ┌─────────────┐
│   React SPA │ ───────────────────▶ │  Express API     │ ────────────────────▶ │ PostgreSQL  │
│  (Vercel)   │ ◀─────────────────── │  (Railway/Render) │ ◀──────────────────── │  (Neon)     │
└─────────────┘     JSON / SSE       └──────────────────┘                        └─────────────┘
                                              │  │
                                              │  └──── Prisma ORM (connection pooled via Neon PgBouncer)
                                              │
                                              ▼
                                     ┌───────────────────┐
                                     │  AI Provider Layer │  (Abstraction — not hardcoded to one vendor)
                                     │  OpenAI / Anthropic│
                                     └───────────────────┘
Flow summary:

React SPA (Vite build, static hosting on Vercel) calls the Express API exclusively via authenticated REST calls (Axios), never touches the database or AI provider directly.
Express API is the single trust boundary: it validates JWTs, authorizes actions, validates input, applies rate limits, and orchestrates business logic.
Prisma is the only component that talks to PostgreSQL — no raw SQL scattered across the codebase.
All AI calls go through an internal AI Gateway module inside the backend, not directly from routes/controllers. This is the single most important decision for your 11-tool future — every future generator (CV Builder, Motivation Letter, etc.) reuses this gateway instead of reimplementing AI plumbing.
Streaming AI responses go from provider → backend → frontend via Server-Sent Events (SSE), not raw WebSockets (simpler, works through Vercel/Railway infra, no bidirectional need for MVP).

⚠️ Architect's Note — Vercel for backend-adjacent streaming:
You listed Vercel only for frontend, which is correct — keep it that way. Vercel serverless functions have execution time limits and are a poor fit for long-lived SSE streams from AI generation. Railway/Render (always-on Node process) is the right call for the backend specifically because of AI streaming. Good instinct keeping these separate; just want it explicit so nobody "simplifies" later by moving the API to Vercel functions.

2. Folder Structure
Backend (/server)
server/
├── src/
│   ├── config/              # env loading, constants, provider configs (never hardcode secrets/URLs elsewhere)
│   ├── routes/               # Express route definitions only — no logic here
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── application.routes.ts
│   │   ├── document.routes.ts
│   │   ├── ai.routes.ts
│   │   ├── billing.routes.ts
│   │   └── index.ts          # mounts all routers
│   ├── controllers/          # request/response handling — parses req, calls service, sends res
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── application.controller.ts
│   │   ├── document.controller.ts
│   │   ├── ai.controller.ts
│   │   └── billing.controller.ts
│   ├── services/              # ALL business logic lives here — testable, framework-agnostic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── application.service.ts
│   │   ├── document.service.ts
│   │   ├── ai/
│   │   │   ├── aiGateway.service.ts     # single entry point to any AI provider
│   │   │   ├── providers/
│   │   │   │   ├── openai.provider.ts
│   │   │   │   └── anthropic.provider.ts
│   │   │   └── promptTemplates/          # one folder per tool — this is how you scale to 11+ tools
│   │   │       ├── sop/
│   │   │       ├── personalStatement/
│   │   │       ├── motivationLetter/
│   │   │       ├── scholarshipEssay/
│   │   │       ├── cvBuilder/
│   │   │       ├── researchProposal/
│   │   │       ├── emailProfessor/
│   │   │       └── documentReviewer/
│   │   └── billing.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts        # JWT verification, attaches req.user
│   │   ├── validate.middleware.ts    # runs zod/joi schemas
│   │   ├── rateLimit.middleware.ts
│   │   ├── error.middleware.ts       # global error handler (last in chain)
│   │   └── requestLogger.middleware.ts
│   ├── validators/            # zod/joi schemas per module — kept separate from controllers for reuse
│   │   ├── auth.validator.ts
│   │   ├── application.validator.ts
│   │   └── document.validator.ts
│   ├── prisma/
│   │   ├── schema.prisma      # (not written yet per your instruction — placeholder)
│   │   └── client.ts          # single PrismaClient instance (singleton pattern — critical at scale)
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── apiError.ts        # custom error class
│   │   ├── asyncHandler.ts    # wraps async controllers to forward errors
│   │   └── tokens.ts          # JWT sign/verify helpers
│   ├── jobs/                  # background job definitions (empty at MVP, structure ready for Phase 2)
│   │   └── .gitkeep
│   ├── types/                  # shared TypeScript types/interfaces
│   └── app.ts                  # Express app setup (middleware order, route mounting)
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── package.json
└── tsconfig.json
Why jobs/ exists even though it's empty: you will need background jobs by month 3 (billing webhooks, email sending, batch AI scoring). Reserving the folder now means Phase 2 doesn't require restructuring — it's a pure addition.
Why promptTemplates/ is per-tool from day one: this is the folder structure decision that directly answers your "must support 11 future tools without refactoring" requirement. Every new AI tool = one new subfolder + one new service method that calls the shared aiGateway.service.ts. Nothing else in the architecture changes.
Frontend (/client)
client/
├── src/
│   ├── pages/                    # route-level components only
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardHomePage.tsx
│   │   │   └── ApplicationsListPage.tsx
│   │   ├── applications/
│   │   │   └── ApplicationDetailPage.tsx
│   │   ├── generator/
│   │   │   └── SOPGeneratorPage.tsx
│   │   ├── billing/
│   │   │   └── BillingPage.tsx
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx
│   │   └── marketing/
│   │       ├── LandingPage.tsx
│   │       └── PricingPage.tsx
│   ├── layouts/
│   │   ├── DashboardLayout.tsx    # sidebar + top nav wrapper for authenticated pages
│   │   ├── AuthLayout.tsx          # centered card layout for login/register
│   │   └── MarketingLayout.tsx     # public site layout
│   ├── components/
│   │   ├── ui/                     # generic reusable primitives (Button, Input, Modal, Badge)
│   │   ├── forms/                  # composed form components
│   │   ├── editor/                 # SOP editor-specific components (SectionCard, ScorePanel, ToneControls)
│   │   └── shared/                  # Navbar, Footer, LoadingSpinner, etc.
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useDebounce.ts
│   │   └── useStream.ts             # handles SSE consumption for AI generation
│   ├── services/                    # Axios instances + API call functions, one file per backend module
│   │   ├── api.ts                   # base Axios instance (interceptors for auth/refresh)
│   │   ├── auth.service.ts
│   │   ├── application.service.ts
│   │   ├── document.service.ts
│   │   └── ai.service.ts
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── SubscriptionContext.tsx
│   │   └── UIContext.tsx            # global UI state: modals, toasts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── routes/
│   │   └── AppRoutes.tsx            # centralized React Router config
│   ├── types/
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env.example
├── package.json
└── vite.config.ts

3. Backend Architecture (Layer Responsibilities)
LayerResponsibilityMust NOT doRoutesMap HTTP verb+path to a controller function; attach middleware (auth, validation, rate limit)Contain any business logic or DB callsControllersParse req (params/body/query), call the appropriate service, shape the res (status code, JSON body)Contain business rules, direct Prisma calls, or AI provider callsServicesAll business logic: orchestration, calling Prisma, calling the AI Gateway, enforcing subscription quotasKnow anything about req/res — must be framework-agnostic and unit-testable in isolationMiddlewareCross-cutting concerns: auth verification, input validation, rate limiting, error catching, loggingContain feature-specific business logicPrisma (client.ts)Single source of DB access, instantiated once (singleton)Be re-instantiated per request (this alone causes connection exhaustion at scale)ValidatorsDefine and export schemas (zod recommended) that middleware runs before controllers executeDuplicate logic already in servicesUtilsPure, reusable helper functions (token signing, error classes, async wrapper)Hold state or side effects tied to a specific featureError HandlingCentralized in error.middleware.ts, last middleware in the chain, catches everything thrown via next(err)Be handled ad hoc with try/catch scattered per controller (inconsistent responses)
Pattern to enforce: Controller → Service → Prisma/AI Gateway, always in that direction. A controller should never call Prisma directly, and a service should never construct an HTTP response. This is what makes the codebase safe for you (or future engineers) to add 11 more AI tools without regressions — each tool is a new service, reusing the same layers.

4. Frontend Architecture
LayerBelongs HereExamplePagesRoute-level containers. Fetch data via hooks/services, compose layout + components. Minimal logic.SOPGeneratorPage.tsxLayoutsStructural wrappers shared across multiple pages (nav, sidebar, auth guard placement)DashboardLayout.tsxComponentsReusable, presentation-focused UI. Split into ui/ (dumb primitives), forms/, editor/, shared/Button, ScorePanelHooksEncapsulate reusable stateful logic — data fetching, auth state, SSE streaming, debouncinguseStream.tsServicesAll Axios calls. Pages/components never call axios directly — always through a service functionai.service.ts → generateSOP()ContextGlobal state that many unrelated components need: auth session, subscription tier, UI-wide toasts/modalsAuthContextUtilsPure functions: formatting dates, validating form fields client-side, shared constantsformatters.ts
Rule of thumb: if state is used by one page only → local useState. If used by a handful of related components → a custom hook. If used app-wide → Context. Avoid defaulting everything into Context — it causes unnecessary re-renders at scale (more in Section 13).

5. Database Design (High-Level, No Schema Yet)
⚠️ Architect's Note — biggest structural decision in this document:
With 11 planned AI document tools (SOP, Personal Statement, Motivation Letter, Scholarship Essay, CV, Research Proposal, Email to Professor...), a naive design creates a separate table per document type. That's 8+ near-identical tables, 8+ sets of CRUD endpoints, and a schema migration every time you add tool #12. Instead, use a polymorphic "Document" model with a documentType field and a flexible content JSONB column. One table, one API surface, infinite tool growth. I've designed the tables below around this.
Users
FieldNotesidPrimary keyemailUnique, indexedpasswordHashNullable (OAuth-only users won't have one)authProviderlocal | googlefullNamesubscriptionTierfree | premium | pro (denormalized for fast checks; source of truth is Subscription table)emailVerifiedAtNullable timestampcreatedAt / updatedAt
Profiles (1:1 with User)
FieldNotesidPKuserIdFK → Users, uniqueacademicBackgroundTextachievementsText/JSONB arraycareerGoalsTexttargetCountriesArray/JSONBtargetFieldsArray/JSONB
Universities (reference data, admin-managed initially)
FieldNotesidPKnamecountryrankingMetaJSONB (flexible for future ranking sources)
Programs (reference data)
FieldNotesidPKuniversityIdFK → UniversitiesdegreeLevelundergrad | masters | mba | phdfieldtoneGuidanceJSONB (prompt-shaping metadata used by AI Gateway)
Applications
FieldNotesidPKuserIdFK → UsersuniversityIdFK → UniversitiesprogramIdFK → ProgramsintakeTerme.g. "Fall 2027"statusin_progress | submitted | admitted | rejectedcreatedAt / updatedAt
Documents (polymorphic — replaces separate tables per AI tool)
FieldNotesidPKapplicationIdFK → Applications, nullable (some tools like CV Builder aren't tied to one application)userIdFK → UsersdocumentTypesop | personal_statement | motivation_letter | scholarship_essay | cv | research_proposal | email_professorstatusdraft | finalcontentJSONB — structured section-based content, shape varies by documentTypecurrentVersionIdFK → DocumentVersions (points to latest)createdAt / updatedAt
DocumentVersions
FieldNotesidPKdocumentIdFK → DocumentscontentJSONB snapshotscoreMetaJSONB (structure/clarity/originality scores)createdAt
QuestionnaireResponses
FieldNotesidPKdocumentIdFK → DocumentsresponsesJSONB (flexible per documentType's question set)
Subscriptions
FieldNotesidPKuserIdFK → Users, uniquetierfree | premium | prostatusactive | canceled | past_duebillingProviderstripebillingProviderCustomerIdcurrentPeriodEnd
UsageLogs
FieldNotesidPKuserIdFK → Usersactiongeneration | regeneration | exportdocumentTypeFor per-tool quota tracking latercreatedAtIndexed — used to compute monthly usage windows
Relationships summary:

User 1:1 Profile, 1:1 Subscription, 1:N Applications, 1:N Documents, 1:N UsageLogs
Application N:1 University, N:1 Program, 1:N Documents
Document 1:N DocumentVersions, 1:N QuestionnaireResponses (or 1:1 depending on tool)
University 1:N Programs


6. Authentication Flow
Registration (email/password):

Client submits email + password → backend validates (format, password strength) → bcrypt hash (cost factor 12) → user row created with emailVerifiedAt = null.
Verification email sent with a signed, time-limited token.
User clicks link → backend verifies token → sets emailVerifiedAt.

Login:

Client submits credentials → backend looks up user, bcrypt.compare().
On success: issue a short-lived access token (JWT, ~15 min) and a long-lived refresh token.
Access token returned in response body (kept in memory on the client, not localStorage). Refresh token set as an httpOnly, Secure, SameSite=Strict cookie.

⚠️ Architect's Note — refresh token storage:
Your stack says "JWT" without specifying refresh strategy. Pure stateless JWT refresh tokens (no DB record) can't be revoked — if a token leaks, you can't kill the session short of rotating your signing secret (which logs everyone out). At 100K users, you will have support tickets like "I think my account was compromised." Recommendation: store refresh tokens (or their hash) in a RefreshTokens table with userId, expiresAt, revokedAt, and rotate on every use (issue a new refresh token each time, invalidate the old one, detect reuse of a revoked token as a compromise signal). This is a small addition now that saves a painful migration later.
Protected routes (backend): auth.middleware.ts verifies the access token on every protected request, attaches req.user. If expired, frontend's Axios interceptor automatically calls /auth/refresh using the httpOnly cookie, retries the original request once.
Password reset: User requests reset → backend generates a signed, time-limited token, emails a reset link → user submits new password with token → backend verifies token, updates passwordHash, invalidates all existing refresh tokens for that user (forces re-login everywhere — standard security practice).
Google OAuth (future, Phase 2): Standard OAuth 2.0 authorization code flow; on callback, backend either creates a new user (authProvider = google, no password) or links to an existing email match (with explicit confirmation to prevent account-takeover via unverified email matching).

7. API Design (MVP Endpoints)
Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
POST   /api/auth/verify-email
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
Users
GET    /api/users/me
PATCH  /api/users/me
DELETE /api/users/me
Profiles
GET    /api/profile
PUT    /api/profile
Applications
GET    /api/applications
POST   /api/applications
GET    /api/applications/:id
PATCH  /api/applications/:id
DELETE /api/applications/:id
Documents (generic — powers SOP now, every future tool later)
GET    /api/documents?applicationId=&type=
POST   /api/documents                     # create new document of a given type
GET    /api/documents/:id
PATCH  /api/documents/:id                 # manual edits
DELETE /api/documents/:id
GET    /api/documents/:id/versions
POST   /api/documents/:id/finalize
GET    /api/documents/:id/export?format=pdf|docx
AI
POST   /api/ai/generate            # body: { documentId, documentType, questionnaireResponses }
POST   /api/ai/regenerate-section  # body: { documentId, sectionId, instructions }
POST   /api/ai/score               # body: { documentId }
Billing
GET    /api/billing/subscription
POST   /api/billing/checkout-session
POST   /api/billing/portal-session
POST   /api/billing/webhook        # Stripe webhook, no auth middleware — signature-verified instead
Settings
GET    /api/settings
PATCH  /api/settings
Reference Data (public/read-only)
GET    /api/universities
GET    /api/universities/:id/programs

8. AI Architecture
Core principle: routes and controllers never talk to OpenAI/Anthropic directly. Every AI call flows through aiGateway.service.ts.
Prompt management:

Each tool gets its own folder under promptTemplates/{toolName}/, containing: a base system prompt, a set of input-shaping functions, and output-parsing logic (splitting the model's response into structured sections).
Prompts are versioned as code (in git), not hand-edited in a database at MVP — this keeps prompt changes reviewable and rollback-able like any other code change.
Phase 2 recommendation: once you have real usage data, move prompt templates (not logic) into a database table so you can A/B test prompt variants without a redeploy. Don't build this at MVP — it's premature.

Adding a new AI tool (e.g., CV Builder) later — the entire workflow:

Add a new folder under promptTemplates/cvBuilder/.
Add cv to the documentType enum.
Add one new questionnaire config for the CV Builder's intake.
Everything else — auth, document storage, versioning, export, billing/quota enforcement — is already generic and reused. Zero schema migrations, zero new tables, zero new route files beyond the enum addition.

This is the direct payoff of the polymorphic Document model from Section 5.
AI provider abstraction:
aiGateway.service.ts
   → providers/openai.provider.ts     (implements a common interface: generate(), stream())
   → providers/anthropic.provider.ts  (same interface)
The gateway picks a provider based on config (env variable or per-tool override), so you can switch or split traffic between providers without touching any controller or service that calls aiGateway.generate(...).
⚠️ Architect's Note — single-provider risk:
Your stack list doesn't mention which AI provider you're using. Whatever you pick, build the interface-based abstraction from day one even if only one provider is implemented at MVP. Providers change pricing, get rate-limited, or have outages — a hardcoded import OpenAI from 'openai' scattered across 8 future tool services is exactly the "major refactor" you told me to avoid.
Streaming:

Client calls POST /api/ai/generate with Accept: text/event-stream.
Backend opens a stream to the AI provider, forwards tokens to the client via SSE as they arrive.
Frontend's useStream.ts hook consumes the SSE stream and updates the editor UI progressively (section by section).
On stream completion, backend persists the full generated content as a new DocumentVersion and increments the UsageLogs counter — not before, so a dropped connection mid-stream doesn't consume a user's quota for nothing without a saved result.


9. Security
ConcernApproachInput validationZod schemas on every mutating endpoint, enforced via validate.middleware.ts before controller execution. Reject unknown fields.Rate limitingPer-IP and per-user limits (e.g., express-rate-limit). AI generation endpoints get stricter limits than reads.Password hashingbcrypt, cost factor 12 (tune based on server response time under load).Environment variablesNever committed; .env.example documents required keys; secrets loaded via platform's secret manager (Railway/Vercel env dashboards), validated at boot (fail fast if a required var is missing).CORSExplicit allow-list of frontend origin(s) only — never * in production.HelmetEnabled globally for standard secure headers (CSP, HSTS, X-Frame-Options, etc.).SQL InjectionPrisma parameterizes all queries by default — never drop to raw SQL without parameterized $queryRaw if unavoidable.Prompt InjectionTreat all user-supplied questionnaire text as untrusted input embedded into a prompt. Wrap user content in clearly delimited sections in the prompt template, instruct the model explicitly to treat delimited content as data not instructions, and never let user input alter system-level instructions or trigger tool/function calls.Auth securityShort-lived access tokens, rotated refresh tokens (Section 6), account lockout/backoff after repeated failed logins, generic error messages on login failure (don't reveal whether email exists).
⚠️ Architect's Note — rate limiting at scale:
express-rate-limit's default in-memory store only works correctly on a single server instance. The moment you run more than one backend instance (which you will, well before 100K users), each instance has its own counter and your limits become meaningless. Plan to back it with Redis (rate-limit-redis) — doesn't need to be built at MVP, but the middleware should be written against an interface so swapping the store later is a config change, not a rewrite.

10. Error Handling

Every async controller wrapped in asyncHandler() so thrown errors are forwarded to next(err) instead of crashing the process or requiring try/catch boilerplate everywhere.
A custom ApiError class (statusCode, message, isOperational) is thrown by services for expected failures (e.g., "quota exceeded," "invalid application ID").
error.middleware.ts is the single last-mile handler: distinguishes operational errors (safe to show the user, e.g., 400/403/404) from programming errors (log full detail internally, return a generic 500 to the client — never leak stack traces or internals to the frontend in production).
AI provider errors (timeouts, rate limits, malformed responses) are caught inside aiGateway.service.ts and translated into a consistent ApiError so the frontend always gets a predictable error shape regardless of provider.
Unhandled promise rejections and uncaught exceptions at the process level are logged and trigger a controlled shutdown (let your process manager, e.g., Railway's restart policy, bring it back up) rather than continuing in a corrupted state.


11. Logging

Structured JSON logging (e.g., pino) rather than console.log — searchable and parseable by log aggregation tools as you scale.
Every request logged with: method, path, status code, duration, userId (if authenticated), request ID (for tracing a request across logs).
AI generation calls logged separately with: documentType, provider used, token count, latency, cost estimate — this becomes your unit-economics dashboard (cost per user, referenced in your PRD's success metrics).
Errors logged with full stack trace internally; never returned to the client in production.
Phase 2: ship logs to a hosted aggregator (e.g., Better Stack, Axiom, or Railway's built-in log viewer initially) once volume makes local log-tailing impractical.


12. Environment Variables
Backend
NODE_ENV
PORT
DATABASE_URL              # Neon Postgres connection string (pooled)
DIRECT_URL                # Neon direct connection (for Prisma migrations)
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRY
JWT_REFRESH_EXPIRY
BCRYPT_SALT_ROUNDS
AI_PROVIDER                # e.g., "openai" | "anthropic"
OPENAI_API_KEY
ANTHROPIC_API_KEY
FRONTEND_URL                # for CORS allow-list and email links
EMAIL_PROVIDER_API_KEY      # e.g., Resend/SendGrid
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
REDIS_URL                   # reserved for Phase 2 (rate limiting, jobs)
SENTRY_DSN                  # or equivalent error tracking, reserved
Frontend
VITE_API_BASE_URL
VITE_STRIPE_PUBLISHABLE_KEY
VITE_GOOGLE_OAUTH_CLIENT_ID   # reserved for Phase 2

13. State Management (React Context)
Keep Context usage deliberately narrow — it's for global, cross-cutting state only, not a replacement for local component state or server data caching.

AuthContext: current user, access token (in-memory), login/logout/refresh functions. Wraps the entire app.
SubscriptionContext: current tier, usage/quota remaining — read frequently across the dashboard (generator, upgrade prompts) so it earns its place as global state.
UIContext: toasts/notifications, global modal state (e.g., "upgrade required" modal triggered from anywhere).

⚠️ Architect's Note — don't put server data in Context:
Applications, Documents, and Profile data should not live in a global Context. That data is naturally scoped to specific pages and changes on the server. Fetch it with a dedicated data-fetching hook (or adopt React Query / TanStack Query — strongly recommended addition to your stack) which gives you caching, automatic refetching, and loading/error states for free. Storing this in Context instead leads to stale data bugs and unnecessary re-renders across your whole app — a common mistake that becomes expensive to unwind post-launch.

14. Routing (MVP Page Routes)
/                          → Landing page
/pricing                   → Pricing page
/login
/register
/forgot-password
/reset-password/:token
/verify-email/:token

/dashboard                          → Dashboard home (applications overview)
/dashboard/applications              → Applications list
/dashboard/applications/new          → Create application
/dashboard/applications/:id          → Application detail (documents list for that application)
/dashboard/applications/:id/sop/:documentId   → SOP generator/editor
/dashboard/profile
/dashboard/billing
/dashboard/settings

/* (404)                             → Not found page
All /dashboard/* routes wrapped in an auth-guard within DashboardLayout — unauthenticated users redirected to /login with a return-to path preserved.

15. Dashboard Navigation (Sidebar Menu)

Overview — snapshot of applications, recent documents, quota usage widget
My Applications — list/manage university+program applications
SOP Generator (MVP; will become a "Documents" or "AI Tools" section housing all 11 tools in Phase 2 — design the nav to group by category from the start: Essays & Statements, CV & Documents, Application Tools, so adding Motivation Letter/Scholarship Essay later is just a new item in an existing group, not a new top-level nav concept)
My Profile — academic background/achievements used across all generators
Billing & Subscription — current plan, usage, upgrade/downgrade, invoices
Settings — account details, password, notification preferences
Help/Support — contact/FAQ link


16. Future Scalability
ConcernStrategy100,000 usersStateless backend (no in-memory session state) allows horizontal scaling — run multiple Railway/Render instances behind a load balancer. Neon's connection pooler (PgBouncer) handles the resulting connection fan-out from many serverless-style backend instances/Prisma clients.Many AI toolsSolved architecturally now via the polymorphic Document model + per-tool prompt template folders (Sections 5 & 8) — the marginal cost of tool #12 is a folder and an enum value, not a new subsystem.Multiple AI providersProvider interface abstraction (Section 8) — add a new providers/xyz.provider.ts implementing the same interface; route selection via config, enabling cost-based or capability-based routing later (e.g., cheap model for scoring, strong model for generation).Background jobsIntroduce a job queue (BullMQ + Redis) when you add: async email sending, Stripe webhook processing, batch re-scoring, PDF/DOCX generation for large exports. The jobs/ folder is already reserved.NotificationsStart with transactional email (Resend/SendGrid) at MVP; add in-app notifications (new DB table + a lightweight polling or SSE channel) in Phase 2 without touching core document/application logic.PaymentsStripe Checkout + Customer Portal handles most complexity (proration, invoices, dunning) without custom billing logic — webhook-driven sync into your Subscriptions table keeps your DB as a read cache of Stripe's state, not the source of truth.AnalyticsEmit key events (signup, generation, upgrade) to a lightweight analytics pipeline (e.g., PostHog) from day one — retrofitting event tracking after 50K users means losing your early funnel data permanently.Database growthJSONB fields on Documents keep the schema flexible, but monitor query patterns — add targeted indexes (userId, applicationId, documentType, createdAt) as read patterns emerge; consider read replicas only once you have actual read-heavy bottlenecks, not preemptively.

17. Development Roadmap (2–6 Hour Milestones)
Foundation

Initialize backend repo: Express app skeleton, folder structure, env loading, health-check route.
Initialize frontend repo: Vite + React + Tailwind + React Router skeleton, base layout shells.
Set up Neon PostgreSQL + Prisma connection (client singleton, verify connectivity, no schema yet).
Design and write Prisma schema for Users, Profiles (from Section 5), run first migration.

Authentication
5. Implement registration endpoint (validation + bcrypt hashing + user creation).
6. Implement email verification flow (token generation, verify endpoint, email send stub).
7. Implement login endpoint + access/refresh token issuance + RefreshTokens table.
8. Implement auth.middleware.ts + /api/users/me protected route.
9. Implement refresh + logout endpoints, rotating refresh token logic.
10. Implement forgot/reset password flow end-to-end.
11. Frontend: Login/Register pages wired to real endpoints, AuthContext, Axios interceptor for auto-refresh.
12. Frontend: protected route guard + redirect-to-login behavior.
Core Domain
13. Prisma schema + migration for Universities, Programs (seed a small reference dataset manually).
14. Prisma schema + migration for Applications; CRUD endpoints + controller/service layer.
15. Frontend: Applications list page + "create application" flow.
16. Prisma schema + migration for Documents, DocumentVersions, QuestionnaireResponses.
17. Document CRUD endpoints (create/get/update/delete/list, scoped to documentType=sop initially).
AI Generation (SOP MVP)
18. Build aiGateway.service.ts interface + first provider implementation (no streaming yet, single blocking call).
19. Build the SOP prompt template (system prompt + input-shaping function).
20. Implement /api/ai/generate endpoint (blocking version) → persists first DocumentVersion.
21. Frontend: guided questionnaire UI for SOP intake.
22. Frontend: generator page — trigger generation, display returned draft in section cards.
23. Convert /api/ai/generate to SSE streaming; update useStream.ts hook to consume it progressively.
24. Implement section-level regeneration endpoint + corresponding UI controls.
25. Implement scoring pass (structure/clarity/originality) + score panel UI.
Usage, Billing, Export
26. Implement UsageLogs tracking + quota enforcement middleware on AI endpoints.
27. Stripe integration: Checkout session creation + webhook handler + Subscriptions table sync.
28. Frontend: Billing page (current plan, upgrade/downgrade buttons via Stripe Customer Portal).
29. Implement PDF export (server-side rendering of Document content).
30. Implement DOCX export.
Polish & Launch Readiness
31. Global error handling middleware + consistent ApiError responses across all routes.
32. Structured logging (pino) wired into all requests + AI generation calls.
33. Rate limiting middleware applied to auth and AI endpoints.
34. CORS/Helmet hardening + security review pass against Section 9 checklist.
35. Landing page + pricing page (marketing layout) built out per PRD Section 17.
36. Dashboard overview page (usage widget, recent applications/documents).
37. End-to-end smoke test pass across full user journey (register → verify → profile → application → generate → export → upgrade).
38. Deploy pipeline finalized: Vercel (frontend), Railway/Render (backend), Neon (DB), env vars confirmed in all environments.
Each milestone is independently shippable and doesn't require revisiting prior milestones' code — by the time you reach #17 (Document CRUD), tools 2 through 11 from your future roadmap are additive work following the exact same pattern as milestones 18–25.

Summary of Where I Challenged Your Original Plan

Backend must stay off Vercel — confirmed your split (Vercel frontend / Railway backend) was correct specifically because of AI streaming; flagged so it doesn't get "simplified" later.
Refresh tokens need to be stateful (DB-backed + rotated), not pure stateless JWT, for revocation and breach response.
Polymorphic Document model instead of one table per AI tool — this is the change that actually delivers your "no major refactor for 11 tools" requirement.
AI provider abstraction from day one, even with a single provider at MVP, to avoid vendor lock-in scattered across every future tool's service.
Rate limiting needs a shared store (Redis) once you run more than one server instance — the default in-memory approach silently breaks under horizontal scaling.
React Query (or equivalent) for server data instead of stuffing it into Context — prevents stale-data bugs and unnecessary re-renders as the dashboard grows.
Analytics event tracking from MVP, not retrofitted later — you lose the early funnel data permanently otherwise.