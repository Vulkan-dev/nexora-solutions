"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
}

export default function TextReveal({ text, className, wordClassName }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.35"],
  });

  const words = text.split(" ");

  return (
    <div ref={containerRef} className={cn("relative my-4 flex flex-wrap gap-x-2 gap-y-1", className)}>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={index}
            progress={scrollYProgress}
            range={[start, end]}
            className={wordClassName}
          >
            {word}
          </Word>
        );
      })}
    </div>
  );
}

interface WordProps {
  children: React.ReactNode;
  progress: any;
  range: [number, number];
  className?: string;
}

function Word({ children, progress, range, className }: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [6, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className={cn("inline-block transition-colors duration-150", className)}
    >
      {children}
    </motion.span>
  );
}
