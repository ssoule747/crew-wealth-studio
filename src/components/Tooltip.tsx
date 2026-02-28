"use client";

import { useState, useRef, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: "top" | "bottom";
  delay?: number;
}

export default function Tooltip({ text, children, position = "top", delay = 500 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      style={{ position: "relative", display: "inline-flex" }}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: position === "top" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              ...(position === "top"
                ? { bottom: "calc(100% + 8px)" }
                : { top: "calc(100% + 8px)" }),
              left: "50%",
              transform: "translateX(-50%)",
              background: "#232129",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px",
              padding: "6px 10px",
              fontSize: "11px",
              color: "rgba(255,255,255,0.6)",
              whiteSpace: "nowrap",
              zIndex: 999,
              pointerEvents: "none",
            }}
          >
            {text}
            {/* Arrow */}
            <div
              style={{
                position: "absolute",
                ...(position === "top"
                  ? {
                      bottom: "-4px",
                      borderLeft: "4px solid transparent",
                      borderRight: "4px solid transparent",
                      borderTop: "4px solid #232129",
                    }
                  : {
                      top: "-4px",
                      borderLeft: "4px solid transparent",
                      borderRight: "4px solid transparent",
                      borderBottom: "4px solid #232129",
                    }),
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
