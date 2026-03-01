"use client";

import { useState, useEffect, useCallback } from "react";

interface WaitingFolderProps {
  state: "waiting" | "ready";
  triggerCatch?: boolean;
  onDownload?: () => void;
  downloaded?: boolean;
  folderRef?: React.RefObject<HTMLDivElement | null>;
}

export default function WaitingFolder({
  state,
  triggerCatch,
  onDownload,
  downloaded,
  folderRef,
}: WaitingFolderProps) {
  const [displayState, setDisplayState] = useState(state);
  const [transitioning, setTransitioning] = useState(false);
  const [catchAnim, setCatchAnim] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (state !== displayState) {
      setTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayState(state);
        setTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [state, displayState]);

  useEffect(() => {
    if (triggerCatch && !catchAnim) {
      setCatchAnim(true);
      const timer = setTimeout(() => setCatchAnim(false), 600);
      return () => clearTimeout(timer);
    }
  }, [triggerCatch, catchAnim]);

  const handleDownload = useCallback(() => {
    onDownload?.();
  }, [onDownload]);

  const hoverClass = reducedMotion ? "" : "animate-[gentle-hover_3s_ease-in-out_infinite]";
  const fadeClass = transitioning ? "opacity-0" : "opacity-100";

  return (
    <>
      <style>{`
        @keyframes gentle-hover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-opacity {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        @keyframes catch-scale {
          0% { transform: scale(1); }
          40% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes catch-ripple {
          0% { transform: scale(0.5); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes btn-shimmer {
          0%, 100% { left: -100%; }
          40% { left: 120%; }
          41% { left: -100%; }
        }
      `}</style>

      <div className="flex items-center justify-center w-full">
        {displayState === "waiting" ? (
          <div
            className={`${fadeClass} flex flex-col items-center gap-5 p-10 rounded-2xl w-full`}
            style={{
              border: "1px dashed rgba(201, 169, 110, 0.15)",
              transition: "opacity 300ms",
              borderColor: catchAnim && !reducedMotion ? "rgba(201, 169, 110, 0.6)" : undefined,
            }}
          >
            {/* Folder with catch wrapper */}
            <div className="relative">
              {/* Catch ripple */}
              {catchAnim && !reducedMotion && (
                <div
                  className="absolute inset-0 rounded-full border border-[#C9A96E]/40"
                  style={{
                    animation: "catch-ripple 600ms ease-out forwards",
                    top: "50%",
                    left: "50%",
                    width: 64,
                    height: 64,
                    marginTop: -32,
                    marginLeft: -32,
                  }}
                />
              )}

              {/* Folder icon */}
              <div
                ref={folderRef}
                className={hoverClass}
                style={{
                  width: 64,
                  height: 52,
                  position: "relative",
                  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
                  animation: catchAnim && !reducedMotion
                    ? "catch-scale 250ms ease-out"
                    : undefined,
                }}
              >
                {/* Folder tab */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 24,
                    height: 10,
                    borderRadius: "6px 6px 0 0",
                    border: "1.5px solid rgba(201, 169, 110, 0.4)",
                    borderBottom: "none",
                    backgroundColor: "rgba(201, 169, 110, 0.06)",
                  }}
                />
                {/* Folder body */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 0,
                    width: 64,
                    height: 42,
                    borderRadius: "0 8px 8px 8px",
                    border: "1.5px solid rgba(201, 169, 110, 0.4)",
                    backgroundColor: "rgba(201, 169, 110, 0.06)",
                  }}
                >
                  {/* Doc icon peeking out */}
                  <div
                    style={{
                      position: "absolute",
                      left: 22,
                      top: -10,
                      width: 16,
                      height: 20,
                      borderRadius: 2,
                      border: "1px solid rgba(255,255,255,0.15)",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 2,
                      padding: "0 3px",
                    }}
                  >
                    <div className="h-px w-full bg-white/20" />
                    <div className="h-px w-3/4 bg-white/15" />
                    <div className="h-px w-full bg-white/20" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 mt-1">
              <span className="text-sm text-white/45">
                Your updated Keynote will appear here
              </span>
              <span
                className="text-xs text-[#C9A96E]/40"
                style={
                  reducedMotion
                    ? undefined
                    : { animation: "pulse-opacity 2.5s ease-in-out infinite" }
                }
              >
                Henry is preparing the updates...
              </span>
            </div>
          </div>
        ) : (
          <div
            className={`${fadeClass} flex flex-col items-center gap-5 p-10 rounded-2xl w-full relative`}
            style={{ transition: "opacity 300ms" }}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, rgba(201, 169, 110, 0.06) 0%, transparent 70%)",
              }}
            />

            {/* File icon */}
            <div className={`relative ${hoverClass}`} style={{ width: 64, height: 80 }}>
              {/* Document shape */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  border: "1.5px solid",
                  borderImage: "linear-gradient(135deg, #C9A96E, #A8884A) 1",
                  backgroundColor: "rgba(201, 169, 110, 0.06)",
                }}
              />
              {/* Folded corner */}
              <div
                className="absolute top-0 right-0"
                style={{
                  width: 14,
                  height: 14,
                  background: "linear-gradient(225deg, #0C0B0F 45%, rgba(201, 169, 110, 0.3) 50%)",
                  borderRadius: "0 6px 0 4px",
                }}
              />
              {/* Content bars */}
              <div className="absolute left-2.5 right-2.5 top-6 flex flex-col gap-2">
                <div className="h-[2px] w-full bg-white/10 rounded" />
                <div className="h-[2px] w-3/4 bg-white/8 rounded" />
                <div className="h-[2px] w-5/6 bg-white/10 rounded" />
                <div className="h-[2px] w-2/3 bg-white/8 rounded" />
              </div>
              {/* Green checkmark badge */}
              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#8BC96E] flex items-center justify-center shadow-lg">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 relative z-10">
              <span className="text-sm text-white/80 font-medium">
                Lucy_C_Annual_Review_Updated.key
              </span>
              <span className="text-xs text-[#8BC96E]/70">
                13 slides &middot; All updated &middot; Ready to present
              </span>
            </div>

            {/* Download button */}
            {downloaded ? (
              <button
                className="relative z-10 rounded-xl py-3.5 px-7 text-sm font-semibold bg-[#8BC96E]/15 text-[#8BC96E] border border-[#8BC96E]/25 cursor-default"
              >
                &#10003; Keynote Downloaded
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="relative z-10 rounded-xl py-3.5 px-7 text-sm font-semibold text-[#0C0B0F] overflow-hidden transition-transform duration-150 hover:scale-[1.03] hover:brightness-110 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #C9A96E, #A8884A)",
                }}
              >
                {/* Shimmer overlay */}
                <span
                  className="absolute inset-y-0 w-full pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                    width: "60%",
                    animation: reducedMotion ? "none" : "btn-shimmer 3s ease-in-out infinite",
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                  }}
                />
                <span className="relative z-10">Download Keynote</span>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
