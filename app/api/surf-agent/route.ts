import { NextResponse } from "next/server"
import { runAgent } from "@/lib/agent"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const result = await runAgent()
    return NextResponse.json({
      ok: true,
      generated_at: new Date().toISOString(),
      ...result,
    })
  } catch (error) {
    console.error("Surf agent error:", error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}