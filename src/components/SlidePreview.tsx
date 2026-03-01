"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { clientData } from "@/data/lucyData";

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface SlidePreviewPanelProps {
  activeSlideId: number | null;
  updatedSlideIds: Set<number>;
  mentionedSlideId: number | null;
  onSlideClick?: (slideId: number) => void;
}

interface SlideThumbnailProps {
  slide: (typeof clientData.slides)[number];
  isActive: boolean;
  isUpdated: boolean;
  isMentioned: boolean;
  onClick?: () => void;
}

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════

const PYRAMID_TIERS = [
  { tier: "estate", label: "Estate", color: "#8CB8C4", width: 30 },
  { tier: "retirement", label: "Retirement", color: "#5B9BAD", width: 45 },
  { tier: "taxable", label: "Taxable", color: "#4A8FA0", width: 58 },
  { tier: "protection", label: "Protection", color: "#2D6579", width: 70 },
  { tier: "cash", label: "Cash Reserve", color: "#1B3A4B", width: 80 },
] as const;

/** Maps tier name to its vertical position (0 = top, 4 = bottom) */
const TIER_INDEX: Record<string, number> = {
  estate: 0,
  retirement: 1,
  taxable: 2,
  protection: 3,
  cash: 4,
  goals: 0, // goals uses estate position
};

const TIER_COLORS: Record<string, string> = {
  estate: "#8CB8C4",
  retirement: "#5B9BAD",
  taxable: "#4A8FA0",
  protection: "#2D6579",
  cash: "#1B3A4B",
  goals: "#C9A96E",
};

// ═══════════════════════════════════════════════════════════════
// Mini Pyramid — reusable CSS pyramid for thumbnails
// ═══════════════════════════════════════════════════════════════

function MiniPyramid({
  height = 54,
  highlightTier,
  className = "",
}: {
  height?: number;
  highlightTier?: string;
  className?: string;
}) {
  const tierHeight = height / PYRAMID_TIERS.length;

  return (
    <div
      className={`flex flex-col items-center ${className}`}
      style={{ height, gap: 1 }}
    >
      {PYRAMID_TIERS.map((t) => {
        const isHighlighted = highlightTier === t.tier;
        return (
          <div
            key={t.tier}
            style={{
              width: `${t.width}%`,
              height: tierHeight - 1,
              backgroundColor: t.color,
              borderRadius: 1,
              opacity: highlightTier && !isHighlighted ? 0.4 : 1,
              transition: "opacity 200ms ease",
            }}
          />
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Individual Slide Content Renderers
// ═══════════════════════════════════════════════════════════════

/** Slide 1 — Work Area / internal */
function SlideInternal() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full rounded-sm"
      style={{ backgroundColor: "#f5f5f5" }}>
      <div className="flex flex-col items-center gap-[3px]" style={{ marginTop: -4 }}>
        <div className="rounded-[1px]" style={{ width: "55%", height: 3, backgroundColor: "#bbb" }} />
        <div className="rounded-[1px]" style={{ width: "42%", height: 2, backgroundColor: "#ccc" }} />
        <div className="rounded-[1px]" style={{ width: "48%", height: 2, backgroundColor: "#ccc" }} />
      </div>
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, backgroundColor: "#5B9BAD" }} />
    </div>
  );
}

/** Slide 2 — Welcome */
function SlideWelcome() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative"
      style={{ backgroundColor: "#fff" }}>
      <span className="font-bold tracking-wide"
        style={{ fontSize: 6, color: "#333", letterSpacing: "1.5px" }}>
        WELCOME
      </span>
      <div className="rounded-[1px] mt-[3px]" style={{ width: "35%", height: 2, backgroundColor: "#ccc" }} />
      <div className="absolute left-0 right-0" style={{ bottom: 6, height: 1.5, backgroundColor: "#5B9BAD", marginLeft: "15%", marginRight: "15%" }} />
      <span className="absolute font-bold" style={{ bottom: 3, right: 6, fontSize: 5, color: "#C9A96E" }}>CW</span>
    </div>
  );
}

/** Slide 3 — Pyramid overview */
function SlidePyramidOverview() {
  return (
    <div className="flex flex-col items-center h-full w-full"
      style={{ backgroundColor: "#fff" }}>
      <div className="rounded-[1px] mt-[6px]" style={{ width: "40%", height: 2, backgroundColor: "#999" }} />
      <div className="flex-1 flex items-center justify-center w-full">
        <MiniPyramid height={46} className="w-3/4" />
      </div>
    </div>
  );
}

/** Slides 4-9 — Pyramid detail with callout */
function SlidePyramidDetail({ tier }: { tier: string }) {
  const tierIdx = TIER_INDEX[tier] ?? 0;
  const color = TIER_COLORS[tier] ?? "#5B9BAD";
  // Position the callout rectangle vertically based on tier index
  // tierIdx 0 = top (8%), 4 = bottom (72%)
  const topPercent = 12 + tierIdx * 15;

  return (
    <div className="flex h-full w-full relative"
      style={{ backgroundColor: "#fff" }}>
      {/* Pyramid on the left */}
      <div className="flex items-center" style={{ width: "45%", paddingLeft: "8%" }}>
        <MiniPyramid height={40} highlightTier={tier === "goals" ? undefined : tier} className="w-full" />
      </div>
      {/* Callout rectangle on the right */}
      <div className="absolute rounded-[2px]"
        style={{
          right: "10%",
          top: `${topPercent}%`,
          width: "35%",
          height: 14,
          backgroundColor: color,
          opacity: 0.85,
        }}
      />
      {/* Small lines below the callout for "content" */}
      <div className="absolute flex flex-col gap-[2px]"
        style={{ right: "12%", top: `${topPercent + 22}%` }}>
        <div style={{ width: 28, height: 1.5, backgroundColor: "#ddd", borderRadius: 1 }} />
        <div style={{ width: 22, height: 1.5, backgroundColor: "#e5e5e5", borderRadius: 1 }} />
      </div>
    </div>
  );
}

/** Slide 10 — Life Stages */
function SlideLifeStages() {
  const circles = [
    { size: 12, x: 35, y: 30, opacity: 0.25 },
    { size: 18, x: 55, y: 45, opacity: 0.2 },
    { size: 10, x: 25, y: 55, opacity: 0.3 },
    { size: 15, x: 65, y: 60, opacity: 0.22 },
    { size: 8, x: 45, y: 70, opacity: 0.28 },
  ];

  return (
    <div className="relative h-full w-full" style={{ backgroundColor: "#fff" }}>
      {/* Title */}
      <div className="rounded-[1px] absolute" style={{ top: 6, left: "20%", width: "60%", height: 2, backgroundColor: "#999" }} />
      {/* Green arrow on left */}
      <div className="absolute"
        style={{
          left: "8%",
          top: "40%",
          width: 0,
          height: 0,
          borderTop: "6px solid transparent",
          borderBottom: "6px solid transparent",
          borderLeft: "8px solid #8BC96E",
          opacity: 0.6,
        }}
      />
      {/* Scattered circles */}
      {circles.map((c, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: c.size,
            height: c.size,
            left: `${c.x}%`,
            top: `${c.y}%`,
            backgroundColor: "#6EAAC9",
            opacity: c.opacity,
          }}
        />
      ))}
    </div>
  );
}

/** Slide 11 — Ratios */
function SlideRatios() {
  const rows = [
    { color: "#8BC96E" },
    { color: "#D4A054" },
    { color: "#D4C854" },
    { color: "#8BC96E" },
  ];

  return (
    <div className="relative h-full w-full flex flex-col" style={{ backgroundColor: "#fff" }}>
      <div className="rounded-[1px] mt-[6px] mx-auto" style={{ width: "50%", height: 2, backgroundColor: "#999" }} />
      <div className="flex-1 flex flex-col justify-center gap-[6px] px-[12%]">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-[4px]">
            <div className="rounded-full shrink-0" style={{ width: 4, height: 4, backgroundColor: r.color }} />
            <div className="rounded-[1px]" style={{ flex: 1, height: 2, backgroundColor: "#e0e0e0" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Slide 12 — Action Items */
function SlideActionItems() {
  const dots = ["#8BC96E", "#D4A054", "#C96E6E", "#8BC96E", "#D4A054", "#8BC96E", "#C96E6E", "#8BC96E"];

  return (
    <div className="relative h-full w-full flex flex-col" style={{ backgroundColor: "#fff" }}>
      <div className="rounded-[1px] mt-[6px] mx-auto" style={{ width: "45%", height: 2, backgroundColor: "#999" }} />
      <div className="flex-1 flex flex-col justify-center gap-[3px] px-[10%]">
        {dots.map((color, i) => (
          <div key={i} className="flex items-center gap-[3px]">
            <div className="rounded-full shrink-0" style={{ width: 3, height: 3, backgroundColor: color }} />
            <div className="rounded-[1px]" style={{ width: `${55 + (i % 3) * 10}%`, height: 1.5, backgroundColor: "#e8e8e8" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Slide 13 — Closing */
function SlideClosing() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full"
      style={{ backgroundColor: "#f8f8f8" }}>
      <span className="font-bold" style={{ fontSize: 10, color: "#5B9BAD", letterSpacing: "1px" }}>
        CW
      </span>
      <div className="rounded-[1px] mt-[3px]" style={{ width: "30%", height: 1.5, backgroundColor: "#ccc" }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Slide Content Router
// ═══════════════════════════════════════════════════════════════

function SlideContent({ slide }: { slide: (typeof clientData.slides)[number] }) {
  switch (slide.type) {
    case "internal":
      return <SlideInternal />;
    case "welcome":
      return <SlideWelcome />;
    case "pyramid-overview":
      return <SlidePyramidOverview />;
    case "pyramid-detail":
      return <SlidePyramidDetail tier={slide.tier ?? "cash"} />;
    case "life-stages":
      return <SlideLifeStages />;
    case "ratios":
      return <SlideRatios />;
    case "action-items":
      return <SlideActionItems />;
    case "closing":
      return <SlideClosing />;
    default:
      return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// SlideThumbnail
// ═══════════════════════════════════════════════════════════════

export function SlideThumbnail({
  slide,
  isActive,
  isUpdated,
  isMentioned,
  onClick,
}: SlideThumbnailProps) {
  const [wasJustUpdated, setWasJustUpdated] = useState(false);
  const prevUpdated = useRef(isUpdated);

  // Detect when a slide transitions from not-updated to updated
  useEffect(() => {
    if (isUpdated && !prevUpdated.current) {
      setWasJustUpdated(true);
      const timer = setTimeout(() => setWasJustUpdated(false), 800);
      return () => clearTimeout(timer);
    }
    prevUpdated.current = isUpdated;
  }, [isUpdated]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative rounded-lg overflow-hidden cursor-pointer
        transition-all duration-200 ease-out
        aspect-video
        ${isActive
          ? "border-2 border-[#C9A96E] ring-1 ring-[#C9A96E]/30 scale-[1.02]"
          : "border border-white/10 hover:border-white/20"
        }
        ${isMentioned ? "animate-slide-mention" : ""}
      `}
      style={{
        boxShadow: isActive
          ? "0 0 12px rgba(201,169,110,0.15)"
          : "0 1px 3px rgba(0,0,0,0.2)",
      }}
    >
      {/* Slide content area */}
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        <SlideContent slide={slide} />
      </div>

      {/* Needs-update indicator (orange dot) — hidden when updated */}
      {slide.needsUpdate && !isUpdated && (
        <div
          className={`
            absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-400
            transition-all duration-300
            ${wasJustUpdated ? "scale-0 opacity-0" : "scale-100 opacity-100"}
          `}
        />
      )}

      {/* Updated checkmark (green) — replaces orange dot */}
      {isUpdated && (
        <div
          className={`
            absolute top-1 right-1 w-3.5 h-3.5 rounded-full
            bg-green/90 flex items-center justify-center
            ${wasJustUpdated ? "animate-check-pop" : ""}
          `}
        >
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="text-white">
            <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Slide number */}
      <span className="absolute bottom-1 left-1.5 text-[8px] text-gray-400 font-medium leading-none"
        style={{ textShadow: "0 0 3px rgba(0,0,0,0.5)" }}>
        {slide.id}
      </span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// SlidePreviewPanel
// ═══════════════════════════════════════════════════════════════

export function SlidePreviewPanel({
  activeSlideId,
  updatedSlideIds,
  mentionedSlideId,
  onSlideClick,
}: SlidePreviewPanelProps) {
  const slides = clientData.slides;

  const needsUpdateCount = useMemo(() => {
    return slides.filter((s) => s.needsUpdate && !updatedSlideIds.has(s.id)).length;
  }, [slides, updatedSlideIds]);

  const allUpdated = useMemo(() => {
    return slides.filter((s) => s.needsUpdate).every((s) => updatedSlideIds.has(s.id));
  }, [slides, updatedSlideIds]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Header ── */}
      <div className="shrink-0 px-5 pt-5 pb-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-[15px] text-text-primary tracking-tight">
            Lucy C — Annual Review
          </h2>
          <span className="text-[11px] text-text-muted">
            {slides.length} slides
          </span>
        </div>

        {/* Update status */}
        <div className="flex items-center gap-1.5 mt-1.5">
          {allUpdated ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-green" />
              <span className="text-[11px] text-green font-medium">
                All slides updated &#10003;
              </span>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span className="text-[11px] text-text-secondary">
                {needsUpdateCount} slide{needsUpdateCount !== 1 ? "s" : ""} need{needsUpdateCount === 1 ? "s" : ""} updates
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── Thumbnail Grid ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5">
        {/* Desktop: 2-column grid | Mobile: horizontal scroll */}
        <div className="grid grid-cols-2 gap-3 max-md:flex max-md:flex-nowrap max-md:overflow-x-auto max-md:gap-3 max-md:pb-2">
          {slides.map((slide) => (
            <div key={slide.id} className="max-md:shrink-0 max-md:w-[160px]">
              <SlideThumbnail
                slide={slide}
                isActive={activeSlideId === slide.id}
                isUpdated={updatedSlideIds.has(slide.id)}
                isMentioned={mentionedSlideId === slide.id}
                onClick={() => onSlideClick?.(slide.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Keyframe styles (injected once) ── */}
      <style>{`
        @keyframes slide-mention {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,169,110,0); }
          30% { box-shadow: 0 0 0 4px rgba(201,169,110,0.35); }
          60% { box-shadow: 0 0 0 2px rgba(201,169,110,0.15); }
        }
        .animate-slide-mention {
          animation: slide-mention 600ms ease-out;
        }

        @keyframes check-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-check-pop {
          animation: check-pop 400ms ease-out;
        }
      `}</style>
    </div>
  );
}

export default SlidePreviewPanel;
