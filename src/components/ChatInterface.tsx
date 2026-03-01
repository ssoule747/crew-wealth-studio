"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import type {
  ChatMessage,
  SuggestedPrompt,
  ConversationPhase,
  TableData,
} from "@/lib/useConversation";
import { DEMO_FILES } from "@/lib/mockData";

// ===============================================
// PROPS
// ===============================================

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isTyping: boolean;
  typingProgress: number;
  suggestedPrompts: SuggestedPrompt[];
  onPromptClick: (promptId: string) => void;
  onSendMessage: (text: string) => void;
  inputPlaceholder: string;
  inputDisabled: boolean;
  phase: ConversationPhase;
  onSlideClick?: (slideId: number) => void;
  onFileChipClick?: () => void;
}

// ===============================================
// MESSAGE TABLE
// ===============================================

function MessageTable({ data }: { data: TableData }) {
  return (
    <div className="my-3 overflow-x-auto rounded-lg border border-white/[0.08] bg-[#111015]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.08] bg-[#5B9BAD]/[0.03]">
            {data.headers.map((h, i) => (
              <th
                key={i}
                className={`px-4 py-2.5 text-left text-xs font-medium text-[#5B9BAD] uppercase tracking-wider ${
                  data.alignRight?.includes(i) ? "text-right" : ""
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-white/[0.04] last:border-0"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-2.5 text-sm ${
                    data.alignRight?.includes(ci)
                      ? "text-right font-mono text-text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ===============================================
// CONTENT PARSER
// ===============================================

function renderMessageContent(
  content: string,
  onSlideClick?: (id: number) => void
): ReactNode {
  const lines = content.split("\n");

  return lines.map((line, i) => {
    // Horizontal rule
    if (line.trim() === "---") {
      return <hr key={i} className="border-white/[0.08] my-3" />;
    }

    // Blank line
    if (line.trim() === "") {
      return <br key={i} />;
    }

    // Process inline formatting: bold + slide refs
    const processed = processInline(line, onSlideClick);

    // Bullet / emoji indentation
    const trimmed = line.trimStart();
    const isBullet =
      trimmed.startsWith("\u2022") ||
      trimmed.startsWith("\u2705") ||
      trimmed.startsWith("\u26A0\uFE0F") ||
      trimmed.startsWith("\u2713");
    const isNumbered = /^\d+\./.test(trimmed);

    return (
      <div
        key={i}
        className={`${isBullet || isNumbered ? "pl-4" : ""} ${
          line.startsWith("|") ? "font-mono text-xs" : ""
        }`}
      >
        {processed}
      </div>
    );
  });
}

/**
 * Process a single line for **bold** and Slide N references.
 * Returns an array of ReactNode fragments.
 */
function processInline(
  text: string,
  onSlideClick?: (id: number) => void
): ReactNode[] {
  // Split on bold markers first
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);

  return boldParts.map((part, j) => {
    // Bold segment
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={j} className="text-[#C9A96E] font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Within non-bold segments, look for Slide references
    const slideRefParts = part.split(/(Slide \d+)/g);
    return slideRefParts.map((sp, k) => {
      const slideMatch = sp.match(/^Slide (\d+)$/);
      if (slideMatch) {
        const slideId = parseInt(slideMatch[1], 10);
        return (
          <button
            key={`${j}-${k}`}
            onClick={() => onSlideClick?.(slideId)}
            className="text-[#5B9BAD] hover:text-[#7DC0D0] underline underline-offset-2 decoration-[#5B9BAD]/30 hover:decoration-[#5B9BAD]/60 transition-colors cursor-pointer"
          >
            Slide {slideId}
          </button>
        );
      }
      return <span key={`${j}-${k}`}>{sp}</span>;
    });
  });
}

// ===============================================
// HENRY AVATAR
// ===============================================

function HenryAvatar() {
  return (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A96E]/20 to-[#8B7340]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-[#C9A96E] text-xs font-serif font-bold">H</span>
    </div>
  );
}

// ===============================================
// MAIN COMPONENT
// ===============================================

export default function ChatInterface({
  messages,
  isTyping,
  typingProgress,
  suggestedPrompts,
  onPromptClick,
  onSendMessage,
  inputPlaceholder,
  inputDisabled,
  phase,
  onSlideClick,
  onFileChipClick,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or typing state changes
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput("");
  };

  return (
    <>
      {/* Inject fadeSlideUp keyframe */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="flex flex-col h-full">
        {/* ---- Scrollable message area ---- */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
          {/* File Chips */}
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs text-text-muted mb-2">
              Loaded files for Lucy C&apos;s annual review
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DEMO_FILES.map((file) => (
                <button
                  type="button"
                  key={file.name}
                  onClick={() => onFileChipClick?.()}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border cursor-pointer hover:brightness-125 transition-all ${
                    file.ext === "key"
                      ? "border-[#C9A96E]/30 text-[#C9A96E] bg-[#C9A96E]/5"
                      : "border-[#5B9BAD]/30 text-[#5B9BAD] bg-[#5B9BAD]/5"
                  }`}
                >
                  <span>{file.icon}</span>
                  <span className="truncate max-w-[160px]">{file.name}</span>
                  <span className="text-text-muted">{file.size}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          {messages.map((msg) =>
            msg.role === "assistant" ? (
              <div key={msg.id} className="flex gap-3 px-4 py-3">
                <HenryAvatar />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                    {renderMessageContent(msg.content, onSlideClick)}
                  </div>
                  {msg.isTable && msg.tableData && (
                    <MessageTable data={msg.tableData} />
                  )}
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex justify-end px-4 py-3">
                <div className="bg-[#1a1a1f] rounded-2xl px-4 py-2.5 max-w-[80%] border border-white/[0.06]">
                  <p className="text-sm text-text-primary">{msg.content}</p>
                </div>
              </div>
            )
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-1 px-4 py-3">
              <div className="flex items-center gap-1.5">
                <HenryAvatar />
                <div className="flex items-center gap-1 px-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar (loading phase) */}
          {phase === "loading" && typingProgress > 0 && typingProgress < 100 && (
            <div className="mx-4 my-2">
              <div className="h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A96E] to-[#5B9BAD] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${typingProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-text-muted mt-1.5">
                Analyzing files...
              </p>
            </div>
          )}
        </div>

        {/* ---- Suggested Prompts ---- */}
        {suggestedPrompts.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2.5 md:flex-row flex-col">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={prompt.id}
                onClick={() => onPromptClick(prompt.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  prompt.variant === "primary"
                    ? "bg-gradient-to-r from-[#C9A96E] to-[#8B7340] text-white hover:brightness-110 hover:scale-[1.02]"
                    : "border border-[#C9A96E]/40 text-[#C9A96E] hover:bg-[#C9A96E]/10"
                }`}
                style={{
                  animation: `fadeSlideUp 300ms ease ${600 + i * 100}ms both`,
                  minHeight: "44px",
                }}
              >
                {prompt.label}
              </button>
            ))}
          </div>
        )}

        {/* ---- Input Bar ---- */}
        <div className="px-4 py-3 border-t border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2 bg-[#141318] rounded-xl px-4 py-2.5 border border-white/[0.06] focus-within:border-[#C9A96E]/30 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && input.trim()) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={inputPlaceholder}
              disabled={inputDisabled}
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none disabled:opacity-40 min-h-[24px]"
              style={{ fontSize: "16px" }}
            />
            <button
              onClick={handleSend}
              disabled={inputDisabled || !input.trim()}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-20 bg-gradient-to-br from-[#C9A96E] to-[#8B7340] hover:brightness-110"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
