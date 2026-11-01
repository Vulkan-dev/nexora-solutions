import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, getAllServices } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  const services = getAllServices();
  return services.map((s) => ({ slug: s.slug }));
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-20">
      {/* Back button */}
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white mb-12 transition-colors font-mono"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Return to Disciplines Index</span>
      </Link>

      {/* Header */}
      <div className="max-w-4xl mb-20">
        <div className="text-[11px] uppercase tracking-widest text-cream-400 font-mono mb-3">
          Edition Specification // {service.category}
        </div>
        <h1 className="text-4xl sm:text-6xl font-light text-white tracking-tight leading-tight">
          {service.title}
        </h1>
        <p className="mt-6 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-3xl">
          {service.description}
        </p>
      </div>

      {/* Packages Grid */}
      <div className="mb-24">
        <div className="mb-10 flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-2xl font-light text-white">Production Tiers</h2>
            <p className="text-xs text-neutral-400 mt-1">Select the architectural tier corresponding to your project scope.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {service.packages.map((pkg, index) => {
            const isFeatured = index === 1;
            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all ${
                  isFeatured
                    ? "border border-white/30 bg-surfaceElevated shadow-atelier"
                    : "border border-white/[0.08] bg-surface"
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-8 rounded-full bg-cream-100 text-neutral-900 px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                    Signature Choice
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-normal text-white mb-2">{pkg.name}</h3>
                  <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="mb-6 flex items-baseline gap-2">
                    <span className="text-3xl font-light text-white font-serif">
                      {formatCurrency(pkg.price)}
                    </span>
                    <span className="text-[11px] text-neutral-500 uppercase tracking-wider">production fee</span>
                  </div>

                  <div className="mb-8 flex items-center gap-2 rounded-xl bg-white/[0.03] px-3.5 py-2 text-xs text-neutral-300 border border-white/[0.05]">
                    <Clock className="h-3.5 w-3.5 text-cream-400" />
                    <span>Estimated Completion: {pkg.deliveryDays} business days</span>
                  </div>

                  <div className="space-y-3 mb-10">
                    <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
                      Scope Included:
                    </div>
                    {pkg.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <span className="h-1 w-1 rounded-full bg-cream-400 flex-shrink-0 mt-1.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href={`/order?serviceId=${service.id}&packageId=${pkg.id}`}>
                  <MagneticButton
                    variant={isFeatured ? "primary" : "secondary"}
                    className="w-full py-3 text-xs uppercase tracking-wider font-semibold"
                  >
                    <span>Commission {pkg.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </MagneticButton>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Addons Section */}
      {service.addons && service.addons.length > 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-surface p-8 sm:p-10">
          <h3 className="text-xl font-normal text-white mb-2">Bespoke Enhancements</h3>
          <p className="text-xs text-neutral-400 mb-8 max-w-lg">
            Optional modular extensions that can be attached during the commissioning wizard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.addons.map((addon) => (
              <div
                key={addon.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-surfaceElevated p-4"
              >
                <div>
                  <div className="text-sm font-medium text-white">{addon.name}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">Bespoke Add-on</div>
                </div>
                <div className="text-sm font-serif text-cream-200">
                  +{formatCurrency(addon.price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
