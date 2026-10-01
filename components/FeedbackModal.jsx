"use client";

import { useState } from "react";
import styles from "./FeedbackModal.module.css";
import { X, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function FeedbackModal({ isOpen, onClose, userEmail = "" }) {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setName("");
    setFeedback("");
    setIsSubmitted(false);
    setErrorMsg("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setErrorMsg("Please enter your feedback before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: userEmail.trim().toLowerCase(),
          feedback: feedback.trim()
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit feedback.");
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Feedback submission error:", err);
      setErrorMsg(err.message || "An error occurred while sending feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <>
            <div className={styles.headerArea}>
              <h2 className={styles.title}>Share your feedback</h2>
              <p className={styles.subtitle}>
                Help us tailor GRIP to your enterprise compliance workflow.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Name Field */}
              <div className={styles.fieldGroup}>
                <label htmlFor="feedback-name" className={styles.label}>
                  Name
                </label>
                <input
                  id="feedback-name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                />
              </div>

              {/* Email Field (Automatically prefilled with verified email) */}
              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="feedback-email" className={styles.label}>
                    Email
                  </label>
                  <span className={styles.verifiedBadge}>Verified</span>
                </div>
                <input
                  id="feedback-email"
                  type="email"
                  required
                  value={userEmail}
                  className={`${styles.input} ${styles.inputReadonly}`}
                  readOnly
                  title="Using your verified subscription email"
                />
              </div>

              {/* Feedback Field */}
              <div className={styles.fieldGroup}>
                <label htmlFor="feedback-text" className={styles.label}>
                  Feedback
                </label>
                <textarea
                  id="feedback-text"
                  required
                  rows={4}
                  placeholder="What circulars, jurisdictions, or features would you like to see?"
                  value={feedback}
                  onChange={(e) => {
                    setFeedback(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  className={styles.textarea}
                />
              </div>

              {errorMsg && (
                <div
                  style={{
                    color: "#dc2626",
                    fontSize: "0.78rem",
                    fontWeight: 600
                  }}
                >
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !feedback.trim()}
                className={styles.submitBtn}
              >
                <span>{isSubmitting ? "Sending..." : "Send Feedback"}</span>
                <ArrowUpRight size={17} />
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successBox}>
            <div className={styles.successIconBadge}>
              <CheckCircle2 size={26} />
            </div>
            <h3 className={styles.successTitle}>Thank You!</h3>
            <p className={styles.successSubtext}>
              Your feedback has been received and shared directly with the GRIP product team.
            </p>
            <button type="button" onClick={handleClose} className={styles.doneBtn}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
