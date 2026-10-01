"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { ArrowUpRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand / Logo */}
        <Link href="/" className={styles.logoWrapper} aria-label="Truvad Home">
          <div className={styles.logoIcon}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer serrated gear/seal */}
              <circle
                cx="14"
                cy="14"
                r="12.5"
                stroke="#0f172a"
                strokeWidth="1.25"
                strokeDasharray="2 1.5"
              />
              <circle
                cx="14"
                cy="14"
                r="10.5"
                stroke="#0f172a"
                strokeWidth="0.8"
              />
              <circle
                cx="14"
                cy="14"
                r="9"
                fill="#0f172a"
                fillOpacity="0.04"
              />
              {/* Monogram T with architectural styling */}
              <path
                d="M9.5 9.5H18.5V11.5H15V18.5H13V11.5H9.5V9.5Z"
                fill="#0f172a"
              />
              {/* Corner accent marks */}
              <circle cx="14" cy="5" r="0.8" fill="#0f172a" />
              <circle cx="14" cy="23" r="0.8" fill="#0f172a" />
              <circle cx="5" cy="14" r="0.8" fill="#0f172a" />
              <circle cx="23" cy="14" r="0.8" fill="#0f172a" />
            </svg>
          </div>
          <span className={styles.brandName}>
            TRUVAD
            <span className={styles.brandDegree}>°</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav aria-label="Main Navigation">
          <ul className={styles.navLinks}>
            <li>
              <Link href="/#problem" className={styles.navLink}>
                Problem
              </Link>
            </li>
            <li>
              <Link href="/#coverage" className={styles.navLink}>
                Coverage
              </Link>
            </li>
            <li>
              <Link href="/#products" className={styles.navLink}>
                Products
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className={styles.navLink}>
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/personalized-alerts" className={styles.navLink}>
                Personalized Alerts
              </Link>
            </li>
            <li>
              <Link href="/#company" className={styles.navLink}>
                Company
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right CTA / Log In */}
        <div className={styles.actions}>
          <button className={styles.loginBtn}>Log in</button>
          <Link href="/#get-started" className={styles.getStartedBtn}>
            <span>Get started</span>
            <ArrowUpRight className={styles.arrowIcon} size={16} />
          </Link>

          {/* Mobile hamburger button */}
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <Link href="/#problem" onClick={() => setMobileMenuOpen(false)}>
            Problem
          </Link>
          <Link href="/#coverage" onClick={() => setMobileMenuOpen(false)}>
            Coverage
          </Link>
          <Link href="/#products" onClick={() => setMobileMenuOpen(false)}>
            Products
          </Link>
          <Link href="/#pricing" onClick={() => setMobileMenuOpen(false)}>
            Pricing
          </Link>
          <Link href="/personalized-alerts" onClick={() => setMobileMenuOpen(false)}>
            Personalized Alerts
          </Link>
          <Link href="/#company" onClick={() => setMobileMenuOpen(false)}>
            Company
          </Link>
          <div style={{ paddingTop: "0.5rem", display: "flex", gap: "1rem" }}>
            <button className={styles.loginBtn}>Log in</button>
            <Link href="/#get-started" className={styles.getStartedBtn} onClick={() => setMobileMenuOpen(false)}>
              <span>Get started</span>
              <ArrowUpRight className={styles.arrowIcon} size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
