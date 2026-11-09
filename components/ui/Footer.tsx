"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-black/[0.08] bg-[#edebe4] py-12 sm:py-16 text-neutral-600">
      <div className="mx-auto w-full max-w-[95vw] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Nexora Solutions Brand Identity */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" aria-label="Nexora Solutions Home" className="inline-flex items-center gap-3 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/64x64.png"
                alt="Nexora Solutions"
                className="h-7 w-7 object-contain flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-base font-semibold tracking-[0.25em] uppercase text-neutral-900">
                NEXORA
              </span>
              <span className="text-[11px] text-neutral-500 tracking-[0.25em] uppercase">Solutions</span>
            </Link>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-sm">
              Building modern full-stack websites, SaaS apps, and custom Discord bots with clean code, fast performance, and easy management.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] uppercase tracking-widest text-neutral-900 mb-4 font-mono font-semibold">Navigation</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link href="/services" aria-label="Explore Services" className="text-neutral-700 hover:text-neutral-950 transition-colors">Services</Link></li>
              <li><Link href="/order" aria-label="Order a Project" className="text-neutral-700 hover:text-neutral-950 transition-colors">Order Now</Link></li>
              <li><Link href="/dashboard" aria-label="Go to My Orders and Chat" className="text-neutral-700 hover:text-neutral-950 transition-colors">My Orders & Chat</Link></li>
              <li><Link href="/auth/signin" aria-label="Sign In to Account" className="text-neutral-700 hover:text-neutral-950 transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Studio Offices */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] uppercase tracking-widest text-neutral-900 mb-4 font-mono font-semibold">Contact</h4>
            <p className="text-xs text-neutral-600 leading-relaxed mb-4">
              Direct chat with the developer, live order progress updates, and fast turnaround.
            </p>
            <div className="text-xs text-neutral-900 font-mono font-semibold">
              contact@nexorasolutions.com
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-black/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-600">
          <p>© {new Date().getFullYear()} Nexora Solutions Ltd. All rights reserved.</p>
          <p className="tracking-widest uppercase text-[10px]">Global • London • New York • Singapore</p>
        </div>
      </div>
    </footer>
  );
}
