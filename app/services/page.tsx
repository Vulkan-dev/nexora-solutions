"use client";

import React, { useState } from "react";
import Link from "next/link";
import TiltCard from "@/components/ui/TiltCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { getAllServices } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, ArrowRight, Clock, Search } from "lucide-react";

export default function ServicesPage() {
  const allServices = getAllServices();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All",
    "Software as a Service",
    "Web Engineering",
    "Bot Development",
  ];

  const filteredServices = allServices.filter((service) => {
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-[95vw] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 lg:py-20">
      {/* Header */}
      <div className="max-w-4xl 2xl:max-w-5xl mb-16">
        <div className="text-[11px] uppercase tracking-widest text-amber-800 font-mono font-semibold mb-3">
          Nexora Solutions // Services
        </div>
        <h1 className="text-4xl sm:text-5xl font-light text-neutral-900 tracking-tight leading-tight">
          What I Build
        </h1>
        <p className="mt-4 text-sm text-neutral-600 leading-relaxed max-w-2xl 2xl:max-w-3xl">
          Every project comes with clean code, fast loading speeds, simple order tracking, and direct chat with me while I build your app.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-14 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 border-b border-black/[0.08] pb-6">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs tracking-wider uppercase transition-all ${
                selectedCategory === cat
                  ? "bg-neutral-900 text-white font-semibold shadow-md"
                  : "bg-white text-neutral-700 hover:text-black border border-black/[0.08] shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full rounded-full border border-black/[0.09] bg-white py-2 pl-9 pr-4 text-xs text-neutral-900 placeholder-neutral-500 focus:border-amber-700 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Services Grid (Balanced 3-column layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {filteredServices.map((service, idx) => (
          <TiltCard key={service.id} className="flex flex-col justify-between p-8 bg-white border border-black/[0.08] shadow-md h-full">
            <div className="flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>0{idx + 1} // {service.category}</span>
                  <span className="flex items-center gap-1 text-amber-800 font-medium">
                    <Clock className="h-3 w-3 text-amber-700" />
                    {service.packages[0]?.deliveryDays}d delivery
                  </span>
                </div>

                <h2 className="text-2xl font-normal text-neutral-900">
                  <Link href={`/services/${service.slug}`} className="hover:text-amber-800 transition-colors">
                    {service.title}
                  </Link>
                </h2>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Package Tiers Preview (Equally spaced and aligned) */}
              <div className="pt-4 border-t border-black/[0.06] space-y-2.5 mt-auto">
                <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
                  Available Packages:
                </div>
                {service.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between rounded-lg bg-[#f4f2ec] p-2.5 border border-black/[0.06] text-xs shadow-inner"
                  >
                    <div>
                      <div className="font-medium text-neutral-900">{pkg.name}</div>
                      <div className="text-[10px] text-neutral-500">{pkg.features.length} features included</div>
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-amber-800 font-semibold">
                      Included
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pinned Bottom Action Bar (Symmetrically aligned across all cards) */}
            <div className="mt-8 pt-4 border-t border-black/[0.08] flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">Pricing</div>
                <div className="text-sm font-medium text-amber-800 font-mono font-semibold">
                  Custom Quote
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/services/${service.slug}`}>
                  <MagneticButton variant="outline" className="px-3.5 py-1.5 text-xs uppercase tracking-wider">
                    <span>Details</span>
                  </MagneticButton>
                </Link>
                <Link href={`/order?serviceId=${service.id}`}>
                  <MagneticButton variant="primary" className="px-4 py-1.5 text-xs uppercase tracking-wider font-semibold">
                    <span>Order Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
