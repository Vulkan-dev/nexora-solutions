import React from "react";
import Link from "next/link";
import InteractiveHero from "@/components/ui/InteractiveHero";
import TextReveal from "@/components/ui/TextReveal";
import TiltCard from "@/components/ui/TiltCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { getAllServices } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, ArrowRight, Clock, Check } from "lucide-react";

export default function HomePage() {
  const services = getAllServices();
  const featured = services[0];
  const secondaryServices = services.slice(1);

  return (
    <div className="relative flex flex-col gap-32 pb-24">
      {/* 1. Bespoke Editorial Hero */}
      <InteractiveHero />

      {/* 2. Architectural Manifesto (Word-by-word reveal) */}
      <section className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-cream-400 font-mono mb-6">
          <span className="h-[1px] w-8 bg-cream-400" />
          <span>Statement of Intent</span>
        </div>

        <TextReveal
          text="We create singular digital platforms where kinetic elegance meets relentless architectural restraint. Every interaction is shaped by intention, every transition is tuned by physics, and every surface is sculpted to elevate discerning houses into enduring legacies."
          className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-cream-100 leading-[1.25]"
          wordClassName="hover:text-cream-400 transition-colors"
        />

        <div className="mt-12 flex flex-wrap items-center gap-12 text-xs text-neutral-400 border-t border-white/[0.08] pt-8">
          <div>
            <div className="text-white font-serif text-lg">60fps</div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">Kinetic Frame Stability</div>
          </div>
          <div>
            <div className="text-white font-serif text-lg">100%</div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">Bespoke Vector & Shader Craft</div>
          </div>
          <div>
            <div className="text-white font-serif text-lg">Private</div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">Direct Atelier Collaboration</div>
          </div>
        </div>
      </section>

      {/* 3. Asymmetric Curated Capabilities Showcase (NO REPEATED CARDS) */}
      <section className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-cream-400 font-mono mb-2">
              Capabilities // 02
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-white">
              Selected Disciplines & Works
            </h2>
          </div>
          <Link href="/services">
            <MagneticButton variant="outline" className="text-xs uppercase tracking-wider">
              <span>View Complete Portfolio</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </MagneticButton>
          </Link>
        </div>

        {/* Master Showcase Feature Card (Asymmetric Large Top Display) */}
        {featured && (
          <div className="mb-12">
            <TiltCard className="p-8 sm:p-12 border-white/[0.12] bg-surfaceElevated/70">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1 text-[10px] uppercase tracking-widest text-cream-200">
                    Signature Edition
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-normal text-white tracking-tight">
                    {featured.title}
                  </h3>

                  <p className="text-sm text-neutral-300 leading-relaxed max-w-xl">
                    {featured.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {featured.packages[0]?.features.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                        <span className="h-1 w-1 rounded-full bg-cream-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 flex items-center gap-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-neutral-500">Starting Investment</div>
                      <div className="text-2xl font-light text-white font-serif">{formatCurrency(featured.basePrice)}</div>
                    </div>

                    <Link href={`/services/${featured.slug}`}>
                      <MagneticButton variant="primary" className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold">
                        <span>Inspect Commission</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </MagneticButton>
                    </Link>
                  </div>
                </div>

                {/* Right Decorative Aesthetic Panel */}
                <div className="lg:col-span-5 h-full min-h-[260px] rounded-xl border border-white/[0.08] bg-black/40 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start text-xs text-neutral-500 font-mono">
                    <span>EDITION: ATELIER-01</span>
                    <span>STUDIO VERIFIED</span>
                  </div>

                  <div className="space-y-3 my-auto py-6">
                    <div className="text-[11px] text-cream-400 uppercase tracking-widest font-mono">Key Highlights</div>
                    <div className="text-base text-cream-100 font-serif italic">
                      "Sculpted with inverse-kinematics anatomy, natural spring friction, and pure obsidian poise."
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-neutral-400 border-t border-white/[0.06] pt-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-cream-400" />
                      <span>{featured.packages[0]?.deliveryDays} Business Days</span>
                    </span>
                    <span className="text-cream-300">Private Release</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        )}

        {/* Secondary Asymmetric Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {secondaryServices.map((service, index) => (
            <TiltCard key={service.id} className="p-8 flex flex-col justify-between bg-surface/90">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
                    Edition 0{index + 2} // {service.category}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {service.packages[0]?.deliveryDays}d Production
                  </span>
                </div>

                <h4 className="text-2xl font-normal text-white">
                  {service.title}
                </h4>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                  {service.packages[0]?.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                      <span className="h-1 w-1 rounded-full bg-cream-400" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-500">Tier Starting</div>
                  <div className="text-xl font-light text-white font-serif">{formatCurrency(service.basePrice)}</div>
                </div>

                <Link href={`/services/${service.slug}`}>
                  <MagneticButton variant="outline" className="px-5 py-2 text-xs uppercase tracking-wider">
                    <span>Examine</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </MagneticButton>
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* 4. Atelier Production Stages (Refined, Non-Generic Layout) */}
      <section className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="border-t border-white/[0.08] pt-16">
          <div className="max-w-xl mb-12">
            <div className="text-[11px] uppercase tracking-widest text-cream-400 font-mono mb-2">
              Process // 03
            </div>
            <h2 className="text-3xl font-normal tracking-tight text-white">
              The Architecture Method
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                idx: "01",
                title: "Curatorial Immersion",
                desc: "An exhaustive briefing to establish brand essence, spatial proportion, and kinetic philosophy.",
              },
              {
                idx: "02",
                title: "Kinetic Prototyping",
                desc: "Bespoke mathematical modeling of canvas curves, inertial drag, and spring-physics behaviors.",
              },
              {
                idx: "03",
                title: "Architectural Synthesis",
                desc: "Full typographic styling, high-contrast surface texturing, and client staging in our private suite.",
              },
              {
                idx: "04",
                title: "Private Handover",
                desc: "Global production deployment, perpetual asset licensing, and ongoing studio stewardship.",
              },
            ].map((st, i) => (
              <div key={i} className="space-y-3 border-l border-white/[0.08] pl-6 py-2">
                <span className="font-mono text-xs text-cream-400">{st.idx}</span>
                <h3 className="text-base font-normal text-white">{st.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Minimalist Commission Invitation CTA */}
      <section className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
        <div className="rounded-3xl border border-white/[0.12] bg-surfaceElevated p-10 sm:p-16 text-center">
          <div className="text-[11px] uppercase tracking-widest text-cream-400 font-mono mb-4">
            Private Inquiry // Vol. XXIV
          </div>

          <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
            Commission a Signature Platform
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Select your architectural tier, configure bespoke enhancements, and track staging updates through our private client suite.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/order">
              <MagneticButton variant="primary" className="px-8 py-3 text-xs uppercase tracking-widest font-semibold">
                <span>Begin Commission</span>
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </Link>

            <Link href="/auth/signin">
              <MagneticButton variant="outline" className="px-6 py-3 text-xs uppercase tracking-widest">
                <span>Client Access</span>
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
