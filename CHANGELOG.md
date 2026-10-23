# Changelog

All notable changes to the Campus Skill Connect platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-10-23

### Tier 2 Features (Communication, CV Studio, Privacy & Moderation)
- **Direct Messaging (`/messages`, `/api/conversations`, `/api/messages`)**:
  - Direct messaging restricted exclusively to accepted, unblocked peer connections.
  - Realtime delivery backed by Supabase Realtime channel subscriptions (`chat:${conversationId}`).
  - Accessible screen reader announcements via `aria-live="polite"` live regions.
  - Full keyboard navigation across conversation threads (`ArrowUp` / `ArrowDown`).
  - Optimistic message append with automatic rollback upon HTTP 429 rate limit or network failures.
  - In-thread moderation actions: direct user blocking and message reporting to moderation queue.
  - Hard 2,000-character input ceiling with visual character meter.
- **CV Studio & Rule-Based ATS Checklist (`/cv/upload`, `/cv/builder`, `/api/cv`)**:
  - File signature validation checking binary magic bytes (`%PDF-` for PDF, `PK\x03\x04` for DOCX) up to 5 MB.
  - Private storage bucket integration with downloads granted strictly via short-lived signed URLs.
  - Server-side parsing with a mandatory staging review step: zero fields are committed to user profile until explicitly approved.
  - Rule-based ATS checklist analyzing contact info, standard headings, chronological consistency, and keyword coverage without fake scores or fabricated parser standards.
  - CV builder exporting only user-selected fields (`exportFields` toggles).
- **Skill Evidence & Connection Endorsements (`/api/skills/endorse`, `SkillEvidenceBadge`)**:
  - Direct linking between skills and verified work items proving real-world application.
  - Endorsements restricted exclusively to accepted connections, strictly capped at one endorsement per peer per skill.
- **Moderation, Reporting & Blocking (`/api/reports`, `/api/blocks`, `/report`)**:
  - Full reporting pipeline supporting profiles, works, and messages dispatching to moderation queue with audit trail logging.
  - Symmetrical user blocking trigger auto-canceling all existing connection records and isolating profiles.
- **In-App Notifications (`/api/notifications`)**:
  - Endpoint for connection requests, acceptances, and endorsements with unread count badges and batch read updates.
- **Link-Based Collaboration Rooms (`/api/collab/google-meet`, `/collaborate`)**:
  - Authenticated room creation with cryptographic SHA-256 passcode hashing; zero unhashed secrets stored.
- **Privacy-Preserving Share Previews (Open Graph)**:
  - Dynamically configured `generateMetadata` for `/u/[username]` and `/works/[id]`: private and connections-only items return generic, non-indexed metadata to protect confidential portfolios from web scrapers.
- **Privacy Dashboard & DPDPA 2023 Compliance (`/profile/privacy`, `/api/user/export`, `/api/user/delete`)**:
  - Interactive exposure matrix demonstrating what each visibility tier exposes to the public, campus, and connections.
  - Machine-readable JSON personal data archive export (`/api/user/export`).
  - Permanent account deletion and data anonymization flow (`/api/user/delete`) requiring explicit confirmation.
  - Statutory consent notices aligned with the Digital Personal Data Protection Act, 2023 (India).
- **Purge of Fabricated Metrics & Placeholder Identities**:
  - Completely eradicated synthetic metrics ("ATS 94/100", "99.4% cache hit", "98% parser standard") and hardcoded default personas ("Alex Rivera") across all dashboard and landing page components.

### Tier 1 Features & Database Architecture V2
- **Data Model Migration V2 (`002_data_model_v2.sql`)**:
  - Implemented canonical connection pair ordering `(user_low < user_high)` to eliminate duplicate rows and race conditions.
  - Added PostgreSQL state transition function `transition_connection_status` enforcing valid state transitions (`pending`, `accepted`, `declined`, `withdrawn`, `blocked`).
  - Added `blocks` table with trigger to sever connections and symmetrically isolate blocked users across all queries.
  - Enforced append-only immutability on `audit_logs` via trigger blocking all `UPDATE` and `DELETE` operations.
  - Added university email domain verification function `verify_user_campus` linking profiles to verified institutions.
- **Public Profile & Public Preview Route (`/u/[username]`)**:
  - Created `/u/[username]` displaying user portfolio, skills, and evidence links.
  - Enforced 4-level visibility model (`only_me`, `connections`, `campus`, `public`) based on viewer authorization.
  - Added toggleable "Preview as Public" mode for profile owners.
  - Added Profile Editor at `/profile/edit` with unique username validation and campus domain verification trigger.
- **Authentication & Password Recovery (`/auth/reset-password`)**:
  - Built complete password recovery workflow utilizing `supabase.auth.resetPasswordForEmail` and `supabase.auth.updateUser`.
  - Added "Forgot password?" navigation flow on `/sign-in`.
- **Controlled Skills Vocabulary & User Skills (`/api/skills`)**:
  - Created `/api/skills` endpoint supporting autocomplete search against accredited skills.
  - Allowed adding, removing, and editing user skills, with explicit self-declared labeling.
- **Link-First Work Publishing (`/works/new`, `/api/works/[id]`)**:
  - Enforced secure HTTPS protocol validation on all external URLs.
  - Added safe-link origin verification without arbitrary server-side SSRF.
  - Added owner-only PATCH and DELETE endpoints at `/api/works/[id]`.
- **Showcase Feed & Cursor Pagination (`/showcase`)**:
  - URL-synced search, category filtering, and sorting state (`?category=...&q=...&sort=...&page=...`).
  - Implemented 24 items per page cursor pagination with accurate result count ("Showing X works").
  - Added accessible, distinct empty states when no results match.
- **Corporate Recruiter Candidate Search (`/recruiter/search`)**:
  - Server-side role gating requiring verified corporate recruiter credentials.
  - Compact candidate comparison cards filtering on real skills, campus, and field.
  - Zero leakage of private or connections-only portfolios or PII.
- **Comprehensive Automated Testing**:
  - Installed Vitest test runner; created 28 unit tests across 5 test suites covering rate limiting, IP extraction, visibility rules, URL/file validators, environment configuration, and XSS sanitization payloads.
  - Created SQL database test suite (`tests/database/rls_and_state_machine.test.sql`) proving canonical state transitions and RLS enforcement.

### Security Hardening (AUDIT.md Remediation Gate)
- **Eliminated Client-Side Cookie/LocalStorage Auth Bypass (SEC-001)**:
  - Removed trust of client-side `csc_is_logged_in` and `csc_active_role` cookies from `src/lib/supabase/middleware.ts`.
  - Enforced cryptographically verified session checks via `supabase.auth.getUser()`.
- **Wired Live Supabase Authentication in Sign-In & Sign-Up (SEC-002)**:
  - Updated `src/app/sign-in/page.tsx` to call `supabase.auth.signInWithPassword()` with reactive error alert banners.
  - Updated `src/app/sign-up/page.tsx` to call `supabase.auth.signUp()`, with DPDP Act 2023 compliance consent notice.
- **Enforced Server-Derived Identity on API Routes (SEC-003, DATA-001)**:
  - `POST /api/works`: Enforced 401 Unauthorized for unauthenticated requests, derived `owner_id = user.id` strictly from session token.
  - `POST /api/messages`: Derived `sender_id = user.id` strictly from session. Enforced 2,000-character ceiling.
  - Standardized on proper HTTP 400/401/429/500 error responses.
- **Neutralized Stored & Reflected XSS in Copilot (SEC-004)**:
  - Replaced `dangerouslySetInnerHTML` in `src/app/copilot/page.tsx` with a safe, pure React inline AST tokenizer in `src/lib/utils/markdown.ts`.
- **Prevented Rate Limiting Evasion (SEC-005)**:
  - Created `src/lib/utils/ip.ts` for trusted client IP extraction, ignoring spoofable client `X-Forwarded-For` headers.
  - Added `failClosed` option to `src/lib/redis/rate-limit.ts` to fail closed for sensitive authentication and AI routes when Redis is unavailable, while failing open for general read routes.
- **Removed Silent Mock Fallbacks (DATA-002)**:
  - Refactored `src/lib/data/service.ts` so live queries return genuine database records or accurate empty sets without silently masking database availability.
- **Product Honesty & Accurate Feedback (PROD-001)**:
  - Replaced artificial hardcoded ATS scores with a genuine rule-based ATS structure checklist in `src/app/cv/builder/page.tsx`.
- **Cleaned Dead Boilerplate (ARCH-001, CONF-001, DEP-001)**:
  - Deleted obsolete starter files `src/lib/middleware.ts`, `src/lib/client.ts`, `src/lib/server.ts`.
  - Standardized all Supabase keys on `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - Created canonical `.env.example`.
  - Removed unused package `"cn"`, moved `"shadcn"` to `devDependencies`.
