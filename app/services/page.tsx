"use client";

import React, { useState } from "react";
import Link from "next/link";
import TiltCard from "@/components/ui/TiltCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { getAllServices } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, ArrowRight, Check, Clock, Search, Filter } from "lucide-react";

export default function ServicesPage() {
  const allServices = getAllServices();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Web Engineering", "Creative Technology", "Cloud Engineering"];

  const filteredServices = allServices.filter((service) => {
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Services & Solutions</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Bespoke Engineering Capabilities
        </h1>
        <p className="mt-4 text-base text-neutral-400 leading-relaxed">
          Select from our curated services. Every engagement comes with dedicated architecture planning, security auditing, and our proprietary kinetic UI system.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-white/5 pb-8">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-neon"
                  : "bg-surfaceElevated text-neutral-400 hover:text-white border border-borderDark"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search capabilities..."
            className="w-full rounded-full border border-borderDark bg-surface py-2 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {filteredServices.map((service) => (
          <TiltCard key={service.id} className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[11px] font-medium text-blue-400">
                  {service.category}
                </span>
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {service.packages[0]?.deliveryDays} days
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                <Link href={`/services/${service.slug}`}>{service.title}</Link>
              </h2>

              <p className="text-xs text-neutral-400 leading-relaxed">
                {service.description}
              </p>

              {/* Package Tiers Preview */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Available Tiers ({service.packages.length}):
                </div>
                {service.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between rounded-lg bg-surfaceElevated/50 p-2.5 border border-white/5 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-neutral-200">{pkg.name}</div>
                      <div className="text-[10px] text-neutral-500">{pkg.features.length} features included</div>
                    </div>
                    <div className="font-bold text-blue-400">{formatCurrency(pkg.price)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500">Starting at</div>
                <div className="text-2xl font-extrabold text-white">
                  {formatCurrency(service.basePrice)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/services/${service.slug}`}>
                  <MagneticButton variant="secondary" className="px-3.5 py-2 text-xs">
                    <span>Details</span>
                  </MagneticButton>
                </Link>
                <Link href={`/order?serviceId=${service.id}`}>
                  <MagneticButton variant="glow" className="px-4 py-2 text-xs">
                    <span>Order</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-20 text-neutral-500">
          No services found matching your criteria.
        </div>
      )}
    </div>
  );
}
