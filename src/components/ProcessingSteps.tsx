// NOTE: This component is no longer used in the current app architecture.
// Kept for reference. Can be safely deleted.
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LEGACY_STEPS = [
  { icon: "⟐", label: "Reading your presentation…" },
  { icon: "⟡", label: "Parsing the supporting documents…" },
  { icon: "⟢", label: "Comparing year-over-year data…" },
  { icon: "◈", label: "Drafting updated slide content…" },
];

interface ProcessingStepsProps {
  onComplete: () => void;
}

export default function ProcessingSteps({ onComplete }: ProcessingStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < LEGACY_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 900);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(finishTimer);
    }
  }, [currentStep, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center h-full"
      style={{ padding: "24px" }}
    >
      <div className="flex flex-col gap-3 w-full" style={{ maxWidth: "320px" }}>
        {LEGACY_STEPS.map((step, i) => {
          const isComplete = i < currentStep;
          const isCurrent = i === currentStep;

          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{
                opacity: isComplete ? 0.4 : isCurrent ? 1 : 0.15,
                x: 0,
              }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="flex items-center gap-3"
            >
              <span
                style={{
                  fontSize: "12px",
                  width: "20px",
                  textAlign: "center",
                  color: isComplete ? "#8BC96E" : isCurrent ? "#C9A96E" : "rgba(255,255,255,0.15)",
                }}
              >
                {isComplete ? "✓" : step.icon}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: isCurrent ? 500 : 400,
                  color: isComplete
                    ? "rgba(255,255,255,0.4)"
                    : isCurrent
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.15)",
                }}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
