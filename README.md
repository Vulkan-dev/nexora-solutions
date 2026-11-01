# RADIANT — Kinetic Web Architecture & Full-Stack Platform

A production-ready, ultra-high-performance digital web platform built with **Next.js 14+ (App Router, TypeScript, Tailwind CSS)**, **Framer Motion**, and **Lenis**, optimized specifically for zero-cold-start **Vercel Serverless** deployment.

---

## Key Features & Visual Engineering

### 1. Cinematic UI & Motion Physics
- **Custom Cursor**: HTML5 canvas rendering a primary pointer dot trailing a multi-segment (26-joint) spring-physics **dragon follower** with velocity damping, lateral rib spikes, and ember dissipation.
- **Interactive 3D Hero**: Normalized coordinate tracking, multi-layer perspective parallax, floating pills, and glowing gradient lighting reacting in real-time to pointer movements.
- **Magnetic Buttons**: Spring-interpolated cursor pull within a configurable interaction radius.
- **3D Tilt Cards**: Perspective tilt on hover with dynamic specular reflection gloss tracking pointer position.
- **Text Reveals**: Smooth word-by-word opacity and vertical translation triggered by scroll progress.
- **Smooth Scrolling**: Zero-jank inertial scrolling powered by Lenis.
- **Background Ambiance**: Subtle, restrained animated canvas grid with pulsing particle constellations.

### 2. Full-Stack Modules & Workflows
- **Catalog & Filterable Services**: Category pills, instant search, dynamic tier packages, and direct configuration links.
- **Multi-Step Ordering Wizard**:
  - *Step 1*: Service & Package selection
  - *Step 2*: Add-on feature configuration with instant real-time price recalculation
  - *Step 3*: Project requirements specification and reference file uploads (Uploadthing dropzone)
  - *Step 4*: Order review, itemized breakdown, and Stripe checkout trigger
- **Customer Dashboard**:
  - Active and historical orders overview
  - **8-Stage visual progress timeline**: `PENDING` → `UNDER_REVIEW` → `ACCEPTED` → `IN_PROGRESS` → `AWAITING_RESPONSE` → `REVISION` → `COMPLETED`
  - Real-time project messaging thread connecting client directly to lead architects
  - Revision request modal with change details
- **Admin Command Center**:
  - Executive KPI metrics (Pipeline Volume, Active Builds, Triage Queue, Delivered Orders)
  - Interactive orders table with instant status transitions (Accept, Reject, In Progress, Deliver)
  - Audit logging and client note dispatch
- **Authentication & RBAC**:
  - NextAuth.js with Google OAuth 2.0 provider and JWT session strategy
  - Role-Based Access Control (`CUSTOMER`, `ADMIN`) enforced via Edge Middleware

### 3. Enterprise Security & Hardening
- **Distributed Rate Limiting**: Upstash Redis sliding-window token bucket on all API handlers (with automatic development fallback).
- **Anti-SQL Injection**: Prisma ORM parameterized queries with strict Zod schema validation across all inputs.
- **Bot Mitigation**: Cloudflare Turnstile token validation on auth and order submission forms.
- **Edge Route Protection**: Middleware verifying JWT session signature and admin claims before entering `/admin/*`.
- **Security Headers**: Injected via `next.config.mjs` including CSP, HSTS (`max-age=63072000`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Actions, Route Handlers) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS (Obsidian luxury theme) |
| **Animations** | Framer Motion + Custom HTML5 Canvas Physics + Lenis |
| **Database & ORM** | PostgreSQL (Neon / Supabase) via Prisma ORM |
| **Rate Limiting** | Upstash Redis (`@upstash/ratelimit`) |
| **Authentication** | NextAuth.js (Google Provider + Prisma Adapter) |
| **Payments** | Stripe API + Webhook handling |
| **Asset Storage** | Uploadthing |

---

## Local Development Quickstart

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd radiant-einstein
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Update your credentials for PostgreSQL, Google OAuth, Upstash Redis, and Stripe.

### 3. Push Prisma Database Schema
```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the platform.

---

## Vercel Deployment

1. Push your repository to GitHub / GitLab.
2. Import the project in the [Vercel Dashboard](https://vercel.com).
3. Under **Build & Development Settings**, configure:
   - **Build Command**: `prisma generate && next build`
4. Add all environment variables from `.env.example` into **Project Settings → Environment Variables**.
5. Click **Deploy**. Vercel will automatically provision serverless functions with zero cold starts!
