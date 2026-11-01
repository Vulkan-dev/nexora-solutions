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

    // Warm, architectural light orbs drifting gently
    const orbs = [
      { x: width * 0.25, y: height * 0.2, r: 420, vx: 0.18, vy: 0.12, baseColor: "rgba(225, 215, 198, 0.035)" },
      { x: width * 0.75, y: height * 0.6, r: 520, vx: -0.15, vy: -0.1, baseColor: "rgba(180, 160, 140, 0.025)" },
      { x: width * 0.5, y: height * 0.85, r: 380, vx: 0.12, vy: -0.15, baseColor: "rgba(200, 190, 180, 0.02)" },
    ];

    let t = 0;

    const render = () => {
      t += 0.002;
      ctx.clearRect(0, 0, width, height);

      // Deep obsidian solid base
      ctx.fillStyle = "#0c0d0e";
      ctx.fillRect(0, 0, width, height);

      // Render subtle drifting caustic aura pools
      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
        if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

        const pulse = Math.sin(t + orb.x * 0.001) * 30;
        const currentRadius = Math.max(150, orb.r + pulse);

        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          currentRadius * 0.05,
          orb.x,
          orb.y,
          currentRadius
        );
        grad.addColorStop(0, orb.baseColor);
        grad.addColorStop(1, "rgba(12, 13, 14, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Elegant architectural vignette
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.35,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85
      );
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(5, 5, 6, 0.75)");
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
