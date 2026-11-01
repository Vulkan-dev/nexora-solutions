"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-background/90 py-12 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 shadow-neon">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-base font-bold tracking-wider">RADIANT.</span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Bespoke web architecture, cinematic interaction design, and high-security enterprise solutions.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-3">Capabilities</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/services" className="hover:text-white transition-colors">Full-Stack Web Platforms</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">3D & Interactive Experiences</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Enterprise Cloud Architecture</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Design Systems & UI Engineering</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/order" className="hover:text-white transition-colors">Multi-Step Ordering</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Customer Portal</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Command Center</Link></li>
              <li><Link href="/auth/signin" className="hover:text-white transition-colors">Client Authentication</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-3">Security & Status</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Systems Operational</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Vercel Serverless Safe • Upstash Sliding-Window Rate Limited • Strict RBAC Enforced
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Radiant Architecture Labs. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for supreme performance.
          </p>
        </div>
      </div>
    </footer>
  );
}
