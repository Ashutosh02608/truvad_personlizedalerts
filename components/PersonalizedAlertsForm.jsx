"use client";

import { useState, useMemo } from "react";
import styles from "./PersonalizedAlertsForm.module.css";
import OtpModal from "./OtpModal";
import {
  Check,
  Search,
  Mail,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from "lucide-react";

import { REGULATORS_DATABASE, REGIONS } from "@/lib/regulators";

export default function PersonalizedAlertsForm() {
  const [selectedRegulators, setSelectedRegulators] = useState([
    "rbi",
    "sebi",
    "ecb",
    "boe",
    "sec"
  ]);
  const [activeRegion, setActiveRegion] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cadence, setCadence] = useState("realtime");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const regionTabs = REGIONS;

  const filteredRegulators = useMemo(() => {
    return REGULATORS_DATABASE.filter((reg) => {
      // Region filter
      if (activeRegion !== "All" && reg.region !== activeRegion) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesAcronym = reg.acronym.toLowerCase().includes(q);
        const matchesName = reg.fullName.toLowerCase().includes(q);
        const matchesDomain = reg.domain.toLowerCase().includes(q);
        if (!matchesAcronym && !matchesName && !matchesDomain) {
          return false;
        }
      }
      return true;
    });
  }, [activeRegion, searchQuery]);

  const toggleRegulator = (id) => {
    setSelectedRegulators((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredRegulators.map((r) => r.id);
    setSelectedRegulators((prev) => Array.from(new Set([...prev, ...visibleIds])));
  };

  const handleClearAllVisible = () => {
    const visibleIds = filteredRegulators.map((r) => r.id);
    setSelectedRegulators((prev) => prev.filter((id) => !visibleIds.includes(id)));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [storageSource, setStorageSource] = useState(null);
  const [serverMessage, setServerMessage] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setErrorMessage("Please enter a valid business email address.");
      return;
    }
    if (selectedRegulators.length === 0) {
      setErrorMessage("Please select at least one regulator to receive updates from.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      // Trigger OTP dispatch to the user's email
      const response = await fetch("/api/alerts/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to dispatch verification code.");
      }

      setIsOtpModalOpen(true);
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage(err.message || "An unexpected error occurred while sending code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySuccess = (result) => {
    // Keep modal open so it displays the post-verification UI with interests and feedback prompt
    setStorageSource(result.source || "supabase");
    setServerMessage(result.message || "Email verified! Alert preferences saved to Supabase.");
    setIsSubmitted(true);
  };

  const handleResendOtp = async () => {
    const response = await fetch("/api/alerts/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to resend code.");
    }
    if (result.previewOtp) {
      setPreviewOtp(result.previewOtp);
    }
  };

  return (
    <div className={styles.alertsContainer}>
      {/* Header section */}
      <div className={styles.headerBlock}>
        <div className={styles.kickerTag}>
          <Sparkles size={14} color="#0f172a" />
          <span>PERSONALIZED REGULATORY INTELLIGENCE</span>
        </div>
        <h1 className={styles.title}>Personalized Regulatory Alerts</h1>
        <p className={styles.subtitle}>
          Select the global authorities, central banks, and market regulators
          relevant to your compliance team. Receive synthesised, prioritised
          circulars delivered directly to your inbox.
        </p>
      </div>

      {/* Main card */}
      <div className={styles.formCard}>
        {/* Controls Toolbar */}
        <div className={styles.toolbar}>
          {/* Region Tabs */}
          <div className={styles.regionTabs}>
            {regionTabs.map((region) => (
              <button
                key={region}
                className={`${styles.regionTab} ${
                  activeRegion === region ? styles.regionTabActive : ""
                }`}
                onClick={() => setActiveRegion(region)}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Search Box and Quick Actions */}
          <div className={styles.rightControls}>
            <div className={styles.searchBox}>
              <Search size={14} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Filter regulators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.actionLinks}>
              <button
                type="button"
                className={styles.textActionBtn}
                onClick={handleSelectAllVisible}
              >
                Select all
              </button>
              <span style={{ color: "#cbd5e1" }}>|</span>
              <button
                type="button"
                className={styles.textActionBtn}
                onClick={handleClearAllVisible}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Selection Summary Counter */}
        <div className={styles.selectionSummary}>
          <span>
            Showing {filteredRegulators.length} of {REGULATORS_DATABASE.length} tracked regulators
          </span>
          <span className={styles.badgeSelected}>
            <Check size={13} />
            {selectedRegulators.length} regulators selected
          </span>
        </div>

        {/* Checkbox Menu Grid */}
        <div className={styles.regulatorsGrid}>
          {filteredRegulators.map((reg) => {
            const isChecked = selectedRegulators.includes(reg.id);

            return (
              <div
                key={reg.id}
                className={`${styles.regulatorCard} ${
                  isChecked ? styles.regulatorCardActive : ""
                }`}
                onClick={() => toggleRegulator(reg.id)}
              >
                {/* Styled Checkbox */}
                <div className={styles.checkboxContainer}>
                  <div
                    className={`${styles.customCheckbox} ${
                      isChecked ? styles.customCheckboxChecked : ""
                    }`}
                  >
                    {isChecked && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>

                {/* Regulator Info */}
                <div className={styles.regCardContent}>
                  <div className={styles.regTopLine}>
                    <span className={styles.regAcronym}>{reg.acronym}</span>
                    <span className={styles.regFlag} title={reg.region}>
                      {reg.flag}
                    </span>
                  </div>
                  <div className={styles.regFullName}>{reg.fullName}</div>
                  <span className={styles.regDomainTag}>{reg.domain}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alert Cadence Selector */}
        <div className={styles.cadenceSection}>
          <div className={styles.cadenceTitle}>Alert Delivery Cadence</div>
          <div className={styles.cadenceOptions}>
            <button
              type="button"
              className={`${styles.cadenceOption} ${
                cadence === "realtime" ? styles.cadenceOptionActive : ""
              }`}
              onClick={() => setCadence("realtime")}
            >
              <span>⚡ Real-Time Breaking Circulars</span>
            </button>
            <button
              type="button"
              className={`${styles.cadenceOption} ${
                cadence === "daily" ? styles.cadenceOptionActive : ""
              }`}
              onClick={() => setCadence("daily")}
            >
              <span>📅 Daily Executive Digest (08:00 UTC)</span>
            </button>
            <button
              type="button"
              className={`${styles.cadenceOption} ${
                cadence === "weekly" ? styles.cadenceOptionActive : ""
              }`}
              onClick={() => setCadence("weekly")}
            >
              <span>📊 Weekly Synthesized Briefing</span>
            </button>
          </div>
        </div>

        {/* Email Input & Submit Section at the end */}
        <form onSubmit={handleSubmit} className={styles.emailSection}>
          <div className={styles.emailSectionLabel}>
            Where should we deliver your regulatory updates?
          </div>
          <div className={styles.emailSectionSub}>
            We deliver actionable summaries with linked circular diffs and suggested enterprise SOPs.
          </div>

          <div className={styles.emailFormRow}>
            <div className={styles.emailInputWrapper}>
              <Mail size={18} className={styles.mailIcon} />
              <input
                type="email"
                required
                placeholder="Enter your work email address (e.g. compliance@bank.com)"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                className={styles.emailInput}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={styles.emailSubmitBtn}
              style={{ opacity: isLoading ? 0.75 : 1 }}
            >
              <span>{isLoading ? "Sending Code..." : "Activate Personalized Alerts"}</span>
              <ArrowUpRight size={17} />
            </button>
          </div>

          {errorMessage && (
            <div
              style={{
                color: "#dc2626",
                fontSize: "0.78rem",
                marginTop: "0.5rem",
                fontWeight: 600
              }}
            >
              {errorMessage}
            </div>
          )}

          <div className={styles.privacyFootnote}>
            <ShieldCheck size={15} color="#10b981" />
            <span>
              Zero data egress. Your email and preferences remain strictly protected.
            </span>
          </div>

          {/* Success Banner */}
          {isSubmitted && (
            <div className={styles.successBanner}>
              <div className={styles.successHeader}>
                <CheckCircle2 size={19} />
                <span>Personalized Alerts Configured Successfully!</span>
                <span
                  style={{
                    fontSize: "0.68rem",
                    padding: "0.15rem 0.45rem",
                    borderRadius: "4px",
                    background: storageSource === "supabase" ? "#dcfce7" : "#fef3c7",
                    color: storageSource === "supabase" ? "#15803d" : "#b45309",
                    fontWeight: 700,
                    marginLeft: "auto"
                  }}
                >
                  {storageSource === "supabase" ? "● Supabase Synced" : "● Sandbox Mode"}
                </span>
              </div>
              <div className={styles.successBody}>
                {serverMessage}
                <div style={{ marginTop: "0.3rem" }}>
                  A confirmation has been recorded for <strong>{email}</strong>.
                  You are set to receive <strong>{cadence}</strong> circulars
                  for <strong>{selectedRegulators.length} regulators</strong>.
                </div>
              </div>

              <div className={styles.subscribedTags}>
                {selectedRegulators.map((id) => {
                  const reg = REGULATORS_DATABASE.find((r) => r.id === id);
                  return reg ? (
                    <span key={id} className={styles.subscribedTag}>
                      {reg.flag} {reg.acronym}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Verification OTP Dialog Box */}
      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        email={email}
        selectedRegulators={selectedRegulators}
        cadence={cadence}
        onVerifySuccess={handleVerifySuccess}
        onResendOtp={handleResendOtp}
      />
    </div>
  );
}
