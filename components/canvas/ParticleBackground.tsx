"use client";

import React, { useEffect, useRef } from "react";

export default function LuxuryAmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Architectural grey ambient orbs drifting gently
    const orbs = [
      { x: width * 0.25, y: height * 0.2, r: 460, vx: 0.16, vy: 0.1, baseColor: "rgba(180, 150, 105, 0.08)" },
      { x: width * 0.78, y: height * 0.55, r: 540, vx: -0.14, vy: -0.09, baseColor: "rgba(160, 135, 95, 0.06)" },
      { x: width * 0.45, y: height * 0.88, r: 420, vx: 0.1, vy: -0.12, baseColor: "rgba(205, 207, 214, 0.25)" },
    ];

    // Delicate floating ambient dust particles
    const motes = Array.from({ length: 24 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.4 + 0.6,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.1 - Math.random() * 0.15,
      alpha: Math.random() * 0.35 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    const render = () => {
      t += 0.002;
      ctx.clearRect(0, 0, width, height);

      // Warm alabaster gallery paper base
      ctx.fillStyle = "#f7f6f2";
      ctx.fillRect(0, 0, width, height);

      // Render subtle drifting caustic aura pools
      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -120 || orb.x > width + 120) orb.vx *= -1;
        if (orb.y < -120 || orb.y > height + 120) orb.vy *= -1;

        const pulse = Math.sin(t + orb.x * 0.001) * 35;
        const currentRadius = Math.max(160, orb.r + pulse);

        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          currentRadius * 0.05,
          orb.x,
          orb.y,
          currentRadius
        );
        grad.addColorStop(0, orb.baseColor);
        grad.addColorStop(1, "rgba(247, 246, 242, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render gentle floating atmospheric motes in warm amber bronze
      for (const mote of motes) {
        mote.x += mote.vx;
        mote.y += mote.vy;
        mote.phase += 0.015;

        if (mote.y < -10) {
          mote.y = height + 10;
          mote.x = Math.random() * width;
        }
        if (mote.x < -10) mote.x = width + 10;
        if (mote.x > width + 10) mote.x = -10;

        const currentAlpha = mote.alpha * (0.6 + 0.4 * Math.sin(mote.phase));
        ctx.fillStyle = `rgba(165, 130, 80, ${(currentAlpha * 0.7).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Elegant architectural vignette for perimeter framing
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.4,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.9
      );
      vignette.addColorStop(0, "rgba(247, 246, 242, 0)");
      vignette.addColorStop(1, "rgba(235, 232, 224, 0.45)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-90"
      aria-hidden="true"
    />
  );
}
