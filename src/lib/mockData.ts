// ============================================================
// Demo Data for Crew Wealth Studio — Chat-Driven Demo
// ============================================================

// --- Types ---

export type SlideType = "cover" | "data" | "chart" | "text";

export const SLIDE_TYPE_COLORS: Record<SlideType, string> = {
  cover: "#C9A96E",
  data: "#6EAAC9",
  chart: "#8BC96E",
  text: "#C96EA0",
};

export interface DemoFile {
  name: string;
  ext: string;
  icon: string;
  color: string;
  size: string;
}

export interface SlidePreview {
  id: number;
  title: string;
  type: SlideType;
  changes: string[];
}

export interface DemoResponse {
  text: string;
  slides: SlidePreview[];
  filename: string;
  fileSize: string;
}

export type AppState =
  | "idle"
  | "files_loaded"
  | "processing"
  | "review"
  | "accepted"
  | "iterating";

// --- Demo Files ---

export const DEMO_FILES: DemoFile[] = [
  { name: "Henderson_Annual_Review_2025.key", ext: "key", icon: "◆", color: "#C9A96E", size: "8.2 MB" },
  { name: "Henderson_Portfolio_Q4.pdf", ext: "pdf", icon: "▣", color: "#C96E6E", size: "1.4 MB" },
  { name: "Henderson_Tax_Summary.csv", ext: "csv", icon: "▤", color: "#6EAAC9", size: "248 KB" },
];

// --- Henry's Messages ---

export const HENRY_GREETING =
  "Hello! I'm Henry, your presentation assistant. Load some files and tell me what you'd like to change — or click 'Load Demo Files' to try me out.";

export const HENRY_FILES_LOADED =
  "I see you've loaded the Henderson files — a 2025 Keynote presentation, their Q4 portfolio statement, and tax summary. What would you like me to update?";

export const PROCESSING_STEPS = [
  "📄 Reading through the Keynote...",
  "📊 Analyzing the financial data...",
  "✏️ Writing updated content...",
  "✅ Finalizing changes...",
];

export const HENRY_ACCEPTED =
  "Great — the updated deck is ready for download on the right. Need anything else?";

// --- Demo Slide Previews ---

export const DEMO_SLIDES: SlidePreview[] = [
  {
    id: 1,
    title: "Annual Financial Review 2026",
    type: "cover",
    changes: ["Updated year from 2025 → 2026", "Updated client name styling"],
  },
  {
    id: 2,
    title: "Portfolio Overview",
    type: "data",
    changes: [
      "Total assets updated from $4.2M to $4.8M",
      "Growth rate updated from 12.3% to 14.1%",
    ],
  },
  {
    id: 3,
    title: "Asset Allocation",
    type: "chart",
    changes: [
      "Adjusted allocation: Equities 55%, Fixed Income 28%, Alternatives 17%",
      "Updated donut chart values",
    ],
  },
  {
    id: 4,
    title: "Performance Summary",
    type: "data",
    changes: [
      "YTD return updated to 16.2% vs 13.8% benchmark",
      "Added 3-year trailing performance",
    ],
  },
  {
    id: 5,
    title: "Market Commentary",
    type: "text",
    changes: [
      "Complete rewrite for 2025 review",
      "Added current economic outlook",
      "Referenced Fed rate trajectory",
    ],
  },
  {
    id: 6,
    title: "Tax Planning",
    type: "data",
    changes: [
      "Updated liability to $142,800",
      "Flagged Roth conversion opportunity from CSV",
      "Added estimated $18,400 savings over 5 years",
    ],
  },
  {
    id: 7,
    title: "Investment Strategy",
    type: "text",
    changes: [
      "Forward-looking for 2027",
      "Added international markets tilt recommendation",
    ],
  },
  {
    id: 8,
    title: "Next Steps & Timeline",
    type: "text",
    changes: [
      "Updated scheduling to March 2027",
      "Added action items from Q4 review",
    ],
  },
];

// --- Demo Responses (pattern matching) ---

export const DEMO_PRIMARY_RESPONSE: DemoResponse = {
  text: "I've gone through the Henderson deck and cross-referenced it with their Q4 portfolio statement and tax summary. Here's what I updated:\n\n- **Cover slide** — Updated year from 2025 → 2026\n- **Portfolio Overview** — Total assets updated from $4.2M to $4.8M, growth rate from 12.3% to 14.1%\n- **Asset Allocation** — Adjusted to reflect new strategy: Equities 55%, Fixed Income 28%, Alternatives 17%\n- **Performance** — YTD return updated to 16.2% vs 13.8% benchmark\n- **Market Commentary** — Rewrote for 2025 review with current economic outlook\n- **Tax Planning** — Updated liability to $142,800 and flagged a Roth conversion opportunity I found in the tax summary\n- **Strategy** — Forward-looking for 2027 with international markets tilt\n- **Next Steps** — Updated scheduling to March 2027\n\nTake a look and let me know if you'd like any adjustments.",
  slides: DEMO_SLIDES,
  filename: "Henderson_Annual_Review_2026.key",
  fileSize: "2.4 MB",
};

export interface FollowUpResponse {
  patterns: string[];
  text: string;
}

export const DEMO_FOLLOWUPS: FollowUpResponse[] = [
  {
    patterns: ["conservative", "tone", "soften", "gentle"],
    text: "I've softened the language across the deck — replaced terms like 'strong growth' with 'steady performance' and added risk-aware framing to the strategy section. Here's the updated version.",
  },
  {
    patterns: ["slide 5", "market commentary", "commentary", "market"],
    text: "I've reworked slide 5 specifically — the market commentary now leads with diversification benefits and takes a more measured view of sector performance. Updated deck below.",
  },
  {
    patterns: ["tax", "roth", "conversion"],
    text: "I've expanded the tax planning slide with more detail on the Roth conversion opportunity — including the estimated tax savings of $18,400 over 5 years based on the data in the CSV. Updated deck below.",
  },
];

export const DEMO_FALLBACK_RESPONSE =
  "Got it — I've made those adjustments to the Henderson deck. Here's the updated version for your review.";

// Helper function to find matching response
export function findDemoResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  for (const followUp of DEMO_FOLLOWUPS) {
    if (followUp.patterns.some((p) => lower.includes(p))) {
      return followUp.text;
    }
  }
  return DEMO_FALLBACK_RESPONSE;
}

// ============================================================
// Legacy - kept for backwards compatibility
// ============================================================

export interface MockSlide {
  id: number;
  number: string;
  title: string;
  content: string;
  type: SlideType;
  accentColor: string;
}

export interface UpdatedSlide extends MockSlide {
  status: "updated" | "unchanged";
  changes: string[];
}

export const ORIGINAL_SLIDES: MockSlide[] = [
  {
    id: 1,
    number: "01",
    title: "Annual Financial Review 2025",
    content: "Prepared for Henderson Family Trust — Crew Wealth Management",
    type: "cover",
    accentColor: SLIDE_TYPE_COLORS.cover,
  },
  {
    id: 2,
    number: "02",
    title: "Portfolio Overview",
    content: "Total Assets: $4.2M — Growth: 12.3% — Net Contributions: $180K",
    type: "data",
    accentColor: SLIDE_TYPE_COLORS.data,
  },
  {
    id: 3,
    number: "03",
    title: "Asset Allocation",
    content: "Equities 60% | Fixed Income 25% | Alternatives 15%",
    type: "chart",
    accentColor: SLIDE_TYPE_COLORS.chart,
  },
  {
    id: 4,
    number: "04",
    title: "Performance Summary",
    content: "YTD Return: 14.7% vs Benchmark 11.2% — Alpha: +3.5%",
    type: "data",
    accentColor: SLIDE_TYPE_COLORS.data,
  },
  {
    id: 5,
    number: "05",
    title: "Market Commentary",
    content:
      "Q4 saw continued momentum in large-cap growth with moderating inflation expectations...",
    type: "text",
    accentColor: SLIDE_TYPE_COLORS.text,
  },
  {
    id: 6,
    number: "06",
    title: "Tax Planning",
    content:
      "Estimated tax liability: $127,400 — Roth conversion opportunity identified",
    type: "data",
    accentColor: SLIDE_TYPE_COLORS.data,
  },
  {
    id: 7,
    number: "07",
    title: "2026 Strategy",
    content:
      "Recommended rebalancing toward value exposure with increased international allocation",
    type: "text",
    accentColor: SLIDE_TYPE_COLORS.text,
  },
  {
    id: 8,
    number: "08",
    title: "Next Steps",
    content:
      "Schedule Q1 review — March 2026 — Action items and follow-up timeline",
    type: "cover",
    accentColor: SLIDE_TYPE_COLORS.cover,
  },
];

export const UPDATED_SLIDES: UpdatedSlide[] = [
  {
    id: 1,
    number: "01",
    title: "Annual Financial Review 2026",
    content: "Prepared for Henderson Family Trust — Crew Wealth Management",
    type: "cover",
    accentColor: SLIDE_TYPE_COLORS.cover,
    status: "updated",
    changes: ["Updated year 2025 → 2026"],
  },
  {
    id: 2,
    number: "02",
    title: "Portfolio Overview",
    content: "Total Assets: $4.8M — Growth: 14.1% — Net Contributions: $210K",
    type: "data",
    accentColor: SLIDE_TYPE_COLORS.data,
    status: "updated",
    changes: [
      "Updated total assets $4.2M → $4.8M",
      "Updated growth rate 12.3% → 14.1%",
      "Updated net contributions $180K → $210K",
    ],
  },
  {
    id: 3,
    number: "03",
    title: "Asset Allocation",
    content: "Equities 55% | Fixed Income 28% | Alternatives 17%",
    type: "chart",
    accentColor: SLIDE_TYPE_COLORS.chart,
    status: "updated",
    changes: [
      "Reduced equities 60% → 55%",
      "Increased fixed income 25% → 28%",
      "Increased alternatives 15% → 17%",
    ],
  },
  {
    id: 4,
    number: "04",
    title: "Performance Summary",
    content: "YTD Return: 16.2% vs Benchmark 12.8% — Alpha: +3.4%",
    type: "data",
    accentColor: SLIDE_TYPE_COLORS.data,
    status: "updated",
    changes: [
      "Updated YTD return 14.7% → 16.2%",
      "Updated benchmark 11.2% → 12.8%",
      "Updated alpha +3.5% → +3.4%",
    ],
  },
  {
    id: 5,
    number: "05",
    title: "Market Commentary",
    content:
      "2025 delivered strong equity returns driven by AI infrastructure spending and rate normalization...",
    type: "text",
    accentColor: SLIDE_TYPE_COLORS.text,
    status: "updated",
    changes: [
      "Rewrote commentary for 2025 full-year perspective",
      "Added AI infrastructure spending theme",
      "Updated rate environment narrative",
    ],
  },
  {
    id: 6,
    number: "06",
    title: "Tax Planning",
    content:
      "Estimated tax liability: $142,800 — Roth conversion executed Q3 ($85K)",
    type: "data",
    accentColor: SLIDE_TYPE_COLORS.data,
    status: "updated",
    changes: [
      "Updated tax liability $127,400 → $142,800",
      "Roth conversion status: opportunity → executed Q3 ($85K)",
    ],
  },
  {
    id: 7,
    number: "07",
    title: "2027 Strategy",
    content:
      "Maintain value tilt with gradual increase in international developed markets allocation",
    type: "text",
    accentColor: SLIDE_TYPE_COLORS.text,
    status: "updated",
    changes: [
      "Updated strategy year 2026 → 2027",
      "Shifted from 'recommended rebalancing' to 'maintain value tilt'",
      "Added international developed markets focus",
    ],
  },
  {
    id: 8,
    number: "08",
    title: "Next Steps",
    content:
      "Schedule Q1 review — March 2027 — Estate planning discussion added",
    type: "cover",
    accentColor: SLIDE_TYPE_COLORS.cover,
    status: "updated",
    changes: [
      "Updated review date March 2026 → March 2027",
      "Added estate planning discussion item",
    ],
  },
];
