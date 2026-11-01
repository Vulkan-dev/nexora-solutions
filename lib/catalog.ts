export interface PackageTier {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  features: string[];
}

export interface ServiceAddon {
  id: string;
  name: string;
  price: number;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  packages: PackageTier[];
  addons: ServiceAddon[];
}

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "srv-saas",
    slug: "saas-app",
    title: "SaaS Application Development",
    category: "Software as a Service",
    description:
      "Production-ready, multi-tenant SaaS platforms built for scale. Includes recurring Stripe subscriptions, JWT/OAuth authentication, role-based dashboards, and high-performance serverless APIs.",
    basePrice: 2800,
    isActive: true,
    packages: [
      {
        id: "pkg-saas-mvp",
        name: "MVP Launch Edition",
        description: "Essential SaaS foundation with authentication, user dashboard, Stripe billing, and database setup.",
        price: 2800,
        deliveryDays: 14,
        features: [
          "Next.js App Router Architecture",
          "NextAuth & Google/Email Login",
          "Stripe Subscription Checkout & Webhooks",
          "PostgreSQL / Supabase Database Schema",
          "Clean Admin & Customer Dashboards",
          "Responsive Mobile-First UI",
        ],
      },
      {
        id: "pkg-saas-pro",
        name: "Scale & Growth Suite",
        description: "Full-featured SaaS ecosystem with multi-tiered billing, team workspaces, usage tracking, and automated onboarding.",
        price: 4900,
        deliveryDays: 24,
        features: [
          "Everything in MVP Edition",
          "Multi-Tenant Team Workspaces & Invites",
          "Usage Metering & Tiered Subscription Models",
          "Real-Time Metrics & Analytics Charts",
          "Transactional Email (Resend/SendGrid)",
          "Protected Admin Operations Hub",
        ],
      },
      {
        id: "pkg-saas-enterprise",
        name: "Enterprise Architecture",
        description: "Custom enterprise-grade SaaS infrastructure with custom API rate limits, audit logs, and ongoing priority support.",
        price: 8500,
        deliveryDays: 35,
        features: [
          "Complete Enterprise SaaS Codebase & IP",
          "Distributed Upstash Redis Rate Limiting",
          "Custom Webhooks & Public REST API for Users",
          "Comprehensive Automated Unit & E2E Tests",
          "High-Availability Cloud Hosting Setup",
          "60 Days Dedicated Dev Maintenance",
        ],
      },
    ],
    addons: [
      { id: "add-saas-ai", name: "Gemini / OpenAI LLM Integration & AI Streaming", price: 650 },
      { id: "add-saas-cms", name: "Headless CMS & Blog for SEO Organic Growth", price: 450 },
      { id: "add-saas-analytics", name: "Advanced Mixpanel / PostHog Event Tracking", price: 350 },
    ],
  },
  {
    id: "srv-fullstack",
    slug: "fullstack-web-application",
    title: "Full-Stack Web Applications",
    category: "Web Engineering",
    description:
      "Modern, ultra-fast web applications crafted with Next.js, TypeScript, Tailwind CSS, and resilient backend databases. Designed for high conversion and fluid interactive UX.",
    basePrice: 1900,
    isActive: true,
    packages: [
      {
        id: "pkg-web-essential",
        name: "Standard Application",
        description: "Custom bespoke web application with responsive UI, dynamic data forms, and database storage.",
        price: 1900,
        deliveryDays: 10,
        features: [
          "Custom Responsive Next.js 14+ UI",
          "Tailwind CSS & Framer Motion Animations",
          "PostgreSQL / Prisma Database Integration",
          "Secure API Routes with Zod Validation",
          "Contact & Quest Submission Systems",
          "SEO Metadata & Performance Tuning",
        ],
      },
      {
        id: "pkg-web-premium",
        name: "Cinematic Platform",
        description: "High-end interactive web application with custom cursor, 3D tilt cards, interactive hero, and member portal.",
        price: 3400,
        deliveryDays: 18,
        features: [
          "Everything in Standard Edition",
          "Custom Cursor & Kinematic Physics",
          "Interactive Hero with Mouse Depth",
          "Customer Portal & Order Tracking",
          "Stripe One-Time & Split Payment Support",
          "Uploadthing Secure File Delivery Zone",
        ],
      },
    ],
    addons: [
      { id: "add-web-speed", name: "Ultra Performance Optimization (99+ Core Web Vitals)", price: 400 },
      { id: "add-web-i18n", name: "Multi-Language Internationalization (i18n)", price: 500 },
    ],
  },
  {
    id: "srv-discord",
    slug: "discord-bots",
    title: "Custom Discord Bots & Community Tools",
    category: "Bot Development",
    description:
      "Powerful, scalable Discord bots built with Discord.js / Python. Custom slash commands, automated role assignment, payment verification, AI moderation, and web management dashboards.",
    basePrice: 750,
    isActive: true,
    packages: [
      {
        id: "pkg-bot-core",
        name: "Community Utility Bot",
        description: "Specialized Discord bot with custom slash commands, welcome gates, ticket system, and role management.",
        price: 750,
        deliveryDays: 6,
        features: [
          "Custom Slash Commands (/help, /info, /ticket)",
          "Automated Welcome & Auto-Role System",
          "Interactive Buttons, Modals & Select Menus",
          "SQLite / PostgreSQL Persistent Storage",
          "24/7 VPS / Docker Deployment Ready",
          "Full Source Code & Setup Guide",
        ],
      },
      {
        id: "pkg-bot-advanced",
        name: "Ecosystem & Web Dashboard",
        description: "Complete Discord ecosystem featuring web control dashboard, payment gating, and AI assistant integration.",
        price: 1800,
        deliveryDays: 14,
        features: [
          "Full Web Admin Dashboard (Discord OAuth2)",
          "Stripe / Crypto Payment Verification Roles",
          "AI-Powered Chat Assistant & Moderation",
          "Automated Logging & Anti-Raid Shielding",
          "Custom Leveling & Economy Mechanics",
          "Free Cloud Deployment Setup",
        ],
      },
    ],
    addons: [
      { id: "add-bot-ai", name: "Custom Fine-Tuned AI Assistant Persona", price: 350 },
      { id: "add-bot-crypto", name: "Web3 / Wallet Verification Integration", price: 450 },
    ],
  },
  {
    id: "srv-automations",
    slug: "automations-workflows",
    title: "Intelligent Automations & Workflows",
    category: "Automation Engineering",
    description:
      "Automate manual business tasks, sync data across APIs, scrape web platforms, and build intelligent background processing pipelines that run 24/7 without fail.",
    basePrice: 950,
    isActive: true,
    packages: [
      {
        id: "pkg-auto-pipeline",
        name: "Workflow Pipeline",
        description: "Custom automated data integration connecting your apps, APIs, webhooks, and Google Sheets/Notion.",
        price: 950,
        deliveryDays: 7,
        features: [
          "Multi-App Webhook Integration",
          "Scheduled Cron Jobs & Background Workers",
          "Automated Error Alerting (Discord/Slack/Email)",
          "Google Sheets / Notion / Airtable Sync",
          "Data Cleaning & Transformation Engine",
          "Comprehensive Documentation",
        ],
      },
      {
        id: "pkg-auto-scraper",
        name: "Enterprise Data Scraper & AI Engine",
        description: "Advanced headless web scraping, proxy rotation, and automated AI data extraction pipelines.",
        price: 2200,
        deliveryDays: 16,
        features: [
          "Puppeteer / Playwright Headless Scraping",
          "Automated CAPTCHA & Proxy Handling",
          "AI Summarization & Information Extraction",
          "Automated Database Injection (Supabase/Postgres)",
          "Interactive Web Dashboard to Run / Inspect Jobs",
          "Continuous Scheduled Execution Monitoring",
        ],
      },
    ],
    addons: [
      { id: "add-auto-monitoring", name: "24/7 Automated Health Pings & Heartbeat", price: 200 },
      { id: "add-auto-proxy", name: "Residential Proxy Setup & Cloud Rotation", price: 350 },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return INITIAL_SERVICES.find((s) => s.slug === slug);
}

export function getAllServices(): ServiceItem[] {
  return INITIAL_SERVICES;
}
