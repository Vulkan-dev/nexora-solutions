"use client";

import React, { useEffect, useRef } from "react";

interface Segment {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -100, y: -100, targetX: -100, targetY: -100, isHovering: false });
  const segmentsRef = useRef<Segment[]>([]);

  useEffect(() => {
    // Only enable on pointer/fine devices (desktop mouse)
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const NUM_SEGMENTS = 26;
    const SEGMENT_DIST = 9;

    // Initialize segments
    segmentsRef.current = Array.from({ length: NUM_SEGMENTS }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: 0,
      vy: 0,
      angle: 0,
    }));

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;

      // Check if hovering clickable
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("button") ||
        target?.closest("a") ||
        target?.closest("[data-clickable='true']") ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA"
      ) {
        mouseRef.current.isHovering = true;
      } else {
        mouseRef.current.isHovering = false;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      // Smooth interpolation for primary mouse dot
      mouse.x += (mouse.targetX - mouse.x) * 0.25;
      mouse.y += (mouse.targetY - mouse.y) * 0.25;

      const segments = segmentsRef.current;
      if (segments.length === 0) return;

      // Head segment follows mouse
      const head = segments[0];
      const dxHead = mouse.x - head.x;
      const dyHead = mouse.y - head.y;
      head.vx = (head.vx + dxHead * 0.2) * 0.65;
      head.vy = (head.vy + dyHead * 0.2) * 0.65;
      head.x += head.vx;
      head.y += head.vy;
      head.angle = Math.atan2(head.vy, head.vx);

      // Trailing dragon spine segments with spring-distance constraints
      for (let i = 1; i < segments.length; i++) {
        const prev = segments[i - 1];
        const curr = segments[i];

        const dx = prev.x - curr.x;
        const dy = prev.y - curr.y;
        const dist = Math.hypot(dx, dy) || 1;

        curr.angle = Math.atan2(dy, dx);

        // Constrained pull
        const targetDist = SEGMENT_DIST;
        const diff = (dist - targetDist) / dist;
        const springX = dx * diff * 0.45;
        const springY = dy * diff * 0.45;

        curr.vx = (curr.vx + springX) * 0.72;
        curr.vy = (curr.vy + springY) * 0.72;

        curr.x += curr.vx;
        curr.y += curr.vy;
      }

      // Draw Dragon Spine & Ribs / Fins
      const isHover = mouse.isHovering;
      const primaryColor = isHover ? "rgba(96, 165, 250, 0.9)" : "rgba(147, 197, 253, 0.7)";
      const glowColor = isHover ? "rgba(59, 130, 246, 0.4)" : "rgba(37, 99, 235, 0.25)";

      // Draw ethereal glow along segments
      for (let i = segments.length - 1; i >= 0; i--) {
        const seg = segments[i];
        const progress = 1 - i / segments.length;
        const radius = Math.max(1.2, 5.5 * Math.pow(progress, 0.8));

        // Lateral dragon spines/ribs
        if (i % 2 === 0 && i > 1 && i < segments.length - 3) {
          const finLength = radius * 2.8;
          const perpAngle = seg.angle + Math.PI / 2;
          const fx1 = seg.x + Math.cos(perpAngle) * finLength;
          const fy1 = seg.y + Math.sin(perpAngle) * finLength;
          const fx2 = seg.x - Math.cos(perpAngle) * finLength;
          const fy2 = seg.y - Math.sin(perpAngle) * finLength;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(96, 165, 250, ${0.35 * progress})`;
          ctx.lineWidth = 1;
          ctx.moveTo(fx1, fy1);
          ctx.lineTo(fx2, fy2);
          ctx.stroke();
        }

        // Segment node
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? primaryColor : `rgba(147, 197, 253, ${0.75 * progress})`;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = isHover ? 16 : 8;
        ctx.fill();
      }

      // Draw primary pointer dot
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, isHover ? 7 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = isHover ? "#60a5fa" : "#ffffff";
      ctx.shadowColor = isHover ? "#3b82f6" : "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = isHover ? 20 : 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      aria-hidden="true"
    />
  );
}
