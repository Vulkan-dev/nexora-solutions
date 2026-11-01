"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-background/95 py-16 text-neutral-400">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
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
              Engineering high-performance full-stack web applications, scalable SaaS systems, and custom Discord bots with clean architecture, enterprise security, and cinematic UI.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] uppercase tracking-widest text-cream-200 mb-4 font-mono">Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/services" className="hover:text-cream-100 transition-colors">Services & Solutions</Link></li>
              <li><Link href="/order" className="hover:text-cream-100 transition-colors">Order Now (Quest)</Link></li>
              <li><Link href="/dashboard" className="hover:text-cream-100 transition-colors">My Orders & Chat</Link></li>
              <li><Link href="/auth/signin" className="hover:text-cream-100 transition-colors">Client Login</Link></li>
            </ul>
          </div>

          {/* Studio Offices */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] uppercase tracking-widest text-cream-200 mb-4 font-mono">Inquiries & Contact</h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Direct developer communication, milestone staging updates, and real-time chat managed through the client suite.
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
