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
    title: "Cinematic Digital Platform",
    category: "Signature Digital Works",
    description:
      "Bespoke platform featuring inverse-kinematic skeleton cursor physics, fluid inertial scroll damping, and sculpted typographic perspective tailored for singular brands.",
    basePrice: 5800,
    isActive: true,
    packages: [
      {
        id: "pkg-cine-starter",
        name: "Studio Edition",
        description: "Core interactive digital experience with curated editorial typography, custom cursor, and restrained motion choreography.",
        price: 5800,
        deliveryDays: 14,
        features: [
          "Bespoke Responsive Layouts",
          "Skeleton Dragon Cursor Tracking",
          "Interactive Perspective Hero Choreography",
          "Tactile Smooth Inertial Scrolling",
          "Private Client Authentication Suite",
          "Dedicated Architectural Direction",
        ],
      },
      {
        id: "pkg-cine-pro",
        name: "Signature Atelier",
        description: "Full production platform featuring dynamic catalog showcases, direct private checkout, and dedicated client dashboard tracking.",
        price: 9500,
        deliveryDays: 24,
        features: [
          "Comprehensive Multi-Section Atelier Architecture",
          "Bespoke 3D Tilt Cards & Specular Sheen Shaders",
          "Multi-Step Interactive Commissioning Suite",
          "Direct Studio Payment & Contract Synchronization",
          "Real-time Milestone Timeline & Private Vault",
          "Administrative Management Operations Console",
        ],
      },
      {
        id: "pkg-cine-flagship",
        name: "Sovereign Masterpiece",
        description: "Ultra-luxury, custom physics engine, multi-region database, and dedicated ongoing architectural stewardship.",
        price: 16500,
        deliveryDays: 40,
        features: [
          "Unlimited Bespoke Interactive Compositions",
          "Tailored Kinetic Canvas Physics & Sound Design",
          "Multi-Territory Global Edge Availability",
          "Direct Hotline with Lead Creative Director",
          "Complete Architectural Asset & IP Transfer",
          "60 Days Post-Launch Concierge Stewardship",
        ],
      },
    ],
    addons: [
      { id: "add-seo", name: "Artisanal Search & Social Previews Curation", price: 650 },
      { id: "add-cms", name: "Editorial Headless Content Studio Integration", price: 1400 },
      { id: "add-rush", name: "Expedited Atelier Delivery (Accelerated by 35%)", price: 2400 },
      { id: "add-sound", name: "Custom Ambient Audio & Interaction Soundscape", price: 1100 },
    ],
  },
  {
    id: "srv-3d-interactive",
    slug: "3d-interactive-experience",
    title: "Spatial & 3D Interactive Exhibition",
    category: "Creative Technology",
    description:
      "Interactive WebGL spatial showrooms, real-time material textures, and tactile object configurators that mesmerize high-end clientele.",
    basePrice: 7200,
    isActive: true,
    packages: [
      {
        id: "pkg-3d-standard",
        name: "Virtual Showroom",
        description: "One photorealistic 3D interactive exhibit with orbit controls and 4 dynamic lighting conditions.",
        price: 7200,
        deliveryDays: 18,
        features: [
          "Optimized High-Fidelity 3D Asset Pipeline",
          "Custom Specular Shaders & Studio HDRI Lighting",
          "Touch & Pointer Orbit Interaction Mechanics",
          "Frame-Rate Optimization for Luxury Display",
        ],
      },
      {
        id: "pkg-3d-customizer",
        name: "Full Object Atelier Configurator",
        description: "Multi-part material & geometry customization with dynamic snapshot export and bespoke portfolio integration.",
        price: 12500,
        deliveryDays: 32,
        features: [
          "Interactive Material & Finish Switching",
          "Cinematic Camera Animation Sequences",
          "High-Resolution Print Snapshot Export",
          "Direct Commissioning Synchronization",
        ],
      },
    ],
    addons: [
      { id: "add-ar", name: "Spatial WebAR iOS & Android Scene Viewer", price: 1600 },
      { id: "add-lighting", name: "Day/Night Architectural Lighting Studio Modes", price: 950 },
    ],
  },
  {
    id: "srv-cloud-arch",
    slug: "enterprise-cloud-architecture",
    title: "Brand Systems & Custom Architecture",
    category: "System Engineering",
    description:
      "High-availability serverless systems, Supabase database synchronization, private client portals, and resilient digital infrastructure.",
    basePrice: 6500,
    isActive: true,
    packages: [
      {
        id: "pkg-cloud-core",
        name: "Foundation Architecture",
        description: "End-to-end cloud database orchestration, private access controls, and production platform deployment.",
        price: 6500,
        deliveryDays: 14,
        features: [
          "Supabase PostgreSQL Schema Setup & Relations",
          "NextAuth Private Authentication Integration",
          "Strict HTTP Headers & Secure Cookie Sessions",
          "Production Vercel Serverless Optimization",
        ],
      },
      {
        id: "pkg-cloud-full",
        name: "Complete Enterprise Ecosystem",
        description: "Comprehensive multi-tenant database systems, webhook event pipelines, and real-time administrative governance.",
        price: 11000,
        deliveryDays: 28,
        features: [
          "High-Throughput Database Architecture & Indexing",
          "Automated Stripe Webhook Processing System",
          "Automated Data Archiving & Backup Protocols",
          "Client Milestone & Revision Management System",
        ],
      },
    ],
    addons: [
      { id: "add-uptime", name: "High-Priority SLA Response & System Monitoring", price: 1200 },
      { id: "add-backup", name: "Continuous Snapshot Archiving & Failover", price: 900 },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return INITIAL_SERVICES.find((s) => s.slug === slug);
}

export function getAllServices(): ServiceItem[] {
  return INITIAL_SERVICES;
}
