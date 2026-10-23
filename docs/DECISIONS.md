# Architecture and Product Decisions (DECISIONS.md)

This document records all architectural, product, and implementation decisions where user prompt specifications refine, supersede, or adapt the original project report (`docs/PROJECT_REPORT.md`).

---

## Decision 1: Authority and Source of Truth
* **Context**: The project report (`docs/PROJECT_REPORT.md`) defines the broad 48-hour hackathon blueprint. The user prompt provides senior-level engineering and security constraints.
* **Decision**: Per prompt instructions, where the prompt and the report disagree, the prompt is the authoritative source of truth. All deviations are formally recorded here.
* **Rationale**: Eliminates ambiguity, enforces strict security boundaries, and prevents shipping unverified claims or placeholder features.

---

## Decision 2: Strict Three-Tier Phased Scope
* **Context**: The project report suggested an expansive list of features across hackathon stages.
* **Decision**: All work is strictly partitioned into:
  * **Tier 1 (Core Demo Flow — Section 21.7)**: Complete, tested vertical slice (Authentication with Supabase SSR cookies, verified campus email domain check, Profile `/u/[username]`, Skills with controlled search, Publish work link-first with safe-link preview, Discover & Showcase with cursor pagination and URL sync, Connections with DB state machine, Recruiter search basic).
  * **Tier 2 (Additional Features)**: Direct messaging (accepted connections only, Supabase Realtime), CV Studio (PDF/DOCX max 5MB, signature validation, signed URLs), Rule-based ATS checklist (no fake scores), Skill evidence links, Reports & blocking, In-app notifications, Link-based Collab rooms (no video hosting), Share previews, Privacy dashboard.
  * **Tier 3 (Flagged / Deferred)**: AI Career Copilot (opt-in session, escaped Markdown, server-side key), Admin/Moderation console (backed by `user_roles` and `audit_logs`), Support tickets, GitHub import, Mentor matching/city zones/communities deferred until verified rules exist.
* **Rationale**: Guarantees zero half-working controls and ensures Tier 1 is verified with database and unit tests before any Tier 2/3 features are surfaced.

---

## Decision 3: Canonical Connection Pair Ordering `(user_low, user_high)`
* **Context**: The report proposed `connection_requests (sender_id, receiver_id)` which can lead to race conditions or duplicate rows in opposing directions `(A -> B)` and `(B -> A)`.
* **Decision**: Migrate to a canonical single-row pair model:
  * `user_low = LEAST(user_a, user_b)`
  * `user_high = GREATEST(user_a, user_b)`
  * Unique constraint on `(user_low, user_high)`.
  * Track `requested_by` (UUID), `status` (`pending`, `accepted`, `declined`, `withdrawn`, `blocked`), and timestamps.
  * Database function `enforce_connection_transition()` validates state machine transitions in PostgreSQL, not just application code.
* **Rationale**: Eliminates race conditions, duplicate rows, and client-forged state transitions at the database level.

---

## Decision 4: Verified Email Domain Campus Membership vs Self-Declared
* **Context**: The report allowed self-selected campus/community tags.
* **Decision**: Campus and institution verification requires matching a verified university email domain against `institutions.allowed_domains`. If verified, the badge `Verified Campus` is displayed; otherwise, the user's institution/campus tag is explicitly labeled `Self-declared`.
* **Rationale**: Aligns with the core non-negotiable principle: "Self-declared content, uploaded documents, and AI output are labeled as such. Nothing is presented as verified unless verification actually happened."

---

## Decision 5: Rule-Based ATS Checklist (Prohibition of Fake Scores)
* **Context**: Earlier drafts showed an arbitrary "ATS Score 94/100" and claimed "98% parser standard".
* **Decision**: Remove all hardcoded or simulated scores and claimed parser benchmarks. Replace with a deterministic, rule-based ATS structural checklist:
  * Contact information detection (name, email, phone/links).
  * Standard section headings present (Experience, Education, Skills, Projects).
  * Date consistency and chronological formatting.
  * Keyword coverage matching against user-provided job descriptions.
* **Rationale**: Products with senior engineering standards never ship unsubstantiated or deceptive metrics.

---

## Decision 6: Rate Limiting & Trusted IP Extraction
* **Context**: Existing routes trusted `request.headers.get('x-forwarded-for')` directly, allowing trivial rate-limit bypass via header spoofing.
* **Decision**: Extract client IP using a secure reverse proxy strategy (e.g. leftmost client IP when behind verified NGINX/Cloudflare, or socket remote address). Implement a rate limiter interface with an Upstash Redis implementation and a Postgres fallback table `rate_limit_buckets`.
  * Auth and AI endpoints fail closed on limiter failure.
  * Public read feeds fail open on limiter failure.
* **Rationale**: Prevents spoofing attacks and ensures high availability when Redis is unreachable.

---

## Decision 7: Complete Elimination of Client-Side Session Spoofing
* **Context**: Prior implementation used `csc_is_logged_in` and `csc_active_role` cookies with `localStorage` fallback to impersonate roles without backend validation.
* **Decision**: Completely remove all client-side authentication bypasses. The Supabase SSR session token (`sb-*-auth-token`) verified via `supabase.auth.getUser()` on the server is the single source of truth for all routes and RLS policies.
* **Rationale**: Non-negotiable security principle: The frontend is never the security boundary.

---

## Decision 8: Controlled Link-First Publishing & Safe Link Previews
* **Context**: Arbitrary external link fetching in server-side preview can lead to Server-Side Request Forgery (SSRF) and malicious script execution.
* **Decision**: Works are link-first. External URLs must validate as HTTPS. Link previews use static safe metadata extraction with URL domain allowlisting/sanitization, strict request timeouts, and never automatically execute remote code or fetch private intranet IPs (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, `169.254.169.254`).
* **Rationale**: Protects server infrastructure from SSRF and users from malicious embeds.
