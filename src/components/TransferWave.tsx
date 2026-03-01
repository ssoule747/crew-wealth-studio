"use client";

import { useEffect, useState, useRef } from "react";

interface TransferWaveProps {
  active: boolean;
  onComplete?: () => void;
}

export default function TransferWave({ active, onComplete }: TransferWaveProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (active) {
      setShouldRender(true);
      timerRef.current = setTimeout(() => {
        setShouldRender(false);
        onComplete?.();
      }, 2000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, onComplete]);

  if (!shouldRender) return null;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes sweep-across {
          0% { left: -200px; }
          100% { left: calc(100% + 200px); }
        }
        @keyframes sweep-line {
          0% { left: -2px; }
          100% { left: calc(100% + 200px); }
        }
      `}</style>
      <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 bottom-0"
          style={{
            width: "200px",
            background: `linear-gradient(90deg,
              transparent 0%,
              rgba(201, 169, 110, 0.03) 15%,
              rgba(201, 169, 110, 0.08) 30%,
              rgba(201, 169, 110, 0.15) 45%,
              rgba(201, 169, 110, 0.25) 55%,
              rgba(201, 169, 110, 0.15) 65%,
              rgba(201, 169, 110, 0.08) 78%,
              rgba(201, 169, 110, 0.03) 88%,
              transparent 100%
            )`,
            animation: "sweep-across 1.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
            willChange: "transform",
          }}
        />
        <div
          className="absolute top-0 bottom-0"
          style={{
            width: "2px",
            background: "rgba(201, 169, 110, 0.6)",
            boxShadow: "0 0 12px rgba(201, 169, 110, 0.4), 0 0 24px rgba(201, 169, 110, 0.2)",
            animation: "sweep-line 1.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
            willChange: "transform",
          }}
        />
      </div>
    </>
  );
}
