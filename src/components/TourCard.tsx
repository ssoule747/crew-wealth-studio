"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTour } from "./TourProvider";

const TOTAL_STEPS = 5;

interface TourStep {
  step: number;
  title: string;
  body: string;
  typeThis?: string;
  position: "center" | "top-left" | "bottom-left" | "bottom-right" | "right" | "left";
  arrowDirection?: "up" | "down" | "left" | "right";
  primaryButton?: string;
  showSkip?: boolean;
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: "Load Client Files",
    body: "In the real app, you'd drag and drop last year's Keynote plus any new financial data. For this demo, click the button below to load sample Henderson client files.",
    position: "bottom-left",
    arrowDirection: "up",
    primaryButton: "Next →",
    showSkip: true,
  },
  {
    step: 2,
    title: "Tell Henry What to Change",
    body: "Type your instructions in plain English. Henry understands context — you can be specific or general. Try this:",
    typeThis: "Update all the financial figures to reflect 2025 actuals and refresh the market commentary for the new year",
    position: "top-left",
    arrowDirection: "down",
    primaryButton: "Next →",
    showSkip: true,
  },
  {
    step: 3,
    title: "Henry is Working",
    body: "Henry reads through the Keynote, analyzes your financial data, cross-references year-over-year changes, and writes updated content. In the real app, this takes 15-30 seconds.",
    position: "right",
    arrowDirection: "left",
    primaryButton: "Next →",
    showSkip: true,
  },
  {
    step: 4,
    title: "Review the Changes",
    body: "Henry shows you a summary of every change and a preview of the updated deck. Accept it, or request further changes — try either button, or type a follow-up like:",
    typeThis: "Make the market commentary more conservative and cautious in tone",
    position: "right",
    arrowDirection: "left",
    primaryButton: "Next →",
    showSkip: true,
  },
  {
    step: 5,
    title: "Your Updated Presentation",
    body: "The approved deck is ready for download. In the production app on your Mac Mini, 'Open in Keynote' launches the file directly. You can always request more changes.",
    position: "right",
    arrowDirection: "left",
    primaryButton: "Finish Tour ✓",
    showSkip: false,
  },
];

interface TourCardProps {
  onFillInput?: (text: string) => void;
}

export default function TourCard({ onFillInput }: TourCardProps) {
  const {
    currentStep,
    isTourActive,
    skipTour,
    isAutoPlaying,
    isPerformingAction,
    performStepAction,
    startAutoPlay,
    pauseAutoPlay,
  } = useTour();
  const [copied, setCopied] = useState(false);

  const stepData = TOUR_STEPS.find((s) => s.step === currentStep);

  useEffect(() => {
    setCopied(false);
  }, [currentStep]);

  // Escape to skip
  useEffect(() => {
    if (!isTourActive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipTour();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isTourActive, skipTour]);

  const handleTypeThisClick = useCallback(() => {
    if (!stepData?.typeThis) return;
    onFillInput?.(stepData.typeThis);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [stepData, onFillInput]);

  const handlePrimaryClick = useCallback(async () => {
    if (isPerformingAction) return; // Prevent double-clicks
    await performStepAction();
  }, [performStepAction, isPerformingAction]);

  if (!isTourActive || !stepData) return null;

  const getPositionStyle = (): React.CSSProperties => {
    switch (stepData.position) {
      case "center":
        return { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
      case "bottom-left":
        return { position: "fixed", top: "180px", left: "60px" };
      case "top-left":
        return { position: "fixed", bottom: "120px", left: "60px" };
      case "right":
        return { position: "fixed", top: "50%", left: "calc(50% - 180px)", transform: "translateY(-50%)" };
      case "left":
        return { position: "fixed", top: "50%", right: "60px", transform: "translateY(-50%)" };
      default:
        return { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
  };

  const renderArrow = () => {
    if (!stepData.arrowDirection) return null;
    const styles: Record<string, React.CSSProperties> = {
      up: { position: "absolute", top: "-8px", left: "40px", width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "8px solid rgba(201,169,110,0.25)" },
      down: { position: "absolute", bottom: "-8px", left: "40px", width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid rgba(201,169,110,0.25)" },
      left: { position: "absolute", left: "-8px", top: "30px", width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: "8px solid rgba(201,169,110,0.25)" },
      right: { position: "absolute", right: "-8px", top: "30px", width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderLeft: "8px solid rgba(201,169,110,0.25)" },
    };
    return <div style={styles[stepData.arrowDirection]} />;
  };

  return (
    <>
      {/* Dim overlay — pointer-events none so highlighted elements stay interactive */}
      {/* During auto-play, overlay becomes clickable to pause */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={isAutoPlaying ? () => pauseAutoPlay() : undefined}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 998,
          pointerEvents: isAutoPlaying ? "auto" : "none",
          cursor: isAutoPlaying ? "pointer" : "default",
        }}
      />

      {/* Tour card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`tour-step-${currentStep}`}
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -4 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            ...getPositionStyle(),
            zIndex: 1001,
            maxWidth: "340px",
            width: "340px",
            background: "#1E1C24",
            border: "1px solid rgba(201,169,110,0.25)",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.1)",
            pointerEvents: "auto",
          }}
        >
          {renderArrow()}

          {/* Step indicator */}
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#C9A96E", marginBottom: "10px" }}>
            Step {currentStep} of {TOTAL_STEPS}
          </div>

          {/* Title */}
          <h3 className="font-serif" style={{ fontSize: "15px", color: "rgba(255,255,255,0.9)", marginBottom: "8px", lineHeight: "1.3" }}>
            {stepData.title}
          </h3>

          {/* Body */}
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: "1.7", marginBottom: stepData.typeThis ? "14px" : "18px" }}>
            {stepData.body}
          </p>

          {/* Type This box */}
          {stepData.typeThis && (
            <>
              <button
                type="button"
                onClick={handleTypeThisClick}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: copied ? "rgba(201,169,110,0.12)" : "rgba(201,169,110,0.06)",
                  border: copied ? "1px solid rgba(201,169,110,0.4)" : "1px dashed rgba(201,169,110,0.2)",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  marginBottom: "6px",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                }}
              >
                <span style={{ fontSize: "12.5px", color: "#C9A96E", fontStyle: "italic", lineHeight: "1.5", display: "block" }}>
                  {copied ? "✓ Copied to input!" : stepData.typeThis}
                </span>
              </button>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", marginBottom: "14px", textAlign: "center" }}>
                Click to auto-fill
              </p>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: i + 1 === currentStep ? "16px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background: i + 1 === currentStep ? "#C9A96E" : i + 1 < currentStep ? "rgba(201,169,110,0.4)" : "rgba(255,255,255,0.1)",
                    transition: "all 300ms ease",
                  }}
                />
              ))}
            </div>
            {isAutoPlaying ? (
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                  style={{
                    fontSize: "11px",
                    color: "#C9A96E",
                  }}
                >
                  Playing...
                </motion.span>
                <button
                  type="button"
                  onClick={pauseAutoPlay}
                  style={{
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.4)",
                    cursor: "pointer",
                    padding: "4px 10px",
                  }}
                >
                  ❚❚ Pause
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {stepData.showSkip && (
                  <button type="button" onClick={skipTour} style={{ background: "none", border: "none", fontSize: "11px", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: "4px" }}>
                    Skip
                  </button>
                )}
                {stepData.primaryButton && (
                  <button
                    type="button"
                    onClick={handlePrimaryClick}
                    disabled={isPerformingAction}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "none",
                      background: isPerformingAction
                        ? "linear-gradient(135deg, rgba(201,169,110,0.5) 0%, rgba(139,115,64,0.5) 100%)"
                        : "linear-gradient(135deg, #C9A96E 0%, #8B7340 100%)",
                      color: "#0C0B0F",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: isPerformingAction ? "not-allowed" : "pointer",
                      opacity: isPerformingAction ? 0.7 : 1,
                      transition: "opacity 200ms ease",
                    }}
                  >
                    {isPerformingAction ? (
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                      >
                        Working...
                      </motion.span>
                    ) : (
                      stepData.primaryButton
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Auto-play link on Step 1 */}
          {currentStep === 1 && !isAutoPlaying && (
            <button
              type="button"
              onClick={startAutoPlay}
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                marginTop: "12px",
                background: "none",
                border: "none",
                fontSize: "11px",
                color: "rgba(255,255,255,0.25)",
                cursor: "pointer",
                padding: "4px",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
            >
              ▶ Auto-play demo
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export function TourProgressBar() {
  const { currentStep, isTourActive } = useTour();

  if (!isTourActive) return null;

  const progress = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 1002,
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <motion.div
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          height: "100%",
          background: "linear-gradient(90deg, #C9A96E 0%, #8B7340 100%)",
          borderRadius: "0 1px 1px 0",
        }}
      />
    </motion.div>
  );
}
