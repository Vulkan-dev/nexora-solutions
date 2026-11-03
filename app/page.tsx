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
      <section className="w-full max-w-[95vw] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-amber-800 font-mono font-semibold mb-6">
          <span className="h-[1px] w-8 bg-amber-700" />
          <span>Core Capabilities</span>
        </div>

        <TextReveal
          text="I engineer production-ready full stack web applications, scalable SaaS systems, and custom Discord bots. Fast turnaround, clean maintainable code, resilient databases, and cinematic user interfaces."
          className="text-2xl sm:text-4xl md:text-5xl 3xl:text-6xl font-light tracking-tight text-neutral-900 leading-[1.25]"
          wordClassName="hover:text-amber-800 transition-colors"
        />

        <div className="mt-12 flex flex-wrap items-center gap-12 text-xs text-neutral-600 border-t border-black/[0.08] pt-8">
          <div>
            <div className="text-neutral-900 font-serif text-lg font-medium">Next.js 14+</div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">Modern Full-Stack Web</div>
          </div>
          <div>
            <div className="text-neutral-900 font-serif text-lg font-medium">SaaS Architecture</div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">Stripe, Auth & PostgreSQL</div>
          </div>
          <div>
            <div className="text-neutral-900 font-serif text-lg font-medium">Discord Bots</div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">Discord.js & Community Tools</div>
          </div>
        </div>
      </section>

      {/* 3. Featured Services Section */}
      <section className="w-full max-w-[95vw] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 border-b border-black/[0.08] pb-6">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-amber-800 font-mono font-semibold mb-2">
              Services // 02
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-neutral-900">
              Featured Services
            </h2>
          </div>
          <Link href="/services">
            <MagneticButton variant="outline" className="text-xs uppercase tracking-wider">
              <span>View All Services</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </MagneticButton>
          </Link>
        </div>

        {/* Master Showcase Feature Card */}
        {featured && (
          <div className="mb-12">
            <TiltCard className="p-8 sm:p-12 border-black/[0.08] bg-white shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-50 px-3.5 py-1 text-[10px] uppercase tracking-widest text-amber-900 font-semibold">
                    Featured Service
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-normal text-neutral-900 tracking-tight">
                    {featured.title}
                  </h3>

                  <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
                    {featured.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {featured.packages[0]?.features.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 flex items-center gap-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-neutral-500">Pricing</div>
                      <div className="text-xl font-light text-amber-800 font-mono font-semibold">Custom Quote</div>
                    </div>

                    <Link href={`/order?type=saas`}>
                      <MagneticButton variant="primary" className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold">
                        <span>Order Now</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </MagneticButton>
                    </Link>
                  </div>
                </div>

                {/* Right Decorative Aesthetic Panel */}
                <div className="lg:col-span-5 h-full min-h-[260px] rounded-xl border border-black/[0.06] bg-[#f4f2ec] p-6 flex flex-col justify-between shadow-inner">
                  <div className="flex justify-between items-start text-xs text-neutral-500 font-mono">
                    <span>NEXORA QUALITY</span>
                    <span>TESTED & VERIFIED</span>
                  </div>

                  <div className="space-y-3 my-auto py-6">
                    <div className="text-[11px] text-amber-800 uppercase tracking-widest font-mono font-semibold">Highlights</div>
                    <div className="text-base text-neutral-900 font-serif italic">
                      "Built with clean code, fast loading speeds, and smooth interactive design."
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-neutral-600 border-t border-black/[0.06] pt-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-700" />
                      <span>{featured.packages[0]?.deliveryDays} Days Estimated Delivery</span>
                    </span>
                    <span className="text-amber-800 font-medium">Custom Built</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        )}

        {/* Secondary Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {secondaryServices.map((service, index) => (
            <TiltCard key={service.id} className="p-8 flex flex-col justify-between bg-white border border-black/[0.08] shadow-md">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
                    Service 0{index + 2} // {service.category}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    {service.packages[0]?.deliveryDays} Days Delivery
                  </span>
                </div>

                <h4 className="text-2xl font-normal text-neutral-900">
                  {service.title}
                </h4>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-black/[0.06]">
                  {service.packages[0]?.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-black/[0.08] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-500">Pricing</div>
                  <div className="text-sm font-light text-amber-800 font-mono font-semibold">Custom Quote</div>
                </div>

                <Link href={`/services/${service.slug}`}>
                  <MagneticButton variant="outline" className="px-5 py-2 text-xs uppercase tracking-wider">
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </MagneticButton>
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* 4. Step-by-Step Development Process */}
      <section className="w-full max-w-[95vw] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="border-t border-black/[0.08] pt-16">
          <div className="max-w-xl mb-12">
            <div className="text-[11px] uppercase tracking-widest text-amber-800 font-mono font-semibold mb-2">
              Process // 03
            </div>
            <h2 className="text-3xl font-normal tracking-tight text-neutral-900">
              How We Work Together
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                idx: "01",
                title: "1. Project Discussion",
                desc: "We discuss your project goals, must-have features, and your timeline.",
              },
              {
                idx: "02",
                title: "2. UI Design & Layout",
                desc: "We design clean, modern screens with smooth animations that look great on phones and laptops.",
              },
              {
                idx: "03",
                title: "3. Coding & Database",
                desc: "We write clean code, connect your database, set up payments, and build all features.",
              },
              {
                idx: "04",
                title: "4. Testing & Launch",
                desc: "We test every page, launch your app or bot live, and show you how to manage it.",
              },
            ].map((st, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-black/[0.07] bg-white p-6 shadow-sm hover:shadow-md transition-all">
                <span className="font-mono text-xs text-amber-800 font-semibold">{st.idx}</span>
                <h3 className="text-base font-normal text-neutral-900">{st.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Minimalist Invitation CTA */}
      <section className="w-full max-w-[92vw] 2xl:max-w-[88vw] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="rounded-3xl border border-black/[0.08] bg-white shadow-xl p-10 sm:p-16 text-center">
          <div className="text-[11px] uppercase tracking-widest text-amber-800 font-mono font-semibold mb-4">
            Start Your Project
          </div>

          <h2 className="text-3xl sm:text-5xl font-light text-neutral-900 tracking-tight">
            Ready to Build Your Project?
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            Select your app type, pick your favorite colors, and submit your details to get started right away.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/order">
              <MagneticButton variant="primary" className="px-8 py-3 text-xs uppercase tracking-widest font-semibold">
                <span>Order Now</span>
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </Link>

            <Link href="/dashboard">
              <MagneticButton variant="outline" className="px-6 py-3 text-xs uppercase tracking-widest">
                <span>My Orders & Chat</span>
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
