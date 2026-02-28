// NOTE: This component is no longer used in the current app architecture.
// Kept for reference. Can be safely deleted.
"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { UpdatedSlide } from "@/lib/mockData";

interface UpdatedSlideCardProps {
  slide: UpdatedSlide;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function UpdatedSlideCard({ slide, index, isSelected, onClick }: UpdatedSlideCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="w-full text-left rounded-[10px] transition-all duration-200"
      style={{
        padding: "12px 16px",
        background: isSelected ? "rgba(201,169,110,0.06)" : "rgba(255,255,255,0.02)",
        border: isSelected
          ? "1px solid rgba(201,169,110,0.3)"
          : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-start gap-3 relative">
        {/* Slide number */}
        <span
          className="font-serif shrink-0"
          style={{
            fontSize: "14px",
            lineHeight: "20px",
            width: "20px",
            color: "rgba(255,255,255,0.15)",
          }}
        >
          {slide.number}
        </span>

        {/* Accent bar */}
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
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <span
            style={{
              fontSize: "12px",
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {slide.title}
          </span>
          <span
            style={{
              fontSize: "11px",
              lineHeight: "1.5",
              color: "rgba(255,255,255,0.3)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {slide.content}
          </span>

          {/* Expanded changelog */}
          <AnimatePresence>
            {isSelected && slide.changes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-1.5 overflow-hidden"
                style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                {slide.changes.map((change) => (
                  <div key={change} className="flex items-start gap-2">
                    <span className="shrink-0" style={{ fontSize: "10px", color: "#8BC96E", marginTop: "3px" }}>●</span>
                    <span style={{ fontSize: "11.5px", lineHeight: "1.5", color: "rgba(255,255,255,0.5)" }}>
                      {change}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* UPDATED badge */}
        {slide.status === "updated" && (
          <span
            className="shrink-0"
            style={{
              fontSize: "8px",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "#8BC96E",
              background: "rgba(139,201,110,0.1)",
              padding: "2px 6px",
              borderRadius: "4px",
              lineHeight: "1",
            }}
          >
            Updated
          </span>
        )}
      </div>
    </motion.button>
  );
}
