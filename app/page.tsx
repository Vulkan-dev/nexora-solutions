import React from "react";
import Link from "next/link";
import InteractiveHero from "@/components/ui/InteractiveHero";
import TextReveal from "@/components/ui/TextReveal";
import TiltCard from "@/components/ui/TiltCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { getAllServices } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code2,
  Layers,
  Cpu,
  ShieldAlert,
  ArrowUpRight,
  Clock,
} from "lucide-react";

export default function HomePage() {
  const services = getAllServices();

  return (
    <div className="relative flex flex-col gap-24 pb-20">
      {/* 1. Interactive Hero Section */}
      <InteractiveHero />

      {/* 2. Text Reveal Manifesto Section */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
          <Sparkles className="h-3 w-3" />
          <span>Our Manifesto</span>
        </div>

        <TextReveal
          text="We dismantle ordinary digital boundaries. Through reactive spring-physics, sub-100ms serverless architectures, and tactile 3D perspective shaders, we engineer unforgettable web platforms that convert discerning audiences into loyal patrons."
          className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-neutral-100 leading-snug"
          wordClassName="hover:text-blue-400"
        />

        <div className="mt-6 flex items-center gap-6 text-sm text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Zero-Jank 60FPS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <span>Multi-Tenant DB</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-400" />
            <span>Automated Stripe Sync</span>
          </div>
        </div>
      </section>

      {/* 3. Featured Services with 3D Tilt Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
              Capabilities Catalog
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Engineered For Visionary Brands
            </h2>
          </div>
          <Link href="/services">
            <MagneticButton variant="secondary" className="text-xs">
              <span>View All Services</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </MagneticButton>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <TiltCard key={service.id} className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[11px] font-medium text-blue-400">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Est. {service.packages[0]?.deliveryDays}d</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-neutral-400 leading-relaxed">
                  {service.description}
                </p>

                <div className="pt-4 border-t border-white/5 space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Featured Capabilities:
                  </div>
                  {service.packages[0]?.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500">Starting from</div>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(service.basePrice)}
                  </div>
                </div>

                <Link href={`/services/${service.slug}`}>
                  <MagneticButton variant="glow" className="px-4 py-2 text-xs">
                    <span>Explore</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </MagneticButton>
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* 4. Architectural Process Workflow */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
            Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            From Blueprint to Global Edge Deployment
          </h2>
          <p className="mt-4 text-sm text-neutral-400">
            A battle-tested 4-stage engineering lifecycle prioritizing speed, security, and kinetic refinement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Triage & Scoping",
              desc: "Deep-dive requirement analysis, package customization, and technical constraint modeling.",
              icon: Cpu,
            },
            {
              step: "02",
              title: "Kinetic UI & Physics",
              desc: "Canvas particle grids, spring-physics cursor shaders, and Framer Motion micro-interactions.",
              icon: Sparkles,
            },
            {
              step: "03",
              title: "Full-Stack Security",
              desc: "Prisma PostgreSQL schemas, Upstash distributed rate limiters, and Cloudflare Turnstile token validation.",
              icon: Code2,
            },
            {
              step: "04",
              title: "Vercel Edge Delivery",
              desc: "Sub-100ms global edge replication, automated Stripe webhooks, and live customer portal handover.",
              icon: Layers,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-white/5 bg-surface/50 p-6 backdrop-blur-md transition-all hover:border-neutral-700"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-neutral-600">{item.step}</span>
                <item.icon className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Direct Conversion CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-surfaceElevated to-surface p-8 sm:p-14 text-center backdrop-blur-2xl shadow-2xl">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-blue-500/20 blur-3xl" />

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Build Something Extraordinary?
          </h2>

          <p className="mt-4 text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Initiate your project in our multi-step wizard. Configure service packages, select add-on accelerators, and track progress live in your customer dashboard.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/order">
              <MagneticButton variant="glow" className="px-8 py-3.5 text-base">
                <span>Configure Your Order</span>
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </Link>

            <Link href="/auth/signin">
              <MagneticButton variant="secondary" className="px-6 py-3.5 text-base">
                <span>Client Sign In</span>
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
