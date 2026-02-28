"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AppState, SlidePreview } from "@/lib/mockData";
import { SLIDE_TYPE_COLORS } from "@/lib/mockData";
import { DownloadModal, KeynoteModal } from "./ProductionModals";
import Tooltip from "./Tooltip";

interface ApprovedFile {
  filename: string;
  fileSize: string;
  slides: SlidePreview[];
  timestamp: string;
}

interface RightPanelProps {
  appState: AppState;
  approvedFile: ApprovedFile | null;
}

export default function RightPanel({ appState, approvedFile }: RightPanelProps) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ padding: "24px" }}>
      {/* Header */}
      <div className="flex items-center gap-2" style={{ marginBottom: "16px" }}>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "1.8px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Approved Files
        </span>
        {approvedFile && (
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#C9A96E",
              background: "rgba(201,169,110,0.1)",
              padding: "2px 8px",
              borderRadius: "10px",
            }}
          >
            1
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!approvedFile ? (
            <IdleState key="idle" reducedMotion={prefersReducedMotion} />
          ) : (
            <ApprovedFileCard
              key="approved"
              file={approvedFile}
              reducedMotion={prefersReducedMotion}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ========== Idle State with Ambient Animation ==========

function IdleState({ reducedMotion }: { reducedMotion: boolean }) {
  const noAnimation = { animate: {}, transition: {} };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center h-full relative"
    >
      {/* Dot grid pattern background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient floating gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blob 1 — Gold */}
        <motion.div
          animate={
            reducedMotion
              ? {}
              : {
                  x: [0, 80, -40, 60, 0],
                  y: [0, -60, 40, -30, 0],
                }
          }
          transition={
            reducedMotion
              ? {}
              : { duration: 20, repeat: Infinity, ease: "easeInOut" }
          }
          style={{
            position: "absolute",
            top: "15%",
            left: "25%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #C9A96E, transparent)",
            filter: "blur(80px)",
            opacity: 0.04,
            willChange: "transform",
          }}
        />
        {/* Blob 2 — Blue */}
        <motion.div
          animate={
            reducedMotion
              ? {}
              : {
                  x: [0, -60, 40, -30, 0],
                  y: [0, 40, -60, 50, 0],
                }
          }
          transition={
            reducedMotion
              ? {}
              : { duration: 25, repeat: Infinity, ease: "easeInOut" }
          }
          style={{
            position: "absolute",
            bottom: "20%",
            right: "15%",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #6EAAC9, transparent)",
            filter: "blur(80px)",
            opacity: 0.04,
            willChange: "transform",
          }}
        />
        {/* Blob 3 — Pink */}
        <motion.div
          animate={
            reducedMotion
              ? {}
              : {
                  x: [0, 50, -35, 0],
                  y: [0, -35, 50, 0],
                }
          }
          transition={
            reducedMotion
              ? {}
              : { duration: 18, repeat: Infinity, ease: "easeInOut" }
          }
          style={{
            position: "absolute",
            top: "55%",
            left: "10%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #C96EA0, transparent)",
            filter: "blur(80px)",
            opacity: 0.04,
            willChange: "transform",
          }}
        />
      </div>

      {/* Floating H logo */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : {
                y: [0, -6, 3, -6, 0],
                rotate: [0, 1, -1, 1, 0],
              }
        }
        transition={
          reducedMotion
            ? {}
            : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative z-10 flex items-center justify-center"
        style={{ marginBottom: "24px", willChange: "transform" }}
      >
        {/* Pulsing glow — intentionally 4s (different from 6s float) */}
        <motion.div
          animate={
            reducedMotion
              ? {}
              : { opacity: [0.04, 0.12, 0.04], scale: [1, 1.15, 1] }
          }
          transition={
            reducedMotion
              ? {}
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
          style={{
            position: "absolute",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,169,110,0.25) 0%, transparent 70%)",
            willChange: "transform, opacity",
          }}
        />
        <div
          className="flex items-center justify-center rounded-xl font-serif"
          style={{
            width: "56px",
            height: "56px",
            background: "rgba(201,169,110,0.04)",
            border: "1.5px solid rgba(201,169,110,0.2)",
            backgroundImage:
              "linear-gradient(135deg, rgba(201,169,110,0.08) 0%, transparent 100%)",
            color: "#C9A96E",
            fontSize: "24px",
            position: "relative",
          }}
        >
          H
        </div>
      </motion.div>

      {/* Text */}
      <div className="relative z-10 text-center">
        <p
          className="font-serif"
          style={{ fontSize: "16px", color: "rgba(255,255,255,0.25)" }}
        >
          Waiting for approved files
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.15)",
            marginTop: "6px",
          }}
        >
          Accept a presentation from Henry to see it here
        </p>
      </div>
    </motion.div>
  );
}

// ========== Approved File Card ==========

function ApprovedFileCard({
  file,
  reducedMotion,
}: {
  file: ApprovedFile;
  reducedMotion: boolean;
}) {
  const [expandedSlideId, setExpandedSlideId] = useState<number | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showKeynoteModal, setShowKeynoteModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col h-full"
    >
      {/* Success ripple */}
      <motion.div
        initial={{ scale: 0, opacity: 0.4 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "2px solid rgba(201,169,110,0.3)",
        }}
      />

      {/* Card with breathing glow */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : {
                boxShadow: [
                  "0 0 0 rgba(201,169,110,0)",
                  "0 4px 20px rgba(201,169,110,0.08)",
                  "0 0 0 rgba(201,169,110,0)",
                ],
              }
        }
        transition={
          reducedMotion
            ? {}
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
        className="flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(201,169,110,0.12)",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Card header */}
        <div
          className="flex items-center gap-3 shrink-0"
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            background: "rgba(201,169,110,0.03)",
          }}
        >
          <span style={{ fontSize: "20px", color: "#C9A96E" }}>&#9670;</span>
          <div className="flex-1 min-w-0">
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {file.filename}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
              {file.fileSize} · Updated by Henry · {file.timestamp}
            </div>
          </div>
        </div>

        {/* Slides list — scrollable */}
        <div
          className="flex-1 overflow-y-auto min-h-0"
          style={{ padding: "12px 16px" }}
        >
          <div className="flex flex-col gap-1">
            {file.slides.map((slide) => {
              const isExpanded = expandedSlideId === slide.id;
              const dotColor = SLIDE_TYPE_COLORS[slide.type] || "#C9A96E";

              return (
                <div key={slide.id}>
                  <Tooltip text="In production, click to edit this slide individually" position="bottom" delay={700}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSlideId(isExpanded ? null : slide.id)
                    }
                    className="w-full flex items-center gap-3 text-left rounded-lg transition-all duration-150"
                    style={{
                      padding: "10px 12px",
                      background: isExpanded
                        ? "rgba(255,255,255,0.03)"
                        : "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: dotColor,
                        flexShrink: 0,
                        opacity: 0.7,
                      }}
                    />
                    <span
                      style={{
                        flex: 1,
                        fontSize: "12px",
                        fontWeight: isExpanded ? 600 : 400,
                        color: isExpanded
                          ? "rgba(255,255,255,0.8)"
                          : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {slide.title}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.2)",
                        transform: isExpanded
                          ? "rotate(90deg)"
                          : "rotate(0deg)",
                        transition: "transform 150ms ease",
                      }}
                    >
                      &#8250;
                    </span>
                  </button>
                  </Tooltip>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ padding: "4px 12px 12px 32px" }}>
                          {slide.changes.map((change, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2"
                              style={{
                                fontSize: "11px",
                                color: "rgba(255,255,255,0.4)",
                                lineHeight: "1.5",
                                marginBottom: "4px",
                              }}
                            >
                              <span
                                style={{
                                  color: "rgba(201,169,110,0.5)",
                                  flexShrink: 0,
                                }}
                              >
                                &#8226;
                              </span>
                              {change}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom actions */}
        <div
          className="shrink-0 flex flex-col gap-2"
          style={{
            padding: "16px 20px",
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {/* Download button with shimmer */}
          <button
            type="button"
            onClick={() => setShowDownloadModal(true)}
            className="w-full flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background:
                "linear-gradient(135deg, #C9A96E 0%, #8B7340 100%)",
              color: "#0C0B0F",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {/* Shimmer sweep */}
            {!reducedMotion && (
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>
              Download &#8595;
            </span>
          </button>
          <button
            type="button"
            onClick={() => setShowKeynoteModal(true)}
            className="w-full flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              color: "rgba(255,255,255,0.35)",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Open in Keynote
          </button>
        </div>
      </motion.div>
      {/* Modals rendered via portal-like fixed positioning — already fixed/z-indexed in ProductionModals */}
      <DownloadModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} />
      <KeynoteModal isOpen={showKeynoteModal} onClose={() => setShowKeynoteModal(false)} />
    </motion.div>
  );
}
