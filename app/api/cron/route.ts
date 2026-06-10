import { NextResponse } from "next/server"
import { runAgent } from "@/lib/agent"

export const dynamic = "force-dynamic"

async function sendEmail(subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Surf Agent <onboarding@resend.dev>",
      to: process.env.NOTIFY_EMAIL?.split(",").map(e => e.trim()),
      subject,
      html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("Email failed:", err)
    return false
  }
  return true
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await runAgent()

    const subject = result.spot === "Rest day"
      ? "Rest day — no surf today"
      : `${result.spot} · ${result.time_window}`

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:480px;padding:20px">
        <h1 style="font-size:28px;margin:0 0 4px">${result.spot}</h1>
        <p style="color:#0F6E56;font-weight:500;margin:0 0 16px">${result.time_window || "No window today"} · ${result.confidence} confidence</p>
        <p style="color:#57534e;line-height:1.6;margin:0 0 20px">${result.brief}</p>
        <table style="width:100%;border-collapse:collapse;margin:0 0 20px">
          <tr>
            <td style="padding:8px 12px;background:#fafaf9;border-radius:6px">
              <small style="color:#a8a29e">Swell</small><br>
              <strong>${result.conditions_summary?.swell || "--"}</strong>
            </td>
            <td style="padding:8px 12px;background:#fafaf9;border-radius:6px">
              <small style="color:#a8a29e">Wind</small><br>
              <strong>${result.conditions_summary?.wind || "--"}</strong>
            </td>
          </tr>
        </table>
        <p style="color:#a8a29e;font-size:12px">Runner-up: ${result.runner_up || "none"}</p>
        <a href="https://surf-agent-phi.vercel.app" style="color:#0F6E56;font-size:13px">Log feedback</a>
      </div>
    `

    const emailed = await sendEmail(subject, html)

    return NextResponse.json({ ok: true, emailed, spot: result.spot, brief: result.brief })
  } catch (error) {
    console.error("Cron error:", error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}