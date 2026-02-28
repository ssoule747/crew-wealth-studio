"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage } from "@/app/page";
import type { AppState } from "@/lib/mockData";
import { PROCESSING_STEPS, SLIDE_TYPE_COLORS } from "@/lib/mockData";
import { useIsMobile } from "@/lib/useIsMobile";

interface ChatInterfaceProps {
  appState: AppState;
  messages: ChatMessage[];
  hasFiles: boolean;
  onSendMessage: (text: string) => void;
  onAcceptFile: (cardRect?: DOMRect) => void;
  onRequestChanges: () => void;
  isTransferring?: boolean;
  tourFillText?: string;
  onTourFillConsumed?: () => void;
}

export default function ChatInterface({
  appState,
  messages,
  hasFiles,
  onSendMessage,
  onAcceptFile,
  onRequestChanges,
  isTransferring,
  tourFillText,
  onTourFillConsumed,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Tour auto-fill with typewriter effect
  useEffect(() => {
    if (!tourFillText) return;

    setInput(""); // Clear first
    let i = 0;
    const text = tourFillText;
    const interval = setInterval(() => {
      i++;
      setInput(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        inputRef.current?.focus();
        onTourFillConsumed?.();
      }
    }, 8); // ~8ms per char = ~800ms for 100 chars

    return () => clearInterval(interval);
  }, [tourFillText, onTourFillConsumed]);

  // Determine placeholder text
  const getPlaceholder = () => {
    if (!hasFiles) return "Load demo files to get started...";
    if (appState === "review") return "Request changes or ask Henry anything...";
    return "Tell Henry what to update...";
  };

  // Determine if input is disabled
  const isDisabled = !hasFiles || appState === "processing";

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isDisabled) return;
    onSendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto min-h-0"
        style={{ padding: isMobile ? "16px 16px" : "20px 24px" }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "85%",
                  padding: msg.isProcessing ? "16px 20px" : "12px 16px",
                  borderRadius: "12px",
                  background: msg.role === "user"
                    ? "rgba(201,169,110,0.1)"
                    : "rgba(255,255,255,0.03)",
                  border: msg.role === "user"
                    ? "1px solid rgba(201,169,110,0.15)"
                    : "1px solid rgba(255,255,255,0.05)",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  color: msg.role === "user"
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(255,255,255,0.7)",
                }}
              >
                {msg.isProcessing ? (
                  <ProcessingAnimation />
                ) : (
                  <>
                    {/* Render message text with markdown-like bold support */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong style="color: rgba(255,255,255,0.9); font-weight: 600;">$1</strong>')
                          .replace(/\n/g, "<br />"),
                      }}
                    />

                    {/* File Preview Card — inline in chat */}
                    {msg.filePreview && (
                      <FilePreviewCard
                        filename={msg.filePreview.filename}
                        fileSize={msg.filePreview.fileSize}
                        slides={msg.filePreview.slides}
                        onAccept={onAcceptFile}
                        onRequestChanges={onRequestChanges}
                        appState={appState}
                        isTransferring={isTransferring}
                      />
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding: isMobile ? "8px 12px calc(12px + env(safe-area-inset-bottom, 0px))" : "12px 24px 20px" }}>
        <div
          className="flex items-center gap-2"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${isDisabled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: "12px",
            padding: "6px 6px 6px 16px",
            opacity: isDisabled ? 0.5 : 1,
            transition: "all 200ms ease",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            disabled={isDisabled}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "rgba(255,255,255,0.8)",
              fontSize: isMobile ? "16px" : "13px",
              caretColor: "#C9A96E",
            }}
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled || !input.trim()}
            style={{
              padding: isMobile ? "10px 20px" : "8px 16px",
              minHeight: "44px",
              borderRadius: "8px",
              border: "none",
              background: !isDisabled && input.trim()
                ? "linear-gradient(135deg, #C9A96E 0%, #8B7340 100%)"
                : "rgba(255,255,255,0.04)",
              color: !isDisabled && input.trim()
                ? "#0C0B0F"
                : "rgba(255,255,255,0.2)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: !isDisabled && input.trim() ? "pointer" : "not-allowed",
              transition: "all 200ms ease",
              whiteSpace: "nowrap",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== Processing Animation (in-chat) ==========

function ProcessingAnimation() {
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    // Show steps one by one with delays: 0ms, 1000ms, 2000ms, 3500ms
    const delays = [0, 1000, 1000, 1500];
    let total = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    delays.forEach((delay, i) => {
      total += delay;
      timers.push(
        setTimeout(() => {
          setVisibleSteps(i + 1);
        }, total)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {visibleSteps === 0 && (
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Henry is thinking</span>
          <TypingDots />
        </div>
      )}
      {PROCESSING_STEPS.slice(0, visibleSteps).map((step, i) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-2"
          style={{
            fontSize: "12px",
            color: i === visibleSteps - 1 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
          }}
        >
          {i < visibleSteps - 1 ? (
            <span style={{ color: "#8BC96E" }}>✓</span>
          ) : (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ display: "inline-block", fontSize: "10px", color: "#C9A96E" }}
            >
              ◈
            </motion.span>
          )}
          {step}
        </motion.div>
      ))}
    </div>
  );
}

// ========== Typing Dots ==========

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          style={{
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "#C9A96E",
          }}
        />
      ))}
    </div>
  );
}

// ========== File Preview Card (inline in chat) ==========

interface FilePreviewCardProps {
  filename: string;
  fileSize: string;
  slides: Array<{ id: number; title: string; type: string; changes: string[] }>;
  onAccept: (cardRect?: DOMRect) => void;
  onRequestChanges: () => void;
  appState: AppState;
  isTransferring?: boolean;
}

function FilePreviewCard({
  filename,
  fileSize,
  slides,
  onAccept,
  onRequestChanges,
  appState,
  isTransferring,
}: FilePreviewCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const showActions = appState === "review";
  const isAccepted = appState === "accepted" || appState === "iterating" || isTransferring;

  const handleAccept = () => {
    const rect = cardRef.current?.getBoundingClientRect();
    onAccept(rect ?? undefined);
  };

  // If the file has been accepted (or is transferring), show a compact accepted state
  if (isAccepted && !showActions) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        style={{
          marginTop: "16px",
          padding: "12px 16px",
          borderRadius: "12px",
          background: "rgba(139,201,110,0.06)",
          border: "1px solid rgba(139,201,110,0.12)",
        }}
      >
        <div className="flex items-center gap-2" style={{ fontSize: "12px", color: "rgba(139,201,110,0.7)" }}>
          <span>✓</span>
          <span>✓ File accepted</span>
        </div>
      </motion.div>
    );
  }

  // If currently transferring, hide the full card (it's being shown as the flying card overlay)
  if (isTransferring) {
    return (
      <motion.div
        animate={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        style={{ marginTop: "16px", height: 0, overflow: "hidden" }}
      />
    );
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{
        marginTop: "16px",
        background: "rgba(201,169,110,0.06)",
        border: "1px solid rgba(201,169,110,0.15)",
        borderRadius: "12px",
        padding: "16px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Shimmer overlay on first appear */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{ duration: 1.2, delay: 0.3 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.08) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* File header */}
      <div className="flex items-center gap-3" style={{ marginBottom: "12px" }}>
        <span style={{ fontSize: "16px", color: "#C9A96E" }}>◆</span>
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{filename}</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{fileSize}</div>
        </div>
      </div>

      {/* Mini slide list — show first 5 */}
      <div className="flex flex-col gap-1" style={{ marginBottom: showActions ? "14px" : "0" }}>
        {slides.slice(0, 5).map((slide) => (
          <div key={slide.id} className="flex items-center gap-2" style={{ fontSize: "11px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: SLIDE_TYPE_COLORS[slide.type as keyof typeof SLIDE_TYPE_COLORS] || "#C9A96E",
                flexShrink: 0,
              }}
            />
            <span style={{ color: "rgba(255,255,255,0.5)" }}>{slide.title}</span>
          </div>
        ))}
        {slides.length > 5 && (
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", paddingLeft: "14px" }}>
            +{slides.length - 5} more slides
          </span>
        )}
      </div>

      {/* Action buttons — updated Accept handler */}
      {showActions && (
        <div className="flex flex-col md:flex-row gap-2">
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #C9A96E 0%, #8B7340 100%)",
              color: "#0C0B0F",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✓ Accept & Download
          </button>
          <button
            type="button"
            onClick={onRequestChanges}
            className="flex-1 flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.5)",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            ✎ Request Changes
          </button>
        </div>
      )}
    </motion.div>
  );
}
