"use client";

import { useEffect, useId, useRef, useState } from "react";

// Centerline of the existing ribbon logo: up the left, down the fold, up the right.
const LOGO_PATH = "M164 745 V286 Q164 264 190 264 H274 Q292 264 306 278 L757 650 Q789 680 789 715 V302";
// The main ribbon excludes the image's thin reflected sliver below the diagonal.
// Keep the original image intact, but confine the moving highlight to this surface.
const RIBBON_OUTLINE = "M94 790 V278 C94 237 125 203 164 203 H354 C375 206 392 216 405 231 L718 535 V345 L859 235 V718 C859 758 831 788 789 788 H653 C632 785 617 776 607 758 L615 669 Q568 659 530 626 L278 367 Q250 342 234 334 V677 Z";
const GLINT_DURATION = 1300;
// Broad silver shoulders and a crisp specular core, all measured along the ribbon.
// Layering the reflection along the path lets it bend around both folds of the N.
const GLINT_LAYERS = Array.from({ length: 40 }, (_, index) => {
  const t = (index + 1) / 40;
  const previous = index / 40;
  const coverage = 0.94 * Math.pow(t, 2.4);
  const previousCoverage = 0.94 * Math.pow(previous, 2.4);
  return {
    length: 0.205 - t * 0.183,
    // Compensate for overlapping alpha to produce one smooth reflection.
    opacity: (coverage - previousCoverage) / (1 - previousCoverage),
  };
});

export default function LoadingScreen() {
  const id = useId().replace(/:/g, "");
  const reveal = useRef<SVGPathElement>(null);
  const glint = useRef<SVGGElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let cancelled = false;
    let ready = false;
    let progress = 0;
    let finishAt = 0;
    let audio: AudioContext | undefined;
    let sounded = false;
    const unlockAudio = () => {
      if (cancelled || sounded || reduced.matches || (finishAt && performance.now() - finishAt > GLINT_DURATION)) return;
      try {
        audio ??= new AudioContext();
        void audio.resume().catch(() => {});
      } catch { /* Audio is optional; never delay the reveal. */ }
    };
    const playMetal = (elapsed: number) => {
      if (sounded || !audio || audio.state !== "running" || elapsed > GLINT_DURATION - 100) return;
      sounded = true;
      const time = audio.currentTime;
      const remaining = (GLINT_DURATION - elapsed) / 1000;
      const master = audio.createGain();
      master.gain.value = 0.1; // Requested 10% output volume.
      master.connect(audio.destination);
      // Inharmonic partials give a brushed-metal ping, with a falling shimmer.
      [1, 2.76, 5.4, 8.93].forEach((ratio, index) => {
        const tone = audio!.createOscillator();
        const envelope = audio!.createGain();
        tone.type = "sine";
        tone.frequency.setValueAtTime(620 * ratio, time);
        tone.frequency.exponentialRampToValueAtTime(460 * ratio, time + remaining);
        envelope.gain.setValueAtTime(0, time);
        envelope.gain.linearRampToValueAtTime(0.3 / (index + 1), time + 0.012);
        envelope.gain.exponentialRampToValueAtTime(0.0001, time + remaining);
        tone.connect(envelope); envelope.connect(master);
        tone.start(time); tone.stop(time + remaining + 0.02);
        tone.onended = () => { tone.disconnect(); envelope.disconnect(); };
      });
    };
    const releaseAudio = () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      if (audio && audio.state !== "closed") void audio.close().catch(() => {});
    };
    window.addEventListener("pointerdown", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    // Attempt playback only where the browser already grants autoplay permission.
    unlockAudio();
    const start = performance.now();
    let previous = start;
    const markReady = () => { ready = true; };
    const logo = new Image();
    logo.src = "/64x64.png";
    let removeLoad: (() => void) | undefined;
    const pageReady = document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          window.addEventListener("load", resolveLoad, { once: true });
          function resolveLoad() { resolve(); }
          removeLoad = () => window.removeEventListener("load", resolveLoad);
        });
    // Real readiness gates the finish; the N provides an indeterminate visual beforehand.
    Promise.allSettled([pageReady, document.fonts.ready, logo.decode()]).then(() => {
      if (!cancelled) markReady();
    });
    const animate = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      // Escape a stalled external resource rather than blocking the page indefinitely.
      const canFinish = (ready && now - start > (reduced.matches ? 100 : 950)) || now - start > 6000;
      progress += ((canFinish ? 1 : 0.85) - progress) * (1 - Math.exp(-dt * (canFinish ? 9 : 2)));
      reveal.current?.setAttribute("stroke-dashoffset", String(1 - progress));
      if (canFinish && progress > 0.995 && !finishAt) {
        finishAt = now;
        reveal.current?.setAttribute("stroke-dashoffset", "0");
        setComplete(true);
      }
      if (finishAt) {
        const duration = reduced.matches ? 0 : GLINT_DURATION;
        const elapsed = now - finishAt;
        if (duration) playMetal(elapsed);
        if (glint.current && duration) {
          const t = Math.min(1, elapsed / duration);
          const position = -0.105 + t * 1.21;
          Array.from(glint.current.children).forEach((layer, index) => {
            layer.setAttribute("stroke-dashoffset", String(GLINT_LAYERS[index].length / 2 - position));
          });
          glint.current.style.opacity = String(Math.min(1, t * 16, (1 - t) * 16));
        }
        if (elapsed > duration + 120 && screen.current) screen.current.style.opacity = "0";
        if (elapsed > duration + (reduced.matches ? 160 : 650)) { releaseAudio(); setVisible(false); return; }
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => { cancelled = true; cancelAnimationFrame(frame); removeLoad?.(); releaseAudio(); };
  }, []);

  if (!visible) return null;
  return (
    <div ref={screen} data-loading-screen="" className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f7f6f2] select-none" style={{ transition: "opacity 500ms ease" }}>
      <div role="status" aria-live="polite" className="sr-only">{complete ? "Nexora is ready" : "Loading Nexora"}</div>
      <svg aria-hidden="true" viewBox="0 0 1000 1000" className="h-[160px] w-[160px] sm:h-[185px] sm:w-[185px]">
        <defs>
          <mask id={`${id}-reveal`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
            <path ref={reveal} d={LOGO_PATH} pathLength="1" stroke="white" strokeWidth="210" strokeLinecap="round" fill="none" strokeDasharray="1 1" strokeDashoffset="1" />
          </mask>
          <mask id={`${id}-shape`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000" style={{ maskType: "alpha" }}>
            <image href="/64x64.png" width="1000" height="1000" filter={`url(#${id}-inset)`} />
          </mask>
          <filter id={`${id}-inset`} filterUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000" colorInterpolationFilters="sRGB">
            <feMorphology in="SourceGraphic" operator="erode" radius="2" />
          </filter>
          <clipPath id={`${id}-ribbon`}><path d={RIBBON_OUTLINE} /></clipPath>
        </defs>
        <image href="/64x64.png" width="1000" height="1000" opacity="0.13" />
        <image href="/64x64.png" width="1000" height="1000" mask={complete ? undefined : `url(#${id}-reveal)`} />
        <g mask={`url(#${id}-shape)`} clipPath={`url(#${id}-ribbon)`}>
          <g ref={glint} data-logo-glint="" fill="none" stroke="#fff" strokeWidth="210" strokeLinecap="butt" style={{ opacity: 0 }}>
            {GLINT_LAYERS.map((layer) => (
              <path key={layer.length} d={LOGO_PATH} pathLength="1" strokeDasharray={`${layer.length} 2`} strokeDashoffset={layer.length / 2 + 0.105} opacity={layer.opacity} />
            ))}
          </g>
        </g>
      </svg>
      <div aria-hidden="true" className="-mt-3 text-[10px] tracking-[0.42em] text-neutral-500">NEXORA SOLUTIONS</div>
    </div>
  );
}
