"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// ===============================================
// CONVERSATION STATE MACHINE
// ===============================================

export type ConversationPhase = "loading" | "analysis" | "plan" | "interactive";

export interface SuggestedPrompt {
  id: string;
  label: string;
  variant: "primary" | "secondary"; // primary = gold filled, secondary = outline
}

export interface ConversationState {
  phase: ConversationPhase;
  messages: ChatMessage[];
  suggestedPrompts: SuggestedPrompt[];
  isTyping: boolean; // Henry is currently "typing"
  typingProgress: number; // 0-100 for progress bar during loading phase
  inputPlaceholder: string;
  inputDisabled: boolean;
  activeSlideId: number | null; // which slide to highlight in panel
  mentionedSlideId: number | null; // which slide to flash
  updatedSlideIds: Set<number>; // slides that have been "updated"
  showFilePreview: boolean; // show download button after updates
  slidesPopulated: boolean; // whether slide thumbnails should be visible
  animationPhase: "processing" | "transferring" | "ready" | "idle";
}

// Re-export ChatMessage type for convenience
export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  isProcessing?: boolean;
  isTable?: boolean; // render as styled table
  tableData?: TableData; // structured table data for rendering
}

export interface TableData {
  headers: string[];
  rows: string[][];
  alignRight?: number[]; // column indices to right-align (for numbers)
}

// ===============================================
// SCRIPTED MESSAGES
// ===============================================

const MSG_1_1 = `I've loaded Lucy C's annual review Keynote and her four latest portfolio statements from LPL Financial.

\u{1F4CA} Lucy_C_Annual_Review.key \u2014 13 slides
\u{1F4C4} 4 portfolio reports (as of 2/27/2026)

Analyzing files and cross-referencing data...`;

const MSG_1_2_TEXT = `Here's what I've found across Lucy's accounts:

**Total Portfolio at LPL: $2,283,715**`;

const MSG_1_2_TABLE: TableData = {
  headers: ["Account", "Type", "Value", "Strategy"],
  rows: [
    ["SAM TOD (3333)", "Non-Qualified", "$242,877", "Diversified L2"],
    ["SAM Roth IRA (1122)", "Tax-Free", "$1,093,094", "Strong Growth L4"],
    ["SAM Trad IRA (1234)", "Pre-Tax", "$34,260", "Diversified L2"],
    ["SAM Benef IRA (2222)", "Inherited", "$913,484", "Courage L3"],
  ],
  alignRight: [2],
};

const MSG_1_2_AFTER = `I've mapped these to your Keynote's 13-slide structure. **8 slides need data updates** based on the new statements.`;

const MSG_2_1 = `Here's my update plan, slide by slide:

**Slide 4 \u2014 Cash Reserve**
Your TOD account holds $10,885 in the Insured Cash Account. Combined with Roth cash ($17,110), Traditional cash ($1,253), and Beneficiary cash ($14,752) \u2014 Lucy has **$43,999 in LPL cash positions**. That exceeds her $40,000 reserve goal at LPL. I'll update the balances and note she's on target.

**Slide 6 \u2014 Taxable (TOD Account)**
The SAM TOD is now **$242,877**. This account has been drawn down significantly \u2014 it started at $1,096,437 three years ago with $1,147,218 in outflows (the real estate purchases and distributions). The $6,000/month distribution continues. Income generated: **$93,599**. Holdings are all ETFs \u2014 CGDV, JGRO, JHMM, PYLD, QINT \u2014 consistent with Level 2 Diversified.

**Slide 7 \u2014 Retirement Accounts**
Three accounts to update:
\u2022 **Roth IRA: $1,093,094** \u2014 This is the powerhouse. Up 51.41% since inception (16.17% annualized). It's 100% equities at Level 4 \u2014 individual stocks plus growth funds. NVIDIA alone is $195K (17.9% of the account).
\u2022 **Traditional IRA: $34,260** \u2014 Newer account (April 2025), up 15.67% since inception. Mix of individual stocks and ETFs.
\u2022 **Beneficiary IRA: $913,484** \u2014 Solid 33.76% return over 3 years (10.18% annualized). Same ETF model as the TOD. Generated **$97,561 in income**.

**Slide 10 \u2014 LIFE Stages**
All account-to-level assignments remain correct. I'll refresh the displayed values at each level.

**Slide 11 \u2014 Financial Ratios** \u26A0\uFE0F
This slide needs the most attention:
\u2022 Net Wealth at LPL: **$2,284K** (was $2,311K \u2014 slight decrease, consistent with TOD drawdowns)
\u2022 Tax-Free Ratio: **47.9%** ($1,093K Roth \u00F7 $2,284K total) \u2014 essentially unchanged from 48%
\u2022 Withdrawal Ratio and Debt Ratio reference mortgage data and real estate values that aren't in these portfolio PDFs \u2014 I'll flag those fields for your manual review.

**Slides 2, 9, 12** \u2014 Date rollover and action item updates.

The Keynote is ready to update. Would you like me to proceed?`;

const MSG_3A_1 = `Applying updates across the deck...`;

const MSG_3A_2 = `All updates applied. Here's the summary:

\u2705 Slide 2 \u2014 Review date updated
\u2705 Slide 4 \u2014 Cash reserves: $43,999 across LPL accounts (goal: $40,000 \u2713)
\u2705 Slide 6 \u2014 TOD value: $242,877 | Distribution: $6K/mo | Income: $93,599
\u2705 Slide 7 \u2014 Roth: $1,093,094 | Traditional: $34,260 | Beneficiary: $913,484
\u2705 Slide 9 \u2014 2025 goals marked complete, 2026 goals confirmed
\u2705 Slide 10 \u2014 LIFE Stages values refreshed across all levels
\u2705 Slide 11 \u2014 Net Wealth: $2,284K | Tax-Free Ratio: 47.9%
\u2705 Slide 12 \u2014 Action items rolled forward to 2/2026

\u26A0\uFE0F **Two items need your review:**
1. Slide 11 \u2014 Debt Ratio needs current mortgage balance confirmation
2. Slide 12 \u2014 Item #7 references refinancing discussion \u2014 confirm if Lucy and Evan have decided

The deck is ready for download.`;

const MSG_3B_1_TEXT = `The Roth IRA has notable single-stock concentration worth flagging:

**Top Individual Positions in Roth ($1,093,094):**`;

const MSG_3B_1_TABLE: TableData = {
  headers: ["Stock", "Value", "% of Roth", "% of Total Portfolio"],
  rows: [
    ["NVIDIA", "$195,263", "17.9%", "8.6%"],
    ["Palantir", "$151,732", "13.9%", "6.6%"],
    ["Berkshire", "$143,911", "13.2%", "6.3%"],
    ["Tesla", "$124,376", "11.4%", "5.4%"],
    ["Apple", "$74,499", "6.8%", "3.3%"],
  ],
  alignRight: [1, 2, 3],
};

const MSG_3B_1_AFTER = `The **top 5 individual stocks represent 63.1% of the Roth** and 30.2% of the total portfolio. NVIDIA alone is nearly 18% of the account.

This is by design \u2014 the Roth is Level 4 (Strong Growth / Long-Term) and the tax-free status makes it ideal for high-growth positions. But it's worth discussing Lucy's comfort level with this concentration, especially given she feels "optimistic but stressed about money."

I can add a concentration note to Slide 7 or create a supplemental analysis slide if you'd like.`;

const MSG_3C_1 = `Good catch \u2014 the Beneficiary IRA ($913,484) has Required Minimum Distribution obligations.

Since this is an inherited IRA, Lucy must take annual RMDs based on the SECURE Act rules. Your Slide 12 action items already note "Lucy will need to take her annual RMDs from her Mother's Benef IRA, Harry to assist."

Based on the current $913,484 balance, her 2026 RMD will depend on the applicable life expectancy divisor. I'd recommend confirming the exact calculation with your custodian, but at typical inherited IRA distribution rates, she'd be looking at roughly **$35,000\u2013$50,000** that must be distributed this year.

This is also worth connecting to the withdrawal ratio discussion \u2014 the RMD adds to her annual outflows beyond the $6K/month TOD distribution and $18K LTC premium.

Want me to add an RMD reminder to the action items on Slide 12?`;

const MSG_FALLBACK = `I can help with that. Based on Lucy's current portfolio data, let me check...

For the demo, this is where Henry would query Claude with the full context of Lucy's financial data \u2014 every position, ratio, and planning consideration from the loaded files.

Would you like me to focus on a specific account or slide?`;

const MSG_FLAG_CONCENTRATION = `I've added a concentration risk note to **Slide 7 \u2014 Retirement Accounts**:

> \u26A0\uFE0F **Roth Concentration Alert:** Top 5 individual positions represent 63.1% of the Roth IRA. NVIDIA (17.9%) and Palantir (13.9%) are the largest single-stock exposures. Consider rebalancing discussion at next review.

The note will appear in the advisor's work area section of the slide \u2014 visible to you but not in the client-facing portion. I've also added it as an action item on Slide 12.`;

const MSG_DRAFT_EMAIL = `Here's a draft summary email for Lucy:

---

**Subject: Your Annual Review \u2014 February 26, 2026**

Hi Lucy,

Thank you for meeting with me for your annual financial review. Here's a quick summary of where things stand:

**Your Portfolio: $2,283,715**
\u2022 Roth IRA: $1,093,094 \u2014 up 51% since inception, excellent growth
\u2022 Beneficiary IRA: $913,484 \u2014 generating strong income ($97K+)
\u2022 TOD Account: $242,877 \u2014 continuing $6K/month distributions
\u2022 Traditional IRA: $34,260 \u2014 off to a solid start

**Key Highlights:**
\u2713 Cash reserves ($44K) exceed your $40K target
\u2713 Tax-free assets represent 48% of your portfolio
\u2713 Estate planning documents updated with Laura Hoffman
\u2713 2026 goals confirmed \u2014 Dominica, Hawaii, RV trips!

**Action Items:**
\u2022 Review Beneficiary IRA RMD for 2026
\u2022 Confirm mortgage balance for updated ratios
\u2022 Discuss Roth concentration levels at next check-in

Your updated presentation is attached. As always, please don't hesitate to reach out with any questions.

Warm regards,
William

---

Want me to adjust the tone or add anything?`;

// ===============================================
// SUGGESTED PROMPTS BY PHASE
// ===============================================

const PROMPTS_AFTER_ANALYSIS: SuggestedPrompt[] = [
  {
    id: "walk-through",
    label: "Walk me through the updates \u2192",
    variant: "primary",
  },
];

const PROMPTS_AFTER_PLAN: SuggestedPrompt[] = [
  { id: "update-all", label: "Update all slides", variant: "primary" },
  {
    id: "roth-concentration",
    label: "Tell me more about the Roth concentration",
    variant: "secondary",
  },
  {
    id: "rmd-situation",
    label: "What about Lucy's RMD situation?",
    variant: "secondary",
  },
];

const PROMPTS_AFTER_UPDATE: SuggestedPrompt[] = [
  {
    id: "flag-concentration",
    label: "Flag the Roth concentration risk",
    variant: "secondary",
  },
  {
    id: "draft-email",
    label: "Draft a summary email for Lucy",
    variant: "secondary",
  },
];

// ===============================================
// INPUT PLACEHOLDERS BY PHASE
// ===============================================

const PLACEHOLDERS: Record<ConversationPhase, string> = {
  loading: "Henry is analyzing your files...",
  analysis: "Ask Henry about Lucy's accounts...",
  plan: "Ask a follow-up or update all slides...",
  interactive: "Ask anything about Lucy's review...",
};

// ===============================================
// SLIDE HIGHLIGHT SEQUENCES
// Slide IDs to highlight as Henry discusses them
// ===============================================

const SLIDES_NEEDING_UPDATE = [2, 4, 6, 7, 9, 10, 11, 12];
const SLIDE_UPDATE_ORDER = [2, 4, 6, 7, 9, 10, 11, 12];

// ===============================================
// THE HOOK
// ===============================================

export function useConversation() {
  const [phase, setPhase] = useState<ConversationPhase>("loading");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestedPrompts, setSuggestedPrompts] =
    useState<SuggestedPrompt[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingProgress, setTypingProgress] = useState(0);
  const [activeSlideId, setActiveSlideId] = useState<number | null>(null);
  const [mentionedSlideId, setMentionedSlideId] = useState<number | null>(
    null
  );
  const [updatedSlideIds, setUpdatedSlideIds] = useState<Set<number>>(
    new Set()
  );
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [slidesPopulated, setSlidesPopulated] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<"processing" | "transferring" | "ready" | "idle">("idle");

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear all pending timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  // Schedule a timeout and track it
  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // Add a message with typing delay
  const addMessage = useCallback(
    (msg: Omit<ChatMessage, "id">, delay: number = 0): Promise<void> => {
      return new Promise((resolve) => {
        schedule(() => {
          setIsTyping(true);
        }, delay);

        // Calculate typing duration based on content length
        const contentLength = msg.content.length;
        let typingDuration: number;
        if (contentLength < 100) typingDuration = 1500;
        else if (contentLength < 400) typingDuration = 3000;
        else typingDuration = 5000;

        schedule(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              ...msg,
              id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            },
          ]);
          resolve();
        }, delay + typingDuration);
      });
    },
    [schedule]
  );

  // Flash a slide mention (auto-clears after 600ms)
  const flashSlide = useCallback(
    (slideId: number) => {
      setMentionedSlideId(slideId);
      schedule(() => setMentionedSlideId(null), 600);
    },
    [schedule]
  );

  // Callback for when TransferWave animation completes
  const handleTransferComplete = useCallback(() => {
    setAnimationPhase("ready");
  }, []);

  // ===============================================
  // PHASE 1: LOADING (auto-plays on start)
  // ===============================================

  const startConversation = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);
    clearAllTimeouts();
    setMessages([]);
    setPhase("loading");

    // Message 1.1 - after 1s initial delay
    schedule(() => {
      setIsTyping(true);
      setAnimationPhase("processing");
    }, 1000);

    schedule(() => {
      setIsTyping(false);
      setMessages([
        {
          id: "msg-1-1",
          role: "assistant",
          content: MSG_1_1,
        },
      ]);
    }, 2500);

    // Progress bar animation (2.5s fill)
    schedule(() => setTypingProgress(10), 3000);
    schedule(() => setTypingProgress(30), 3500);
    schedule(() => setTypingProgress(55), 4000);
    schedule(() => setTypingProgress(75), 4500);
    schedule(() => setTypingProgress(90), 5000);
    schedule(() => {
      setTypingProgress(100);
      setSlidesPopulated(true); // thumbnails fade in
    }, 5500);

    // Message 1.2 - account summary with table
    schedule(() => setIsTyping(true), 6000);

    schedule(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: "msg-1-2",
          role: "assistant",
          content: MSG_1_2_TEXT,
          isTable: true,
          tableData: MSG_1_2_TABLE,
        },
        {
          id: "msg-1-2b",
          role: "assistant",
          content: MSG_1_2_AFTER,
        },
      ]);
      setPhase("analysis");
      setSuggestedPrompts(PROMPTS_AFTER_ANALYSIS);
    }, 10000);
  }, [hasStarted, clearAllTimeouts, schedule]);

  // ===============================================
  // HANDLE SUGGESTED PROMPT CLICKS
  // ===============================================

  const handlePromptClick = useCallback(
    (promptId: string) => {
      const prompt = suggestedPrompts.find((p) => p.id === promptId);
      if (!prompt) return;

      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          role: "user",
          content: prompt.label,
        },
      ]);
      setSuggestedPrompts([]);

      switch (promptId) {
        case "walk-through": {
          setPhase("plan");
          setIsTyping(true);

          // Highlight slides sequentially as Henry "discusses" them
          schedule(() => flashSlide(4), 2000);
          schedule(() => setActiveSlideId(4), 2000);
          schedule(() => flashSlide(6), 4000);
          schedule(() => setActiveSlideId(6), 4000);
          schedule(() => flashSlide(7), 6000);
          schedule(() => setActiveSlideId(7), 6000);
          schedule(() => flashSlide(10), 7500);
          schedule(() => setActiveSlideId(10), 7500);
          schedule(() => flashSlide(11), 9000);
          schedule(() => setActiveSlideId(11), 9000);
          schedule(() => flashSlide(12), 10000);
          schedule(() => setActiveSlideId(12), 10000);

          schedule(() => {
            setIsTyping(false);
            setActiveSlideId(null);
            setMessages((prev) => [
              ...prev,
              {
                id: "msg-2-1",
                role: "assistant",
                content: MSG_2_1,
              },
            ]);
            setSuggestedPrompts(PROMPTS_AFTER_PLAN);
          }, 11000);
          break;
        }

        case "update-all": {
          setPhase("interactive");
          setIsTyping(true);
          setAnimationPhase("transferring");

          // Brief "applying" message
          schedule(() => {
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: "msg-3a-1",
                role: "assistant",
                content: MSG_3A_1,
              },
            ]);
          }, 1500);

          // Cascade update animation - orange dots -> green checkmarks
          SLIDE_UPDATE_ORDER.forEach((slideId, i) => {
            schedule(() => {
              setUpdatedSlideIds(
                (prev) => new Set([...prev, slideId])
              );
              flashSlide(slideId);
            }, 2000 + i * 300);
          });

          // Final summary after cascade
          schedule(
            () => setIsTyping(true),
            2000 + SLIDE_UPDATE_ORDER.length * 300 + 500
          );

          schedule(() => {
            setIsTyping(false);
            setShowFilePreview(true);
            setMessages((prev) => [
              ...prev,
              {
                id: "msg-3a-2",
                role: "assistant",
                content: MSG_3A_2,
              },
            ]);
            setSuggestedPrompts(PROMPTS_AFTER_UPDATE);
          }, 2000 + SLIDE_UPDATE_ORDER.length * 300 + 5000);
          break;
        }

        case "roth-concentration": {
          setIsTyping(true);
          setActiveSlideId(7);

          schedule(() => {
            setIsTyping(false);
            setActiveSlideId(null);
            setMessages((prev) => [
              ...prev,
              {
                id: "msg-3b-1",
                role: "assistant",
                content: MSG_3B_1_TEXT,
                isTable: true,
                tableData: MSG_3B_1_TABLE,
              },
              {
                id: "msg-3b-1b",
                role: "assistant",
                content: MSG_3B_1_AFTER,
              },
            ]);
            // Keep existing prompts minus the one just clicked, add update if not done
            setSuggestedPrompts((prev) => {
              const remaining = prev.filter(
                (p) => p.id !== "roth-concentration"
              );
              if (!remaining.find((p) => p.id === "update-all")) {
                return [
                  {
                    id: "update-all",
                    label: "Update all slides",
                    variant: "primary" as const,
                  },
                  ...remaining,
                ];
              }
              return remaining;
            });
          }, 5000);
          break;
        }

        case "rmd-situation": {
          setIsTyping(true);
          setActiveSlideId(12);

          schedule(() => {
            setIsTyping(false);
            setActiveSlideId(null);
            setMessages((prev) => [
              ...prev,
              {
                id: "msg-3c-1",
                role: "assistant",
                content: MSG_3C_1,
              },
            ]);
            setSuggestedPrompts((prev) => {
              const remaining = prev.filter(
                (p) => p.id !== "rmd-situation"
              );
              if (!remaining.find((p) => p.id === "update-all")) {
                return [
                  {
                    id: "update-all",
                    label: "Update all slides",
                    variant: "primary" as const,
                  },
                  ...remaining,
                ];
              }
              return remaining;
            });
          }, 5000);
          break;
        }

        case "flag-concentration": {
          setIsTyping(true);
          flashSlide(7);

          schedule(() => {
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: "msg-flag",
                role: "assistant",
                content: MSG_FLAG_CONCENTRATION,
              },
            ]);
            setSuggestedPrompts((prev) =>
              prev.filter((p) => p.id !== "flag-concentration")
            );
          }, 3500);
          break;
        }

        case "draft-email": {
          setIsTyping(true);

          schedule(() => {
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: "msg-email",
                role: "assistant",
                content: MSG_DRAFT_EMAIL,
              },
            ]);
            setSuggestedPrompts((prev) =>
              prev.filter((p) => p.id !== "draft-email")
            );
          }, 5000);
          break;
        }
      }
    },
    [suggestedPrompts, schedule, flashSlide]
  );

  // ===============================================
  // HANDLE FREE-FORM INPUT
  // ===============================================

  const handleUserMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;

      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          role: "user",
          content: text,
        },
      ]);
      setSuggestedPrompts([]);
      setIsTyping(true);

      schedule(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `fallback-${Date.now()}`,
            role: "assistant",
            content: MSG_FALLBACK,
          },
        ]);
      }, 3000);
    },
    [isTyping, schedule]
  );

  // ===============================================
  // RESET
  // ===============================================

  const resetConversation = useCallback(() => {
    clearAllTimeouts();
    setPhase("loading");
    setMessages([]);
    setSuggestedPrompts([]);
    setIsTyping(false);
    setTypingProgress(0);
    setActiveSlideId(null);
    setMentionedSlideId(null);
    setUpdatedSlideIds(new Set());
    setShowFilePreview(false);
    setSlidesPopulated(false);
    setHasStarted(false);
    setAnimationPhase("idle");
  }, [clearAllTimeouts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimeouts();
  }, [clearAllTimeouts]);

  // ===============================================
  // COMPUTED STATE
  // ===============================================

  const slidesNeedingUpdate = SLIDES_NEEDING_UPDATE.filter(
    (id) => !updatedSlideIds.has(id)
  );

  const state: ConversationState = {
    phase,
    messages,
    suggestedPrompts,
    isTyping,
    typingProgress,
    inputPlaceholder: PLACEHOLDERS[phase],
    inputDisabled: phase === "loading" && !slidesPopulated,
    activeSlideId,
    mentionedSlideId,
    updatedSlideIds,
    showFilePreview,
    slidesPopulated,
    animationPhase,
  };

  return {
    ...state,
    startConversation,
    handlePromptClick,
    handleUserMessage,
    resetConversation,
    handleTransferComplete,
    slidesNeedingUpdate,
  };
}
