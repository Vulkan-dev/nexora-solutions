"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number; // Distance multiplier (default 0.35)
  radius?: number; // Active magnetic pull radius (px)
  variant?: "primary" | "secondary" | "glow" | "outline";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function MagneticButton({
  children,
  className,
  strength = 0.35,
  radius = 120,
  variant = "primary",
  onClick,
  ...props
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.hypot(distX, distY);

    if (distance < radius) {
      x.set(distX * strength);
      y.set(distY * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const variantStyles = {
    primary:
      "bg-white text-black hover:bg-neutral-200 border border-white/20 shadow-md",
    secondary:
      "bg-surfaceElevated text-neutral-200 hover:text-white border border-borderDark hover:border-neutral-500",
    glow: "bg-blue-600 text-white hover:bg-blue-500 shadow-neon border border-blue-400/40",
    outline:
      "bg-transparent text-neutral-300 hover:text-white border border-white/15 hover:border-white/40",
  };

  return (
    <motion.button
      ref={btnRef}
      style={{ x: smoothX, y: smoothY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-clickable="true"
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
        variantStyles[variant],
        className
      )}
      {...(props as any)}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
