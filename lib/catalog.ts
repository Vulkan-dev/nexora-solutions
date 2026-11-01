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
    id: "srv-cinematic-web",
    slug: "cinematic-web-platform",
    title: "Cinematic Web Platform",
    category: "Web Engineering",
    description:
      "Bespoke Next.js 14+ application equipped with spring-physics custom cursor, Lenis smooth scrolling, Framer Motion transitions, and sub-100ms serverless edge rendering.",
    basePrice: 4800,
    isActive: true,
    packages: [
      {
        id: "pkg-cine-starter",
        name: "Architectural MVP",
        description: "Core interactive platform with up to 5 cinematic pages, dark obsidian aesthetic, and custom cursor.",
        price: 4800,
        deliveryDays: 14,
        features: [
          "5 Custom Responsive Pages",
          "HTML5 Spring-Physics Dragon Cursor",
          "Interactive 3D Mouse Hero Section",
          "Lenis Smooth Scrolling & Text Reveals",
          "NextAuth Google Authentication",
          "Vercel Serverless Optimization",
        ],
      },
      {
        id: "pkg-cine-pro",
        name: "Signature Enterprise",
        description: "Full production platform with dynamic catalog, Stripe checkout, customer portal, and admin dashboard.",
        price: 8500,
        deliveryDays: 24,
        features: [
          "Up to 12 Bespoke Interactive Pages",
          "Advanced 3D Tilt Cards & Shader Effects",
          "Multi-Step Interactive Ordering Wizard",
          "Stripe Payment Gateway & Webhook Sync",
          "Customer Progress Timeline & File Hub",
          "Full Admin Management Control Panel",
          "Upstash Redis Distributed Rate Limiting",
        ],
      },
      {
        id: "pkg-cine-flagship",
        name: "Flagship Sovereign",
        description: "Ultra-luxury, custom physics engine, multi-region database, and dedicated ongoing architectural stewardship.",
        price: 14500,
        deliveryDays: 40,
        features: [
          "Unlimited Pages & Bespoke 3D Scenes",
          "Custom Soundscape & Kinetic Canvas Engines",
          "Enterprise SSO & Zero-Trust RBAC",
          "Priority 24/7 Architectural Hotline",
          "Automated E2E Testing Suite",
          "60 Days Post-Launch Maintenance",
        ],
      },
    ],
    addons: [
      { id: "add-seo", name: "Comprehensive Technical SEO & Schema Markup", price: 650 },
      { id: "add-cms", name: "Headless CMS Integration (Sanity / Strapi)", price: 1200 },
      { id: "add-perf", name: "Core Web Vitals Perfection Audit (99+ Score)", price: 800 },
      { id: "add-rush", name: "Accelerated Delivery (Cut time by 40%)", price: 2200 },
    ],
  },
  {
    id: "srv-3d-interactive",
    slug: "3d-interactive-experience",
    title: "3D Interactive Product Experience",
    category: "Creative Technology",
    description:
      "High-fidelity Three.js and WebGL spatial showrooms, real-time material shaders, and product customizers that captivate audiences.",
    basePrice: 6200,
    isActive: true,
    packages: [
      {
        id: "pkg-3d-standard",
        name: "Single Showcase Room",
        description: "One photorealistic 3D interactive model with orbit controls and 4 dynamic lighting states.",
        price: 6200,
        deliveryDays: 18,
        features: [
          "Optimized GLTF/GLB Asset Pipeline",
          "Custom Specular Shaders & Environment Maps",
          "Touch & Mouse Orbit Interaction",
          "Responsive Framerate Throttling for Battery Saving",
        ],
      },
      {
        id: "pkg-3d-customizer",
        name: "Full Product Configurator",
        description: "Multi-part material & geometry customization with dynamic snapshot export and cart integration.",
        price: 11000,
        deliveryDays: 30,
        features: [
          "Interactive Material & Color Switching",
          "Camera Animation Waypoints & Exploded Views",
          "High-Resolution Screenshot Export",
          "Direct Add-to-Cart Synchronization",
        ],
      },
    ],
    addons: [
      { id: "add-sound", name: "Spatial Audio & Kinetic Sound Effects", price: 950 },
      { id: "add-ar", name: "WebAR iOS QuickLook & Android Scene Viewer", price: 1500 },
    ],
  },
  {
    id: "srv-cloud-arch",
    slug: "enterprise-cloud-architecture",
    title: "Enterprise Cloud & Security Architecture",
    category: "Cloud Engineering",
    description:
      "Serverless cloud backend architectures, Prisma PostgreSQL sharding, Upstash Redis caching, Cloudflare Turnstile bot shielding, and RBAC governance.",
    basePrice: 5500,
    isActive: true,
    packages: [
      {
        id: "pkg-cloud-core",
        name: "Security & Scale Audit",
        description: "End-to-end security hardening, distributed rate limiting, and SQL injection vulnerability audits.",
        price: 5500,
        deliveryDays: 14,
        features: [
          "Upstash Redis Rate Limiting Setup",
          "Prisma Schema Optimization & Indexing",
          "Strict Next.js Content Security Policies",
          "Penetration & Bot Mitigation Shielding",
        ],
      },
      {
        id: "pkg-cloud-full",
        name: "Full Backend Orchestration",
        description: "Complete serverless microservices, webhooks, asynchronous worker queues, and real-time pub-sub.",
        price: 9800,
        deliveryDays: 28,
        features: [
          "Multi-Tenant Database Architecture",
          "Webhook Event Pipeline with Dead-Letter Queues",
          "Automated Database Backup & Rollback Protocol",
          "Audit Logging & Threat Detection System",
        ],
      },
    ],
    addons: [
      { id: "add-uptime", name: "99.99% SLA Monitoring & PagerDuty Integration", price: 1100 },
      { id: "add-backup", name: "Zero-Data-Loss Continuous Archiving", price: 850 },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return INITIAL_SERVICES.find((s) => s.slug === slug);
}

export function getAllServices(): ServiceItem[] {
  return INITIAL_SERVICES;
}
