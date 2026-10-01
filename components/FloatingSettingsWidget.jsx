"use client";

import { useState } from "react";
import styles from "./FloatingSettingsWidget.module.css";
import { Settings, ShieldCheck, Database, Radio, X } from "lucide-react";

export default function FloatingSettingsWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={styles.floatingGearBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Compliance Settings & System Health"
        title="Truvad Node Settings"
      >
        <Settings size={22} />
      </button>

      {isOpen && (
        <div className={styles.popupMenu}>
          <div className={styles.menuHeader}>
            <span>Truvad Node Status</span>
            <X
              size={14}
              style={{ cursor: "pointer", color: "#94a3b8" }}
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className={styles.menuItem}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShieldCheck size={14} color="#10b981" />
              Air-gap mode
            </span>
            <span className={styles.statusPill}>Active</span>
          </div>

          <div className={styles.menuItem}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Radio size={14} color="#3b82f6" />
              Telemetry
            </span>
            <span className={styles.statusPill}>Offline / Zero Egress</span>
          </div>

          <div className={styles.menuItem}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Database size={14} color="#6366f1" />
              Local Vector DB
            </span>
            <span className={styles.statusPill}>Synced (v2.8)</span>
          </div>
        </div>
      )}
    </>
  );
}
