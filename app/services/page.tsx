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

  const categories = ["All", "Signature Digital Works", "Creative Technology", "System Engineering"];

  const filteredServices = allServices.filter((service) => {
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-20">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <div className="text-[11px] uppercase tracking-widest text-cream-400 font-mono mb-3">
          Disciplines & Editions // 01
        </div>
        <h1 className="text-4xl sm:text-5xl font-light text-white tracking-tight leading-tight">
          Commission Catalog & Works
        </h1>
        <p className="mt-4 text-sm text-neutral-400 leading-relaxed max-w-xl">
          Every commission includes dedicated creative direction, custom kinetic modeling, private client suite tracking, and perpetual production licensing.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-14 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 border-b border-white/[0.08] pb-6">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs tracking-wider uppercase transition-all ${
                selectedCategory === cat
                  ? "bg-cream-100 text-neutral-900 font-semibold"
                  : "bg-surface text-neutral-400 hover:text-white border border-white/[0.08]"
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
            placeholder="Search disciplines..."
            className="w-full rounded-full border border-white/[0.08] bg-surface py-2 pl-9 pr-4 text-xs text-white placeholder-neutral-500 focus:border-white/30 focus:outline-none"
          />
        </div>
      </div>

      {/* Services Grid (Editorial layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {filteredServices.map((service, idx) => (
          <TiltCard key={service.id} className="flex flex-col justify-between p-8 bg-surface">
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>0{idx + 1} // {service.category}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-cream-400" />
                  {service.packages[0]?.deliveryDays}d
                </span>
              </div>

              <h2 className="text-2xl font-normal text-white">
                <Link href={`/services/${service.slug}`} className="hover:text-cream-200 transition-colors">
                  {service.title}
                </Link>
              </h2>

              <p className="text-xs text-neutral-400 leading-relaxed">
                {service.description}
              </p>

              {/* Package Tiers Preview */}
              <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
                <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
                  Production Tiers:
                </div>
                {service.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between rounded-lg bg-surfaceElevated p-2.5 border border-white/[0.04] text-xs"
                  >
                    <div>
                      <div className="font-medium text-neutral-200">{pkg.name}</div>
                      <div className="text-[10px] text-neutral-500">{pkg.features.length} deliverables included</div>
                    </div>
                    <div className="font-serif text-cream-200">{formatCurrency(pkg.price)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">Starting At</div>
                <div className="text-xl font-light text-white font-serif">
                  {formatCurrency(service.basePrice)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/services/${service.slug}`}>
                  <MagneticButton variant="outline" className="px-3.5 py-1.5 text-xs uppercase tracking-wider">
                    <span>Inspect</span>
                  </MagneticButton>
                </Link>
                <Link href={`/order?serviceId=${service.id}`}>
                  <MagneticButton variant="primary" className="px-4 py-1.5 text-xs uppercase tracking-wider font-semibold">
                    <span>Select</span>
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
