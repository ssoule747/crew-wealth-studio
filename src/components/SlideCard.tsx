// NOTE: This component is no longer used in the current app architecture.
// Kept for reference. Can be safely deleted.
"use client";

import { motion } from "framer-motion";
import type { MockSlide } from "@/lib/mockData";

interface SlideCardProps {
  slide: MockSlide;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function SlideCard({ slide, index, isSelected, onClick }: SlideCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="w-full text-left rounded-[10px] transition-all duration-200 group"
      style={{
        padding: "12px 16px",
        background: isSelected ? "rgba(201,169,110,0.06)" : "rgba(255,255,255,0.02)",
        border: isSelected
          ? "1px solid rgba(201,169,110,0.3)"
          : "1px solid rgba(255,255,255,0.05)",
      }}
      whileHover={{
        backgroundColor: isSelected
          ? "rgba(201,169,110,0.08)"
          : "rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Slide number */}
        <span
          className="font-serif text-text-ghost shrink-0"
          style={{ fontSize: "14px", lineHeight: "20px", width: "20px" }}
        >
          {slide.number}
        </span>

        {/* Colored accent bar */}
        <div
          className="shrink-0 rounded-full"
          style={{
            width: "3px",
            height: "16px",
            marginTop: "2px",
            background: slide.accentColor,
            opacity: isSelected ? 1 : 0.5,
            transition: "opacity 200ms",
          }}
        />

        {/* Content */}
        <div className="flex flex-col gap-1 min-w-0">
          <span
            className="text-text-primary"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              lineHeight: "18px",
            }}
          >
            {slide.title}
          </span>
          <span
            className="text-text-muted"
            style={{
              fontSize: "11px",
              lineHeight: "1.5",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {slide.content}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
