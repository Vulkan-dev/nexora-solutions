"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  ArrowUp,
  Layers,
  MessageSquare,
  Compass,
} from "lucide-react";

export default function CustomCursor() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [dragonEnabled, setDragonEnabled] = useState<boolean>(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Check mobile and load persistent toggle preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const savedPref = localStorage.getItem("nexora_dragon_enabled") ?? localStorage.getItem("radiant_dragon_enabled");
    if (savedPref !== null) {
      setDragonEnabled(savedPref === "true");
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleDragon = () => {
    const nextState = !dragonEnabled;
    setDragonEnabled(nextState);
    try {
      localStorage.setItem("nexora_dragon_enabled", String(nextState));
    } catch (_) {}
  };

  // Custom Right-Click Context Menu Listener
  useEffect(() => {
    if (typeof window === "undefined" || isMobile) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      // Keep menu inside viewport boundaries
      const menuWidth = 240;
      const menuHeight = 280;
      const x = Math.min(e.clientX, window.innerWidth - menuWidth - 12);
      const y = Math.min(e.clientY, window.innerHeight - menuHeight - 12);
      setContextMenu({ x, y });
    };

    const handleCloseMenu = () => {
      setContextMenu(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContextMenu(null);
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleCloseMenu);
    window.addEventListener("scroll", handleCloseMenu, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleCloseMenu);
      window.removeEventListener("scroll", handleCloseMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobile]);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => {
        setCopiedLink(false);
        setContextMenu(null);
      }, 900);
    }
  };

  const handleNavigate = (path: string) => {
    setContextMenu(null);
    router.push(path);
  };

  const handleScrollTop = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setContextMenu(null);
  };

  useEffect(() => {
    if (typeof window === "undefined" || isMobile) return;

    const svg = svgRef.current;
    const screenGroup = svg?.querySelector("#screen");
    if (!svg || !screenGroup) return;

    const xmlns = "http://www.w3.org/2000/svg";
    const xlinkns = "http://www.w3.org/1999/xlink";

    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspect = width / height;

    const updateViewBox = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      aspect = width / Math.max(1, height);
      const svgWidth = 300 * aspect;
      const viewBoxXMin = -svgWidth / 2;
      svg.setAttribute("viewBox", `${viewBoxXMin} -150 ${svgWidth} 300`);
    };
    updateViewBox();

    const mapToSvgCoords = (pixelX: number, pixelY: number) => {
      const svgWidth = 300 * aspect;
      const svgX = (pixelX / width) * svgWidth - svgWidth / 2;
      const svgY = (pixelY / height) * 300 - 150;
      return { x: svgX, y: svgY };
    };

    const N = 30;
    const elems: Array<{ use: SVGUseElement | null; x: number; y: number }> = [];
    const initialCoords = mapToSvgCoords(width / 2, height / 2);

    for (let i = 0; i < N; i++) {
      elems[i] = { use: null, x: initialCoords.x, y: initialCoords.y };
    }

    const pointer = { x: initialCoords.x, y: initialCoords.y };
    let frm = Math.random();
    let rad = 0;

    // Clear previous elements
    while (screenGroup.firstChild) {
      screenGroup.removeChild(screenGroup.firstChild);
    }

    const prepend = (useId: string, i: number) => {
      const elem = document.createElementNS(xmlns, "use") as SVGUseElement;
      elems[i].use = elem;
      elem.setAttributeNS(xlinkns, "href", "#" + useId);
      elem.setAttribute("href", "#" + useId);
      screenGroup.prepend(elem);
    };

    for (let i = 1; i < N; i++) {
      if (i === 1) prepend("Cabeza", i);
      else if (i === 6 || i === 13) prepend("Aletas", i);
      else prepend("Espina", i);
    }

    // Pointer tracking for desktop
    const updatePointerPos = (clientX: number, clientY: number) => {
      const svgWidth = 300 * aspect;
      const paddingX = 22;
      const paddingY = 20;
      const minX = -svgWidth / 2 + paddingX;
      const maxX = svgWidth / 2 - paddingX;
      const minY = -150 + paddingY;
      const maxY = 150 - paddingY;

      const svgCoords = mapToSvgCoords(clientX, clientY);
      pointer.x = Math.max(minX, Math.min(maxX, svgCoords.x));
      pointer.y = Math.max(minY, Math.min(maxY, svgCoords.y));
      rad = 0;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${clientX - 4}px, ${clientY - 4}px, 0)`;
        dotRef.current.style.opacity = "1";
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      updatePointerPos(e.clientX, e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, a, [data-clickable='true'], input, select, textarea")) {
        if (dotRef.current) {
          dotRef.current.style.transform = `${dotRef.current.style.transform.split(" scale")[0]} scale(2)`;
          dotRef.current.style.boxShadow = "0 0 14px rgba(223, 213, 198, 0.9)";
        }
      } else {
        if (dotRef.current) {
          dotRef.current.style.transform = dotRef.current.style.transform.replace(/ scale\([^)]+\)/, "");
          dotRef.current.style.boxShadow = "0 0 8px rgba(223, 213, 198, 0.7)";
        }
      }
    };

    const handleResize = () => {
      updateViewBox();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("resize", handleResize, false);

    let animationFrameId: number;

    const run = () => {
      animationFrameId = requestAnimationFrame(run);

      // Only calculate kinematics if dragon is enabled
      if (!dragonEnabled) return;

      const e0 = elems[0];
      const svgWidth = 300 * aspect;
      const ax = (Math.cos(3 * frm) * rad * svgWidth) / 300;
      const ay = (Math.sin(4 * frm) * rad * 300) / svgWidth;

      const paddingX = 22;
      const paddingY = 20;
      const minX = -svgWidth / 2 + paddingX;
      const maxX = svgWidth / 2 - paddingX;
      const minY = -150 + paddingY;
      const maxY = 150 - paddingY;

      // Slowed down head tracking: was / 10, now / 24 for heavy regal gliding
      e0.x += (ax + pointer.x - e0.x) / 24;
      e0.y += (ay + pointer.y - e0.y) / 24;

      // Ensure head never leaves canvas bounds
      e0.x = Math.max(minX, Math.min(maxX, e0.x));
      e0.y = Math.max(minY, Math.min(maxY, e0.y));

      for (let i = 1; i < N; i++) {
        const e = elems[i];
        const ep = elems[i - 1];
        const a = Math.atan2(e.y - ep.y, e.x - ep.x);

        // Slowed down segment physics: was / 4, now / 7.5 for majestic serpentine poise
        const segDist = (100 - i) / 22;
        e.x += (ep.x - e.x + Math.cos(a) * segDist) / 7.5;
        e.y += (ep.y - e.y + Math.sin(a) * segDist) / 7.5;

        // Prevent body segments from leaving canvas
        e.x = Math.max(-svgWidth / 2 + 12, Math.min(svgWidth / 2 - 12, e.x));
        e.y = Math.max(-140, Math.min(140, e.y));

        const s = (162 + 4 * (1 - i)) / 300;

        if (e.use) {
          e.use.setAttribute(
            "transform",
            `translate(${(ep.x + e.x) / 2},${(ep.y + e.y) / 2}) rotate(${
              (180 / Math.PI) * a
            }) scale(${s},${s})`
          );
        }
      }

      const radm = Math.min(svgWidth, 300) / 7 - 20;
      if (rad < radm) rad++;

      // Slower ambient oscillation: was 0.003, now 0.0012
      frm += 0.0012;

      if (rad > 60) {
        pointer.x += (0 - pointer.x) * 0.02;
        pointer.y += (0 - pointer.y) * 0.02;
      }
    };

    run();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile, dragonEnabled]);

  // Complete exclusion on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <>
      {/* Precision Primary Cursor Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-50 h-2 w-2 rounded-full bg-neutral-900 opacity-0 transition-[opacity,box-shadow] duration-200"
        style={{
          boxShadow: "0 0 6px rgba(0, 0, 0, 0.4), 0 0 10px rgba(181, 144, 82, 0.35)",
          willChange: "transform",
        }}
        aria-hidden="true"
      />

      {/* Dragon SVG Canvas Container (Toggled via state) */}
      <div
        ref={containerRef}
        className={`pointer-events-none fixed inset-0 z-20 h-screen w-screen overflow-hidden transition-opacity duration-500 ${
          dragonEnabled ? "opacity-90" : "opacity-0"
        }`}
        style={{
          transform: "translate3d(0,0,0)",
          willChange: "transform",
        }}
        aria-hidden="true"
      >
        <svg
          ref={svgRef}
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full pointer-events-none"
        >
          <defs>
            {/* Cabeza / Head - Luxury Metallic Obsidian & Polished Imperial Gold */}
            <g id="Cabeza">
              {/* Gold Crest Horns & Accents */}
              <path
                style={{ fill: "#b58e4d", fillOpacity: 0.98 }}
                d="M-28.9,-1.1L-28.55 -1.95Q-28.1 -3.1 -27.25 -2.95L-26.7 -2.95Q-27.7 -1.65 -28.9 -1.1M-18.35,-1.8Q-15.1 -10.3 -9.6 -6.05Q-15.1 -6.2 -18.35 -1.8M-18.35,1.1Q-15.1 5.45 -9.6 5.35Q-15.1 9.55 -18.35 1.1M-26.7,2.2L-27.25 2.25Q-28.1 2.4 -28.55 1.2L-28.9 0.35Q-27.7 0.9 -26.7 2.2"
              />
              {/* Deep Sculpted Obsidian Shell */}
              <path
                style={{ fill: "#16171f", fillOpacity: 0.96 }}
                d="M-21.05,-8.25Q-13.6 -15.95 -1.3 -12.1Q-7.85 -8.5 -5.85 -4.35Q-2.3 -4.85 10.5 0.15Q0 4.35 -5.85 3.65Q-7.85 7.75 -1.25 12.45Q-13.6 15.2 -21.05 7.5Q-29.55 4.05 -30.2 -0.35Q-29.55 -4.8 -21.05 -8.25M-26.7,-2.95L-27.25 -2.95Q-28.1 -3.1 -28.55 -1.95L-28.9 -1.1Q-27.7 -1.65 -26.7 -2.95M-9.6,-6.05Q-15.1 -10.3 -18.35 -1.8Q-15.1 -6.2 -9.6 -6.05M-9.6,5.35Q-15.1 5.45 -18.35 1.1Q-15.1 9.55 -9.6 5.35M-28.9,0.35L-28.55 1.2Q-28.1 2.4 -27.25 2.25L-26.7 2.2Q-27.7 0.9 -28.9 0.35"
              />
              {/* Imperial Crown Jewel Specular Highlight */}
              <circle cx="-17" cy="0" r="1.2" fill="#f5d799" fillOpacity="0.9" />
              <circle cx="-17.3" cy="-0.3" r="0.4" fill="#ffffff" />
              {/* Radiant Amber Gold Eyes with Multi-Facet Glint */}
              <circle cx="-13" cy="-3.5" r="1.4" fill="#e8ba55" />
              <circle cx="-13.4" cy="-3.7" r="0.5" fill="#ffffff" />
              <circle cx="-13" cy="3.5" r="1.4" fill="#e8ba55" />
              <circle cx="-13.4" cy="3.3" r="0.5" fill="#ffffff" />
            </g>

            {/* Aletas / Wings - Rich Metallic Gold to Obsidian Iridescent Gradient */}
            <g id="Aletas">
              <linearGradient
                id="DragonWingGrad"
                gradientUnits="userSpaceOnUse"
                x1="-819.2"
                y1="0"
                x2="819.2"
                y2="0"
              >
                <stop offset="0" style={{ stopColor: "#cba564", stopOpacity: 0.95 }} />
                <stop offset="0.3" style={{ stopColor: "#9e7d44", stopOpacity: 0.85 }} />
                <stop offset="0.7" style={{ stopColor: "#323440", stopOpacity: 0.75 }} />
                <stop offset="1" style={{ stopColor: "#15161d", stopOpacity: 0.4 }} />
              </linearGradient>
              <path
                style={{ fill: "url(#DragonWingGrad)" }}
                d="M29.75,-36.85Q-17.75 -61.45 -42.05 -40.95L-45.35 -38.35L-53.7 -41.15L-51.15 -44.85Q-34.85 -68.4 21 -57.8Q-32.2 -72.1 -50.25 -50Q-53.85 -45.65 -56.05 -41.95L-64.7 -43.35L-60.6 -50.3Q-45.9 -75.55 5.1 -79.35Q-2.2 -79.8 -9.45 -79.15Q-16.2 -78.55 -22.85 -77.15Q-29.85 -75.65 -36.5 -73Q-43.05 -70.4 -48.8 -66.85Q-54.55 -63.35 -56.8 -60.3L-60.5 -55.4Q-62.95 -52.1 -67 -43.55L-70.55 -43.55L-76.35 -42.95Q-74.6 -49.1 -71.85 -54.85Q-68.9 -61.25 -64.8 -67.1Q-60.8 -73 -55.45 -77.55Q-49.9 -82.35 -43.65 -85.85L-30.6 -92.7Q-24.05 -95.95 -17 -98.25Q-63.75 -86.35 -73.65 -57.1Q-75.75 -50.75 -77.45 -42.75Q-82.9 -41.75 -88 -39.65Q-87.65 -46.65 -86.3 -53.05Q-79.8 -89.8 -36.65 -117.2Q-80.65 -94.5 -87.55 -59.55Q-88.65 -54.15 -88.95 -39.4L-89.8 -38.85L-92.7 -37.6Q-93.75 -44.35 -94.1 -51.15Q-94.4 -58.2 -93.25 -65.1Q-92.15 -72.5 -90.05 -79.65Q-88.05 -86.55 -85 -93Q-82.1 -99.3 -78.45 -105.15Q-74.6 -111.35 -70.25 -117.25Q-65.95 -123.1 -61.1 -128.55Q-70.3 -119.35 -77.9 -108.7Q-86 -97.3 -90.8 -84.05Q-95.8 -70.5 -96 -56.15Q-96.1 -46 -94.05 -36.05L-93.25 -31.55Q-93.5 -35.65 -92.35 -36Q-79.85 -42 -66.6 -40.45Q-52.45 -38.85 -39.2 -33.25Q-28.3 -29.9 -21.25 -24.15Q-17.8 -23.3 -8.6 -15.6Q-12.1 -20.75 -16.75 -24.5Q-24.55 -30.7 -34.25 -34.05L-42.55 -37Q-38.9 -41.25 -31.5 -43.25Q-24.05 -45.3 -16.2 -46.3Q-8.35 -47.35 -1 -46Q5.95 -44.75 12.75 -42.85Q19.85 -40.9 29.75 -36.85M-92.45,-27.35L-94.95 -36.25Q-109.7 -105 -27.95 -154.65Q-98.65 -103.8 -91.75 -39.4L-89.95 -40.2Q-92.2 -105.25 -5.6 -130.9Q-78.8 -99.95 -87.45 -40.9Q-83.15 -42.95 -78.45 -43.95Q-70 -101.3 17.65 -103.8Q-56.9 -93.4 -74.5 -44.55L-67.4 -45.45Q-49.1 -94.95 39.25 -75.65Q-36.75 -84.35 -62.25 -44.25L-57.3 -43.6Q-31.65 -86.5 56.15 -46.05Q-20.3 -73.35 -51.35 -41.7L-45.95 -39.75Q-17.85 -71.35 51.85 -24.8Q-8.7 -56.4 -39.75 -37.05Q-28.15 -34.05 -14.25 -24.45Q-8.6 -19.85 -5.8 -16.95Q5.95 -2.4 20 0Q5.95 2.4 -5.8 16.95Q-8.6 19.85 -14.25 24.45Q-28.15 34.05 -39.75 37.05Q-8.7 56.4 51.85 24.8Q-17.85 71.35 -45.95 39.75L-51.35 41.7Q-20.3 73.35 56.15 46.1Q-31.65 86.5 -57.3 43.65L-62.25 44.3Q-36.75 84.35 39.25 75.7Q-49.1 94.95 -67.4 45.5L-74.5 44.6Q-56.9 93.4 17.65 103.85Q-70 101.3 -78.45 43.95Q-83.15 42.95 -87.45 40.9Q-78.8 99.95 -5.6 130.9Q-92.2 105.25 -89.95 40.25L-91.75 39.4Q-98.65 103.8 -27.95 154.65Q-109.7 105 -94.95 36.3L-92.45 27.35Q-93.05 33.9 -92.05 34.75Q-91.1 35.55 -88.95 36.7L-87.95 37Q-83.7 38.25 -79.05 38.8L-77.25 38.95Q-72.55 39.3 -67.5 38.85L-65.45 38.65Q-44.4 36.05 -17.8 19.6Q-9.9 12.8 -15.15 4.4Q-18.15 3.15 -19 0Q-18.15 -3.15 -15.15 -4.4Q-9.9 -12.8 -17.8 -19.6L-17.8 -19.55Q-44.4 -36.05 -65.45 -38.6L-67.5 -38.8Q-72.55 -39.3 -77.25 -38.95L-79.05 -38.75Q-83.7 -38.25 -87.95 -36.95L-88.95 -36.65Q-91.1 -35.55 -92.05 -34.7Q-93.05 -33.9 -92.45 -27.35"
              />
            </g>

            {/* Espina / Spine - Interlocking Burnished Obsidian Ribs with Gold Highlights */}
            <g id="Espina">
              <linearGradient
                id="DragonSpineGrad1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(0.0935974, 0, 0, 0.188782, -20.55, 0)"
                x1="-819.2"
                x2="819.2"
                y1="0"
                y2="0"
              >
                <stop offset="0" style={{ stopColor: "#b58e4d", stopOpacity: 0.98 }} />
                <stop offset="1" style={{ stopColor: "#1d1e27", stopOpacity: 0.92 }} />
              </linearGradient>
              <path
                style={{ fill: "url(#DragonSpineGrad1)" }}
                d="M-18.8,0Q-17.85 -5.7 -12.3 -9.6Q-11.2 -5.35 -6.5 -8.25L-6.45 -8.2L-6.2 -8.3Q1.25 -16.25 6.65 -12.4Q0.05 -12.55 0 -5.95Q2.7 -2.4 7.75 -4.1Q18 -1.45 18.8 0L-18.8 0"
              />
              <linearGradient
                id="DragonSpineGrad2"
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(0.0229492, 0, 0, 0.0152893, 0, -0.05)"
                x1="-819.2"
                x2="819.2"
                y1="0"
                y2="0"
              >
                <stop offset="0" style={{ stopColor: "#b58e4d", stopOpacity: 0.98 }} />
                <stop offset="1" style={{ stopColor: "#1d1e27", stopOpacity: 0.92 }} />
              </linearGradient>
              <path
                style={{ fill: "url(#DragonSpineGrad2)" }}
                d="M18.8,0Q18 1.45 7.75 4.1Q2.7 2.4 0 5.95Q0.05 12.55 6.65 12.4Q1.25 16.25 -6.2 8.35Q-6.35 8.25 -6.45 8.25L-6.5 8.25Q-11.2 5.35 -12.3 9.6Q-17.85 5.7 -18.8 0L18.8 0"
              />
            </g>
          </defs>
          {/* Enhanced atmospheric 3D drop-shadow with subtle golden specular halo for rich tangible presence on light backgrounds */}
          <g
            id="screen"
            style={{
              filter:
                "drop-shadow(0 8px 18px rgba(0, 0, 0, 0.2)) drop-shadow(0 2px 6px rgba(181, 142, 77, 0.22))",
            }}
          />
        </svg>
      </div>

      {/* Custom Right-Click Context Menu - Crisp Ultra-Refined White Card */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            style={{ left: contextMenu.x, top: contextMenu.y }}
            className="fixed z-50 w-60 rounded-2xl border border-black/[0.09] bg-white/95 p-2 shadow-[0_16px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-black/[0.06] mb-1.5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-medium">
                Quick Menu
              </span>
              <span className="text-[9px] uppercase font-mono text-amber-800 font-semibold">
                Nexora
              </span>
            </div>

            {/* Dragon Follower Toggle Option */}
            <button
              type="button"
              data-clickable="true"
              onClick={(e) => {
                e.stopPropagation();
                toggleDragon();
              }}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs text-neutral-800 hover:bg-neutral-100 hover:text-black transition-all group font-medium"
            >
              <div className="flex items-center gap-2.5">
                {dragonEnabled ? (
                  <Eye className="h-4 w-4 text-amber-700" />
                ) : (
                  <EyeOff className="h-4 w-4 text-neutral-400" />
                )}
                <span>Dragon Follower</span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider transition-all ${
                  dragonEnabled
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold"
                    : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                }`}
              >
                {dragonEnabled ? "ON" : "OFF"}
              </span>
            </button>

            <div className="my-1.5 h-[1px] bg-black/[0.06]" />

            {/* Quick Navigation Items */}
            <button
              type="button"
              data-clickable="true"
              onClick={() => handleNavigate("/order")}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-100 hover:text-black transition-all text-left font-medium"
            >
              <Layers className="h-4 w-4 text-amber-700" />
              <span>Start New Order</span>
            </button>

            <button
              type="button"
              data-clickable="true"
              onClick={() => handleNavigate("/dashboard")}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-100 hover:text-black transition-all text-left font-medium"
            >
              <MessageSquare className="h-4 w-4 text-amber-700" />
              <span>My Orders & Chat</span>
            </button>

            <button
              type="button"
              data-clickable="true"
              onClick={() => handleNavigate("/services")}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-100 hover:text-black transition-all text-left font-medium"
            >
              <Compass className="h-4 w-4 text-amber-700" />
              <span>View Services</span>
            </button>

            <div className="my-1.5 h-[1px] bg-black/[0.06]" />

            {/* Utility Options */}
            <button
              type="button"
              data-clickable="true"
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-100 hover:text-black transition-all text-left font-medium"
            >
              <div className="flex items-center gap-2.5">
                {copiedLink ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4 text-neutral-400" />
                )}
                <span>{copiedLink ? "Link Copied!" : "Copy Page Link"}</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">URL</span>
            </button>

            <button
              type="button"
              data-clickable="true"
              onClick={handleScrollTop}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-100 hover:text-black transition-all text-left font-medium"
            >
              <ArrowUp className="h-4 w-4 text-neutral-400" />
              <span>Scroll to Top</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
