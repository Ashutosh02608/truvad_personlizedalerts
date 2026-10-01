"use client";

import styles from "./HeroLeft.module.css";
import { ArrowUpRight, Play } from "lucide-react";

export default function HeroLeft() {
  return (
    <div className={styles.heroLeftContainer}>
      {/* Kicker Tag */}
      <div className={styles.kickerTag}>
        <span className={styles.kickerLine} />
        <span>COMPLIANCE WITHOUT COMPROMISE</span>
      </div>

      {/* Main Headline */}
      <h1 className={styles.mainHeadline}>
        <span className={styles.headlineMuted}>6 months</span> of
        <br />
        compliance,
        <br />
        done in 7 days.
      </h1>

      {/* Subtitle */}
      <p className={styles.subHeadline}>
        Truvad tracks 100+ regulators in real time and turns scattered
        circulars into prioritised SOPs, without your data ever leaving your
        server.
      </p>

      {/* CTA Buttons */}
      <div className={styles.ctaButtonGroup}>
        <a href="#start-grip" className={styles.primaryCtaBtn}>
          <span>Start GRIP | $30/month</span>
          <ArrowUpRight size={17} className={styles.arrowIcon} />
        </a>

        <button className={styles.secondaryCtaBtn}>
          <span className={styles.playIconOutline}>
            <Play size={10} fill="#475569" color="#475569" />
          </span>
          <span>See SENTINEL on-prem</span>
        </button>
      </div>

      {/* Trust & Proof points */}
      <div className={styles.trustBadgesRow}>
        <div className={styles.trustItem}>
          <span className={styles.greenDotLive} />
          <span>Live since Aug 20</span>
        </div>
        <span className={styles.separatorBullet}>•</span>
        <div className={styles.trustItem}>
          <span>Air-gapped install</span>
        </div>
        <span className={styles.separatorBullet}>•</span>
        <div className={styles.trustItem}>
          <span>Built for Indian BFSI</span>
        </div>
      </div>
    </div>
  );
}
