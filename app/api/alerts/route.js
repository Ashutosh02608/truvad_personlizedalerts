import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, selectedRegulators, cadence = "realtime" } = body;

    // Validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(selectedRegulators) || selectedRegulators.length === 0) {
      return NextResponse.json(
        { error: "At least one regulator must be selected." },
        { status: 400 }
      );
    }

    // If Supabase is configured with env keys, persist to database
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("personalized_alerts")
        .upsert(
          {
            email: email.trim().toLowerCase(),
            selected_regulators: selectedRegulators,
            cadence,
            updated_at: new Date().toISOString()
          },
          { onConflict: "email" }
        )
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json(
          { error: `Database error: ${error.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Alert preferences successfully synced with Supabase.",
        data,
        source: "supabase"
      });
    }

    // Fallback if env variables are not yet populated
    console.info(
      "Supabase keys not detected in .env.local. Stored in sandbox mode:",
      { email, selectedRegulators, cadence }
    );

    return NextResponse.json({
      success: true,
      message:
        "Preferences saved. (Supabase credentials not configured in .env.local yet; using sandbox mode).",
      data: {
        email,
        selected_regulators: selectedRegulators,
        cadence,
        created_at: new Date().toISOString()
      },
      source: "sandbox"
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({
        configured: false,
        message: "Supabase credentials are not configured yet."
      });
    }

    if (email) {
      const { data, error } = await supabase
        .from("personalized_alerts")
        .select("*")
        .eq("email", email.trim().toLowerCase())
        .single();

      if (error) {
        return NextResponse.json({ found: false, error: error.message });
      }

      return NextResponse.json({ found: true, data });
    }

    // List recent subscribers (admin view)
    const { data, error } = await supabase
      .from("personalized_alerts")
      .select("email, selected_regulators, cadence, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ subscribers: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
