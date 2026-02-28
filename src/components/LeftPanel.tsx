"use client";

import { motion, AnimatePresence } from "framer-motion";
import ChatInterface from "./ChatInterface";
import type { ChatMessage } from "@/app/page";
import type { DemoFile, AppState } from "@/lib/mockData";

interface LeftPanelProps {
  appState: AppState;
  demoFiles: DemoFile[];
  messages: ChatMessage[];
  onLoadDemoFiles: () => void;
  onSendMessage: (text: string) => void;
  onAcceptFile: (cardRect?: DOMRect) => void;
  onRequestChanges: () => void;
  isTransferring?: boolean;
  tourFillText?: string;
  onTourFillConsumed?: () => void;
}

export default function LeftPanel({
  appState,
  demoFiles,
  messages,
  onLoadDemoFiles,
  onSendMessage,
  onAcceptFile,
  onRequestChanges,
  isTransferring,
  tourFillText,
  onTourFillConsumed,
}: LeftPanelProps) {
  const hasFiles = demoFiles.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* File Workspace Bar — compact top section */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          minHeight: "56px",
          maxHeight: "80px",
        }}
      >
        <AnimatePresence mode="wait">
          {!hasFiles ? (
            <motion.button
              key="load-btn"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={onLoadDemoFiles}
              className="flex items-center justify-center w-full transition-all duration-200"
              style={{
                height: "44px",
                border: "1.5px dashed rgba(201,169,110,0.25)",
                borderRadius: "10px",
                background: "rgba(201,169,110,0.03)",
                color: "rgba(201,169,110,0.6)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,169,110,0.06)";
                e.currentTarget.style.borderColor = "rgba(201,169,110,0.4)";
                e.currentTarget.style.color = "rgba(201,169,110,0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(201,169,110,0.03)";
                e.currentTarget.style.borderColor = "rgba(201,169,110,0.25)";
                e.currentTarget.style.color = "rgba(201,169,110,0.6)";
              }}
            >
              <span style={{ fontSize: "16px" }}>＋</span>
              Load Demo Files
            </motion.button>
          ) : (
            <motion.div
              key="file-chips"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 flex-wrap"
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  marginRight: "4px",
                }}
              >
                Files
              </span>
              {demoFiles.map((file, i) => (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, scale: 0.8, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.15 }}
                  className="flex items-center gap-1.5 rounded-full"
                  style={{
                    padding: "4px 10px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  <span style={{ color: file.color, fontSize: "10px" }}>{file.icon}</span>
                  <span style={{ maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {file.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Area — takes remaining space */}
      <div className="flex-1 min-h-0">
        <ChatInterface
          appState={appState}
          messages={messages}
          hasFiles={hasFiles}
          onSendMessage={onSendMessage}
          onAcceptFile={onAcceptFile}
          onRequestChanges={onRequestChanges}
          isTransferring={isTransferring}
          tourFillText={tourFillText}
          onTourFillConsumed={onTourFillConsumed}
        />
      </div>
    </div>
  );
}
