"use client";

import { useState, useEffect, useRef } from "react";
import { useConversation } from "@/lib/useConversation";
import { useIsMobile } from "@/lib/useIsMobile";
import { SlidePreviewPanel } from "@/components/SlidePreview";
import ChatInterface from "@/components/ChatInterface";
import WaitingFolder from "@/components/WaitingFolder";
import FileTransfer from "@/components/FileTransfer";
import DemoModal from "@/components/DemoModal";

export default function Home() {
  const conversation = useConversation();
  const isMobile = useIsMobile();
  const [mobileTab, setMobileTab] = useState<"chat" | "slides">("chat");
  const [folderState, setFolderState] = useState<"waiting" | "ready">("waiting");
  const [triggerCatch, setTriggerCatch] = useState(false);
  const [showFileTransfer, setShowFileTransfer] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const folderRef = useRef<HTMLDivElement>(null);
  const transferStartRef = useRef<HTMLDivElement>(null);

  // Auto-start conversation on mount
  useEffect(() => {
    conversation.startConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger file transfer when animation phase changes to "transferring"
  useEffect(() => {
    if (conversation.animationPhase === "transferring") {
      setShowFileTransfer(true);
    }
  }, [conversation.animationPhase]);

  // Mobile: auto-switch tab when transfer starts
  useEffect(() => {
    if (conversation.animationPhase === "transferring" && isMobile) {
      const timer = setTimeout(() => setMobileTab("slides"), 600);
      return () => clearTimeout(timer);
    }
  }, [conversation.animationPhase, isMobile]);

  return (
    <div className="flex flex-col h-screen bg-bg-primary">
      {/* ── HEADER ── 56px fixed */}
      <header className="flex items-center justify-between px-5 h-14 bg-[#0a0a0e] border-b border-white/[0.04] flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          {/* Gold H icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A96E] to-[#8B7340] flex items-center justify-center">
            <span className="text-white font-serif text-sm font-bold">H</span>
          </div>
          <span className="text-[#C9A96E] font-serif text-lg">Henry</span>
          <span className="text-text-muted mx-1">&mdash;</span>
          <span className="text-text-secondary text-sm">Lucy C Annual Review</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              conversation.resetConversation();
              setFolderState("waiting");
              setTriggerCatch(false);
              setShowFileTransfer(false);
              setDownloaded(false);
              setShowDemoModal(false);
              setMobileTab("chat");
              // Re-start after a tick so reset completes
              setTimeout(() => conversation.startConversation(), 100);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted border border-white/[0.08] hover:border-[#C9A96E]/30 hover:text-[#C9A96E] transition-all"
          >
            Restart Demo
          </button>
          <span className="hidden md:inline text-white/[0.3] text-xs tracking-wide">Crew Wealth Management</span>
        </div>
      </header>

      {/* ── MOBILE TAB BAR ── */}
      {isMobile && (
        <div className="flex border-b border-border bg-bg-secondary flex-shrink-0">
          <button
            type="button"
            onClick={() => setMobileTab("chat")}
            className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
              mobileTab === "chat"
                ? "border-[#5B9BAD] text-text-primary"
                : "border-transparent text-text-muted"
            }`}
          >
            Chat
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("slides")}
            className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors relative ${
              mobileTab === "slides"
                ? "border-[#5B9BAD] text-text-primary"
                : "border-transparent text-text-muted"
            }`}
          >
            Slides
            {conversation.updatedSlideIds.size > 0 && mobileTab !== "slides" && (
              <span className="absolute top-2 right-[30%] w-2 h-2 rounded-full bg-green" />
            )}
          </button>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="flex flex-1 overflow-hidden">
        {/* CHAT PANEL — 58% desktop, full width on mobile "chat" tab */}
        <div
          className={`relative ${
            isMobile
              ? mobileTab === "chat"
                ? "w-full flex flex-col"
                : "hidden"
              : "w-[58%] flex flex-col"
          }`}
        >
          <ChatInterface
            messages={conversation.messages}
            isTyping={conversation.isTyping}
            typingProgress={conversation.typingProgress}
            suggestedPrompts={conversation.suggestedPrompts}
            onPromptClick={conversation.handlePromptClick}
            onSendMessage={conversation.handleUserMessage}
            inputPlaceholder={conversation.inputPlaceholder}
            inputDisabled={conversation.inputDisabled}
            phase={conversation.phase}
            onSlideClick={(slideId: number) => {
              if (isMobile) setMobileTab("slides");
            }}
            onFileChipClick={() => setShowDemoModal(true)}
          />
          {/* Transfer animation start point */}
          <div ref={transferStartRef} className="absolute bottom-20 left-1/2" />
        </div>

        {/* DIVIDER — desktop only */}
        {!isMobile && <div className="w-px bg-border" />}

        {/* SLIDE PANEL — 42% desktop, full width on mobile "slides" tab */}
        <div
          className={
            isMobile
              ? mobileTab === "slides" ? "w-full flex flex-col" : "hidden"
              : "w-[42%] flex flex-col"
          }
          style={folderState === "ready" ? {
            background: 'radial-gradient(ellipse at 50% 60%, rgba(201,169,110,0.04) 0%, transparent 70%)'
          } : undefined}
        >
          {/* Slide thumbnails — hidden when ready, scrollable otherwise */}
          {folderState !== "ready" && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <SlidePreviewPanel
                activeSlideId={conversation.activeSlideId}
                updatedSlideIds={conversation.updatedSlideIds}
                mentionedSlideId={conversation.mentionedSlideId}
                onSlideClick={(id) => {
                  if (isMobile) setMobileTab("slides");
                }}
              />
            </div>
          )}

          {/* Waiting Folder / Download Area */}
          <div className={`px-5 flex items-center justify-center ${
            folderState === "ready"
              ? "flex-1"
              : "flex-shrink-0 border-t border-white/[0.06] py-4"
          }`}>
            <WaitingFolder
              state={folderState}
              triggerCatch={triggerCatch}
              onDownload={() => setShowDemoModal(true)}
              downloaded={downloaded}
              folderRef={folderRef}
            />
          </div>
        </div>
      </main>

      {/* File Transfer Animation */}
      <FileTransfer
        active={showFileTransfer}
        startRef={transferStartRef}
        endRef={folderRef}
        onLanded={() => {
          // File reached the folder — trigger catch animation
          setTriggerCatch(true);
          // After catch animation, reset trigger
          setTimeout(() => {
            setTriggerCatch(false);
          }, 600);
        }}
        onComplete={() => {
          setShowFileTransfer(false);
          // Transition to ready state after a brief delay for the cascade
          setTimeout(() => {
            setFolderState("ready");
            conversation.handleTransferComplete();
          }, 1200);
        }}
      />

      {/* Demo Modal */}
      <DemoModal open={showDemoModal} onClose={() => setShowDemoModal(false)} />

      {/* ── FOOTER ── 32px */}
      <footer className="h-8 flex items-center justify-center flex-shrink-0 border-t border-white/[0.04]">
        <span className="text-[11px] text-white/[0.2]">
          Powered by Claude &middot; Demo Mode
        </span>
      </footer>
    </div>
  );
}
