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
    <div className="w-full max-w-[95vw] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 lg:py-20">
      {/* Back button */}
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-black mb-12 transition-colors font-mono font-medium"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to All Services</span>
      </Link>

      {/* Header */}
      <div className="max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl mb-16 sm:mb-20">
        <div className="text-[11px] uppercase tracking-widest text-amber-800 font-mono font-semibold mb-3">
          Service Details // {service.category}
        </div>
        <h1 className="text-4xl sm:text-6xl font-light text-neutral-900 tracking-tight leading-tight">
          {service.title}
        </h1>
        <p className="mt-6 text-base sm:text-lg text-neutral-700 leading-relaxed max-w-3xl 2xl:max-w-4xl">
          {service.description}
        </p>
      </div>

      {/* Packages Grid */}
      <div className="mb-24">
        <div className="mb-10 flex items-center justify-between border-b border-black/[0.08] pb-4">
          <div>
            <h2 className="text-2xl font-light text-neutral-900">Available Packages</h2>
            <p className="text-xs text-neutral-600 mt-1">Choose the package that fits what you want to build.</p>
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
                    ? "border-2 border-amber-700 bg-white shadow-xl"
                    : "border border-black/[0.08] bg-white shadow-md"
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-8 rounded-full bg-neutral-900 text-white px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-normal text-neutral-900 mb-2">{pkg.name}</h3>
                  <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="mb-6 flex items-baseline gap-2">
                    <span className="text-xl font-light text-amber-800 font-mono font-semibold">
                      Custom Quote
                    </span>
                    <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-mono">// Tailored Delivery</span>
                  </div>

                  <div className="mb-8 flex items-center gap-2 rounded-xl bg-[#f4f2ec] px-3.5 py-2 text-xs text-neutral-800 border border-black/[0.06] shadow-inner">
                    <Clock className="h-3.5 w-3.5 text-amber-700" />
                    <span>Estimated Delivery: {pkg.deliveryDays} business days</span>
                  </div>

                  <div className="space-y-3 mb-10">
                    <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
                      What&apos;s Included:
                    </div>
                    {pkg.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-700 flex-shrink-0 mt-1.5" />
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
                    <span>Order {pkg.name}</span>
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
        <div className="rounded-2xl border border-black/[0.08] bg-white p-8 sm:p-10 shadow-md">
          <h3 className="text-xl font-normal text-neutral-900 mb-2">Available Add-Ons</h3>
          <p className="text-xs text-neutral-600 mb-8 max-w-lg">
            Optional extra features you can choose during your order.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.addons.map((addon) => (
              <div
                key={addon.id}
                className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-[#f4f2ec] p-4 shadow-inner"
              >
                <div>
                  <div className="text-sm font-medium text-neutral-900">{addon.name}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">Extra Feature</div>
                </div>
                <div className="text-xs font-mono text-amber-800 font-semibold">
                  Included on Request
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
