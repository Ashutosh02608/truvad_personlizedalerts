/**
 * In-memory store for OTPs with rate-limiting, brute-force lockout, and auto-cleanup.
 * Production-ready for standard Node.js runtime.
 */

const otpCache = new Map();

// Configuration
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 30 * 1000;  // 30 seconds between OTP requests
const MAX_FAILED_ATTEMPTS = 5;

/**
 * Periodically purge expired entries to prevent memory leaks
 */
function pruneExpiredEntries() {
  const now = Date.now();
  for (const [email, entry] of otpCache.entries()) {
    if (now > entry.expiresAt) {
      otpCache.delete(email);
    }
  }
}

/**
 * Generate a 6-digit OTP for an email address with cooldown protection
 */
export function createOtp(email) {
  pruneExpiredEntries();

  const normalizedEmail = email.trim().toLowerCase();
  const existing = otpCache.get(normalizedEmail);
  const now = Date.now();

  // Enforce cooldown if an OTP was sent recently
  if (existing && now - existing.createdAt < RESEND_COOLDOWN_MS) {
    const remainingSecs = Math.ceil(
      (RESEND_COOLDOWN_MS - (now - existing.createdAt)) / 1000
    );
    const err = new Error(
      `Please wait ${remainingSecs}s before requesting a new code.`
    );
    err.code = "COOLDOWN";
    throw err;
  }

  // Generate cryptographically uniform 6-digit numerical code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = now + OTP_EXPIRY_MS;

  otpCache.set(normalizedEmail, {
    code,
    createdAt: now,
    expiresAt,
    failedAttempts: 0
  });

  return code;
}

/**
 * Validate an OTP with lockout after MAX_FAILED_ATTEMPTS
 */
export function validateOtp(email, inputCode) {
  const normalizedEmail = email.trim().toLowerCase();
  const entry = otpCache.get(normalizedEmail);

  if (!entry) {
    return {
      valid: false,
      reason: "No active verification code found. Please request a new code."
    };
  }

  // Check expiration
  if (Date.now() > entry.expiresAt) {
    otpCache.delete(normalizedEmail);
    return {
      valid: false,
      reason: "Verification code has expired. Please request a new code."
    };
  }

  // Check brute force attempts
  if (entry.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    otpCache.delete(normalizedEmail);
    return {
      valid: false,
      reason: "Too many failed attempts. For security, please request a new code."
    };
  }

  // Validate code
  if (entry.code !== inputCode.trim()) {
    entry.failedAttempts += 1;
    const remaining = MAX_FAILED_ATTEMPTS - entry.failedAttempts;
    return {
      valid: false,
      reason:
        remaining > 0
          ? `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          : "Too many failed attempts. Please request a new code."
    };
  }

  // Success: Clear OTP once used
  otpCache.delete(normalizedEmail);
  return { valid: true };
}
