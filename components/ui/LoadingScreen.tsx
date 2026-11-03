"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Smooth progress counter filling to 100% across ~1.8 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Organic step increments
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(100, prev + increment);
      });
    }, 80);

    // Fade out after reaching 100%
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f7f6f2] text-neutral-900 pointer-events-none select-none"
        >
          {/* Subtle radial background warmth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(181,142,77,0.06)_0%,transparent_65%)]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center gap-5"
          >
            {/* Nexora Updated 64x64 Logo (Uncropped, crisp clean graphic) */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/64x64.png"
                alt="Nexora Solutions"
                className="relative h-14 w-14 sm:h-16 sm:w-16 object-contain"
              />
            </motion.div>

            {/* Nexora Brand Monogram */}
            <div className="flex items-center gap-2.5 text-center">
              <span className="text-xl sm:text-2xl font-semibold tracking-[0.25em] uppercase text-neutral-900">
                NEXORA
              </span>
              <span className="text-xs text-neutral-600 tracking-[0.3em] uppercase font-medium">
                Solutions
              </span>
            </div>

            {/* Smooth Cinematic Charging Bar */}
            <div className="w-56 h-[3px] bg-neutral-200/80 rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                style={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 shadow-[0_0_8px_rgba(181,142,77,0.4)] transition-all duration-150 ease-out"
              />
            </div>

            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-600">
              <span>Loading Nexora Solutions</span>
              <span className="text-amber-800 font-semibold">{progress}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
