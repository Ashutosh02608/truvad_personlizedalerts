"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./OtpModal.module.css";
import {
  KeyRound,
  X,
  ArrowUpRight,
  AlertCircle,
  Check,
  MailCheck
} from "lucide-react";

import { REGULATOR_MAP } from "@/lib/regulators";

export default function OtpModal({
  email,
  isOpen,
  onClose,
  onVerifySuccess,
  onResendOtp,
  selectedRegulators = [],
  cadence = "realtime"
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(45);
  const [isResending, setIsResending] = useState(false);

  // Post-verification states
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const inputRefs = useRef([]);

  const handleModalClose = useCallback(() => {
    setDigits(["", "", "", "", "", ""]);
    setErrorMessage("");
    setCountdown(45);
    setIsSubscribed(false);
    setShowFeedbackForm(false);
    setFeedbackName("");
    setFeedbackText("");
    setFeedbackSubmitted(false);
    onClose();
  }, [onClose]);

  // Focus first input upon opening without cascading render
  useEffect(() => {
    if (isOpen && !isSubscribed) {
      const timer = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSubscribed]);

  // Resend countdown timer
  useEffect(() => {
    if (!isOpen || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMessage("");

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().replace(/\D/g, "");
    if (pastedData.length > 0) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedData[i] || "";
      }
      setDigits(newDigits);
      const nextFocus = Math.min(pastedData.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = digits.join("");
    if (fullCode.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/alerts/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: fullCode,
          selectedRegulators,
          cadence
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Verification failed. Please try again.");
      }

      onVerifySuccess(result);
      setIsSubscribed(true);
    } catch (err) {
      setErrorMessage(err.message || "Failed to verify code.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setErrorMessage("");
    try {
      await onResendOtp();
      setCountdown(45);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setErrorMessage("Failed to resend verification code.");
    } finally {
      setIsResending(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmittingFeedback(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: feedbackName.trim(),
          email: email.trim().toLowerCase(),
          feedback: feedbackText.trim()
        })
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error("Feedback submit error:", err);
      setFeedbackSubmitted(true);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Format list of interests e.g. [RBI] [SEBI]
  const displayedInterests =
    selectedRegulators.length > 0
      ? selectedRegulators.map((id) => `[${REGULATOR_MAP[id] || id.toUpperCase()}]`)
      : ["[RBI]", "[SEBI]"];

  return (
    <div className={styles.backdrop} onClick={handleModalClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={handleModalClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* ========================================================
            POST-VERIFICATION SUCCESS SCREEN
            ======================================================== */}
        {isSubscribed ? (
          <div className={styles.successContainer}>
            {/* Checkmark icon */}
            <div className={styles.successCheckBadge}>
              <Check size={28} strokeWidth={3} />
            </div>

            {/* Header & Subtext */}
            <h2 className={styles.successHeading}>
              You&apos;re successfully subscribed
            </h2>
            <p className={styles.successSubtext}>
              Your personalized regulatory alerts are now active.
            </p>

            {/* Selected Interests */}
            <div className={styles.interestsBlock}>
              <span className={styles.interestsLabel}>Your interests:</span>
              <div className={styles.interestsTags}>
                {displayedInterests.map((interest, idx) => (
                  <span key={idx} className={styles.interestPill}>
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Welcome Email Notice */}
            <div className={styles.welcomeNotice}>
              <MailCheck size={16} />
              <span>We&apos;ve sent a welcome email to your inbox.</span>
            </div>

            {/* Feedback Section */}
            {!showFeedbackForm ? (
              <>
                <div className={styles.feedbackPrompt}>
                  Would you like to share your feedback with the GRIP Team?
                </div>

                <div className={styles.actionButtonsRow}>
                  <button
                    type="button"
                    className={styles.shareFeedbackBtn}
                    onClick={() => setShowFeedbackForm(true)}
                  >
                    <span>Share Feedback</span>
                    <ArrowUpRight size={16} />
                  </button>

                  <button
                    type="button"
                    className={styles.maybeLaterBtn}
                    onClick={handleModalClose}
                  >
                    Maybe Later
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.feedbackFormContainer}>
                {feedbackSubmitted ? (
                  <div className={styles.feedbackThanks}>
                    ✓ Thank you! Your feedback has been sent to the GRIP Team.
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit}>
                    <h3 className={styles.feedbackHeading}>
                      Share your feedback
                    </h3>

                    {/* Name */}
                    <div className={styles.formGroup}>
                      <label htmlFor="feedback-name" className={styles.formLabel}>
                        Name
                      </label>
                      <input
                        id="feedback-name"
                        type="text"
                        placeholder="Enter your name"
                        value={feedbackName}
                        onChange={(e) => setFeedbackName(e.target.value)}
                        className={styles.formInput}
                      />
                    </div>

                    {/* Email (Automatically prefilled with verified email) */}
                    <div className={styles.formGroup}>
                      <div className={styles.formLabelRow}>
                        <label htmlFor="feedback-email" className={styles.formLabel}>
                          Email
                        </label>
                        <span className={styles.verifiedBadge}>
                          Verified
                        </span>
                      </div>
                      <input
                        id="feedback-email"
                        type="email"
                        readOnly
                        value={email}
                        className={`${styles.formInput} ${styles.formInputDisabled}`}
                      />
                    </div>

                    {/* Feedback Textarea */}
                    <div className={styles.formGroup}>
                      <label htmlFor="feedback-text" className={styles.formLabel}>
                        Feedback
                      </label>
                      <textarea
                        id="feedback-text"
                        required
                        rows={3}
                        placeholder="Write your feedback..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        className={styles.feedbackTextarea}
                      />
                    </div>

                    <div className={styles.feedbackButtonRow}>
                      <button
                        type="submit"
                        disabled={isSubmittingFeedback || !feedbackText.trim()}
                        className={styles.feedbackSubmitBtn}
                      >
                        {isSubmittingFeedback ? "Sending..." : "Send Feedback"}
                      </button>
                      <button
                        type="button"
                        className={styles.maybeLaterBtn}
                        onClick={handleModalClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {feedbackSubmitted && (
                  <button
                    type="button"
                    className={styles.maybeLaterBtn}
                    onClick={handleModalClose}
                    style={{ marginTop: "0.5rem" }}
                  >
                    Done
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================
             ENTER OTP FORM SCREEN
             ======================================================== */
          <>
            <div className={styles.iconWrapper}>
              <KeyRound size={24} />
            </div>

            <h2 className={styles.title}>Enter Verification Code</h2>
            <p className={styles.description}>
              We sent a 6-digit verification code to{" "}
              <span className={styles.emailHighlight}>{email}</span>. Please enter
              it below to confirm your subscription.
            </p>

            {/* 6 Digit Inputs */}
            <div className={styles.otpRow} onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={styles.otpInput}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className={styles.errorBanner}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Verify Action Button */}
            <button
              type="button"
              disabled={isVerifying || digits.join("").length !== 6}
              onClick={handleVerify}
              className={styles.verifyBtn}
            >
              <span>
                {isVerifying ? "Verifying with Supabase..." : "Verify & Activate Alerts"}
              </span>
              <ArrowUpRight size={17} />
            </button>

            {/* Resend footer */}
            <div className={styles.footerRow}>
              <span>Didn&apos;t receive code?</span>
              <button
                type="button"
                className={styles.resendBtn}
                onClick={handleResend}
                disabled={countdown > 0 || isResending}
              >
                {countdown > 0 ? (
                  `Resend code in ${countdown}s`
                ) : isResending ? (
                  "Sending..."
                ) : (
                  "Resend code"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
