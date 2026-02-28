// NOTE: This component is no longer used in the current app architecture.
// Kept for reference. Can be safely deleted.
"use client";

import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
  "Update all figures to reflect 2025 actuals and project for 2026",
  "Refresh market commentary with current economic outlook",
  "Update tax planning section with new Roth conversion data",
  "Rewrite strategy section for conservative tilt",
];

interface SmartSuggestionsProps {
  visible: boolean;
  onSelect: (suggestion: string) => void;
}

export default function SmartSuggestions({ visible, onSelect }: SmartSuggestionsProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-2"
        >
          {/* Section label */}
          <span
            className="text-gold"
            style={{
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              marginBottom: "2px",
            }}
          >
            Henry's Suggestions
          </span>

          {/* Suggestion cards */}
          <div className="flex flex-col gap-1.5">
            {SUGGESTIONS.map((suggestion, i) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                type="button"
                onClick={() => onSelect(suggestion)}
                className="group flex items-start gap-3 text-left rounded-[10px] transition-all duration-200"
                style={{
                  padding: "11px 14px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(201,169,110,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                }}
              >
                <span
                  className="text-gold shrink-0"
                  style={{ fontSize: "13px", marginTop: "1px", opacity: 0.7 }}
                >
                  →
                </span>
                <span className="text-text-secondary" style={{ fontSize: "13px", lineHeight: "1.5" }}>
                  {suggestion}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
