// NOTE: This component is no longer used in the current app architecture.
// Kept for reference. Can be safely deleted.
"use client";

import { motion } from "framer-motion";

interface InstructionInputProps {
  value: string;
  onChange: (value: string) => void;
  hasFiles: boolean;
  onSubmit: () => void;
}

export default function InstructionInput({
  value,
  onChange,
  hasFiles,
  onSubmit,
}: InstructionInputProps) {
  const canSubmit = hasFiles && value.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.04)",
        borderRadius: "12px",
        padding: "12px",
      }}>
        <div className="flex gap-2 items-end">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Describe what you want to update..."
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canSubmit) {
                e.preventDefault();
                onSubmit();
              }
            }}
            className="flex-1 resize-none rounded-[8px] text-text-primary placeholder:text-text-ghost outline-none transition-colors duration-200 focus:border-border-hover"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "10px 12px",
              fontSize: "13px",
              lineHeight: "1.5",
              fontFamily: "inherit",
              maxHeight: "80px",
            }}
          />
          <button
            type="button"
            onClick={canSubmit ? onSubmit : undefined}
            disabled={!canSubmit}
            className="shrink-0 rounded-[8px]"
            style={{
              padding: "10px 16px",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "inherit",
              background: canSubmit
                ? "linear-gradient(135deg, #C9A96E 0%, #8B7340 100%)"
                : "rgba(255,255,255,0.04)",
              color: canSubmit ? "#0C0B0F" : "rgba(255,255,255,0.25)",
              border: canSubmit
                ? "1px solid rgba(201,169,110,0.3)"
                : "1px solid rgba(255,255,255,0.06)",
              cursor: canSubmit ? "pointer" : "not-allowed",
              opacity: canSubmit ? 1 : 0.3,
              transition: "all 200ms",
              ...(canSubmit ? {} : { pointerEvents: "none" as const }),
            }}
            onMouseEnter={(e) => {
              if (canSubmit) {
                (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)";
            }}
          >
            Update Deck →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
