# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary**: University and college students seeking to showcase genuine technical and creative projects, discover campus peers, find multidisciplinary collaborators, and build high-trust academic/technical portfolios.
- **Secondary**: Faculty members creating research/project showcases and guiding student work; and verified corporate recruiters sourcing emerging campus talent through public and campus-visible work proofs.

## Product Purpose

Replace keyword-stuffed resumes and unverified profile claims with peer-reviewable, link-first proof of work. Success means students build credible, verified portfolios of tangible artifacts (code repositories, research papers, design systems, deployments), form genuine cross-disciplinary project collaborations, and earn career opportunities through authenticated proof rather than self-asserted hype.

## Positioning

A skill-first, work-first, privacy-conscious campus platform anchored in cryptographic/domain-verified institutional identity and link-first evidence. Unlike generic professional networks (e.g., LinkedIn) saturated with unvetted self-endorsements, every institutional badge is verified via institutional email domain matching, every project is anchored in safe HTTPS links to real artifacts, and privacy is strictly enforced at the database RLS layer across four discrete visibility tiers.

## Operating Context

- University campuses, student computer labs, developer environments, mobile and desktop web browsers (responsive from 360px+).
- Integrated with external proof repositories (GitHub, GitLab, ArXiv, Figma, live demo URLs).
- Used during project creation cycles, hackathons, academic terms, peer reviews, and campus placement/recruiting seasons.
- Alignment with India's Digital Personal Data Protection (DPDP) Act 2023 for student privacy and clear consent.

## Capabilities and Constraints

- **Verified University Membership**: Validated strictly against accredited university email domains. Non-verified or pending domains are prominently marked as "Self-declared".
- **Link-First Work Publishing**: HTTPS external link submissions with server-side SSRF protection (sanitized domain checking, intranet IP protection).
- **Strict 4-Level Visibility Model**: Enforced at the PostgreSQL Row Level Security (RLS) layer across `only_me`, `connections`, `campus`, and `public`.
- **Canonical Peer Connection Graph**: Single-row canonical ordering `(user_low < user_high)` with database-level state machine validation (`pending`, `accepted`, `declined`, `withdrawn`, `blocked`).
- **Rule-Based ATS Checklist**: Deterministic structural analysis (contact info, standard headings, date consistency, keyword coverage). Zero arbitrary scores, percentages, or black-box metrics.
- **Direct Messaging**: Available strictly between mutual, accepted connections with Supabase Realtime synchronization.
- **Corporate Recruiter Portal**: Gated on verified corporate domains; strictly restricted to querying public and campus-visible portfolios. Never permitted access to private or connections-only student data.
- **Security Boundaries**: Frontend is never the security boundary; all auth and permissions derive server-side from `supabase.auth.getUser()`. Append-only audit logs for security actions.

## Brand Commitments

- **Name**: Campus Skill Connect (CSC)
- **Voice**: Credible, academic yet modern, candid, privacy-respecting, and free of corporate jargon or inflated hype.
- **Honesty in Credentials**: Explicit distinction between verified academic/institutional credentials and self-declared claims.

## Evidence on Hand

- Fully operational Next.js 16 (App Router) codebase with React 19, Supabase RLS, and Tailwind CSS.
- Documented engineering and product architecture in `README.md`, `docs/DECISIONS.md`, and `docs/PROJECT_REPORT.md`.
- Comprehensive test suite covering connection states, rate limiting, and domain validation.

## Product Principles

1. **Proof Over Claims**: Tangible links, live demos, and verified artifacts replace self-declared skills and keyword resumes.
2. **Never Fabricate Truth**: Zero arbitrary scores, benchmark percentages, or simulated ATS grades; every status is transparently classified as verified or self-declared.
3. **Privacy as an Invariant**: Visibility levels (`only_me`, `connections`, `campus`, `public`) are enforced at the PostgreSQL RLS layer, never relying on client-side display logic.
4. **Symmetric Boundaries**: Blocking, connection states, and permissions maintain strict symmetry and fail-safe defaults to protect student safety.
5. **Student & Peer Focus First**: Build primarily for student collaboration and proof-of-work discovery; recruiter discovery serves as an organic extension of real work.

## Accessibility & Inclusion

- Designed for responsive mobile (360px+) through widescreen desktop displays.
- Strict semantic HTML structure, keyboard navigability, and high-contrast readable type hierarchy.
- Compliance with data privacy and explicit consent requirements under DPDP Act 2023.
