"use client";

import { useEffect } from "react";

export default function ClientShield() {
  useEffect(() => {
    // 1. Prevent Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Prevent Developer Tool shortcuts & Inspection combinations
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const code = e.code;
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      // F12
      if (key === "f12" || code === "F12") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+I / Cmd+Option+I (Inspect)
      // Ctrl+Shift+J / Cmd+Option+J (Console)
      // Ctrl+Shift+C / Cmd+Option+C (Element picker)
      if (
        (isCtrlOrMeta && e.shiftKey && (key === "i" || key === "j" || key === "c")) ||
        (e.altKey && isCtrlOrMeta && (key === "i" || key === "j" || key === "c"))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U (View Source)
      if (isCtrlOrMeta && key === "u") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+S / Cmd+S (Save Page)
      if (isCtrlOrMeta && key === "s") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+P / Cmd+P (Print Page)
      if (isCtrlOrMeta && key === "p") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 3. DevTools Active Detection & Throttling Trap
    let devtoolsOpen = false;
    const threshold = 160;

    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;

      if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          // Clear console immediately
          console.clear();
        }
      } else {
        devtoolsOpen = false;
      }
    };

    window.addEventListener("contextmenu", handleContextMenu, { capture: true });
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    const interval = setInterval(checkDevTools, 1000);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      clearInterval(interval);
    };
  }, []);

  return null;
}
