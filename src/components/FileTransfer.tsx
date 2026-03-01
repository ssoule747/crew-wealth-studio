"use client";

import { useEffect, useState } from "react";

interface FileTransferProps {
  active: boolean;
  startRef?: React.RefObject<HTMLElement | null>;
  endRef?: React.RefObject<HTMLElement | null>;
  onLanded?: () => void;
  onComplete?: () => void;
}

export default function FileTransfer({ active, startRef, endRef, onLanded, onComplete }: FileTransferProps) {
  const [animating, setAnimating] = useState(false);
  const [positions, setPositions] = useState<{
    startX: number; startY: number; endX: number; endY: number;
  } | null>(null);

  useEffect(() => {
    if (active && startRef?.current && endRef?.current) {
      // Reduced motion: skip animation, fire callbacks immediately
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onLanded?.();
        onComplete?.();
        return;
      }

      const sr = startRef.current.getBoundingClientRect();
      const er = endRef.current.getBoundingClientRect();

      setPositions({
        startX: sr.left + sr.width / 2 - 16,
        startY: sr.top,
        endX: er.left + er.width / 2 - 16,
        endY: er.top + er.height / 2 - 20,
      });
      setAnimating(true);

      const landTimer = setTimeout(() => onLanded?.(), 1000);
      const doneTimer = setTimeout(() => {
        setAnimating(false);
        setPositions(null);
        onComplete?.();
      }, 1200);

      return () => { clearTimeout(landTimer); clearTimeout(doneTimer); };
    }
  }, [active]);

  if (!animating || !positions) return null;

  const cssVars = {
    "--start-x": `${positions.startX}px`,
    "--start-y": `${positions.startY}px`,
    "--end-x": `${positions.endX}px`,
    "--end-y": `${positions.endY}px`,
  } as React.CSSProperties;

  return (
    <>
      <style>{`
        @keyframes fly-to-folder {
          0%   { left: var(--start-x); top: var(--start-y);
                 transform: scale(1) rotate(0deg) translateY(0); opacity: 0; }
          8%   { opacity: 1; }
          20%  { transform: scale(1.1) rotate(-2deg) translateY(0); }
          50%  { left: calc((var(--start-x) + var(--end-x)) / 2);
                 top: calc((var(--start-y) + var(--end-y)) / 2);
                 transform: scale(0.95) rotate(-5deg) translateY(-50px); }
          80%  { transform: scale(0.8) rotate(-2deg) translateY(0); }
          100% { left: var(--end-x); top: var(--end-y);
                 transform: scale(0.6) rotate(0deg) translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Flying file icon */}
      <div
        className="fixed z-[200] pointer-events-none"
        style={{ ...cssVars, left: positions.startX, top: positions.startY,
          animation: "fly-to-folder 1s cubic-bezier(0.34,1.56,0.64,1) forwards",
          willChange: "transform, left, top" }}
      >
        <div className="w-8 h-10 rounded-md relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #C9A96E, #A8884A)",
            boxShadow: "0 4px 16px rgba(201,169,110,0.4)" }}>
          <div className="absolute top-0 right-0 w-2.5 h-2.5"
            style={{ background: "linear-gradient(225deg, #0C0B0F 50%, #8B7340 50%)" }} />
          <div className="absolute bottom-2 left-1.5 right-1.5 space-y-1">
            <div className="h-[1.5px] bg-white/40 rounded w-full" />
            <div className="h-[1.5px] bg-white/30 rounded w-3/4" />
            <div className="h-[1.5px] bg-white/20 rounded w-5/6" />
          </div>
        </div>
      </div>

      {/* Blurred trail */}
      <div
        className="fixed z-[199] pointer-events-none"
        style={{ ...cssVars, left: positions.startX, top: positions.startY,
          animation: "fly-to-folder 1s cubic-bezier(0.34,1.56,0.64,1) forwards",
          animationDelay: "50ms", willChange: "transform, left, top",
          opacity: 0.3, filter: "blur(8px)" }}
      >
        <div className="w-8 h-10 rounded-md bg-[#C9A96E]" />
      </div>
    </>
  );
}
