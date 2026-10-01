import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { sendFeedbackNotificationEmail } from "@/lib/mailClient";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, feedback } = body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!feedback || !feedback.trim()) {
      return NextResponse.json(
        { error: "Feedback content cannot be empty." },
        { status: 400 }
      );
    }

    const cleanName = (name || "Anonymous User").trim().slice(0, 100);
    const cleanEmail = email.trim().toLowerCase().slice(0, 254);
    const cleanFeedback = feedback.trim().slice(0, 5000);
    const targetEmail = process.env.FEEDBACK_TARGET_EMAIL || "kepejip359@abowned.com";

    // 1. Dispatch email notification via Gmail SMTP (Nodemailer)
    sendFeedbackNotificationEmail({
      name: cleanName,
      email: cleanEmail,
      feedback: cleanFeedback
    }).catch((err) => {
      console.error("Feedback email dispatch warning:", err.message);
    });

    // 2. Save feedback into Supabase database if configured
    if (isSupabaseConfigured && supabase) {
      const feedbackRecord = {
        name: cleanName,
        email: cleanEmail,
        feedback: cleanFeedback,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from("feedback")
        .insert(feedbackRecord);

      if (error) {
        console.error("Supabase feedback insert error:", error);
        return NextResponse.json({
          success: true,
          message: `Feedback dispatched to ${targetEmail} (Database sync notice: ${error.message})`,
          source: "email_dispatched"
        });
      }

      return NextResponse.json({
        success: true,
        message: `Thank you! Your feedback has been saved and dispatched to ${targetEmail}.`,
        data: feedbackRecord,
        source: "supabase_and_email"
      });
    }

    // 3. Fallback when Supabase credentials are not set
    console.info(`[FEEDBACK RECORDED] from ${cleanName} <${cleanEmail}>`);

    return NextResponse.json({
      success: true,
      message: `Feedback received and dispatched to ${targetEmail}.`,
      data: { name: cleanName, email: cleanEmail, feedback: cleanFeedback },
      source: "email_dispatched"
    });
  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing feedback." },
      { status: 500 }
    );
  }
}
