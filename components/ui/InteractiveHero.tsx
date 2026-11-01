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

  const textX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const textY = useTransform(smoothY, [-0.5, 0.5], [-12, 12]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-5, 5]);

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
      className="relative min-h-[85vh] flex flex-col justify-between px-6 pt-28 pb-16 sm:px-10 lg:px-16"
      style={{ perspective: 1200 }}
    >
      {/* Top Editorial Index Tag */}
      <div className="flex items-center justify-between text-[11px] tracking-widest uppercase text-neutral-400 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-cream-300" />
          <span>Atelier Studio — Private Editions</span>
        </div>
        <div className="hidden sm:block">Digital Direction & Architecture</div>
        <div>Vol. XXIV</div>
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
        className="my-auto max-w-5xl"
      >
        <div className="text-xs uppercase tracking-widest text-cream-400 mb-6 font-mono">
          [ 01 // Bespoke Digital Architecture ]
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-[1.04]">
          Architecture for the <br />
          <span className="font-serif italic text-cream-200">Uncompromising</span> Mind.
        </h1>

        <p className="mt-8 text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
          We sculpt bespoke digital environments defined by structural poise, kinetic restraint, and tactile elegance. Tailored for iconic houses and singular creators.
        </p>

        {/* Action Magnetic Buttons */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/order">
            <MagneticButton variant="primary" className="px-7 py-3 text-xs tracking-wider uppercase font-semibold">
              <span>Commission Work</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </MagneticButton>
          </Link>

          <Link href="/services">
            <MagneticButton variant="outline" className="px-6 py-3 text-xs tracking-wider uppercase">
              <span>Explore Portfolio</span>
            </MagneticButton>
          </Link>
        </div>
      </motion.div>

      {/* Bottom Architectural Credits Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/[0.08] text-xs">
        <div>
          <div className="text-neutral-500 uppercase text-[10px] tracking-wider">Discipline</div>
          <div className="text-neutral-200 mt-1 font-medium">Kinetic Digital Design</div>
        </div>
        <div>
          <div className="text-neutral-500 uppercase text-[10px] tracking-wider">Availability</div>
          <div className="text-cream-300 mt-1 font-medium">Limited Commissions</div>
        </div>
        <div>
          <div className="text-neutral-500 uppercase text-[10px] tracking-wider">Output</div>
          <div className="text-neutral-200 mt-1 font-medium">Bespoke Platforms & Systems</div>
        </div>
        <div>
          <div className="text-neutral-500 uppercase text-[10px] tracking-wider">Studio Origin</div>
          <div className="text-neutral-200 mt-1 font-medium">Geneva • London • New York</div>
        </div>
      </div>
    </div>
  );
}
