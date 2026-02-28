"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import { useTour } from "@/components/TourProvider";
import TourCard, { TourProgressBar } from "@/components/TourCard";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import Tooltip from "@/components/Tooltip";
import {
  DEMO_FILES,
  DEMO_SLIDES,
  HENRY_GREETING,
  HENRY_FILES_LOADED,
  HENRY_ACCEPTED,
  DEMO_PRIMARY_RESPONSE,
  findDemoResponse,
  type AppState,
  type DemoFile,
  type SlidePreview,
} from "@/lib/mockData";

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  /** If present, this message includes a file preview card */
  filePreview?: {
    filename: string;
    fileSize: string;
    slides: Array<{ id: number; title: string; type: string; changes: string[] }>;
  };
  /** If this is a processing message (animated status lines) */
  isProcessing?: boolean;
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [demoFiles, setDemoFiles] = useState<DemoFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "greeting", role: "assistant", content: HENRY_GREETING },
  ]);
  const [approvedFile, setApprovedFile] = useState<{
    filename: string;
    fileSize: string;
    slides: SlidePreview[];
    timestamp: string;
  } | null>(null);
  const [isFirstSubmit, setIsFirstSubmit] = useState(true);
  const [mobileTab, setMobileTab] = useState<"chat" | "files">("chat");
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferOrigin, setTransferOrigin] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [transferTarget, setTransferTarget] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);
  const tour = useTour();
  const [tourInputText, setTourInputText] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  // Ref so tour actions can read current state without stale closures
  const appStateRef = useRef(appState);
  useEffect(() => { appStateRef.current = appState; }, [appState]);

  // Skip-processing support
  const skipProcessingRef = useRef(false);
  const skipProcessingResolveRef = useRef<(() => void) | null>(null);

  // Typewriter completion tracking for fillInput
  const typewriterResolveRef = useRef<(() => void) | null>(null);

  // Tour auto-advance logic — detects if user has jumped ahead
  useEffect(() => {
    if (!tour.isTourActive) return;

    // Map app states to minimum tour steps
    const stateToMinStep: Record<string, number> = {
      idle: 1,
      files_loaded: 2,
      processing: 3,
      review: 4,
      accepted: 5,
      iterating: 5,
    };

    const minStep = stateToMinStep[appState] ?? 1;

    // If the user has jumped ahead of the tour, skip forward
    if (tour.currentStep < minStep) {
      // If they're way ahead (more than 1 step), dismiss the tour
      if (minStep - tour.currentStep > 1) {
        tour.skipTour();
        return;
      }
      // Otherwise, advance to catch up
      setTimeout(() => tour.advanceStep(), 500);
    }
  }, [appState, tour]);

  // Handle "fill input" from tour
  const handleTourFillInput = useCallback((text: string) => {
    setTourInputText(text);
  }, []);

  const nextId = useCallback(() => {
    messageIdCounter.current += 1;
    return `msg-${messageIdCounter.current}`;
  }, []);

  // --- Handlers ---

  const handleLoadDemoFiles = useCallback(() => {
    if (demoFiles.length > 0) return; // already loaded
    setDemoFiles(DEMO_FILES);
    setAppState("files_loaded");
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "assistant",
        content: HENRY_FILES_LOADED,
      },
    ]);
  }, [demoFiles, nextId]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      // Add user message
      const userMsgId = nextId();
      setMessages((prev) => [...prev, { id: userMsgId, role: "user", content: text }]);

      setAppState("processing");

      // Add processing placeholder
      const processingId = nextId();
      setMessages((prev) => [
        ...prev,
        { id: processingId, role: "assistant", content: "", isProcessing: true },
      ]);

      // Simulate work (4.5 seconds total, cancellable via skipProcessing)
      skipProcessingRef.current = false;
      await new Promise<void>((resolve) => {
        skipProcessingResolveRef.current = resolve;
        const timer = setTimeout(() => {
          skipProcessingResolveRef.current = null;
          resolve();
        }, 4500);
        // Check periodically if skip was requested
        const checkInterval = setInterval(() => {
          if (skipProcessingRef.current) {
            clearTimeout(timer);
            clearInterval(checkInterval);
            skipProcessingResolveRef.current = null;
            resolve();
          }
        }, 50);
      });

      // Determine response
      const isFirst = isFirstSubmit;
      const responseText = isFirst ? DEMO_PRIMARY_RESPONSE.text : findDemoResponse(text);

      if (isFirst) setIsFirstSubmit(false);

      // Replace processing message with real response
      const responseMsgId = nextId();
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== processingId);
        return [
          ...filtered,
          {
            id: responseMsgId,
            role: "assistant",
            content: responseText,
            filePreview: {
              filename: "Henderson_Annual_Review_2026.key",
              fileSize: "2.4 MB",
              slides: DEMO_SLIDES,
            },
          },
        ];
      });

      setAppState("review");
    },
    [nextId, isFirstSubmit]
  );

  const handleAcceptFile = useCallback((cardRect?: DOMRect) => {
    // Get the right panel's center position for the target
    const rightPanel = rightPanelRef.current;
    if (!rightPanel || !cardRect) {
      // Fallback: no animation, just set state directly
      setApprovedFile({
        filename: "Henderson_Annual_Review_2026.key",
        fileSize: "2.4 MB",
        slides: DEMO_SLIDES,
        timestamp: "Just now",
      });
      setAppState("accepted");
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: HENRY_ACCEPTED },
      ]);
      return;
    }

    const panelRect = rightPanel.getBoundingClientRect();

    setTransferOrigin({
      x: cardRect.left,
      y: cardRect.top,
      width: cardRect.width,
      height: cardRect.height,
    });
    setTransferTarget({
      x: panelRect.left + panelRect.width / 2,
      y: panelRect.top + panelRect.height / 2,
      width: panelRect.width * 0.85,
      height: 200,
    });
    setIsTransferring(true);

    // After the flight animation completes (700ms), land the card
    setTimeout(() => {
      setIsTransferring(false);
      setTransferOrigin(null);
      setTransferTarget(null);
      setApprovedFile({
        filename: "Henderson_Annual_Review_2026.key",
        fileSize: "2.4 MB",
        slides: DEMO_SLIDES,
        timestamp: "Just now",
      });
      setAppState("accepted");

      // Delayed follow-up message from Henry
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "assistant", content: HENRY_ACCEPTED },
        ]);
      }, 500);
    }, 700);
  }, [nextId]);

  const handleSkipProcessing = useCallback(() => {
    skipProcessingRef.current = true;
  }, []);

  const fillInputAsync = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      typewriterResolveRef.current = resolve;
      setTourInputText(text);
    });
  }, []);

  // Register tour actions for auto-play system
  useEffect(() => {
    tour.registerActions({
      loadDemoFiles: handleLoadDemoFiles,
      sendMessage: handleSendMessage,
      acceptFile: () => handleAcceptFile(),
      getAppState: () => appStateRef.current,
      fillInput: fillInputAsync,
      skipProcessing: handleSkipProcessing,
    });
  }, [tour, handleLoadDemoFiles, handleSendMessage, handleAcceptFile, fillInputAsync, handleSkipProcessing]);

  const handleRequestChanges = useCallback(() => {
    setAppState("iterating");
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "assistant",
        content: "Sure, what would you like me to adjust?",
      },
    ]);
  }, [nextId]);

  const handleNewConversation = useCallback(() => {
    setAppState("idle");
    setDemoFiles([]);
    setMessages([{ id: "greeting", role: "assistant", content: HENRY_GREETING }]);
    setApprovedFile(null);
    setIsFirstSubmit(true);
    setMobileTab("chat");
    messageIdCounter.current = 0;
  }, []);

  const handleWelcomeStartTour = useCallback(() => {
    setShowWelcome(false);
    tour.startTour();
  }, [tour]);

  const handleWelcomeSkip = useCallback(() => {
    setShowWelcome(false);
    tour.skipTour();
  }, [tour]);

  const handleRestartTour = useCallback(() => {
    // Clear welcome overlay localStorage so it shows again
    localStorage.removeItem("henry_welcome_seen");
    // Reset app state
    handleNewConversation();
    // Show the welcome overlay
    setShowWelcome(true);
  }, [handleNewConversation]);

  return (
    <div className="flex flex-col h-screen bg-bg-primary">
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 md:px-7 shrink-0"
        style={{ height: "56px" }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center justify-center rounded-lg font-serif text-base"
            style={{
              width: "28px",
              height: "28px",
              background: "linear-gradient(135deg, #C9A96E 0%, #8B7340 100%)",
              color: "#0C0B0F",
              fontWeight: 400,
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            H
          </motion.div>
          <div className="flex flex-col">
            <span className="font-serif text-text-primary" style={{ fontSize: "17px", lineHeight: "1.2" }}>
              Henry
            </span>
            <span
              className="text-text-muted hidden sm:block"
              style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 500 }}
            >
              by Crew Wealth
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Tooltip text="Restart guided tour" position="bottom">
            <button
              type="button"
              onClick={handleRestartTour}
              className="transition-all duration-200"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.3)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              ↻
            </button>
          </Tooltip>
          {appState !== "idle" && (
            <Tooltip text="Reset and start fresh with a new client deck" position="bottom">
              <button
                type="button"
                onClick={handleNewConversation}
                className="transition-all duration-200"
                style={{
                  fontSize: "11.5px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  minHeight: "32px",
                }}
              >
                New Conversation
              </button>
            </Tooltip>
          )}
        </div>
      </header>

      {/* Header bottom glow line */}
      <div
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.15) 50%, transparent 100%)",
        }}
      />

      {/* Stage container */}
      <div
        className="flex flex-col flex-1 min-h-0 overflow-hidden noise-overlay"
        style={{
          margin: "20px",
          background: "#131217",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* Mobile tab bar */}
        <div
          className="flex md:hidden shrink-0"
          style={{ height: "44px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
        >
          <button
            type="button"
            onClick={() => setMobileTab("chat")}
            className="flex-1 flex items-center justify-center transition-colors duration-200"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: mobileTab === "chat" ? "#C9A96E" : "rgba(255,255,255,0.3)",
              borderBottom: mobileTab === "chat" ? "2px solid #C9A96E" : "2px solid transparent",
            }}
          >
            Chat
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("files")}
            className="flex-1 flex items-center justify-center transition-colors duration-200"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: mobileTab === "files" ? "#C9A96E" : "rgba(255,255,255,0.3)",
              borderBottom: mobileTab === "files" ? "2px solid #C9A96E" : "2px solid transparent",
            }}
          >
            Files
          </button>
        </div>

        {/* Desktop: two-panel layout */}
        <div className="hidden md:flex flex-1 min-h-0">
          <div className="flex flex-col w-1/2 shrink-0">
            <LeftPanel
              appState={appState}
              demoFiles={demoFiles}
              messages={messages}
              onLoadDemoFiles={handleLoadDemoFiles}
              onSendMessage={handleSendMessage}
              onAcceptFile={handleAcceptFile}
              onRequestChanges={handleRequestChanges}
              isTransferring={isTransferring}
              tourFillText={tourInputText}
              onTourFillConsumed={() => {
                setTourInputText("");
                if (typewriterResolveRef.current) {
                  typewriterResolveRef.current();
                  typewriterResolveRef.current = null;
                }
              }}
            />
          </div>
          {/* Gradient divider */}
          <div
            style={{
              width: "1px",
              background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
            }}
          />
          <div
            ref={rightPanelRef}
            className="flex flex-col flex-1 min-w-0"
            style={{ background: "rgba(201,169,110,0.01)" }}
          >
            <RightPanel appState={appState} approvedFile={approvedFile} />
          </div>
        </div>

        {/* Mobile: single panel with tabs */}
        <div className="flex md:hidden flex-1 min-h-0">
          {mobileTab === "chat" ? (
            <div className="flex flex-col w-full">
              <LeftPanel
                appState={appState}
                demoFiles={demoFiles}
                messages={messages}
                onLoadDemoFiles={handleLoadDemoFiles}
                onSendMessage={handleSendMessage}
                onAcceptFile={handleAcceptFile}
                onRequestChanges={handleRequestChanges}
                isTransferring={isTransferring}
                tourFillText={tourInputText}
                onTourFillConsumed={() => {
                  setTourInputText("");
                  if (typewriterResolveRef.current) {
                    typewriterResolveRef.current();
                    typewriterResolveRef.current = null;
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <RightPanel appState={appState} approvedFile={approvedFile} />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center shrink-0" style={{ height: "40px" }}>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.5px" }}>
          Powered by Claude · Built by Crew Wealth
        </span>
      </div>

      {/* Flying card during transfer */}
      <AnimatePresence>
        {isTransferring && transferOrigin && transferTarget && (
          <motion.div
            key="flying-card"
            initial={{
              position: "fixed",
              left: transferOrigin.x,
              top: transferOrigin.y,
              width: transferOrigin.width,
              height: transferOrigin.height,
              zIndex: 9999,
              opacity: 1,
              rotate: 0,
              scale: 1,
            }}
            animate={{
              left: transferTarget.x - (transferOrigin.width * 0.7) / 2,
              top: transferTarget.y - 100,
              width: transferOrigin.width * 0.7,
              scale: 0.7,
              rotate: [0, 3, -2, 0],
              opacity: 1,
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
              rotate: { duration: 0.6, ease: "easeInOut" },
            }}
            style={{ pointerEvents: "none" }}
          >
            {/* Mini card representation */}
            <div
              style={{
                background: "rgba(201,169,110,0.1)",
                border: "2px solid rgba(201,169,110,0.3)",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 8px 32px rgba(201,169,110,0.15), 0 0 60px rgba(201,169,110,0.08)",
                backdropFilter: "blur(8px)",
                height: "100%",
              }}
            >
              <div className="flex items-center gap-3">
                <span style={{ fontSize: "16px", color: "#C9A96E" }}>&#9670;</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                    Henderson_Annual_Review_2026.key
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>2.4 MB</div>
                </div>
              </div>
            </div>

            {/* Motion trail */}
            <motion.div
              initial={{ opacity: 0.4, scaleX: 0 }}
              animate={{ opacity: 0, scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                position: "absolute",
                top: "50%",
                right: "100%",
                width: "100px",
                height: "2px",
                background: "linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.3) 100%)",
                transformOrigin: "right center",
                pointerEvents: "none",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tour system */}
      <TourProgressBar />
      <TourCard onFillInput={handleTourFillInput} />

      {/* Welcome overlay */}
      <WelcomeOverlay
        onStartTour={handleWelcomeStartTour}
        onSkip={handleWelcomeSkip}
        forceShow={showWelcome}
      />
    </div>
  );
}
