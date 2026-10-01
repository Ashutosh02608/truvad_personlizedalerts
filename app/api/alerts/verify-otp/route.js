import { NextResponse } from "next/server";
import { validateOtp } from "@/lib/otpStore";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { sendWelcomeEmail } from "@/lib/mailClient";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_CADENCES = new Set(["realtime", "daily", "weekly"]);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, code, selectedRegulators = [], cadence = "realtime" } = body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!code || typeof code !== "string" || code.trim().length !== 6) {
      return NextResponse.json(
        { error: "A 6-digit verification code is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCadence = ALLOWED_CADENCES.has(cadence) ? cadence : "realtime";
    const cleanRegulators = Array.isArray(selectedRegulators)
      ? selectedRegulators.filter((item) => typeof item === "string")
      : [];

    // Verify OTP
    const validation = validateOtp(cleanEmail, code.trim());
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.reason },
        { status: 400 }
      );
    }

    // Send welcome email asynchronously
    sendWelcomeEmail({
      to: cleanEmail,
      selectedRegulators: cleanRegulators,
      cadence: cleanCadence
    }).catch((err) => console.error("Welcome email warning:", err.message));

    // Save to Supabase
    if (isSupabaseConfigured && supabase) {
      const payload = {
        email: cleanEmail,
        selected_regulators: cleanRegulators,
        cadence: cleanCadence,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from("personalized_alerts")
        .upsert(payload, { onConflict: "email" })
        .select()
        .single();

      if (error) {
        console.error("Supabase upsert error:", error);
        return NextResponse.json(
          { error: `Database error: ${error.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Email verified! Alert preferences saved to Supabase.",
        data,
        source: "supabase"
      });
    }

    // Fallback if Supabase is in sandbox mode
    return NextResponse.json({
      success: true,
      message: "Email verified successfully! (Sandbox mode).",
      data: {
        email: cleanEmail,
        selected_regulators: cleanRegulators,
        cadence: cleanCadence,
        verified: true
      },
      source: "sandbox"
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    return NextResponse.json(
      { error: "Internal server error during verification." },
      { status: 500 }
    );
  }
}
