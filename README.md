# Nexora Solutions — Full-Stack Web Applications, SaaS & Discord Systems

A modern, production-ready web platform for **Nexora Solutions** built with **Next.js 14+ (App Router, TypeScript, Tailwind CSS)**, **Framer Motion**, **Prisma ORM**, and **Supabase PostgreSQL**.

---

## What Nexora Solutions Offers

- **SaaS Applications**: Multi-tenant architectures, user & admin dashboards, Stripe subscriptions, and scalable PostgreSQL database setups.
- **Fullstack Web Applications**: Fast, modern, responsive websites built with Next.js 14+, custom APIs, resilient databases, and smooth animations.
- **Discord Bots**: Custom bots with slash commands, automated roles, payment/crypto gating, moderation, and dedicated web management panels.
- **Custom Projects**: Specialized engineering, web scrapers, integrations, and bespoke systems.

---

## Key Features & Platform Capabilities

### 1. Interactive Ordering Wizard
- **Step 1: App Type Selection**: Choose from SaaS, Fullstack Web App, Discord Bot, or Custom Project.
- **Step 2: Color Theme & Palette Editor**: Select curated luxury color presets or use the real-time interactive color wheel to customize project hues.
- **Step 3: Details & Reference Files**: Provide project requirements, reference URLs, and upload design/brief assets with live image previews.
- **Step 4: Review & Submit**: Review order details and submit directly with automatic authentication.

### 2. Client Dashboard & Live Chat
- **Order Tracking**: Track real-time progress through 7 development milestones (`PENDING` → `UNDER_REVIEW` → `ACCEPTED` → `IN_PROGRESS` → `AWAITING_RESPONSE` → `REVISION` → `COMPLETED`).
- **Direct Developer Chat**: In-app messaging thread connecting clients directly to the developer for questions, updates, and deliverables.
- **Revision Requests**: Integrated modal allowing clients to request changes and updates with revision notes.

### 3. Admin Command Center
- **Order Management**: Review incoming orders, update project statuses, and filter by pipeline state.
- **Direct Client Communication**: Send updates and messages to customers in real time.
- **Key Metrics**: Monitor active builds, review queues, and delivered projects.

### 4. Visual Design & User Experience
- **Fluid Responsiveness**: Scales seamlessly across all browser zoom levels (from 20% to 500%) and screen ratios without awkward dead margins.
- **Custom Right-Click Context Menu**: Glassmorphic menu featuring a Dragon Follower ON/OFF toggle, quick navigation links, "Copy Page Link", and "Scroll to Top".
- **Cinematic Loading Screen**: Branded loading splash featuring the Nexora Solutions logo and a dynamic charging progress counter.
- **Dragon Follower**: Smooth physics-based dragon follower that can be toggled on/off anytime via right-click (automatically hidden on mobile devices).

### 5. Authentication & Security
- **Google OAuth 2.0 & Simulated Testing Mode**: Sign in with real Google accounts, plus one-click simulated login for instant testing.
- **Role-Based Access Control**: Secure separation between customer and administrative dashboards.
- **Prisma & Supabase**: Safe connection pooling via Supavisor pooler URLs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Actions, Route Handlers) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS (Midnight Obsidian & Gold theme) |
| **Animations** | Framer Motion + Canvas Physics + Lenis Smooth Scroll |
| **Database & ORM** | PostgreSQL (Supabase / Supavisor pooler) via Prisma ORM |
| **Authentication** | NextAuth.js (Google Provider + Simulated Testing Mode) |
| **Asset Storage** | Uploadthing |

---

## Local Development Quickstart

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Vulkan-dev/nexora-solutions.git
cd nexora-solutions
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your credentials for Supabase PostgreSQL, Google OAuth, and NextAuth.

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

To run the production server:
```bash
npm run build
npm start
```
*(The prestart script will automatically build the project if `BUILD_ID` is not present.)*
