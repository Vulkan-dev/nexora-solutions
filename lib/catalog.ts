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
      "Complete SaaS web apps built for your business. Includes monthly Stripe subscriptions, Google login, user dashboards, and fast database setup.",
    basePrice: 0,
    isActive: true,
    packages: [
      {
        id: "pkg-saas-mvp",
        name: "Starter Package",
        description: "Basic SaaS app with user login, customer dashboard, Stripe checkout, and database setup.",
        price: 0,
        deliveryDays: 14,
        features: [
          "Next.js App Router Setup",
          "NextAuth Google & Email Login",
          "Stripe Subscription Checkout",
          "PostgreSQL / Supabase Database",
          "Customer & Admin Dashboards",
          "Mobile-Friendly Responsive UI",
        ],
      },
      {
        id: "pkg-saas-pro",
        name: "Pro Growth Package",
        description: "Full SaaS platform with team accounts, subscription tiers, user analytics, and admin dashboard.",
        price: 0,
        deliveryDays: 24,
        features: [
          "Everything in Starter Package",
          "Team Workspaces & Member Invites",
          "Multiple Subscription Pricing Tiers",
          "Analytics Charts & Activity Logs",
          "Automated Email Notifications",
          "Full Admin Management Panel",
        ],
      },
      {
        id: "pkg-saas-enterprise",
        name: "Enterprise Custom Package",
        description: "Custom large-scale SaaS platform with custom APIs, advanced security, automated tests, and dedicated support.",
        price: 0,
        deliveryDays: 35,
        features: [
          "Complete Source Code & Full Ownership",
          "API Rate Limiting & Bot Protection",
          "Custom Webhooks & Public REST API",
          "Automated Unit & System Tests",
          "High-Speed Cloud Deployment",
          "Dedicated Help & Ongoing Support",
        ],
      },
    ],
    addons: [
      { id: "add-saas-ai", name: "AI Chat / Gemini / OpenAI Integration", price: 0 },
      { id: "add-saas-cms", name: "Blog & Content Management for SEO", price: 0 },
      { id: "add-saas-analytics", name: "Advanced User Event & Conversion Tracking", price: 0 },
    ],
  },
  {
    id: "srv-fullstack",
    slug: "fullstack-web-application",
    title: "Full-Stack Web Applications",
    category: "Web Engineering",
    description:
      "Modern, fast websites and web applications built with Next.js, TypeScript, and Tailwind CSS. Designed to look great on all devices and convert visitors into customers.",
    basePrice: 0,
    isActive: true,
    packages: [
      {
        id: "pkg-web-essential",
        name: "Standard Website / App",
        description: "Custom responsive website with modern design, contact forms, and database storage.",
        price: 0,
        deliveryDays: 10,
        features: [
          "Modern Responsive Next.js UI",
          "Smooth Animations with Tailwind CSS",
          "Database Storage with PostgreSQL",
          "Secure Contact & Order Forms",
          "Mobile Phone & Tablet Optimized",
          "Fast Page Speed & Google SEO Setup",
        ],
      },
      {
        id: "pkg-web-premium",
        name: "Interactive Web Platform",
        description: "Interactive website with custom animations, user accounts, order tracking, and Stripe checkout.",
        price: 0,
        deliveryDays: 18,
        features: [
          "Everything in Standard Package",
          "Custom Mouse Follower & 3D Tilt Cards",
          "Interactive Hero & Page Transitions",
          "Customer Portal & Order Tracking",
          "Stripe Online Payments Checkout",
          "Secure File Upload & Storage",
        ],
      },
      {
        id: "pkg-web-enterprise",
        name: "Complete Web Platform",
        description: "End-to-end fullstack platform with admin portal, file uploads, real-time updates, and fast hosting.",
        price: 0,
        deliveryDays: 28,
        features: [
          "Full Web Application & Custom Features",
          "Role-Based Admin Console & Analytics",
          "Cloud Storage & Media Optimization",
          "Database Backup & Security Protection",
          "High-Speed Vercel Global Hosting",
          "Direct Developer Support Channel",
        ],
      },
    ],
    addons: [
      { id: "add-web-speed", name: "Speed Optimization (Top Google Lighthouse Score)", price: 0 },
      { id: "add-web-i18n", name: "Multiple Languages (English, Spanish, etc.)", price: 0 },
    ],
  },
  {
    id: "srv-discord",
    slug: "discord-bots",
    title: "Custom Discord Bots",
    category: "Bot Development",
    description:
      "Custom Discord bots built for your community or business. Features include custom slash commands, auto-roles, payment verification, AI chat, and web dashboards.",
    basePrice: 0,
    isActive: true,
    packages: [
      {
        id: "pkg-bot-core",
        name: "Community Bot",
        description: "Custom Discord bot with slash commands, welcome messages, support tickets, and auto-roles.",
        price: 0,
        deliveryDays: 6,
        features: [
          "Custom Slash Commands (/help, /ticket, /rules)",
          "Automatic Welcome & Role Assignment",
          "Buttons, Menus & Form Popups",
          "Database to Save User Settings",
          "24/7 Cloud Hosting Setup",
          "Full Source Code & Easy Setup Guide",
        ],
      },
      {
        id: "pkg-bot-advanced",
        name: "Advanced Bot with Web Dashboard",
        description: "Full Discord bot with a web management dashboard, payment roles, and AI assistant.",
        price: 0,
        deliveryDays: 14,
        features: [
          "Web Control Dashboard (Login with Discord)",
          "Automatic Role for Paying Customers",
          "AI Chatbot & Smart Auto-Moderation",
          "Raid Protection & Activity Logs",
          "Custom Leveling & Points System",
          "Free Cloud Setup & Deployment",
        ],
      },
      {
        id: "pkg-bot-enterprise",
        name: "Enterprise Bot Network",
        description: "High-volume bot built to run smoothly on hundreds of servers with 24/7 uptime monitoring.",
        price: 0,
        deliveryDays: 24,
        features: [
          "Built to Support Hundreds of Servers",
          "Sync Roles with Your Web Application",
          "Live Real-Time Event Alerts",
          "24/7 VPS Server Uptime Monitoring",
          "Custom Discord Webhooks & Integrations",
          "Full Developer Maintenance & Updates",
        ],
      },
    ],
    addons: [
      { id: "add-bot-ai", name: "Custom AI Assistant Persona", price: 0 },
      { id: "add-bot-crypto", name: "Crypto & Wallet Verification", price: 0 },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return INITIAL_SERVICES.find((s) => s.slug === slug);
}

export function getAllServices(): ServiceItem[] {
  return INITIAL_SERVICES;
}
