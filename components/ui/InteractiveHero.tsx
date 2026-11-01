"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import MagneticButton from "./MagneticButton";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function InteractiveHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse coordinate values normalized between -0.5 and 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Layer 1: Ambient background glow
  const bgGlowX = useTransform(smoothX, [-0.5, 0.5], [-40, 40]);
  const bgGlowY = useTransform(smoothY, [-0.5, 0.5], [-40, 40]);

  // Layer 2: Main Typography 3D tilt & shift
  const textX = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const textY = useTransform(smoothY, [-0.5, 0.5], [-18, 18]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  // Layer 3: Floating badge
  const badgeX = useTransform(smoothX, [-0.5, 0.5], [-28, 28]);
  const badgeY = useTransform(smoothY, [-0.5, 0.5], [-28, 28]);

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
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
      style={{ perspective: 1200 }}
    >
      {/* Dynamic Background Glow Layer */}
      <motion.div
        style={{ x: bgGlowX, y: bgGlowY }}
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[750px] rounded-full bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-transparent blur-[140px]"
      />

      {/* Floating Status Pill */}
      <motion.div
        style={{ x: badgeX, y: badgeY }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-700/60 bg-surface/80 px-4 py-1.5 text-xs font-medium text-neutral-300 shadow-lg backdrop-blur-md"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="tracking-wide uppercase text-neutral-400 text-[10px]">Architecture & Design</span>
        <span className="h-3 w-[1px] bg-neutral-700" />
        <span className="text-neutral-200">Accepting Select Q4 Engagements</span>
        <Sparkles className="h-3 w-3 text-amber-400 ml-1" />
      </motion.div>

      {/* Reactive 3D Main Typography */}
      <motion.div
        style={{
          x: textX,
          y: textY,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="max-w-4xl text-center"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
          Crafting Digital Masterpieces with{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Kinetic Precision
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          High-end web engineering, bespoke animations, and production architectures tailored for visionary brands demanding absolute distinction.
        </p>

        {/* Action Magnetic Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/order">
            <MagneticButton variant="glow" className="px-8 py-3.5 text-base">
              <span>Initiate Project</span>
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </Link>

          <Link href="/services">
            <MagneticButton variant="secondary" className="px-7 py-3.5 text-base">
              <span>Explore Services</span>
            </MagneticButton>
          </Link>
        </div>

        {/* Value Highlights */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-6 text-left max-w-2xl mx-auto pt-8 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Sub-100ms</div>
              <div className="text-xs text-neutral-400">Serverless Latency</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Enterprise RBAC</div>
              <div className="text-xs text-neutral-400">Google OAuth & MFA</div>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Cinematic UI</div>
              <div className="text-xs text-neutral-400">Fluid Spring Physics</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
