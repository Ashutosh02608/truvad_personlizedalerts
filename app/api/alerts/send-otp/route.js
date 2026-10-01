import { NextResponse } from "next/server";
import { createOtp } from "@/lib/otpStore";
import { sendOtpEmail, isSmtpConfigured } from "@/lib/mailClient";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    let code;
    try {
      code = createOtp(normalizedEmail);
    } catch (err) {
      if (err.code === "COOLDOWN") {
        return NextResponse.json({ error: err.message }, { status: 429 });
      }
      throw err;
    }

    // Send email via Gmail SMTP (Nodemailer)
    if (isSmtpConfigured) {
      try {
        await sendOtpEmail({ to: normalizedEmail, code });
      } catch (err) {
        console.error("Email delivery failed:", err.message);
        return NextResponse.json(
          { error: `Email delivery failed: ${err.message}` },
          { status: 500 }
        );
      }
    } else {
      console.info(`[SANDBOX OTP] Generated code for ${normalizedEmail}: ${code}`);
    }

    return NextResponse.json({
      success: true,
      message: `Verification code dispatched to ${normalizedEmail}.`
    });
  } catch (err) {
    console.error("Error generating OTP:", err);
    return NextResponse.json(
      { error: "Failed to send verification code. Please try again." },
      { status: 500 }
    );
  }
}
