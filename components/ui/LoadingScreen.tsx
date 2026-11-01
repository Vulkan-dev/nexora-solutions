"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Elegant quick splash on initial mount
    const timer = setTimeout(() => {
      setLoading(false);
    }, 750);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090a0d] text-white pointer-events-none select-none"
        >
          {/* Subtle radial background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.08)_0%,transparent_65%)]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex flex-col items-center gap-5"
          >
            {/* Nexora Brand Monogram */}
            <div className="flex items-center gap-2 text-center">
              <span className="text-xl font-semibold tracking-[0.25em] uppercase text-cream-100">
                NEXORA
              </span>
              <span className="text-[11px] text-neutral-500 tracking-[0.3em] uppercase">
                Solutions
              </span>
            </div>

            {/* Cinematic Charging Bar */}
            <div className="w-44 h-[2px] bg-white/[0.08] rounded-full overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="h-full w-full bg-gradient-to-r from-cream-400 via-cream-200 to-cream-400 shadow-[0_0_8px_rgba(203,180,147,0.8)]"
              />
            </div>

            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">
              Initializing Experience
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
