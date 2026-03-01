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
  { name: "Lucy_C_Annual_Review.key", ext: "key", icon: "◆", color: "#C9A96E", size: "4.2 MB" },
  { name: "Lucy_TOD_Account_3333.pdf", ext: "pdf", icon: "▣", color: "#5B9BAD", size: "892 KB" },
  { name: "Lucy_Roth_IRA_1122.pdf", ext: "pdf", icon: "▣", color: "#5B9BAD", size: "756 KB" },
  { name: "Lucy_Traditional_IRA_1234.pdf", ext: "pdf", icon: "▣", color: "#5B9BAD", size: "714 KB" },
  { name: "Lucy_Beneficiary_IRA_2222.pdf", ext: "pdf", icon: "▣", color: "#5B9BAD", size: "901 KB" },
];

// --- Henry's Messages ---

export const HENRY_GREETING = `Good morning. I'm **Henry**, your AI presentation assistant.

I've been configured for **Crew Wealth Management** and I'm ready to help with **Lucy C's** annual review presentation.

Load the demo files to get started — I'll analyze Lucy's Keynote deck alongside her LPL Financial account statements and update everything automatically.`;

export const HENRY_FILES_LOADED =
  "I see you've loaded Lucy's files — her Keynote presentation and all four LPL Financial account statements. I'll cross-reference everything and update the deck automatically.";

export const PROCESSING_STEPS = [
  "Reading Lucy_C_Annual_Review.key\u2026",
  "Cross-referencing 4 LPL account statements\u2026",
  "Updating 8 slides with current financial data\u2026",
  "Formatting presentation for review\u2026",
];

export const HENRY_ACCEPTED =
  "Great — the updated deck is ready for download on the right. Need anything else?";

// --- Demo Slide Previews ---

export const DEMO_SLIDES: SlidePreview[] = [
  { id: 1, title: "Work Area", type: "text", changes: ["Internal workspace — no changes needed"] },
  { id: 2, title: "Welcome Lucy", type: "cover", changes: ["Updated review date to February 26, 2026", "Confirmed client name and advisor"] },
  { id: 3, title: "Financial Position Overview", type: "chart", changes: ["Pyramid overview — no data changes needed"] },
  { id: 4, title: "Cash Reserve", type: "data", changes: ["Updated total cash reserves to $43,999", "Cash reserve goal remains $40,000 — on target", "Updated deposit account balances across all 4 accounts"] },
  { id: 5, title: "Protection Planning", type: "text", changes: ["LTC policy confirmed: Mutual of Omaha $10K/mo benefit", "Annual premium $17,743 — no changes", "Umbrella policy $1M confirmed for 2025"] },
  { id: 6, title: "Taxable Account (TOD)", type: "data", changes: ["Account value updated to $242,877 (acct ending 3333)", "Total return 29.88% since inception", "Income generated: $93,599", "Distribution: $6,000/month ongoing", "Allocation: 41% US Stocks, 36% Bonds, 17% Intl"] },
  { id: 7, title: "Retirement Accounts", type: "data", changes: ["Roth IRA updated to $1,093,094 — 51.41% total return", "Traditional IRA updated to $34,260 — 15.67% return", "Beneficiary IRA updated to $913,484 — 33.76% return", "Combined retirement assets: $2,040,838", "Top holdings: NVDA $204K, PLTR $152K, BRK/B $147K"] },
  { id: 8, title: "Estate Planning", type: "text", changes: ["Will/Trust redone 2025 with Laura Hoffman", "Both homes now held in trust", "No updates needed this review"] },
  { id: 9, title: "Goals & Priorities", type: "text", changes: ["2026 goals added: Dominica dive trip", "Hawaii trip with mother", "RV trips and small home projects", "Rolled forward target years"] },
  { id: 10, title: "LIFE Stages Overview", type: "chart", changes: ["Updated all account values across life stages", "Total portfolio: $2,283,715", "Tax-free assets (Roth): $1,093,094 — 47.9% of portfolio"] },
  { id: 11, title: "Financial Ratios", type: "data", changes: ["Withdrawal ratio recalculated: 37%", "Social Security: $2,928 NET monthly", "Rental income: $3,000/month from 3 properties", "Mortgage: $598K @6.88%"] },
  { id: 12, title: "Action Items", type: "text", changes: ["Rolled forward all action items to 2026", "Updated account references with current values", "Flagged Roth concentration risk (NVDA 17.9%, PLTR 13.9%)", "Review TOD distribution sustainability"] },
  { id: 13, title: "Closing", type: "text", changes: ["No changes — closing slide"] },
];

// --- Demo Output Constants ---

export const DEMO_FILENAME = "Lucy_C_Annual_Review_Updated.key";
export const DEMO_FILESIZE = "4.8 MB";

export const HENRY_RESPONSE = `I've finished analyzing Lucy C's annual review presentation and cross-referenced it with all four LPL Financial account statements.

Here's what I updated across **8 of 13 slides**:

**Portfolio & Accounts**
• Total portfolio value: **$2,283,715** across 4 accounts
• Roth IRA leads at **$1,093,094** with 51.41% total return
• Beneficiary IRA: **$913,484** with $97,561 in income generated
• TOD account: **$242,877** distributing $6,000/month
• Traditional IRA: **$34,260** (newest account, 15.67% return)

**Key Insights Flagged**
• Roth concentration risk — NVDA (17.9%) and PLTR (13.9%) are large single positions
• Tax-free assets represent **47.9%** of total portfolio — strong positioning
• Cash reserves at **$43,999** — exceeds $40,000 goal ✓
• TOD distribution sustainability should be reviewed given declining balance

**Slides Updated:** Welcome, Cash Reserve, Taxable, Retirement, Goals, LIFE Stages, Ratios, Action Items

Review the updated presentation below, or ask me to adjust anything specific.`;

// --- Demo Responses (pattern matching) ---

export const DEMO_PRIMARY_RESPONSE: DemoResponse = {
  text: HENRY_RESPONSE,
  slides: DEMO_SLIDES,
  filename: DEMO_FILENAME,
  fileSize: DEMO_FILESIZE,
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
  "Got it — I've made those adjustments to Lucy's deck. Here's the updated version for your review.";

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
    content: "Prepared for Lucy C — Crew Wealth Management",
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
    content: "Prepared for Lucy C — Crew Wealth Management",
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
