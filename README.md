# 🎓 Campus Skill Connect (CSC)

> **A skill-first, work-first, privacy-conscious campus platform where students and faculty publish verifiable evidence of their work and discover peers, opportunities, and corporate recruiters.**

---

## 1. What the Product Does

Campus Skill Connect replaces unverified resumes and keyword-stuffed profiles with peer-reviewable, link-first proof of work. 

Key Capabilities:
- **Verified University Membership**: Derived strictly from verified university email domains matching accredited institutions. Non-verified institutions are plainly labeled "Self-declared".
- **Link-First Work Publishing**: Publish technical repositories, research artifacts, design systems, and creative works with safe HTTPS link validation and zero server-side SSRF exposure.
- **Canonical Connection Graph**: Single-row canonical ordering `(user_low < user_high)` with database-enforced state transitions (`pending`, `accepted`, `declined`, `withdrawn`, `blocked`).
- **Strict 4-Level Visibility Model**: Enforced at the PostgreSQL Row Level Security (RLS) layer across `only_me`, `connections`, `campus`, and `public`.
- **Corporate Recruiter Sourcing**: Restricted to verified corporate accounts. Recruiters search strictly public/campus portfolios and can never access connections-only or private data.
- **Rule-Based ATS Structural Checklist**: Real structural analysis (contact clarity, standard headings, date consistency, keyword coverage) without fabricated numerical percentages.

---

## 2. Architecture Diagram

```
                        ┌─────────────────────────────────────────┐
                        │        Clients & Edge Browsers          │
                        │   Mobile (360px+) • Tablet • Desktop    │
                        └────────────────────┬────────────────────┘
                                             │ HTTPS / WSS
                                             ▼
                        ┌─────────────────────────────────────────┐
                        │        Next.js 16 App Router            │
                        │  • React 19 Strict Server Components    │
                        │  • Trusted IP Extraction (Anti-Spoof)   │
                        │  • SSR Session Cookie Auth (@supabase)  │
                        │  • Zod Environment Schema Validation    │
                        └─────────────┬───────────────────────────┘
                                      │
             ┌────────────────────────┴────────────────────────┐
             ▼                                                 ▼
  ┌─────────────────────────────────────┐   ┌─────────────────────────────────────┐
  │     Supabase / PostgreSQL 15        │   │        Upstash / Redis Layer        │
  │ • Postgres Row Level Security (RLS) │   │ • Sliding Window Rate Limiter       │
  │ • Canonical Connection State Machine│   │ • Fail-Closed for Auth & AI         │
  │ • Append-Only Audit Logs (No DELETE)│   │ • Fail-Open for Public Feeds        │
  │ • Domain-Based Campus Verification  │   │ • Atomic Invalidation (feed:*)      │
  │ • Private Signed-URL Storage        │   └─────────────────────────────────────┘
  └─────────────────────────────────────┘
```

---

## 3. Local Start in Under Five Minutes

### Prerequisites
- Node.js 20+ (tested on Node.js v24.20.0)
- npm 10+

### Step-by-Step Setup
1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/arj556677-blip/Campus-Skill-Connect.git
   cd Campus-Skill-Connect/campus-skill-connect
   npm ci
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env.local
   ```
   *(The default `.env.example` contains safe local defaults to boot immediately).*

3. **Run Unit Tests:**
   ```bash
   npm test
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Environment Variables Specification

| Variable Name | Required | Default / Example | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | `https://placeholder.supabase.co` | Supabase API origin |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | `ey...` (min 10 chars) | Client-safe Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | `ey...` | Server-only admin script operations (never client-exposed) |
| `UPSTASH_REDIS_REST_URL` | Optional | `https://...upstash.io` | Distributed rate limiter |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | `token` | Upstash Redis token |
| `GEMINI_API_KEY` | Optional | `AIza...` | Server-side Career Copilot LLM key |
| `NODE_ENV` | Optional | `development` | Runtime environment (`development`, `production`, `test`) |

---

## 5. Security & Privacy Model

- **Frontend is Never the Security Boundary**: Every read and write is authorized by PostgreSQL RLS policies and server-side verified sessions (`supabase.auth.getUser()`).
- **Never Trust Client Identifiers**: Endpoints never accept client-supplied `owner_id`, `sender_id`, `user_id`, or `role`. All identity is derived strictly from `auth.uid()`.
- **Zero Service-Role Browser Exposure**: `SUPABASE_SERVICE_ROLE_KEY` is never prefixed with `NEXT_PUBLIC_` and is inaccessible to client bundles.
- **Append-Only Audit Logs**: `audit_logs` table has a database trigger rejecting all `UPDATE` and `DELETE` queries.
- **Block Isolation**: When User A blocks User B, both profiles, works, and messages are symmetrically hidden, and any active connection is canceled.

---

## 6. Rate Limiting Table

Rate limits are enforced per client IP (derived from trusted proxy headers) using a Redis sorted-set sliding window:

| Route / Feature | Limit | Window | Limiter Failure Policy |
|---|---|---|---|
| **Sign-In / Auth** (`/api/auth/*`) | 5 requests | 300 seconds (5 min) | **Fail Closed** (429/503) |
| **Work Submissions** (`POST /api/works`) | 10 submissions | 60 seconds | **Fail Closed** |
| **Direct Messaging** (`POST /api/messages`)| 120 messages | 60 seconds | **Fail Closed** |
| **Connection Actions** (`POST /api/connections`)| 15 actions | 60 seconds | **Fail Closed** |
| **AI Copilot** (`POST /api/copilot`) | 10 prompts | 60 seconds | **Fail Closed** |
| **General Read Feeds** (`/showcase`, `/api/skills`) | 100 requests | 60 seconds | **Fail Open** |

---

## 7. Feature Flags & Deferred Modules

| Feature Flag | Default | Description | Status |
|---|---|---|---|
| `ENABLE_AI_COPILOT` | `false` | AI Career Copilot LLM recommendations (opt-in per session, escaped Markdown) | **Tier 3 (Flagged)** |
| `ENABLE_RECRUITER_PORTAL` | `true` | Corporate recruiter search gated on verified corporate email | **Shipped** |
| `ENABLE_GITHUB_IMPORT` | `false` | Read-only repository import with staging review step | **Deferred** |
| `ENABLE_MENTOR_MATCHING` | `false` | Algorithmic mentor matching and geographic city zones | **Deferred** |

---

## 8. Known Limitations

1. **Video Infrastructure**: Collaboration rooms are link-based (Google Meet / Jitsi); the platform intentionally does not host private WebRTC/SFU video servers.
2. **Email Deliverability**: Verification and password reset emails require an external SMTP provider (e.g. Resend, SendGrid) configured within the live Supabase project.
3. **Statutory Legal Review**: While privacy controls and consent notices are aligned with India's DPDP Act 2023, independent legal counsel must formally review user terms before public launch.

---

## 9. Compliance & Legal Notice

- **DPDP Act 2023 (India)**: At sign-up, users must explicitly consent to notice explaining data categories collected, purposes, retention periods, and rights of correction and erasure.
- **Legal Review Notice**: *This platform incorporates security and privacy controls designed to align with the Digital Personal Data Protection Act, 2023 (India). Formal independent legal review is required before public production deployment.*

---

## 10. Verification & Test Commands

Every pull request and build must pass the full verification pipeline:
```bash
# 1. Typecheck (0 errors)
npx tsc --noEmit

# 2. Linting (0 errors)
npm run lint

# 3. Unit Test Suite (28/28 tests passed)
npm test

# 4. Production Build (47 routes compiled)
npm run build
```
