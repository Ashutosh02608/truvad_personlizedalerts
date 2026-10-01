"use client";

import { useState, useMemo } from "react";
import styles from "./PersonalizedUpdatesSection.module.css";
import {
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  RefreshCw,
  Check,
  X,
  Target,
  FileCheck2,
  Bookmark
} from "lucide-react";

// Initial regulatory updates dataset mirroring the screenshot and extending it
const ALL_UPDATES_DATA = [
  {
    id: "update-1",
    regulator: "ECB",
    title: "Christine Lagarde: Where AI risks meet",
    region: "European Union",
    flag: "🇪🇺",
    timeAgo: "2 h ago",
    category: "AI & Banking",
    summary:
      "President Christine Lagarde addresses the systemic operational risks posed by LLMs and autonomous algorithms deployed in automated trading and automated credit scoring.",
    sopName: "SOP-AI-04: Algorithmic Fallback & Kill-Switch Protocol",
    priority: "High Priority",
    bookmarked: false
  },
  {
    id: "update-2",
    regulator: "BE",
    title: "Minutes of the Meeting of the Court of Directors held on 16 July 2026",
    region: "United Kingdom",
    flag: "🇬🇧",
    timeAgo: "2 h ago",
    category: "Corporate Governance",
    summary:
      "Bank of England minutes detailing board oversight expectations regarding distributed ledger infrastructures and real-time liquidity reporting.",
    sopName: "SOP-GOV-12: Board Oversight & Distributed Infrastructure",
    priority: "Medium Priority",
    bookmarked: false
  },
  {
    id: "update-3",
    regulator: "BJ",
    title: "Financial System Report: Stress Testing under Generative Cyber Threats",
    region: "Japan",
    flag: "🇯🇵",
    timeAgo: "4 h ago",
    category: "Cyber Resilience",
    summary:
      "Bank of Japan mandate requiring Tier-1 banking entities to incorporate simulated generative phishing and automated pen-testing exercises into annual risk audits.",
    sopName: "SOP-SEC-09: Generative Cyber Scenario Testing",
    priority: "High Priority",
    bookmarked: false
  },
  {
    id: "update-4",
    regulator: "RBI",
    title: "Master Direction on Digital Payment Tokenization & Offline Auth",
    region: "India",
    flag: "🇮🇳",
    timeAgo: "5 h ago",
    category: "Fintech & Payments",
    summary:
      "Updated compliance criteria for payment system operators and scheduled commercial banks implementing device-side cryptographic token validation.",
    sopName: "SOP-PAY-18: Offline Hardware Cryptographic Validation",
    priority: "High Priority",
    bookmarked: true
  },
  {
    id: "update-5",
    regulator: "ECB",
    title: "DORA Regulatory Technical Standards on Subcontracting ICT Services",
    region: "European Union",
    flag: "🇪🇺",
    timeAgo: "6 h ago",
    category: "Operational Resilience",
    summary:
      "European Supervisory Authorities issue joint finalized RTS regarding critical third-party ICT service provider continuous monitoring mandates.",
    sopName: "SOP-ICT-22: Critical Vendor Audit & Exit Strategy",
    priority: "High Priority",
    bookmarked: false
  },
  {
    id: "update-6",
    regulator: "SEC",
    title: "Form 8-K Disclosure Guidelines for Material Cybersecurity Events",
    region: "United States",
    flag: "🇺🇸",
    timeAgo: "7 h ago",
    category: "Disclosures & Filings",
    summary:
      "Clarification on 4-day disclosure clock commencement following board determination of material cyber compromise.",
    sopName: "SOP-DISC-03: Material Cyber Incident Reporting Escalation",
    priority: "High Priority",
    bookmarked: false
  },
  {
    id: "update-7",
    regulator: "BE",
    title: "PRA Policy Statement 07/26: Capital Requirements for Synthetic Risk Transfers",
    region: "United Kingdom",
    flag: "🇬🇧",
    timeAgo: "9 h ago",
    category: "Prudential Capital",
    summary:
      "Prudential Regulation Authority finalizes supervisory guidelines for significant risk transfer transactions across UK lenders.",
    sopName: "SOP-CAP-14: SRT Qualification & Risk Weighting Review",
    priority: "Medium Priority",
    bookmarked: false
  },
  {
    id: "update-8",
    regulator: "BJ",
    title: "Supervisory Guidance on Wholesale Central Bank Digital Currency Pilots",
    region: "Japan",
    flag: "🇯🇵",
    timeAgo: "12 h ago",
    category: "Digital Assets",
    summary:
      "Bank of Japan releases technical prerequisites for domestic cross-border settlement experiments using wholesale CBDC architecture.",
    sopName: "SOP-CBDC-01: Wholesale Liquidity Bridge Specifications",
    priority: "Medium Priority",
    bookmarked: false
  }
];

export default function PersonalizedUpdatesSection() {
  const [activeTab, setActiveTab] = useState("All updates");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [convertedSops, setConvertedSops] = useState({});

  // Personalization preferences
  const [selectedRegions, setSelectedRegions] = useState([
    "European Union",
    "United Kingdom",
    "Japan",
    "India",
    "United States"
  ]);

  const [selectedCategories, setSelectedCategories] = useState([
    "AI & Banking",
    "Corporate Governance",
    "Cyber Resilience",
    "Fintech & Payments",
    "Operational Resilience"
  ]);

  // Filter updates based on tab, search, and preferences
  const filteredUpdates = useMemo(() => {
    return ALL_UPDATES_DATA.filter((item) => {
      // Tab filter
      if (activeTab !== "All updates" && item.regulator !== activeTab) {
        return false;
      }
      // Region preference
      if (!selectedRegions.includes(item.region)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesRegulator = item.regulator.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesRegulator && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [activeTab, searchQuery, selectedRegions]);

  const handleToggleRegion = (region) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const handleToggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleConvertSOP = (e, id) => {
    e.stopPropagation();
    setConvertedSops((prev) => ({
      ...prev,
      [id]: true
    }));
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.sectionContainer}>
      {/* Kicker label line above card with + action button */}
      <div className={styles.feedHeaderTop}>
        <span className={styles.kickerLabel}>THE SIGNAL, WITHOUT THE NOISE.</span>
        <button
          className={styles.addFilterBtn}
          onClick={() => setIsModalOpen(true)}
          title="Personalize your regulatory intelligence feed"
        >
          <span>Personalize</span>
          <span className={styles.plusIcon}>+</span>
        </button>
      </div>

      {/* Main card */}
      <div className={styles.card}>
        {/* Subtle circular radar line decoration in background */}
        <div className={styles.cardBgRadar}>
          <div className={styles.cardBgRadarInner} />
        </div>

        {/* Card Header: GRIP / Regulatory feed + LIVE badge */}
        <div className={styles.cardMetaBar}>
          <div className={styles.gripLabel}>
            <div className={styles.gripIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#0f172a" strokeWidth="2" strokeDasharray="3 2" />
                <path d="M8 8H16V10H13V16H11V10H8V8Z" fill="#0f172a" />
              </svg>
            </div>
            <span>
              <strong className={styles.gripName}>GRIP</strong>{" "}
              <span className={styles.gripSub}>/ Regulatory feed</span>
            </span>
          </div>

          <div className={styles.liveBadge}>
            <span className={styles.liveDot} />
            <span>LIVE</span>
          </div>
        </div>

        {/* Title & Target Icon */}
        <div className={styles.titleRow}>
          <div>
            <div className={styles.intelSubtitle}>REAL-TIME REGULATORY INTELLIGENCE</div>
            <h2 className={styles.intelTitle}>A clearer picture.</h2>
          </div>
          <div className={styles.targetIconWrapper} title="Live feed synchronized">
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="15" stroke="#3b82f6" strokeWidth="1.75" />
              <circle cx="18" cy="18" r="9" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="18" cy="18" r="4" fill="#3b82f6" />
            </svg>
          </div>
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              {String(filteredUpdates.length).padStart(2, "0")}
            </div>
            <div className={styles.statLabel}>Updates shown</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>59</div>
            <div className={styles.statLabel}>Jurisdictions</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>100+</div>
            <div className={styles.statLabel}>Regulators tracked</div>
          </div>
        </div>

        {/* Navigation Tabs & Search Controls */}
        <div className={styles.controlsBar}>
          <div className={styles.tabsList} role="tablist">
            {["All updates", "BJ", "ECB", "BE", "RBI"].map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.searchWrapper}>
            <Search size={13} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search feed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Feed List Items */}
        <div className={styles.feedList}>
          {filteredUpdates.length === 0 ? (
            <div style={{ padding: "2rem 1rem", textAlign: "center", color: "#64748b", fontSize: "0.85rem" }}>
              No circulars match current personalization filters.
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  className={styles.addFilterBtn}
                  onClick={() => {
                    setSelectedRegions(["European Union", "United Kingdom", "Japan", "India", "United States"]);
                    setActiveTab("All updates");
                    setSearchQuery("");
                  }}
                >
                  Reset filters
                </button>
              </div>
            </div>
          ) : (
            filteredUpdates.map((item) => {
              const isExpanded = expandedId === item.id;
              const isConverted = convertedSops[item.id];

              return (
                <div
                  key={item.id}
                  className={`${styles.feedItem} ${isExpanded ? styles.feedItemActive : ""}`}
                  onClick={() => toggleExpand(item.id)}
                >
                  <div style={{ width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                      <div className={styles.feedLeftCol}>
                        <span className={styles.regBadge}>{item.regulator}</span>
                        <div className={styles.feedContent}>
                          <h3 className={styles.feedItemTitle}>{item.title}</h3>
                          <div className={styles.feedItemMeta}>
                            <span className={styles.flagIcon}>{item.flag}</span>
                            <span>{item.region}</span>
                            <span>·</span>
                            <span>{item.timeAgo}</span>
                            {item.category && (
                              <>
                                <span>·</span>
                                <span style={{ color: "#475569" }}>{item.category}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight size={17} className={styles.arrowRightIcon} />
                    </div>

                    {/* Interactive Expanded Preview */}
                    {isExpanded && (
                      <div className={styles.itemExpanded} onClick={(e) => e.stopPropagation()}>
                        <p className={styles.itemSummary}>{item.summary}</p>
                        <div className={styles.sopBadgeRow}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span className={styles.sopTag}>{item.priority}</span>
                            <span style={{ fontSize: "0.72rem", color: "#475569", fontWeight: 500 }}>
                              {item.sopName}
                            </span>
                          </div>

                          <button
                            className={styles.sopActionBtn}
                            onClick={(e) => handleConvertSOP(e, item.id)}
                          >
                            {isConverted ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                                <Check size={13} /> SOP Generated
                              </span>
                            ) : (
                              "Generate SOP"
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Card Footer: Explore the feed */}
        <div className={styles.cardFooter}>
          <a href="#explore" className={styles.exploreLink}>
            <span>Explore the feed</span>
            <ArrowUpRight size={14} />
          </a>

          <button
            className={styles.refreshBtn}
            onClick={() => {
              // Quick simulated refresh feedback
              setSearchQuery("");
            }}
          >
            <RefreshCw size={12} />
            <span>Updated real-time</span>
          </button>
        </div>

        {/* Overlapping Dark Floating Tooltip Card */}
        <div className={styles.floatingCallout}>
          <div className={styles.calloutArrow}>↳</div>
          <div className={styles.calloutTextGroup}>
            <div className={styles.calloutTitle}>Scattered circulars, prioritised SOPs.</div>
            <div className={styles.calloutSubtitle}>Your data never leaves your server.</div>
          </div>
        </div>
      </div>

      {/* Markings below card */}
      <div className={styles.bottomMarkings}>
        <span>01 — THE INTELLIGENCE LAYER</span>
        <span>TRUVAD / GRIP</span>
      </div>

      {/* Personalization Modal */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Personalize Your Intelligence Feed</h3>
                <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.2rem" }}>
                  Tune regulators and jurisdictions relevant to your enterprise compliance framework.
                </p>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Jurisdictions selection */}
            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>Active Jurisdictions</div>
              <div className={styles.checkboxGrid}>
                {[
                  { name: "European Union", code: "ECB/EBA", flag: "🇪🇺" },
                  { name: "United Kingdom", code: "BOE/PRA", flag: "🇬🇧" },
                  { name: "India", code: "RBI/SEBI", flag: "🇮🇳" },
                  { name: "United States", code: "SEC/FED", flag: "🇺🇸" },
                  { name: "Japan", code: "BJ/JFSA", flag: "🇯🇵" }
                ].map((item) => {
                  const active = selectedRegions.includes(item.name);
                  return (
                    <div
                      key={item.name}
                      className={`${styles.checkItem} ${active ? styles.checkItemActive : ""}`}
                      onClick={() => handleToggleRegion(item.name)}
                    >
                      <span>{item.flag}</span>
                      <div style={{ flex: 1 }}>
                        <div>{item.name}</div>
                        <div style={{ fontSize: "0.68rem", opacity: 0.75 }}>{item.code}</div>
                      </div>
                      {active && <Check size={14} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compliance domain selection */}
            <div className={styles.modalSection}>
              <div className={styles.modalSectionLabel}>Industry Domain & AI Risk</div>
              <div className={styles.checkboxGrid}>
                {[
                  "AI & Banking",
                  "Corporate Governance",
                  "Cyber Resilience",
                  "Fintech & Payments",
                  "Operational Resilience"
                ].map((cat) => {
                  const active = selectedCategories.includes(cat);
                  return (
                    <div
                      key={cat}
                      className={`${styles.checkItem} ${active ? styles.checkItemActive : ""}`}
                      onClick={() => handleToggleCategory(cat)}
                    >
                      <span style={{ flex: 1 }}>{cat}</span>
                      {active && <Check size={14} />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.secondaryBtn}
                onClick={() => {
                  setSelectedRegions(["European Union", "United Kingdom", "Japan", "India", "United States"]);
                  setSelectedCategories([
                    "AI & Banking",
                    "Corporate Governance",
                    "Cyber Resilience",
                    "Fintech & Payments",
                    "Operational Resilience"
                  ]);
                }}
              >
                Reset All
              </button>
              <button className={styles.primaryBtn} onClick={() => setIsModalOpen(false)}>
                Apply Preferences ({filteredUpdates.length} updates)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
