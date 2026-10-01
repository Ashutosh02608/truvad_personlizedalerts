import nodemailer from "nodemailer";

const smtpUser = process.env.SMTP_USER;
// Strip any accidental spaces in the 16-character Gmail app password
const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : "";

export const isSmtpConfigured = Boolean(smtpUser && smtpPass);

// Use connection pooling for fast, reusable TLS connections
export const transporter = isSmtpConfigured
  ? nodemailer.createTransport({
      service: "gmail",
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    })
  : null;

/**
 * Escape HTML special characters to prevent HTML injection in emails
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Shared layout wrapper for all Truvad automated transactional emails
 */
function renderEmailWrapper({
  title,
  headerKicker = "Regulatory Feed",
  bodyHtml,
  footerNote = "Truvad Intelligence Layer · Air-gapped regulatory compliance · Your data never leaves your server."
}) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #faf9f6; margin: 0; padding: 40px 20px; color: #0f172a;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 32px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);">
          <tr>
            <td align="left" style="padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 18px; font-weight: 800; letter-spacing: 0.08em; color: #0b1329;">TRUVAD<sup style="font-size: 10px;">°</sup></span>
              <span style="font-size: 11px; color: #64748b; margin-left: 8px; text-transform: uppercase; font-family: monospace;">/ ${escapeHtml(headerKicker)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 0 16px 0;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="border-top: 1px solid #f1f5f9; padding-top: 16px;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0; line-height: 1.4;">
                ${escapeHtml(footerNote)}
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

/**
 * Send OTP Verification Email
 */
export async function sendOtpEmail({ to, code }) {
  if (!isSmtpConfigured || !transporter) {
    console.info(`[SMTP SKIPPED] SMTP credentials not set. Code for ${to}: ${code}`);
    return { sent: false, reason: "SMTP_USER or SMTP_PASS missing", code };
  }

  const fromAddress = `"Truvad Regulatory Alerts" <${smtpUser}>`;

  const bodyHtml = `
    <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0;">Verify your email address</h2>
    <p style="font-size: 14px; line-height: 1.5; color: #475569; margin: 0 0 20px 0;">
      Use the verification code below to activate your personalized regulatory alerts subscription:
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <div style="display: inline-block; background-color: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 14px 28px; font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #0f172a; font-family: monospace;">
        ${escapeHtml(code)}
      </div>
    </div>
    <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 16px 0 0 0;">
      This code is valid for <strong>10 minutes</strong>. If you did not request personalized alerts on Truvad, you can safely ignore this email.
    </p>
  `;

  const info = await transporter.sendMail({
    from: fromAddress,
    to,
    subject: `${code} is your Truvad verification code`,
    html: renderEmailWrapper({
      title: "Your Truvad Verification Code",
      headerKicker: "Regulatory Feed",
      bodyHtml
    })
  });

  return { sent: true, messageId: info.messageId };
}

/**
 * Send Welcome Email upon subscription
 */
export async function sendWelcomeEmail({ to, selectedRegulators = [], cadence = "realtime" }) {
  if (!isSmtpConfigured || !transporter) {
    return { sent: false, reason: "SMTP not configured" };
  }

  const fromAddress = `"Truvad Regulatory Alerts" <${smtpUser}>`;
  const tagsList = selectedRegulators.map((r) => escapeHtml(r).toUpperCase()).join(", ");

  const bodyHtml = `
    <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0;">You're successfully subscribed!</h2>
    <p style="font-size: 14px; line-height: 1.5; color: #475569; margin: 0 0 16px 0;">
      Your personalized regulatory alerts are now active. You will receive <strong>${escapeHtml(cadence)}</strong> synthesised circulars directly to your inbox.
    </p>
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 8px;">
      <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em;">Tracked authorities:</span>
      <p style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 6px 0 0 0;">${tagsList || "Selected authorities"}</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject: "Welcome to Truvad — Your personalized alerts are active",
      html: renderEmailWrapper({
        title: "Welcome to Truvad GRIP",
        headerKicker: "Welcome to GRIP",
        bodyHtml
      })
    });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error("Welcome email error:", err.message);
    return { sent: false, error: err.message };
  }
}

/**
 * Send Feedback Notification Email
 */
export async function sendFeedbackNotificationEmail({ name, email, feedback }) {
  const targetEmail = process.env.FEEDBACK_TARGET_EMAIL || "kepejip359@abowned.com";

  if (!isSmtpConfigured || !transporter) {
    console.info(`[SMTP SKIPPED] Feedback notification to ${targetEmail}:`, { name, email, feedback });
    return { sent: false, reason: "SMTP not configured" };
  }

  const fromAddress = `"Truvad Feedback" <${smtpUser}>`;
  const displayName = name ? name.trim() : "Anonymous User";
  const timestamp = new Date().toUTCString();

  const bodyHtml = `
    <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">New GRIP Feedback Submitted</h2>
    <table width="100%" style="font-size: 14px; margin-bottom: 20px; border-collapse: collapse;">
      <tr>
        <td style="padding: 6px 0; color: #64748b; width: 80px; font-weight: 600;">Sender:</td>
        <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${escapeHtml(displayName)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email:</td>
        <td style="padding: 6px 0; color: #0f172a;">${escapeHtml(email)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Date:</td>
        <td style="padding: 6px 0; color: #64748b;">${escapeHtml(timestamp)}</td>
      </tr>
    </table>
    <div style="background-color: #f8fafc; border: 1.5px solid #e2e8f0; border-left: 4px solid #0f172a; border-radius: 8px; padding: 18px 20px; font-size: 14px; line-height: 1.6; color: #0f172a; white-space: pre-wrap;">${escapeHtml(feedback)}</div>
  `;

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: targetEmail,
      replyTo: email,
      subject: `New Feedback from ${displayName} (${email}) — Truvad GRIP`,
      html: renderEmailWrapper({
        title: "New Feedback Received",
        headerKicker: "User Feedback",
        bodyHtml,
        footerNote: "Truvad Intelligence Layer · Automatic Feedback Dispatch"
      })
    });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[SMTP FEEDBACK ERROR] Failed to send to ${targetEmail}:`, err.message);
    return { sent: false, error: err.message };
  }
}
