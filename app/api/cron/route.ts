import { NextResponse } from "next/server"
import { runAgent } from "@/lib/agent"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await runAgent()
    console.log("=== SURF BRIEF ===")
    console.log(result.brief)
    return NextResponse.json({ ok: true, brief: result.brief, spot: result.spot })
  } catch (error) {
    console.error("Cron error:", error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}