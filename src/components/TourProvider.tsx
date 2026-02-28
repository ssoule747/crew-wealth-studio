"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** Actions that page.tsx registers so the tour can drive the app */
export interface TourActions {
  loadDemoFiles: () => void;
  sendMessage: (text: string) => void;
  acceptFile: () => void;
  getAppState: () => string; // returns AppState
  fillInput: (text: string) => Promise<void>; // typewriter fill, resolves when done
  skipProcessing: () => void; // fast-forward processing animation
}

export interface TourContextType {
  currentStep: number; // 0 = inactive, 1-5 = active
  isTourActive: boolean;
  isAutoPlaying: boolean;
  isPerformingAction: boolean; // true while performing a step action
  startTour: () => void;
  advanceStep: () => void;
  goToStep: (step: number) => void;
  skipTour: () => void;
  restartTour: () => void;
  registerActions: (actions: TourActions) => void;
  performStepAction: () => Promise<void>; // called by Next button
  startAutoPlay: () => void;
  pauseAutoPlay: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOUR_COMPLETED_KEY = "henry-tour-completed";
const TOTAL_STEPS = 5;
const STEP_2_TEXT =
  "Update all the financial figures to reflect 2025 actuals and refresh the market commentary for the new year";

// ---------------------------------------------------------------------------
// Helpers (module-private)
// ---------------------------------------------------------------------------

function waitForCondition(
  check: () => boolean,
  timeoutMs: number,
): Promise<boolean> {
  return new Promise((resolve) => {
    if (check()) {
      resolve(true);
      return;
    }
    const start = Date.now();
    const interval = setInterval(() => {
      if (check()) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        resolve(false);
      }
    }, 50);
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TourContext = createContext<TourContextType | null>(null);

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useTour(): TourContextType {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used inside TourProvider");
  return ctx;
}

export function useTourSafe(): TourContextType | null {
  return useContext(TourContext);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export default function TourProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  // Actions are stored in a ref to avoid re-render cascades.
  const actionsRef = useRef<TourActions | null>(null);
  const autoPlayActiveRef = useRef(false);

  // We need a ref mirror of currentStep so async helpers always see the
  // latest value without depending on stale closures.
  const stepRef = useRef(currentStep);
  useEffect(() => {
    stepRef.current = currentStep;
  }, [currentStep]);

  // ------------------------------------------------------------------
  // Basic navigation
  // ------------------------------------------------------------------

  const startTour = useCallback(() => {
    setCurrentStep(1);
    setIsTourActive(true);
  }, []);

  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next > TOTAL_STEPS) {
        setIsTourActive(false);
        localStorage.setItem(TOUR_COMPLETED_KEY, "true");
        return 0;
      }
      return next;
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
      setIsTourActive(true);
    }
  }, []);

  const skipTour = useCallback(() => {
    setCurrentStep(0);
    setIsTourActive(false);
    setIsAutoPlaying(false);
    autoPlayActiveRef.current = false;
    localStorage.setItem(TOUR_COMPLETED_KEY, "true");
  }, []);

  const restartTour = useCallback(() => {
    setCurrentStep(1);
    setIsTourActive(true);
  }, []);

  // ------------------------------------------------------------------
  // Action registration
  // ------------------------------------------------------------------

  const registerActions = useCallback((actions: TourActions) => {
    actionsRef.current = actions;
  }, []);

  // ------------------------------------------------------------------
  // performStepAction — the core action-driven method
  // ------------------------------------------------------------------

  const performStepAction = useCallback(async () => {
    const actions = actionsRef.current;
    if (!actions) {
      console.warn("[Tour] No actions registered — advancing step only.");
      advanceStep();
      return;
    }

    setIsPerformingAction(true);
    try {
      const step = stepRef.current;

      switch (step) {
        // Step 1 — Load Demo Files
        case 1: {
          const state = actions.getAppState();
          if (state === "idle") {
            actions.loadDemoFiles();
            await waitForCondition(
              () => actions.getAppState() !== "idle",
              3000,
            );
          }
          await delay(800);
          advanceStep();
          break;
        }

        // Step 2 — Tell Henry What to Change
        case 2: {
          const state = actions.getAppState();
          if (state === "files_loaded") {
            await actions.fillInput(STEP_2_TEXT);
            await delay(400);
            actions.sendMessage(STEP_2_TEXT);
            await delay(300);
          }
          advanceStep();
          break;
        }

        // Step 3 — Henry is Working
        case 3: {
          const state = actions.getAppState();
          if (state === "processing") {
            actions.skipProcessing();
          }
          if (state !== "review") {
            await waitForCondition(
              () => actions.getAppState() === "review",
              6000,
            );
          }
          await delay(500);
          advanceStep();
          break;
        }

        // Step 4 — Review & Accept
        case 4: {
          const state = actions.getAppState();
          if (state === "review") {
            actions.acceptFile();
            await waitForCondition(
              () => actions.getAppState() === "accepted",
              3000,
            );
          }
          await delay(500);
          advanceStep();
          break;
        }

        // Step 5 — Finish
        case 5: {
          setCurrentStep(0);
          setIsTourActive(false);
          setIsAutoPlaying(false);
          autoPlayActiveRef.current = false;
          localStorage.setItem(TOUR_COMPLETED_KEY, "true");
          break;
        }

        default:
          advanceStep();
      }
    } finally {
      setIsPerformingAction(false);
    }
  }, [advanceStep]);

  // ------------------------------------------------------------------
  // Auto-play mode
  // ------------------------------------------------------------------

  const startAutoPlay = useCallback(() => {
    setIsAutoPlaying(true);
    autoPlayActiveRef.current = true;

    // Kick off the async loop. We intentionally fire-and-forget here;
    // the loop guards itself via autoPlayActiveRef.
    (async () => {
      // Step-specific pauses *after* performing the action.
      const stepPauses: Record<number, number> = {
        1: 1500,
        2: 2000,
        3: 0, // step 3 already waits for processing inside performStepAction
        4: 1500,
        5: 3000,
      };

      for (let step = 1; step <= TOTAL_STEPS; step++) {
        if (!autoPlayActiveRef.current) break;

        // Ensure we're on the correct step before performing the action.
        // (The loop relies on performStepAction calling advanceStep internally.)
        await performStepAction();

        if (!autoPlayActiveRef.current) break;

        const pauseMs = stepPauses[step] ?? 1000;
        if (pauseMs > 0) await delay(pauseMs);
      }

      // Clean up auto-play state when the loop finishes.
      autoPlayActiveRef.current = false;
      setIsAutoPlaying(false);
    })();
  }, [performStepAction]);

  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
    autoPlayActiveRef.current = false;
  }, []);

  // ------------------------------------------------------------------
  // Dev-only test utility
  // ------------------------------------------------------------------

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    (window as any).__testTour = async () => {
      console.log("[Tour Test] Starting tour test...");
      restartTour();
      const start = Date.now();
      for (let step = 1; step <= 5; step++) {
        const stepStart = Date.now();
        console.log(`[Tour Test] Step ${step} → performing action...`);
        await performStepAction();
        console.log(
          `[Tour Test] Step ${step} ✓ (${Date.now() - stepStart}ms)`,
        );
      }
      console.log(
        `[Tour Test] Total flow: ${((Date.now() - start) / 1000).toFixed(1)} seconds`,
      );
    };

    return () => {
      delete (window as any).__testTour;
    };
  }, [restartTour, performStepAction]);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    <TourContext.Provider
      value={{
        currentStep,
        isTourActive,
        isAutoPlaying,
        isPerformingAction,
        startTour,
        advanceStep,
        goToStep,
        skipTour,
        restartTour,
        registerActions,
        performStepAction,
        startAutoPlay,
        pauseAutoPlay,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}
