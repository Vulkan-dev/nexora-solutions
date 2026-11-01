"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-background/95 py-12 sm:py-16 text-neutral-400">
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Nexora Solutions Brand Identity */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-base font-semibold tracking-[0.25em] uppercase text-cream-100">
                NEXORA
              </span>
              <span className="text-[11px] text-neutral-500 tracking-[0.25em] uppercase ml-2">Solutions</span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Building modern full-stack websites, SaaS apps, and custom Discord bots with clean code, fast performance, and easy management.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] uppercase tracking-widest text-cream-200 mb-4 font-mono">Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/services" className="hover:text-cream-100 transition-colors">Services</Link></li>
              <li><Link href="/order" className="hover:text-cream-100 transition-colors">Order Now</Link></li>
              <li><Link href="/dashboard" className="hover:text-cream-100 transition-colors">My Orders & Chat</Link></li>
              <li><Link href="/auth/signin" className="hover:text-cream-100 transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Studio Offices */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] uppercase tracking-widest text-cream-200 mb-4 font-mono">Contact</h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Direct chat with the developer, live order progress updates, and fast turnaround.
            </p>
            <div className="text-xs text-neutral-300 font-mono">
              contact@nexorasolutions.com
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Nexora Solutions Ltd. All rights reserved.</p>
          <p className="tracking-widest uppercase text-[10px]">Global • London • New York • Singapore</p>
        </div>
      </div>
    </footer>
  );
}
