/**
 * Curated Database of Global Regulators and Authorities
 * Used across Personalized Alerts form, verification dialogs, and email generation.
 */

export const REGULATORS_DATABASE = [
  // India
  {
    id: "rbi",
    acronym: "RBI",
    fullName: "Reserve Bank of India",
    region: "India",
    flag: "🇮🇳",
    domain: "Banking, Payments & Fintech"
  },
  {
    id: "sebi",
    acronym: "SEBI",
    fullName: "Securities and Exchange Board of India",
    region: "India",
    flag: "🇮🇳",
    domain: "Capital Markets & AI Disclosures"
  },
  {
    id: "irdai",
    acronym: "IRDAI",
    fullName: "Insurance Regulatory and Development Authority",
    region: "India",
    flag: "🇮🇳",
    domain: "Insurtech & Solvency"
  },
  {
    id: "ifsca",
    acronym: "IFSCA",
    fullName: "International Financial Services Centres Authority",
    region: "India",
    flag: "🇮🇳",
    domain: "Cross-border Banking"
  },

  // Europe
  {
    id: "ecb",
    acronym: "ECB",
    fullName: "European Central Bank",
    region: "Europe",
    flag: "🇪🇺",
    domain: "Monetary Policy & SSM Banking"
  },
  {
    id: "eba",
    acronym: "EBA",
    fullName: "European Banking Authority",
    region: "Europe",
    flag: "🇪🇺",
    domain: "DORA & Prudential Standards"
  },
  {
    id: "esma",
    acronym: "ESMA",
    fullName: "European Securities and Markets Authority",
    region: "Europe",
    flag: "🇪🇺",
    domain: "MiFID & Algorithmic Trading"
  },
  {
    id: "bafin",
    acronym: "BaFin",
    fullName: "Federal Financial Supervisory Authority (Germany)",
    region: "Europe",
    flag: "🇩🇪",
    domain: "ICT Risk & Cyber Governance"
  },

  // United Kingdom
  {
    id: "boe",
    acronym: "BE / BOE",
    fullName: "Bank of England (Court of Directors & MPC)",
    region: "United Kingdom",
    flag: "🇬🇧",
    domain: "Financial Stability & DLT"
  },
  {
    id: "pra",
    acronym: "PRA",
    fullName: "Prudential Regulation Authority",
    region: "United Kingdom",
    flag: "🇬🇧",
    domain: "Capital Adequacy & Basel 3.1"
  },
  {
    id: "fca",
    acronym: "FCA",
    fullName: "Financial Conduct Authority",
    region: "United Kingdom",
    flag: "🇬🇧",
    domain: "Consumer Duty & AI Principles"
  },

  // United States
  {
    id: "sec",
    acronym: "SEC",
    fullName: "Securities and Exchange Commission",
    region: "United States",
    flag: "🇺🇸",
    domain: "Form 8-K Cyber & AI Governance"
  },
  {
    id: "fed",
    acronym: "Federal Reserve",
    fullName: "Board of Governors of the Federal Reserve System",
    region: "United States",
    flag: "🇺🇸",
    domain: "Liquidity, Stress Testing & FedNow"
  },
  {
    id: "cftc",
    acronym: "CFTC",
    fullName: "Commodity Futures Trading Commission",
    region: "United States",
    flag: "🇺🇸",
    domain: "Derivatives & Digital Commodities"
  },
  {
    id: "occ",
    acronym: "OCC",
    fullName: "Office of the Comptroller of the Currency",
    region: "United States",
    flag: "🇺🇸",
    domain: "National Bank Supervision"
  },

  // Asia-Pacific
  {
    id: "bj",
    acronym: "BJ / JFSA",
    fullName: "Bank of Japan & Financial Services Agency",
    region: "Asia-Pacific",
    flag: "🇯🇵",
    domain: "Wholesale CBDC & Payment Rails"
  },
  {
    id: "mas",
    acronym: "MAS",
    fullName: "Monetary Authority of Singapore",
    region: "Asia-Pacific",
    flag: "🇸🇬",
    domain: "FEAT AI Framework & FinTech"
  },
  {
    id: "hkma",
    acronym: "HKMA",
    fullName: "Hong Kong Monetary Authority",
    region: "Asia-Pacific",
    flag: "🇭🇰",
    domain: "Virtual Banking & Cyber Fortification"
  },

  // Global Standards
  {
    id: "bis",
    acronym: "BIS / BCBS",
    fullName: "Basel Committee on Banking Supervision",
    region: "Global Standards",
    flag: "🌐",
    domain: "Global Capital & Climate Risk"
  },
  {
    id: "fatf",
    acronym: "FATF",
    fullName: "Financial Action Task Force",
    region: "Global Standards",
    flag: "🌐",
    domain: "AML / CFT & Virtual Assets"
  }
];

export const REGIONS = [
  "All",
  "India",
  "Europe",
  "United Kingdom",
  "United States",
  "Asia-Pacific",
  "Global Standards"
];

// Map of regulator ID -> Display Acronym
export const REGULATOR_MAP = Object.fromEntries(
  REGULATORS_DATABASE.map((item) => [item.id, item.acronym])
);

// Map of regulator ID -> Full Object
export const REGULATOR_BY_ID = Object.fromEntries(
  REGULATORS_DATABASE.map((item) => [item.id, item])
);
