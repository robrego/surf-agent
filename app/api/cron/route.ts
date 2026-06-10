import { NextResponse } from "next/server"
import { runAgent, fetchMarineData, fetchWeatherData } from "@/lib/agent"

export const dynamic = "force-dynamic"

type DayQuality = "epic" | "good" | "marginal" | "skip"

function assessDay(result: any): DayQuality {
  // Rest day = skip or short notice
  if (result.spot === "Rest day") return "skip"

  // Check confidence
  if (result.confidence === "high") {
    return "epic"
  }

  // Check if viable spots exist in debug data
  const viable = result._debug?.viable || []
  if (viable.length === 0) return "skip"
  if (viable.length >= 3 && viable[0].score > 60) return "epic"
  if (viable.length >= 2 && viable[0].score > 40) return "good"

  return "marginal"
}

async function sendEmail(subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Surf Agent <onboarding@resend.dev>",
      to: process.env.NOTIFY_EMAIL?.split(",").map((e) => e.trim()),
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

function buildEmailHtml(result: any, quality: DayQuality): string {
  const qualityBadge =
    quality === "epic"
      ? '<span style="background:#0F6E56;color:white;padding:2px 10px;border-radius:12px;font-size:13px">Epic conditions</span>'
      : quality === "good"
      ? '<span style="background:#1a7a5e;color:white;padding:2px 10px;border-radius:12px;font-size:13px">Good day</span>'
      : quality === "marginal"
      ? '<span style="background:#BA7517;color:white;padding:2px 10px;border-radius:12px;font-size:13px">Marginal</span>'
      : '<span style="background:#78716c;color:white;padding:2px 10px;border-radius:12px;font-size:13px">Rest day</span>'

  return `
    <div style="font-family:system-ui,sans-serif;max-width:480px;padding:20px">
      ${qualityBadge}
      <h1 style="font-size:28px;margin:12px 0 4px">${result.spot}</h1>
      <p style="color:#0F6E56;font-weight:500;margin:0 0 16px">${result.time_window || "No window"} · ${result.confidence} confidence</p>
      <p style="color:#57534e;line-height:1.6;margin:0 0 20px">${result.brief}</p>
      <table style="width:100%;border-collapse:separate;border-spacing:8px 0;margin:0 0 20px">
        <tr>
          <td style="padding:10px 12px;background:#fafaf9;border-radius:8px;width:33%">
            <small style="color:#a8a29e">Swell</small><br>
            <strong style="font-size:14px">${result.conditions_summary?.swell || "--"}</strong>
          </td>
          <td style="padding:10px 12px;background:#fafaf9;border-radius:8px;width:33%">
            <small style="color:#a8a29e">Wind</small><br>
            <strong style="font-size:14px">${result.conditions_summary?.wind || "--"}</strong>
          </td>
          <td style="padding:10px 12px;background:#fafaf9;border-radius:8px;width:33%">
            <small style="color:#a8a29e">Window</small><br>
            <strong style="font-size:14px">${result.conditions_summary?.best_window || "--"}</strong>
          </td>
        </tr>
      </table>
      <p style="color:#a8a29e;font-size:12px;margin:0 0 16px">Runner-up: ${result.runner_up || "none"}</p>
      <a href="https://surf-agent-phi.vercel.app" style="display:inline-block;padding:8px 20px;background:#1c1917;color:white;border-radius:6px;text-decoration:none;font-size:13px">Log feedback</a>
      <p style="color:#d6d3d1;font-size:11px;margin-top:20px">Peniche Surf Agent · Open-Meteo · Llama 3.3</p>
    </div>
  `
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await runAgent()
    const quality = assessDay(result)

    // Skip email on garbage days (or send a short one)
    if (quality === "skip") {
      const skipHtml = `
        <div style="font-family:system-ui,sans-serif;max-width:480px;padding:20px">
          <p style="color:#78716c;font-size:15px">${result.brief || "Nothing worth surfing today. Rest up."}</p>
          <p style="color:#d6d3d1;font-size:11px;margin-top:16px">Peniche Surf Agent</p>
        </div>
      `
      const emailed = await sendEmail("Rest day", skipHtml)
      return NextResponse.json({ ok: true, quality, emailed, spot: "Rest day" })
    }

    // Build subject based on quality
    const emoji = quality === "epic" ? "🔥" : quality === "good" ? "🏄" : "🌊"
    const subject = `${emoji} ${result.spot} · ${result.time_window}`

    const html = buildEmailHtml(result, quality)
    const emailed = await sendEmail(subject, html)

    return NextResponse.json({
      ok: true,
      quality,
      emailed,
      spot: result.spot,
      brief: result.brief,
    })
  } catch (error) {
    console.error("Cron error:", error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}