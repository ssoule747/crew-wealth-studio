"use client";

import { useState, useEffect, useMemo } from "react";

interface ScanAnimationProps {
  active: boolean;
}

const KEYFRAMES = `
@keyframes scan-sweep {
  0% { top: 0%; opacity: 0; }
  5% { opacity: 1; }
  90% { opacity: 1; }
  95% { opacity: 0; }
  100% { top: 100%; opacity: 0; }
}
@keyframes float-down {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: var(--particle-opacity); }
  90% { opacity: var(--particle-opacity); }
  100% { transform: translateY(var(--travel)) translateX(var(--drift)); opacity: 0; }
}
@keyframes status-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}
`;

const STATUS_TEXTS = ["Reading portfolio data...", "Mapping updates to slides..."];

export default function ScanAnimation({ active }: ScanAnimationProps) {
  const [shouldRender, setShouldRender] = useState(active);
  const [isFading, setIsFading] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Generate particles only after mount to avoid hydration mismatch
  const [particles] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      size: 2 + Math.random() * 2,
      opacity: 0.15 + Math.random() * 0.25,
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 4,
      drift: -15 + Math.random() * 30,
    }))
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (active) {
      setShouldRender(true);
      setIsFading(false);
    } else if (shouldRender) {
      setIsFading(true);
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [active]);

  // Cycle status text every 3s
  useEffect(() => {
    if (!shouldRender) return;
    const interval = setInterval(() => setStatusIndex((i) => (i + 1) % STATUS_TEXTS.length), 3000);
    return () => clearInterval(interval);
  }, [shouldRender]);

  const prefersReducedMotion =
    mounted && typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!shouldRender || !mounted) return null;

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <style>{KEYFRAMES}</style>

      {!prefersReducedMotion && (
        <>
          {/* Scan Line */}
          <div
            className="absolute left-0 right-0 h-0.5 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.4) 20%, rgba(201,169,110,0.8) 50%, rgba(201,169,110,0.4) 80%, transparent 100%)",
              boxShadow: "0 0 8px rgba(201,169,110,0.3), 0 0 20px rgba(201,169,110,0.15)",
              animation: "scan-sweep 4s ease-in-out infinite",
            }}
          />

          {/* Data Stream Particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-[#C9A96E] pointer-events-none"
              style={
                {
                  left: p.left,
                  top: "-4px",
                  width: p.size,
                  height: p.size,
                  animation: `float-down ${p.duration}s ${p.delay}s ease-in infinite`,
                  "--particle-opacity": p.opacity,
                  "--drift": `${p.drift}px`,
                  "--travel": "500px",
                } as React.CSSProperties
              }
            />
          ))}
        </>
      )}

      {/* Status Text */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <span
          className="text-[11px] text-text-muted"
          style={{ animation: "status-pulse 2s ease-in-out infinite" }}
        >
          {STATUS_TEXTS[statusIndex]}
        </span>
      </div>
    </div>
  );
}
