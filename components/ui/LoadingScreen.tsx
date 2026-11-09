"use client";

import { useEffect, useId, useRef, useState } from "react";

export default function LoadingScreen() {
  const id = useId().replace(/:/g, "");
  const screen = useRef<HTMLDivElement>(null);
  const glint = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let cancelled = false;
    let ready = false;
    let currentProgress = 0;
    let finishAt = 0;
    const start = performance.now();
    let previous = start;

    const logo = new Image();
    logo.src = "/nexora-logo.png";

    const pageReady =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), { once: true });
          });

    Promise.allSettled([pageReady, document.fonts.ready, logo.decode()]).then(() => {
      if (!cancelled) ready = true;
    });

    const animate = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;

      const canFinish = (ready && now - start > (reduced.matches ? 150 : 850)) || now - start > 4500;
      currentProgress += ((canFinish ? 1 : 0.88) - currentProgress) * (1 - Math.exp(-dt * (canFinish ? 9 : 3)));
      setProgress(Math.min(1, currentProgress));

      if (canFinish && currentProgress > 0.99 && !finishAt) {
        finishAt = now;
      }

      if (finishAt) {
        const elapsed = now - finishAt;
        const glintDuration = reduced.matches ? 0 : 1200;

        if (glint.current && glintDuration > 0) {
          const t = Math.min(1, elapsed / glintDuration);
          // Glint sweeps horizontally across the entire logo from -120% to +180%
          const sweepX = -120 + t * 300;
          glint.current.style.transform = `translateX(${sweepX}%) skewX(-24deg)`;
          glint.current.style.opacity = String(Math.sin(t * Math.PI));
        }

        if (elapsed > glintDuration + 150 && screen.current) {
          screen.current.style.opacity = "0";
        }

        if (elapsed > glintDuration + (reduced.matches ? 180 : 650)) {
          setVisible(false);
          return;
        }
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={screen}
      data-loading-screen=""
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f7f6f2] select-none"
      style={{ transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div role="status" aria-live="polite" className="sr-only">
        {progress >= 0.99 ? "Nexora Solutions is ready" : "Loading Nexora Solutions"}
      </div>

      <div className="relative flex flex-col items-center justify-center">
        {/* Logo Container - Clean uncropped natural rendering */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center overflow-hidden">
          {/* Base Logo Shadow / Ghost Outline */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nexora-logo.png"
            alt="Nexora Solutions"
            className="absolute inset-0 w-full h-full object-contain opacity-20 filter grayscale"
          />

          {/* Reveal Clip Mask using height/width fill transition */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden transition-all duration-75"
            style={{
              clipPath: `inset(0 ${Math.max(0, (1 - progress) * 100)}% 0 0)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nexora-logo.png"
              alt="Nexora Solutions"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(0,163,255,0.18)]"
            />

            {/* Specular Glint Shimmer Sheen Layer - Perfectly bounded and uncropped */}
            <div
              ref={glint}
              className="absolute inset-y-0 w-28 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.1) 80%, transparent 100%)",
                mixBlendMode: "overlay",
                opacity: 0,
                transform: "translateX(-120%) skewX(-24deg)",
              }}
            />
          </div>
        </div>

        {/* Minimal Typography Brand Signature */}
        <div
          aria-hidden="true"
          className="mt-2 text-[10.5px] font-semibold tracking-[0.45em] uppercase text-neutral-800 transition-opacity duration-300"
          style={{ opacity: progress > 0.4 ? 1 : 0.2 }}
        >
          NEXORA SOLUTIONS
        </div>
      </div>
    </div>
  );
}
