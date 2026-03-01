"use client";

import { useEffect, useCallback } from "react";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DemoModal({ open, onClose }: DemoModalProps) {
  // Close on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_200ms_ease]" />

      {/* Card */}
      <div
        className="relative bg-[#1a1a1f] rounded-2xl max-w-[480px] w-full p-8 border border-[#C9A96E]/20 animate-[modalIn_200ms_ease_both]"
        style={{ boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A96E]/20 to-[#8B7340]/20 border border-[#C9A96E]/20 flex items-center justify-center">
            <span className="text-[#C9A96E] text-xl">✨</span>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-center text-lg font-semibold text-white mb-4">
          This is where the magic satisfies
        </h2>

        {/* Body */}
        <p className="text-sm text-white/60 leading-relaxed text-center mb-6">
          In the full version of Henry, this download would contain your fully updated Keynote — every slide refreshed with the latest data, ratios recalculated, and action items rolled forward. Building that engine is part of the development phase and takes fine-tuning to get just right. What you&apos;re seeing here is how the experience will feel.
        </p>

        {/* Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 rounded-lg font-semibold text-sm text-[#0C0B0F] bg-gradient-to-br from-[#C9A96E] to-[#A8884A] hover:brightness-110 active:scale-[0.97] transition-all md:w-auto w-full"
          >
            Got it
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
