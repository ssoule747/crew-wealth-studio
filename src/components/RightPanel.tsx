"use client";

import { useState } from "react";
import { SlidePreviewPanel } from "@/components/SlidePreview";

interface RightPanelProps {
  activeSlideId: number | null;
  updatedSlideIds: Set<number>;
  mentionedSlideId: number | null;
  onSlideClick?: (slideId: number) => void;
  showDownload: boolean;
}

export default function RightPanel({
  activeSlideId,
  updatedSlideIds,
  mentionedSlideId,
  onSlideClick,
  showDownload,
}: RightPanelProps) {
  const [downloaded, setDownloaded] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#111015]">
      {/* Slide Preview Panel - takes up all available space */}
      <div className="flex-1 overflow-hidden">
        <SlidePreviewPanel
          activeSlideId={activeSlideId}
          updatedSlideIds={updatedSlideIds}
          mentionedSlideId={mentionedSlideId}
          onSlideClick={onSlideClick}
        />
      </div>

      {/* Download Button - slides up when ready */}
      <div
        className={`border-t border-white/[0.06] overflow-hidden transition-all duration-500 ease-out ${
          showDownload ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4">
          <button
            onClick={() => setDownloaded(true)}
            className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              downloaded
                ? "bg-[#8BC96E]/15 text-[#8BC96E] border border-[#8BC96E]/25"
                : "bg-gradient-to-r from-[#C9A96E] to-[#8B7340] text-white hover:brightness-110 hover:scale-[1.01] active:scale-[0.99]"
            }`}
            style={
              !downloaded
                ? {
                    boxShadow: "0 0 20px rgba(201, 169, 110, 0.15)",
                    animation: "breathe-glow 4s ease-in-out infinite",
                  }
                : undefined
            }
          >
            {downloaded ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Keynote Downloaded
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download Updated Keynote &rarr;
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
