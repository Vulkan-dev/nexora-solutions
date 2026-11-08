"use client";

import React, { useEffect, useState } from "react";
import DragonFollower from "./DragonFollower";
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
        !window.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    try {
      const savedPref = localStorage.getItem("nexora_dragon_enabled") ?? localStorage.getItem("radiant_dragon_enabled");
      if (savedPref !== null) setDragonEnabled(savedPref === "true");
    } catch { /* Storage can be unavailable in private browsing. */ }

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

  // Complete exclusion on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <>
      <DragonFollower enabled={dragonEnabled} />

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
