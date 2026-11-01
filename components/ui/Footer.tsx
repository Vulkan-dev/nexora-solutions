"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-background/95 py-16 text-neutral-400">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Atelier Brand Identity */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-base font-semibold tracking-[0.2em] uppercase text-cream-100">
                RADIANT
              </span>
              <span className="text-[11px] text-neutral-500 tracking-widest uppercase ml-2">Atelier</span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              An independent creative studio designing singular digital objects, kinetic spatial platforms, and custom brand architectures for luxury houses worldwide.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] uppercase tracking-widest text-cream-200 mb-4 font-mono">Index</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/services" className="hover:text-cream-100 transition-colors">Selected Capabilities</Link></li>
              <li><Link href="/order" className="hover:text-cream-100 transition-colors">Commission a Production</Link></li>
              <li><Link href="/dashboard" className="hover:text-cream-100 transition-colors">Private Client Suite</Link></li>
              <li><Link href="/auth/signin" className="hover:text-cream-100 transition-colors">Client Authentication</Link></li>
            </ul>
          </div>

          {/* Studio Offices */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] uppercase tracking-widest text-cream-200 mb-4 font-mono">Location & Inquiries</h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Private commissions reviewed on a rolling basis. Direct access and production updates managed through the client suite.
            </p>
            <div className="text-xs text-neutral-300 font-mono">
              inquiries@radiant-atelier.com
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Radiant Atelier Ltd. All rights reserved.</p>
          <p className="tracking-widest uppercase text-[10px]">Geneva • London • New York</p>
        </div>
      </div>
    </footer>
  );
}
