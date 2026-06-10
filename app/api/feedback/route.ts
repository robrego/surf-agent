import { NextResponse } from "next/server"
import { saveSession } from "@/lib/feedback"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    await saveSession({
      date: new Date().toISOString().slice(0, 10),
      recommended_spot: body.recommended_spot,
      actual_spot: body.actual_spot || null,
      rating: body.rating,
      notes: body.notes || "",
      conditions_summary: body.conditions_summary || null,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}