"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  variant?: "primary" | "secondary" | "glow" | "outline";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function MagneticButton({
  children,
  className,
  strength = 0.3,
  radius = 100,
  variant = "primary",
  onClick,
  ...props
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 180, mass: 0.1 };
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
      "bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-900 shadow-md font-medium",
    secondary:
      "bg-white text-neutral-800 hover:text-black hover:bg-neutral-50 border border-neutral-300 shadow-sm",
    glow:
      "bg-amber-700 text-white hover:bg-amber-800 border border-amber-700 shadow-md",
    outline:
      "bg-white/90 text-neutral-800 hover:text-black hover:bg-white border border-neutral-300 shadow-sm",
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
        "relative inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs tracking-wide transition-all duration-200 focus:outline-none",
        variantStyles[variant],
        className
      )}
      {...(props as any)}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
