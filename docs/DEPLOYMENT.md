# Production Deployment & Operations Guide (docs/DEPLOYMENT.md)

**Project:** Campus Skill Connect  
**Stack:** Next.js 16 App Router, React 19, Supabase (Auth, Postgres with RLS, Storage), Upstash Redis  
**Target Environments:** Vercel / Managed Next.js Host, Docker Self-Hosted Compose  

---

## 1. Architecture Overview

Campus Skill Connect runs in two supported topologies:
1. **Primary (Recommended Managed Host)**:
   - Next.js 16 deployed on Vercel or AWS Amplify.
   - Managed Supabase PostgreSQL with Row Level Security (RLS) and Storage.
   - Upstash Redis for distributed sliding-window rate limiting.
   - Zero local server daemons needed (no Docker, NGINX, or Redis servers required).

2. **Self-Hosted Profile (`docker-compose.yml`)**:
   - NGINX on ports `80` and `443` (HTTP to HTTPS redirect, TLS termination).
   - Next.js application container internal only (`3000`).
   - Redis container internal only (`6379`).

---

## 2. DNS & Domain Configuration

| Record Type | Host | Value / Target | TTL | Purpose |
|---|---|---|---|---|
| **A** | `@` (apex) | `76.76.21.21` (or load balancer IP) | 300 | Primary apex domain routing |
| **CNAME** | `www` | `cname.vercel-dns.com` (or host target) | 300 | Subdomain redirect |
| **CNAME** | `supabase` | `<project-ref>.supabase.co` | 300 | Custom auth domain (optional) |

---

## 3. TLS, HSTS, and Security Headers

### Reverse Proxy Configuration (NGINX / Edge)
```nginx
# Security Headers & HSTS (Strict-Transport-Security)
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Content Security Policy (CSP) limited to Supabase origin and self
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.supabase.co https://images.unsplash.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.upstash.io; font-src 'self'; frame-ancestors 'none';" always;
```

---

## 4. Supabase Project Configuration

### 4.1 Authentication Configuration
In the **Supabase Dashboard** -> **Authentication** -> **URL Configuration**:
- **Site URL**: `https://<your-domain>.com`
- **Redirect URLs (Allowlist)**:
  - `https://<your-domain>.com/auth/callback`
  - `https://<your-domain>.com/auth/reset-password`
  - `http://localhost:3000/auth/callback` (development only)
  - `http://localhost:3000/auth/reset-password` (development only)

### 4.2 Storage Buckets
Create the following buckets under **Storage**:
1. `cv-uploads` (PRIVATE): Only accessible via short-lived signed URLs.
   - Max file size: 5 MB
   - Allowed MIME types: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
2. `public-works` (PUBLIC): Storage for public project screenshots and architecture diagrams.

---

## 5. Migration Execution Order

Migrations must be executed in sequential order. **Never edit an already applied migration.**

```bash
# 1. Apply baseline tables, roles, and reference communities
supabase db push --file supabase/migrations/001_master_schema.sql

# 2. Apply V2 security hardening, canonical connections, blocks, and verification triggers
supabase db push --file supabase/migrations/002_data_model_v2.sql
```

### Migration Verification
Run the database test suite to verify RLS isolation and state machine enforcement:
```bash
psql -h <supabase-db-host> -U postgres -d postgres -f tests/database/rls_and_state_machine.test.sql
```

---

## 6. Backups & Disaster Recovery

1. **Automated Point-in-Time Recovery (PITR)**:
   - Supabase Pro provides continuous WAL archiving allowing recovery to any millisecond within the retention window.
2. **Nightly Snapshot Backups**:
   - Scheduled pg_dump executed via cron to an encrypted S3 bucket:
   ```bash
   pg_dump -Fc --no-acl --no-owner -h $DB_HOST -U $DB_USER $DB_NAME > /backups/backup_$(date +%Y%m%d_%H%M%S).dump
   ```

---

## 7. Rollback Procedures

### Application Rollback
- Revert commit on `feature/campus-platform-v2` or point the edge router to the previous deployment build ID within the deployment dashboard.

### Database Rollback Strategy
- Migrations in `supabase/migrations/` use non-destructive schema additions (`ADD COLUMN IF NOT EXISTS`, view definitions, and triggers).
- To roll back a migration, create an incremental forward migration `003_rollback_*.sql` rather than dropping columns in place.
