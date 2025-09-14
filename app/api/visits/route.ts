import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, timestamp, user_agent, session_id } = body

    if (!page || !timestamp || !user_agent || !session_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert visit record into Supabase
    const { data, error } = await supabase
      .from("visits")
      .insert([{ page, timestamp, user_agent, session_id }])

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Visit recorded", data }, { status: 201 })
  } catch (error) {
    console.error("Internal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
