"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import MagneticButton from "./MagneticButton";
import { ArrowUpRight } from "lucide-react";

export default function InteractiveHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 140 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const textX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const textY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full flex flex-col justify-between px-6 pt-10 pb-12 sm:px-10 lg:px-16"
      style={{ perspective: 1200 }}
    >
      {/* Top Editorial Index Tag */}
      <div className="flex items-center justify-between text-[11px] tracking-widest uppercase text-neutral-400 border-b border-white/[0.08] pb-4 mb-12">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-cream-400" />
          <span className="font-mono text-neutral-300">Nexora Solutions — Engineering Studio</span>
        </div>
        <div className="hidden sm:block text-neutral-500 font-mono">Full-Stack Development & Architecture</div>
        <div className="font-mono text-neutral-500">Vol. XXIV</div>
      </div>

      {/* Main Reactive Typography Area */}
      <motion.div
        style={{
          x: textX,
          y: textY,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="max-w-4xl py-4 sm:py-8"
      >
        <div className="text-[11px] uppercase tracking-widest text-cream-400 mb-5 font-mono">
          [ Full-Stack Web Development • SaaS Systems • Discord Bots ]
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.08]">
          High-Performance <br />
          <span className="font-serif italic text-cream-200">SaaS, Web Apps</span> & Discord Bots.
        </h1>

        <p className="mt-6 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
          I build production-grade full-stack web applications, scalable SaaS systems, and custom Discord bots with clean architecture, robust security, and cinematic UI.
        </p>

        {/* Action Magnetic Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/order">
            <MagneticButton variant="primary" className="px-8 py-3.5 text-xs tracking-wider uppercase font-semibold">
              <span>Order Now</span>
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
          </Link>

          <Link href="/services">
            <MagneticButton variant="outline" className="px-6 py-3.5 text-xs tracking-wider uppercase">
              <span>Explore Services</span>
            </MagneticButton>
          </Link>
        </div>
      </motion.div>

      {/* Bottom Architectural Credits Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-white/[0.08] text-xs">
        <div>
          <div className="text-neutral-500 uppercase text-[10px] tracking-widest font-mono">Specialty</div>
          <div className="text-neutral-200 mt-1 font-medium">Full-Stack & SaaS Systems</div>
        </div>
        <div>
          <div className="text-neutral-500 uppercase text-[10px] tracking-widest font-mono">Offerings</div>
          <div className="text-cream-300 mt-1 font-medium">Web Apps • SaaS • Discord Bots</div>
        </div>
        <div>
          <div className="text-neutral-500 uppercase text-[10px] tracking-widest font-mono">Core Tech</div>
          <div className="text-neutral-200 mt-1 font-medium">Next.js • Supabase • TypeScript</div>
        </div>
        <div>
          <div className="text-neutral-500 uppercase text-[10px] tracking-widest font-mono">Availability</div>
          <div className="text-cream-300 mt-1 font-medium">Open for Orders</div>
        </div>
      </div>
    </div>
  );
}
