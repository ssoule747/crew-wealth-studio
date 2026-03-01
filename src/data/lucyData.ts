// ═══════════════════════════════════════════════════════════════
// Lucy C — Client Data for Live Demo
// Single source of truth for every number in the Henry demo
// ═══════════════════════════════════════════════════════════════

export const clientData = {
  client: {
    name: "Lucy C",
    fullName: "Lucy Cullen",
    reviewDate: "February 26, 2026",
    advisor: "William Crew",
    firm: "Crew Wealth Management",
  },

  // ═══════════════════════════════════════════
  // ACCOUNT DATA (from LPL Financial PDFs)
  // ═══════════════════════════════════════════
  accounts: {
    tod: {
      name: "SAM TOD",
      number: "3333",
      type: "Non-Retirement (Transfer on Death)",
      level: "Diversified Level 2",
      value: 242877,
      startingValue: 1096437,
      inflows: 60000,
      outflows: 1147218,
      income: 93599,
      marketFluctuation: 178023,
      totalReturn: 29.88,
      annualizedReturn: 9.10,
      inception: "11/26/2019",
      distribution: "$6,000/month",
      allocation: {
        usStocks: 41, bonds: 36, intlStocks: 17, alternatives: 4, cash: 2
      },
      holdings: [
        { ticker: "CGDV", name: "Capital Group Dividend Value ETF", shares: 1260, price: 46, value: 57443, class: "Large Cap Value" },
        { ticker: "JGRO", name: "JPMorgan Active Growth ETF", shares: 736, price: 89, value: 65254, class: "Large Cap Growth" },
        { ticker: "JHMM", name: "John Hancock Multifactor Mid Cap ETF", shares: 628, price: 71, value: 44607, class: "Mid Cap Blend" },
        { ticker: "PYLD", name: "PIMCO Multisector Bond Active ETF", shares: 1834, price: 27, value: 49390, class: "Strategic Income" },
        { ticker: "QINT", name: "American Century Quality Diversified Intl ETF", shares: 217, price: 71, value: 15299, class: "Foreign Equity" },
        { ticker: "CASH", name: "Insured Cash Account", shares: null, price: null, value: 10885, class: "Cash" },
      ]
    },

    roth: {
      name: "SAM Roth IRA",
      number: "1122",
      type: "Tax-Free Roth IRA",
      level: "Strong Growth Level 4",
      value: 1093094,
      startingValue: 720826,
      inflows: 1146,
      outflows: 0,
      income: 20756,
      marketFluctuation: 389687,
      totalReturn: 51.41,
      annualizedReturn: 16.17,
      inception: "5/23/2023",
      allocation: {
        usStocks: 72, intlStocks: 26, cash: 2
      },
      holdings: [
        { ticker: "NVDA", name: "NVIDIA Corp", shares: 1102, price: 177, value: 195263, class: "Large Cap Growth", pctOfAccount: 17.9 },
        { ticker: "PLTR", name: "Palantir Technologies", shares: 1106, price: 137, value: 151732, class: "Large Cap Growth", pctOfAccount: 13.9 },
        { ticker: "BRK/B", name: "Berkshire Hathaway Cl B", shares: 285, price: 505, value: 143911, class: "Large Cap Value", pctOfAccount: 13.2 },
        { ticker: "TSLA", name: "Tesla Inc", shares: 309, price: 403, value: 124376, class: "Large Cap Growth", pctOfAccount: 11.4 },
        { ticker: "BFGIX", name: "Baron Focused Growth Instl", shares: 2026, price: 61, value: 123260, class: "Mid Cap Growth" },
        { ticker: "QINT", name: "American Century Quality Diversified Intl", shares: null, price: null, value: 96262, class: "Foreign Equity" },
        { ticker: "AAPL", name: "Apple Inc", shares: 282, price: 264, value: 74499, class: "Large Cap Growth" },
        { ticker: "HULEX", name: "Huber Select Large Cap Value", shares: 1629, price: 36, value: 59422, class: "Large Cap Value" },
        { ticker: "SEEGX", name: "JPMorgan Large Cap Growth I", shares: 682, price: 79, value: 53687, class: "Large Cap Growth" },
        { ticker: "COST", name: "Costco Wholesale", shares: 53, price: 1011, value: 53572, class: "Large Cap Growth" },
        { ticker: "CASH", name: "Deposit Cash Account", shares: null, price: null, value: 17110, class: "Cash" },
      ]
    },

    traditional: {
      name: "SAM Traditional IRA",
      number: "1234",
      type: "Pre-Tax Traditional IRA",
      level: "Diversified Level 2",
      value: 34260,
      startingValue: 31474,
      inflows: 0,
      outflows: 2000,
      income: 1064,
      marketFluctuation: 4136,
      totalReturn: 15.67,
      annualizedReturn: null,
      inception: "4/7/2025",
      allocation: {
        usStocks: 58, intlStocks: 23, bonds: 14, alternatives: 3, cash: 2
      },
      holdings: [
        { ticker: "NVDA", name: "NVIDIA Corp", shares: 50, price: 177, value: 8860, class: "Large Cap Growth" },
        { ticker: "AAPL", name: "Apple Inc", shares: 17, price: 264, value: 4491, class: "Large Cap Blend" },
        { ticker: "PYLD", name: "PIMCO Multisector Bond Active ETF", shares: 170, price: 27, value: 4578, class: "Strategic Income" },
        { ticker: "BRK/B", name: "Berkshire Hathaway Cl B", shares: 7, price: 505, value: 3535, class: "Large Cap Value" },
        { ticker: "TSLA", name: "Tesla Inc", shares: 8, price: 403, value: 3220, class: "Large Cap Growth" },
        { ticker: "JGRO", name: "JPMorgan Active Growth ETF", shares: 35, price: 89, value: 3103, class: "Large Cap Growth" },
        { ticker: "JHMM", name: "John Hancock Mid Cap ETF", shares: 25, price: 71, value: 1776, class: "Mid Cap Blend" },
        { ticker: "QINT", name: "American Century Intl ETF", shares: 25, price: 71, value: 1763, class: "Foreign Equity" },
        { ticker: "HULEX", name: "Huber Select Large Cap Value", shares: 46, price: 36, value: 1682, class: "Large Cap Value" },
        { ticker: "CASH", name: "Deposit Cash Account", shares: null, price: null, value: 1253, class: "Cash" },
      ]
    },

    beneficiary: {
      name: "SAM Beneficiary IRA",
      number: "2222",
      type: "Inherited Traditional IRA",
      level: "Courage Level 3",
      value: 913484,
      startingValue: 682925,
      inflows: 0,
      outflows: 0,
      income: 97561,
      marketFluctuation: 168456,
      totalReturn: 33.76,
      annualizedReturn: 10.18,
      inception: "6/15/2018",
      allocation: {
        usStocks: 41, bonds: 36, intlStocks: 17, alternatives: 4, cash: 2
      },
      holdings: [
        { ticker: "PYLD", name: "PIMCO Multisector Bond Active ETF", shares: 9968, price: 27, value: 268438, class: "Strategic Income" },
        { ticker: "JGRO", name: "JPMorgan Active Growth ETF", shares: 2698, price: 89, value: 239205, class: "Large Cap Growth" },
        { ticker: "CGDV", name: "Capital Group Dividend Value ETF", shares: 4201, price: 46, value: 191524, class: "Large Cap Value" },
        { ticker: "JHMM", name: "John Hancock Mid Cap ETF", shares: 2090, price: 71, value: 148453, class: "Mid Cap Blend" },
        { ticker: "QINT", name: "American Century Intl ETF", shares: 725, price: 71, value: 51113, class: "Foreign Equity" },
        { ticker: "CASH", name: "Deposit Cash Account", shares: null, price: null, value: 14752, class: "Cash" },
      ]
    }
  },

  // ═══════════════════════════════════════════
  // COMPUTED TOTALS
  // ═══════════════════════════════════════════
  totals: {
    portfolioValue: 2283715,
    totalIncome: 212980,
    totalCash: 43999,
    taxFreeAssets: 1093094,
    taxFreeRatio: 47.9,
    netWealthAtLPL: 2284,
  },

  // ═══════════════════════════════════════════
  // CLIENT PERSONAL DETAILS (from Keynote)
  // ═══════════════════════════════════════════
  personal: {
    socialSecurity: "$2,928 NET monthly (widow benefits)",
    ltcPolicy: "Mutual of Omaha #13-437456, $10K/mo benefit, $17,743 annual premium",
    cashReserveGoal: 40000,
    distribution: "$6,000/month from TOD",
    rentalIncome: "$3,000/month (Henry $1K + Beau $1K + Brody $1K)",
    mortgage: "$598K @6.88%",
    umbrella: "$1,000,000 policy (2025)",
    estate: "Will/Trust redone 2025 with Laura Hoffman, both homes in trust",
    volatilityLevels: "2, 2, 3, 4",
    goals2026: ["Dive trip to Dominica", "Trip to Hawaii with mother", "RV trips", "Small home projects"],
    withdrawalRatio: 37,
    debtRatio: "TBD" as string,
  },

  // ═══════════════════════════════════════════
  // SLIDE STRUCTURE (13 slides)
  // ═══════════════════════════════════════════
  slides: [
    { id: 1, title: "Work Area", type: "internal" as const, needsUpdate: false },
    { id: 2, title: "Welcome Lucy", type: "welcome" as const, needsUpdate: true, updateNote: "Date update" },
    { id: 3, title: "Financial Position", type: "pyramid-overview" as const, needsUpdate: false },
    { id: 4, title: "Cash Reserve", type: "pyramid-detail" as const, tier: "cash" as const, needsUpdate: true, updateNote: "Cash balances" },
    { id: 5, title: "Protection Planning", type: "pyramid-detail" as const, tier: "protection" as const, needsUpdate: false, updateNote: "No changes" },
    { id: 6, title: "Taxable (TOD)", type: "pyramid-detail" as const, tier: "taxable" as const, needsUpdate: true, updateNote: "Account value, income" },
    { id: 7, title: "Retirement", type: "pyramid-detail" as const, tier: "retirement" as const, needsUpdate: true, updateNote: "All account values" },
    { id: 8, title: "Estate", type: "pyramid-detail" as const, tier: "estate" as const, needsUpdate: false },
    { id: 9, title: "Goals", type: "pyramid-detail" as const, tier: "goals" as const, needsUpdate: true, updateNote: "Roll forward years" },
    { id: 10, title: "LIFE Stages", type: "life-stages" as const, needsUpdate: true, updateNote: "Account values" },
    { id: 11, title: "Financial Ratios", type: "ratios" as const, needsUpdate: true, updateNote: "Recalculate all ratios" },
    { id: 12, title: "Action Items", type: "action-items" as const, needsUpdate: true, updateNote: "Roll forward, update references" },
    { id: 13, title: "Closing", type: "closing" as const, needsUpdate: false },
  ],

  // ═══════════════════════════════════════════
  // PRE-LOADED FILES (what appears in upload area)
  // ═══════════════════════════════════════════
  files: [
    { name: "Lucy_C_Annual_Review.key", type: "keynote" as const, size: "4.2 MB", accent: "gold" as const },
    { name: "Lucy_TOD_Account_3333.pdf", type: "pdf" as const, size: "892 KB", accent: "teal" as const },
    { name: "Lucy_Roth_IRA_1122.pdf", type: "pdf" as const, size: "756 KB", accent: "teal" as const },
    { name: "Lucy_Traditional_IRA_1234.pdf", type: "pdf" as const, size: "714 KB", accent: "teal" as const },
    { name: "Lucy_Beneficiary_IRA_2222.pdf", type: "pdf" as const, size: "901 KB", accent: "teal" as const },
  ]
};

// ═══════════════════════════════════════════
// DERIVED EXPORTS for easy component access
// ═══════════════════════════════════════════

export type SlideType = typeof clientData.slides[number]["type"];
export type SlideTier = "cash" | "protection" | "taxable" | "retirement" | "estate" | "goals";
export type FileAccent = "gold" | "teal";

export const LUCY_FILES = clientData.files;
export const LUCY_SLIDES = clientData.slides;
export const LUCY_ACCOUNTS = clientData.accounts;
export const LUCY_TOTALS = clientData.totals;
export const LUCY_PERSONAL = clientData.personal;
