import { NextResponse } from "next/server";
import { createOtp } from "@/lib/otpStore";
import { sendOtpEmail } from "@/lib/mailClient";

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
    const emailResult = await sendOtpEmail({ to: normalizedEmail, code });
    if (!emailResult.sent) {
      console.error("Email delivery failed:", emailResult);
      return NextResponse.json(
        { 
          error: `Email delivery failed: ${emailResult.reason || emailResult.error || "Could not reach mail server"}. Check your SMTP credentials in .env.local and restart the server.` 
        },
        { status: 500 }
      );
    }

    console.log(`[SMTP] Verification email sent to ${normalizedEmail}, messageId: ${emailResult.messageId}`);

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
