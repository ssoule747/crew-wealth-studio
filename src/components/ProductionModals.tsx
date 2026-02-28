"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ========== Base Modal ==========

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 2000,
            }}
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#1A1820",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "480px",
              width: "calc(100% - 40px)",
              maxHeight: "calc(100vh - 80px)",
              overflowY: "auto",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
              zIndex: 2001,
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.3)",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px",
                lineHeight: 1,
              }}
            >
              ×
            </button>

            {/* Production badge */}
            <div
              style={{
                display: "inline-block",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#C9A96E",
                background: "rgba(201,169,110,0.08)",
                padding: "4px 10px",
                borderRadius: "6px",
                marginBottom: "16px",
              }}
            >
              Production Feature
            </div>

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ========== Timeline Step ==========

function TimelineStep({
  icon,
  title,
  description,
  isLast,
}: {
  icon: string;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-4" style={{ marginBottom: isLast ? 0 : "4px" }}>
      {/* Icon + line column */}
      <div className="flex flex-col items-center" style={{ width: "32px", flexShrink: 0 }}>
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: "32px",
            height: "32px",
            background: "rgba(201,169,110,0.08)",
            border: "1px solid rgba(201,169,110,0.15)",
            fontSize: "16px",
          }}
        >
          {icon}
        </div>
        {!isLast && (
          <div
            style={{
              width: "1px",
              flex: 1,
              minHeight: "20px",
              background: "linear-gradient(180deg, rgba(201,169,110,0.2) 0%, rgba(201,169,110,0.05) 100%)",
              marginTop: "4px",
            }}
          />
        )}
      </div>

      {/* Content */}
      <div style={{ paddingBottom: isLast ? 0 : "20px", flex: 1 }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.85)",
            marginBottom: "4px",
            lineHeight: "32px",
          }}
        >
          {title}
        </div>
        <p
          style={{
            fontSize: "12.5px",
            color: "rgba(255,255,255,0.45)",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

// ========== Info Card ==========

function InfoCard({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      className="flex items-start gap-3"
      style={{
        padding: "14px 16px",
        background: "rgba(201,169,110,0.04)",
        border: "1px solid rgba(201,169,110,0.08)",
        borderRadius: "10px",
        marginTop: "20px",
        marginBottom: "24px",
      }}
    >
      <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
      <p
        style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.4)",
          lineHeight: "1.6",
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}

// ========== Got It Button ==========

function GotItButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full transition-all duration-200"
      style={{
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        background: "linear-gradient(135deg, #C9A96E 0%, #8B7340 100%)",
        color: "#0C0B0F",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(201,169,110,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      Got It
    </button>
  );
}

// ========== Download Modal ==========

export function DownloadModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2
        className="font-serif"
        style={{
          fontSize: "20px",
          color: "rgba(255,255,255,0.9)",
          marginBottom: "24px",
        }}
      >
        Download Updated Presentation
      </h2>

      <TimelineStep
        icon="📥"
        title="Export as Keynote"
        description="Henry converts the updated presentation back to native .key format, preserving all your original Keynote themes, animations, and transitions."
      />
      <TimelineStep
        icon="💾"
        title="Save to Your Machine"
        description="The file downloads directly to your Mac. Since Henry runs on your Mac Mini, this stays on your local network — no client data ever leaves your office."
      />
      <TimelineStep
        icon="🔗"
        title="Ready to Present"
        description="Open the deck in Keynote, review the slides, and present to your client. Henry keeps a version history so you can always go back."
        isLast
      />

      <InfoCard
        icon="💡"
        text="In the production app, this button instantly downloads the .key file. For this demo, we're showing you what the experience would look like."
      />

      <GotItButton onClick={onClose} />
    </Modal>
  );
}

// ========== Open in Keynote Modal ==========

export function KeynoteModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2
        className="font-serif"
        style={{
          fontSize: "20px",
          color: "rgba(255,255,255,0.9)",
          marginBottom: "24px",
        }}
      >
        Open Directly in Keynote
      </h2>

      {/* Simulated Keynote window */}
      <div
        style={{
          background: "#2A2930",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.06)",
          marginBottom: "20px",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center"
          style={{
            padding: "10px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-center gap-1.5" style={{ marginRight: "auto" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF5F57" }} />
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FEBC2E" }} />
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#28C840" }} />
          </div>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Keynote
          </span>
        </div>

        {/* Slide mockup */}
        <div
          className="flex flex-col items-center justify-center"
          style={{ padding: "30px 20px", minHeight: "140px" }}
        >
          <div
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#C9A96E",
              marginBottom: "12px",
            }}
          />
          <div
            className="font-serif"
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.7)",
              textAlign: "center",
              marginBottom: "6px",
            }}
          >
            Henderson Annual Review 2026
          </div>
          <div
            style={{
              width: "40px",
              height: "2px",
              background: "linear-gradient(90deg, transparent 0%, #C9A96E 50%, transparent 100%)",
              marginTop: "4px",
            }}
          />
        </div>
      </div>

      {/* Handoff arrow */}
      <div
        className="flex items-center justify-center gap-3"
        style={{ marginBottom: "20px" }}
      >
        <div
          className="flex items-center justify-center rounded-lg font-serif"
          style={{
            width: "28px",
            height: "28px",
            background: "linear-gradient(135deg, rgba(201,169,110,0.15) 0%, rgba(201,169,110,0.05) 100%)",
            border: "1px solid rgba(201,169,110,0.2)",
            color: "#C9A96E",
            fontSize: "14px",
          }}
        >
          H
        </div>
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontSize: "14px", color: "rgba(201,169,110,0.4)" }}
        >
          →→→
        </motion.div>
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: "28px",
            height: "28px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: "14px",
          }}
        >
          📊
        </div>
      </div>

      <p
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.5)",
          lineHeight: "1.7",
          marginBottom: "0",
        }}
      >
        Since Henry runs on your Mac Mini, clicking this button tells macOS to open the updated
        .key file directly in Keynote — no download step needed. The file opens instantly and
        you can start presenting or making final manual tweaks.
      </p>

      <InfoCard
        icon="⚡"
        text="Henry uses AppleScript to communicate with Keynote natively. This means it preserves all your custom themes, master slides, and animations from the original presentation."
      />

      <GotItButton onClick={onClose} />
    </Modal>
  );
}
