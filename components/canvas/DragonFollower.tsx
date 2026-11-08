"use client";

import { useEffect, useId, useRef } from "react";

/** A small, articulated companion. All animation stays outside React renders. */
export default function DragonFollower({ enabled }: { enabled: boolean }) {
  const root = useRef<SVGSVGElement>(null);
  const rig = useRef<SVGGElement>(null);
  const tail = useRef<SVGGElement>(null);
  const embers = useRef<SVGGElement>(null);
  const wings = useRef<SVGGElement>(null);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const svg = root.current;
    if (!svg || !enabled) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = 0;
    let wingPhase = 0;
    let speedEase = 0;
    let active = false;
    let x = 0, y = 0, targetX = 0, targetY = 0, angle = 0;
    let lastMove = 0;
    let subdued = false;
    let lastHitTest = 0;
    const foreground = "a, button, input, textarea, select, label, h1, h2, h3, h4, h5, h6, p, li, [role='dialog'], [role='button'], [contenteditable='true'], [data-dragon-dim]";
    const overContent = (px: number, py: number) => !!document.elementFromPoint(px, py)?.closest(foreground);
    const joints = Array.from({ length: 17 }, (_, i) => ({ x: -i * 5, y: 0 }));
    const segments = Array.from(tail.current?.children ?? []);

    // Reuse a fixed pool: the trail never adds DOM nodes during flight.
    const pixels = Array.from(embers.current?.children ?? []);
    const sparks = pixels.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, age: 2, life: 1, size: 4 }));
    let emission = 0;
    let nextSpark = 0;
    const stop = () => {
      emission = 0;
      sparks.forEach((spark, i) => { spark.age = 2; pixels[i].setAttribute("opacity", "0"); });
      active = false;
      cancelAnimationFrame(frame);
      frame = 0;
      svg.style.opacity = "0";
    };
    const animate = (now: number) => {
      if (!active) return;
      const dt = Math.min((now - previous) / 1000 || 1 / 60, 0.04);
      previous = now;
      const dx = targetX - x, dy = targetY - y;
      const distance = Math.hypot(dx, dy);
      // Leave the native cursor and the content directly under it unobstructed.
      const moving = distance > 63;
      speedEase += ((moving ? 1 : 0) - speedEase) * (1 - Math.exp(-3.5 * dt));
      const travel = Math.max(0, distance - 62) * (1 - Math.exp(-7 * dt)) * 0.9 * speedEase;
      const idleBlend = Math.min(1, Math.max(0, (now - lastMove - 350) / 900));
      if (distance > 63) {
        const desired = Math.atan2(dy, dx);
        const delta = Math.atan2(Math.sin(desired - angle), Math.cos(desired - angle));
        angle += delta * (1 - Math.exp(-9 * dt));
        x += dx / distance * travel;
        y += dy / distance * travel;
      }
      joints[0] = { x, y };
      for (let i = 1; i < joints.length; i++) {
        const parent = joints[i - 1], joint = joints[i];
        const heading = Math.atan2(joint.y - parent.y, joint.x - parent.x);
        const bend = Math.sin(now * 0.0022 - i * 0.5) * (0.025 + idleBlend * 0.075) * dt * 60;
        joint.x = parent.x + Math.cos(heading + bend) * 5;
        joint.y = parent.y + Math.sin(heading + bend) * 5;
        const scale = 1 - i / joints.length * 0.9;
        segments[i - 1]?.setAttribute("transform", `translate(${joint.x} ${joint.y}) rotate(${heading * 180 / Math.PI}) scale(${scale})`);
      }
      // Emit from the tail only while actually traveling, then cool and drift upward.
      const speed = distance > 63 ? travel / dt : 0;
      emission += speed > 18 ? dt * Math.min(38, 12 + speed / 12) : 0;
      const tip = joints[joints.length - 1];
      while (emission >= 1) {
        emission -= 1;
        const spark = sparks[nextSpark];
        if (!spark) break;
        nextSpark = (nextSpark + 1) % sparks.length;
        spark.x = tip.x + (Math.random() - 0.5) * 8;
        spark.y = tip.y + (Math.random() - 0.5) * 8;
        spark.vx = -Math.cos(angle) * 14 + (Math.random() - 0.5) * 22;
        spark.vy = -Math.sin(angle) * 14 - 12 - Math.random() * 16;
        spark.age = 0;
        spark.life = 0.55 + Math.random() * 0.45;
        spark.size = 3 + Math.floor(Math.random() * 3) * 2;
      }
      sparks.forEach((spark, i) => {
        spark.age += dt;
        const life = spark.age / spark.life;
        const pixel = pixels[i];
        if (life >= 1) { pixel.setAttribute("opacity", "0"); return; }
        spark.x += spark.vx * dt;
        spark.y += spark.vy * dt;
        const size = Math.max(2, Math.round(spark.size * (1 - life * 0.6)));
        pixel.setAttribute("transform", `translate(${Math.round(spark.x / 2) * 2} ${Math.round(spark.y / 2) * 2}) scale(${size})`);
        pixel.setAttribute("fill", life < 0.2 ? "#ffe36a" : life < 0.5 ? "#ff941f" : life < 0.75 ? "#ef4415" : "#8f2414");
        pixel.setAttribute("opacity", String(Math.min(1, (1 - life) * 2)));
      });
      rig.current?.setAttribute("transform", `translate(${x} ${y}) rotate(${angle * 180 / Math.PI}) scale(1.12)`);
      const flight = Math.min(travel / dt / 450, 1);
      // Integrate phase so changes in speed never jump the wing position.
      wingPhase += dt * (1.5 + flight * 0.35);
      wings.current?.setAttribute("transform", `scale(1 ${0.88 + Math.sin(wingPhase) * 0.12})`);
      // Sample the creature itself, not just the cursor ahead of it.
      if (now - lastHitTest > 100) {
        lastHitTest = now;
        const nx = -Math.sin(angle) * 45, ny = Math.cos(angle) * 45;
        subdued = overContent(targetX, targetY) || overContent(x, y) || overContent(x + nx, y + ny) || overContent(x - nx, y - ny);
      }
      svg.style.opacity = now - lastMove > 4800 ? "0" : subdued ? "0.18" : "0.64";
      if (now - lastMove > 5400) { stop(); return; }
      frame = requestAnimationFrame(animate);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reduced.matches || document.hidden) return;
      targetX = event.clientX;
      targetY = event.clientY;
      lastMove = performance.now();
      subdued = event.target instanceof Element && !!event.target.closest("a, button, input, textarea, select, [contenteditable='true']");
      if (!active) {
        x = targetX - 65; y = targetY + 30; angle = -0.4;
        joints.forEach((joint, i) => { joint.x = x - i * 5; joint.y = y; });
        speedEase = 0;
        active = true;
        previous = lastMove;
        frame = requestAnimationFrame(animate);
      }
    };
    const visibility = () => { if (document.hidden) stop(); };
    const preference = () => { if (reduced.matches) stop(); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", stop);
    document.documentElement.addEventListener("pointerleave", stop);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", preference);
    return () => {
      stop();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", stop);
      document.documentElement.removeEventListener("pointerleave", stop);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", preference);
    };
  }, [enabled]);

  return (
    <svg ref={root} aria-hidden="true" data-dragon-follower="" className="pointer-events-none fixed inset-0 z-20 h-full w-full" style={{ opacity: 0, transition: "opacity 450ms ease", overflow: "hidden" }}>
      <defs>
        <linearGradient id={`${id}-armor`} x1="0" y1="0" x2="0.3" y2="1">
          <stop stopColor="#596164" /><stop offset="0.45" stopColor="#252c30" /><stop offset="1" stopColor="#101619" />
        </linearGradient>
        <linearGradient id={`${id}-wing`} x1="0" y1="0" x2="0.8" y2="1">
          <stop stopColor="#d5b77c" stopOpacity="0.85" /><stop offset="0.45" stopColor="#77613e" stopOpacity="0.72" /><stop offset="1" stopColor="#192326" stopOpacity="0.94" />
        </linearGradient>
        <path id={`${id}-sail`} d="M0 -7 Q8 -22 -3 -37 L-23 -62 Q-21 -48 -31 -45 L-57 -47 Q-43 -34 -46 -25 Q-33 -30 -29 -16 Q-18 -24 -18 -8 L-10 -4Z" />
        <path id={`${id}-ribs`} d="M0 -7 Q8 -22 -3 -37 L-23 -62 M-3 -37 L-57 -47 M-3 -37 Q-26 -33 -46 -25 M-3 -37 Q-16 -25 -29 -16 M-3 -37 L-18 -8" />
      </defs>
      <g ref={embers} data-dragon-embers="" shapeRendering="crispEdges">
        {Array.from({ length: 48 }, (_, i) => <rect key={i} x="-0.5" y="-0.5" width="1" height="1" opacity="0" />)}
      </g>
      <g ref={tail} fill={`url(#${id}-armor)`} stroke="#b69a61" strokeWidth="0.7">
        {Array.from({ length: 16 }, (_, i) => (
          <g key={i}><path d="M-6 0 Q-2 -6 6 -5 L11 0 L6 5 Q-2 6 -6 0Z" /><path d="M-3 0 L5 -2 L8 0 L5 2Z" fill="#c5a56b" stroke="none" /></g>
        ))}
      </g>
      <g ref={rig} strokeLinejoin="round" strokeLinecap="round">
        <g ref={wings} fill={`url(#${id}-wing)`} stroke="#c4a36a" strokeWidth="0.85">
          <use href={`#${id}-sail`} /><use href={`#${id}-sail`} transform="scale(1 -1)" />
          <g fill="none" strokeWidth="0.65" opacity="0.8"><use href={`#${id}-ribs`} /><use href={`#${id}-ribs`} transform="scale(1 -1)" /></g>
        </g>
        {/* Haunches and hooked claws, tucked back in flight. */}
        <path d="M-17 -6 Q-29 -10 -24 -17 L-14 -15 L-18 -12 L-13 -9 M-17 6 Q-29 10 -24 17 L-14 15 L-18 12 L-13 9" fill={`url(#${id}-armor)`} stroke="#b99a62" strokeWidth="1" />
        <path d="M-17 -16 L-12 -19 M-15 -14 L-10 -16 M-17 16 L-12 19 M-15 14 L-10 16" stroke="#d7bd88" strokeWidth="1.1" />
        {/* Heavy shoulders taper into a distinct neck and angular muzzle. */}
        <path d="M-31 0 Q-22 -8 -15 -10 Q-5 -12 0 -7 Q7 -3 14 -6 L18 -4 L18 4 L14 6 Q7 3 0 7 Q-5 12 -15 10 Q-22 8 -31 0Z" fill={`url(#${id}-armor)`} stroke="#ad905a" strokeWidth="0.9" />
        <path d="M-25 0 L-19 -3 L-13 0 L-8 -4 L-2 0 L3 -3 L8 0" fill="none" stroke="#d4b575" strokeWidth="1.2" />
        {/* Swept horns and cheek spikes frame the head. */}
        <path d="M19 -6 Q7 -13 6 -25 Q14 -19 24 -10 M19 6 Q7 13 6 25 Q14 19 24 10" fill="#d5b77c" stroke="#8e7144" strokeWidth="0.7" />
        <path d="M16 -5 L11 -14 L23 -11 L28 -6 L32 -3 L33 0 L32 3 L28 6 L23 11 L11 14 L16 5 L14 0Z" fill={`url(#${id}-armor)`} stroke="#c0a16a" strokeWidth="0.9" />
        <path d="M20 -6 L26 -4 L21 -3Z M20 6 L26 4 L21 3Z" fill="#ffcf65" />
        <path d="M19 -8 L27 -5 M19 8 L27 5" stroke="#b8985f" strokeWidth="1.2" />
        <path d="M28 -2 L30 -1 M28 2 L30 1 M16 0 L24 0" fill="none" stroke="#ae9059" strokeWidth="0.8" />
        <path d="M16 0 L21 -4 L26 0 L21 4Z" fill="#c5a56b" stroke="#edd6a3" strokeWidth="0.6" />
        <path d="M27 -5 L29 -7 L30 -3 M27 5 L29 7 L30 3" fill="#ead5a9" />
        <path d="M-21 0 L-18 -5 L-13 0 L-8 -6 L-3 0 L2 -4 L6 0" fill="#b99a62" stroke="#e0c58d" strokeWidth="0.5" />
      </g>
    </svg>
  );
}

