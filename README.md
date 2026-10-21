# 🎓 Campus Skill Connect (CSC) — Production Platform V2.0

> **A high-trust proof-of-work campus network connecting verified student engineers, researchers, and creators with peers, faculty mentors, and tier-one recruiters.**

Accelerated by an in-memory **Redis 7 Cache-Aside layer**, secured by **PostgreSQL Row-Level Security (RLS)** across 23 relational tables, and reverse-proxied by **NGINX 1.25** with SSL termination and sliding-window rate limiting zones.

---

## 🏗️ Architecture Blueprint

```
                      ┌─────────────────────────────────────────┐
                      │        Clients & Edge Devices           │
                      │  Desktop • Mobile PWA • Recruiter Portal │
                      └────────────────────┬────────────────────┘
                                           │ HTTP/HTTPS (Port 80/443)
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │         NGINX 1.25 Edge Proxy           │
                      │  • SSL/TLS Termination                  │
                      │  • Brotli & Gzip Compression            │
                      │  • Sliding-Window Rate Zones (limit_req)│
                      │  • SSE Realtime Buffering Bypass        │
                      │  • Static Asset Caching (365d immutable)│
                      └────────────────────┬────────────────────┘
                                           │ Upstream Keepalive
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │    Next.js 15 App Router Application    │
                      │  • React 19 + TypeScript (Strict)       │
                      │  • Server Components & SSR Cookie Auth  │
                      │  • Dynamic ATS Resume Scoring Engine    │
                      │  • Contextual AI Career Copilot         │
                      └─────────────┬───────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌─────────────────────────────────────┐   ┌─────────────────────────────────────┐
│      Redis 7 In-Memory Engine       │   │        Supabase / PostgreSQL 15     │
│ • Cache-Aside Query Accelerator     │   │ • 23 Relational Tables with RLS     │
│ • Sliding Window Rate Limiter       │   │ • Triggers & Auto-Updated Timestamps│
│ • Real-time Active Presence Ping    │   │ • Granular 5-Level Privacy Grants   │
│ • Pub/Sub Channel Message Broker    │   │ • Cloud Storage Buckets             │
└─────────────────────────────────────┘   └─────────────────────────────────────┘
```

---

## ✨ Comprehensive Features & Route Directory

| Feature Route | Description | Tech Highlight |
|---|---|---|
| **`/`** | Editorial Landing Page with live infrastructure telemetry and showcase teaser | Dynamic Server Component |
| **`/showcase`** & **`/discover`** | Project gallery with multi-tag filtering, category tabs, and instant search | Redis Query Cache (120s TTL) |
| **`/works/[id]`** | Work detail view, fine-grained access checks, live demo launch, and endorsements | Granular Visibility Check |
| **`/works/new`** | Work publishing form with automated URL safety scanner and skills multi-select | Redis Cache Invalidation on Submit |
| **`/people`** | Talent Directory with weighted skill match scoring and college/zone filters | Cross-Campus Federation |
| **`/profile/[id]`** | Dribbble-inspired software engineer portfolio profile | Verified Campus Domain Badge |
| **`/cv`** | CV Studio Hub with ATS guidelines and dual creation modes | 98% ATS Parser Standard |
| **`/cv/builder`** | Live 2-column resume builder with real-time ATS score gauge and 4 switchable templates | Print CSS & JSON-Resume Export |
| **`/cv/upload`** | Resume PDF/DOCX scanner, skill extractor, and profile staging view | Heuristic Document Parsing |
| **`/messages`** | In-app 1-on-1 direct messaging with real-time message streams | Redis Pub/Sub + SSE Bridge |
| **`/collaborate`** | WebRTC Collaboration Room launcher with peer presence | Jitsi Meet Cloud Embed |
| **`/collaborate/[slug]`** | Fullscreen zero-login video & screen-share pairing room | Zero Plugin WebRTC Standard |
| **`/copilot`** | AI Career Copilot for portfolio critiques, interview drills, and ATS checklists | Rate-Limited AI Endpoint |
| **`/recruiter/search`** | Talent sourcing engine ranking candidates by verified proof of work | Candidate Match % & JSON Export |
| **`/admin`** | Trust & Safety console: Moderation queue, Security audit logs, College verification | Tamper-Proof Audit Table |
| **`/support`** | Helpdesk ticketing system with threaded staff discussions | Priority & Category Tracking |
| **`/connections`** | Consent-based network manager for pending and active connections | Anti-Scraping Protection |
| **`/communities`** | University directory of verified colleges and federated campuses | Academic Email Whitelist |
| **`/zones`** | Metropolitan innovation corridors (Bangalore, Mumbai, Delhi-NCR, Hyderabad) | Regional Tech Clusters |
| **`/terms`** | Student-first privacy charter and RLS security documentation | Transparent Data Policies |

---

## 🚀 Quick Start Guide

### Option 1: Multi-Container Docker Compose (Recommended)

Run the full production stack (**Next.js**, **Redis 7**, and **NGINX 1.25**) with a single command:

```bash
cd campus-skill-connect
docker compose up --build
```

- **Web App (via NGINX):** [http://localhost](http://localhost)
- **Direct Next.js Application:** [http://localhost:3000](http://localhost:3000)
- **Redis In-Memory Engine:** `localhost:6379`
- **Health Check Endpoint:** [http://localhost/health](http://localhost/health)

---

### Option 2: Local Development Server

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create `.env.local` (copied from `.env.local.example`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   REDIS_URL=redis://localhost:6379
   GOOGLE_AI_API_KEY=your_gemini_api_key  # Optional
   ```

3. **Start Next.js dev server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

1. Open your Supabase SQL Editor or PostgreSQL 15 database instance.
2. Execute the master migration script located at:
   ```
   supabase/migrations/001_master_schema.sql
   ```
3. This creates all **23 relational tables**, foreign key constraints, Row-Level Security (RLS) policies, and performance indexes.

---

## ⚡ Redis In-Memory Engine Architecture

- **Cache-Aside Layer (`src/lib/redis/cache.ts`):** Transparently caches Supabase queries for profiles, works, and showcase feeds. If Redis is unavailable or undergoing maintenance, it seamlessly falls through to the database without throwing errors.
- **Sliding-Window Rate Limiter (`src/lib/redis/rate-limit.ts`):** Defends API routes from scraping and abuse using Redis sorted sets (`ZADD`, `ZREMRANGEBYSCORE`).
- **Pub/Sub Broker (`src/lib/redis/pubsub.ts`):** Powers real-time chat, notifications, and meeting invites.
- **Active Presence Store (`src/lib/redis/session.ts`):** Heartbeat tracking displaying real-time online status badges.

---

## 🔒 Security & Privacy Guarantees

1. **No Unsolicited Recruiter Scraping:** Recruiters cannot bulk export student directories without authenticated authorization.
2. **5-Level Granular Privacy:** Students control access at the per-project level (`worldwide`, `campus`, `connections`, `selected_users`, `only_me`).
3. **Automated URL Safety Scanner:** All external repository and paper links pass protocol and domain reputation validation before submission.
4. **Row-Level Security (RLS):** Cross-tenant database access is restricted by cryptographic PostgreSQL row policies.
