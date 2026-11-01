import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, getAllServices } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import TiltCard from "@/components/ui/TiltCard";
import {
  Check,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Zap,
} from "lucide-react";

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Back button */}
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Services Catalog</span>
      </Link>

      {/* Header */}
      <div className="max-w-4xl mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-4">
          <Sparkles className="h-3 w-3" />
          <span>{service.category}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          {service.title}
        </h1>
        <p className="mt-6 text-lg text-neutral-300 leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Packages Grid */}
      <div className="mb-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Select a Package Tier</h2>
            <p className="text-xs text-neutral-400">Choose the architectural tier that fits your scope.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {service.packages.map((pkg, index) => {
            const isFeatured = index === 1;
            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all backdrop-blur-xl ${
                  isFeatured
                    ? "border-2 border-blue-500/80 bg-surfaceElevated/90 shadow-neon"
                    : "border border-borderDark bg-surface/80"
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-neon">
                    Recommended Tier
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="mb-6 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white">
                      {formatCurrency(pkg.price)}
                    </span>
                    <span className="text-xs text-neutral-400">one-time</span>
                  </div>

                  <div className="mb-6 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-neutral-300">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span>Estimated Delivery: {pkg.deliveryDays} business days</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      Deliverables Included:
                    </div>
                    {pkg.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                        <Check className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href={`/order?serviceId=${service.id}&packageId=${pkg.id}`}>
                  <MagneticButton
                    variant={isFeatured ? "glow" : "secondary"}
                    className="w-full py-3 text-sm font-semibold"
                  >
                    <span>Configure {pkg.name}</span>
                    <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Addons Section */}
      {service.addons && service.addons.length > 0 && (
        <div className="rounded-3xl border border-white/5 bg-surface/60 p-8 backdrop-blur-xl">
          <h3 className="text-xl font-bold text-white mb-2">Available Accelerator Add-ons</h3>
          <p className="text-xs text-neutral-400 mb-6">
            You can selectively attach these enhancements during the multi-step ordering wizard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.addons.map((addon) => (
              <div
                key={addon.id}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-surfaceElevated/50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{addon.name}</div>
                    <div className="text-xs text-neutral-400">Modular capability</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-blue-400">
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
