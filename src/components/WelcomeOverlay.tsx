"use client";

import { useState, useEffect } from "react";

interface WelcomeOverlayProps {
  onStart: () => void;
}

export default function WelcomeOverlay({ onStart }: WelcomeOverlayProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animations after mount
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleStart = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onStart();
    }, 350);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes welcomeFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes welcomeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes welcomeScaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes welcomeDividerGrow {
          from { width: 0; opacity: 0; }
          to { width: 60px; opacity: 1; }
        }
        @keyframes welcomeGlow {
          0%, 100% { opacity: 0.04; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.12; transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>

      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
        style={{
          background: "rgba(12, 11, 15, 0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          opacity: exiting ? 0 : mounted ? 1 : 0,
          transition: "opacity 350ms ease",
        }}
      >
        <div className="max-w-[520px] w-full px-6 flex flex-col items-center text-center">
          {/* Logo */}
          <div
            className="relative mb-7"
            style={{
              animation: mounted ? "welcomeScaleIn 400ms ease 300ms both" : "none",
            }}
          >
            {/* Glow */}
            <div
              className="absolute top-1/2 left-1/2 w-[120px] h-[120px] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(201,169,110,0.25) 0%, transparent 70%)",
                animation: "welcomeGlow 4s ease-in-out infinite",
              }}
            />
            <div className="w-14 h-14 rounded-xl flex items-center justify-center font-serif text-2xl text-[#C9A96E] relative bg-[#C9A96E]/[0.04] border border-[#C9A96E]/20"
              style={{ backgroundImage: "linear-gradient(135deg, rgba(201,169,110,0.08) 0%, transparent 100%)" }}
            >
              H
            </div>
          </div>

          {/* Title */}
          <h1
            className="font-serif text-[32px] text-white/90 mb-2 leading-tight"
            style={{ animation: mounted ? "welcomeSlideUp 400ms ease 500ms both" : "none" }}
          >
            Meet Henry
          </h1>

          {/* Subtitle */}
          <p
            className="text-sm text-[#C9A96E] tracking-wider mb-6"
            style={{ animation: mounted ? "welcomeFadeIn 300ms ease 650ms both" : "none" }}
          >
            AI Presentation Assistant
          </p>

          {/* Divider */}
          <div
            className="h-px bg-[#C9A96E]/20 mb-6"
            style={{ animation: mounted ? "welcomeDividerGrow 400ms ease 750ms both" : "none" }}
          />

          {/* Description */}
          <p
            className="text-sm text-white/55 leading-relaxed max-w-[420px] mb-7"
            style={{ animation: mounted ? "welcomeFadeIn 400ms ease 850ms both" : "none" }}
          >
            Henry helps wealth managers update client presentations in minutes
            instead of hours. Drop in last year&apos;s Keynote along with new
            financial data, tell Henry what to change, and he&apos;ll
            rebuild the deck &mdash; ready for your next client meeting.
          </p>

          {/* Demo context */}
          <div
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-5 py-4 mb-8 max-w-[420px] w-full"
            style={{ animation: mounted ? "welcomeFadeIn 300ms ease 1000ms both" : "none" }}
          >
            <p className="text-xs text-[#C9A96E]/80 uppercase tracking-wider mb-2 font-medium">
              In this demo
            </p>
            <p className="text-[13px] text-white/45 leading-relaxed">
              You&apos;ll see Henry analyze Lucy C&apos;s annual review files,
              identify what needs updating across 13 slides, and generate the
              revised presentation &mdash; all through a natural conversation.
            </p>
          </div>

          {/* Features */}
          <div
            className="flex items-center justify-center gap-4 flex-wrap mb-9"
            style={{ animation: mounted ? "welcomeFadeIn 300ms ease 1100ms both" : "none" }}
          >
            {[
              { icon: "◆", label: "Reads Keynotes" },
              { icon: "📊", label: "Analyzes Data" },
              { icon: "✏️", label: "Writes Updates" },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="text-white/10 text-[10px] mr-2">·</span>
                )}
                <span className="text-sm text-[#C9A96E]">{item.icon}</span>
                <span className="text-xs text-white/40">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Start button */}
          <button
            type="button"
            onClick={handleStart}
            className="px-10 py-3.5 rounded-xl text-sm font-semibold tracking-wide cursor-pointer hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all mb-4"
            style={{
              background: "linear-gradient(135deg, #C9A96E, #A8884A)",
              color: "#0C0B0F",
              minHeight: "48px",
              animation: mounted ? "welcomeSlideUp 400ms ease 1200ms both" : "none",
            }}
          >
            Start Demo →
          </button>
        </div>

        {/* Footer */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ animation: mounted ? "welcomeFadeIn 300ms ease 1500ms both" : "none" }}
        >
          <span className="text-[10px] text-white/15 tracking-wider uppercase">
            Built for Crew Wealth Management
          </span>
        </div>
      </div>
    </>
  );
}
