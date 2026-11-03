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
      className="relative w-full max-w-[95vw] mx-auto flex flex-col justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-8 sm:pt-10 pb-12 sm:pb-16"
      style={{ perspective: 1200 }}
    >
      {/* Top Editorial Index Tag */}
      <div className="flex items-center justify-between text-[11px] tracking-widest uppercase text-neutral-600 border-b border-black/[0.08] pb-4 mb-8 sm:mb-12">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
          <span className="font-mono text-neutral-800 font-medium">Nexora Solutions — Web & Bot Development</span>
        </div>
        <div className="hidden sm:block text-neutral-500 font-mono">Full-Stack Websites & Custom Systems</div>
        <div className="font-mono text-amber-800 font-semibold">Available for Work</div>
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
        className="w-full max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl py-4 sm:py-8"
      >
        <div className="text-[11px] uppercase tracking-widest text-amber-800 mb-5 font-mono font-semibold">
          [ Full-Stack Websites • SaaS Platforms • Discord Bots ]
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-light tracking-tight text-neutral-900 leading-[1.08]">
          Fast, Modern <br />
          <span className="font-serif italic text-amber-800">Websites, SaaS Apps</span> & Discord Bots.
        </h1>

        <p className="mt-6 text-sm sm:text-base text-neutral-700 max-w-3xl 2xl:max-w-4xl leading-relaxed">
          I build high quality full-stack websites, SaaS apps, and Discord bots. Every project comes with clean code, fast loading speeds, and an easy-to-use dashboard to track your order.
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
              <span>View Services</span>
            </MagneticButton>
          </Link>
        </div>
      </motion.div>

      {/* Bottom Architectural Credits Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-black/[0.08] text-xs">
        <div>
          <div className="text-neutral-500 uppercase text-[10px] tracking-widest font-mono">Services</div>
          <div className="text-neutral-800 mt-1 font-medium">Web Apps & SaaS</div>
        </div>
        <div>
          <div className="text-neutral-500 uppercase text-[10px] tracking-widest font-mono">What I Build</div>
          <div className="text-amber-800 mt-1 font-semibold">Websites • SaaS • Discord Bots</div>
        </div>
        <div>
          <div className="text-neutral-500 uppercase text-[10px] tracking-widest font-mono">Technology</div>
          <div className="text-neutral-800 mt-1 font-medium">Next.js • Supabase • TypeScript</div>
        </div>
        <div>
          <div className="text-neutral-500 uppercase text-[10px] tracking-widest font-mono">Status</div>
          <div className="text-amber-800 mt-1 font-semibold">Open for Orders</div>
        </div>
      </div>
    </div>
  );
}
