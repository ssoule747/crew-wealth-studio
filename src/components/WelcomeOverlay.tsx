"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/lib/useIsMobile";

const WELCOME_SEEN_KEY = "henry_welcome_seen";

interface WelcomeOverlayProps {
  onStartTour: () => void;
  onSkip: () => void;
  forceShow?: boolean;
}

export default function WelcomeOverlay({ onStartTour, onSkip, forceShow }: WelcomeOverlayProps) {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(WELCOME_SEEN_KEY);
    if (!seen) {
      setIsVisible(true);
    }
  }, []);

  // Allow parent to force-show (e.g. Restart Tour)
  useEffect(() => {
    if (forceShow) {
      setIsExiting(false);
      setIsVisible(true);
    }
  }, [forceShow]);

  const handleStartTour = () => {
    localStorage.setItem(WELCOME_SEEN_KEY, "true");
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onStartTour();
    }, 350);
  };

  const handleSkip = () => {
    localStorage.setItem(WELCOME_SEEN_KEY, "true");
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onSkip();
    }, 350);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(12, 11, 15, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {/* Content */}
          <div
            style={{
              maxWidth: isMobile ? "100%" : "520px",
              width: "100%",
              padding: isMobile ? "0 16px" : "0 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* 1. Henry logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              style={{ position: "relative", marginBottom: "28px" }}
            >
              {/* Glow */}
              <motion.div
                animate={{ opacity: [0.04, 0.12, 0.04], scale: [1, 1.15, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: isMobile ? "90px" : "120px",
                  height: isMobile ? "90px" : "120px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(201,169,110,0.25) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                className="flex items-center justify-center rounded-xl font-serif"
                style={{
                  width: isMobile ? "44px" : "56px",
                  height: isMobile ? "44px" : "56px",
                  background: "rgba(201,169,110,0.04)",
                  border: "1.5px solid rgba(201,169,110,0.2)",
                  backgroundImage: "linear-gradient(135deg, rgba(201,169,110,0.08) 0%, transparent 100%)",
                  color: "#C9A96E",
                  fontSize: isMobile ? "20px" : "24px",
                  position: "relative",
                }}
              >
                H
              </div>
            </motion.div>

            {/* 2. Title */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="font-serif"
              style={{
                fontSize: isMobile ? "26px" : "32px",
                color: "rgba(255,255,255,0.9)",
                marginBottom: "8px",
                lineHeight: "1.2",
              }}
            >
              Meet Henry
            </motion.h1>

            {/* 3. Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.65 }}
              style={{
                fontSize: "14px",
                color: "#C9A96E",
                letterSpacing: "1px",
                marginBottom: "24px",
              }}
            >
              Your AI Presentation Assistant
            </motion.p>

            {/* 4. Divider */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "60px", opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.75 }}
              style={{
                height: "1px",
                background: "rgba(201,169,110,0.2)",
                marginBottom: "24px",
              }}
            />

            {/* 5. Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.85 }}
              style={{
                fontSize: isMobile ? "13px" : "14px",
                color: "rgba(255,255,255,0.55)",
                lineHeight: "1.8",
                maxWidth: isMobile ? "340px" : "420px",
                marginBottom: isMobile ? "24px" : "28px",
              }}
            >
              Henry helps wealth managers update client presentations in minutes
              instead of hours. Drop in last year&apos;s Keynote along with new
              financial data, tell Henry what to change in plain English, and
              he&apos;ll rebuild the deck — ready for your next client meeting.
            </motion.p>

            {/* 6. Feature highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.0 }}
              className="flex items-center justify-center gap-4 flex-wrap"
              style={{ marginBottom: "36px" }}
            >
              {[
                { icon: "◆", label: "Reads Keynotes" },
                { icon: "📊", label: "Analyzes Data" },
                { icon: "✏️", label: "Writes Updates" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 1.0 + i * 0.15 }}
                  className="flex items-center gap-2"
                >
                  {i > 0 && (
                    <span
                      style={{
                        color: "rgba(255,255,255,0.1)",
                        fontSize: "10px",
                        marginRight: "8px",
                      }}
                    >
                      ·
                    </span>
                  )}
                  <span style={{ fontSize: "14px", color: "#C9A96E" }}>
                    {item.icon}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* 7. Start Tour button */}
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.2 }}
              onClick={handleStartTour}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: isMobile ? "16px 40px" : "14px 40px",
                minHeight: "48px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #C9A96E, #A8884A)",
                color: "#0C0B0F",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.3px",
                cursor: "pointer",
                marginBottom: "16px",
              }}
            >
              Take a Quick Tour →
            </motion.button>

            {/* 8. Skip link */}
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.4 }}
              onClick={handleSkip}
              style={{
                background: "none",
                border: "none",
                fontSize: "12px",
                color: "rgba(255,255,255,0.3)",
                cursor: "pointer",
                padding: "4px",
                marginBottom: "40px",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.3)";
              }}
            >
              Skip and explore on my own
            </motion.button>
          </div>

          {/* 9. Footer credit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.5 }}
            style={{
              position: "absolute",
              bottom: isMobile ? "calc(16px + env(safe-area-inset-bottom, 0px))" : "32px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.15)",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Built for Crew Wealth Management
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
