// For now, stores feedback in Vercel KV (Redis)
// Add KV from Vercel dashboard: Storage > Create > KV
// It will auto-add the env vars

interface SessionLog {
  date: string
  recommended_spot: string
  actual_spot: string | null
  rating: "good" | "ok" | "bad"
  notes: string
  conditions_summary: any
}

const STORAGE_KEY = "surf-agent:sessions"

async function getKvUrl() {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return { url, token }
}

export async function saveSession(session: SessionLog): Promise<boolean> {
  const kv = await getKvUrl()
  if (!kv) {
    console.log("No KV configured, skipping feedback storage")
    return false
  }

  // Get existing sessions
  const existing = await getSessions()
  existing.push(session)

  // Keep last 30 sessions
  const trimmed = existing.slice(-30)

  await fetch(`${kv.url}/set/${STORAGE_KEY}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${kv.token}` },
    body: JSON.stringify(trimmed),
  })

  return true
}

export async function getSessions(): Promise<SessionLog[]> {
  const kv = await getKvUrl()
  if (!kv) return []

  try {
    const res = await fetch(`${kv.url}/get/${STORAGE_KEY}`, {
      headers: { Authorization: `Bearer ${kv.token}` },
    })
    const data = await res.json()
    if (data.result) {
      return typeof data.result === "string"
        ? JSON.parse(data.result)
        : data.result
    }
  } catch (e) {
    console.error("Failed to fetch sessions:", e)
  }
  return []
}

export function buildFeedbackContext(sessions: SessionLog[]): string {
  if (sessions.length === 0) return ""

  const recent = sessions.slice(-10)
  const lines = recent.map(
    (s) =>
      `- ${s.date}: Recommended ${s.recommended_spot}, surfer went to ${s.actual_spot ?? "unknown"}, rated ${s.rating}${s.notes ? ` ("${s.notes}")` : ""}`
  )

  return `\n## Recent session feedback (use this to improve your recommendations)
${lines.join("\n")}
`
}