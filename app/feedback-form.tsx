"use client"

import { useState } from "react"

const SPOTS = [
  "Supertubos", "Consolacao", "Molhe Leste", "Lagide", "Gamboa",
  "Cerro", "Meio da Baia", "Cantinho da Baia", "Baleal", "Belgas",
  "Praia del Rey", "Cortico", "Areia Branca", "Didn't surf"
]

const ratings = [
  { value: "good", label: "Spot on" },
  { value: "ok", label: "Decent" },
  { value: "bad", label: "Wrong call" },
]

export default function FeedbackForm({
  recommendedSpot,
  conditionsSummary,
}: {
  recommendedSpot: string
  conditionsSummary: any
}) {
  const [rating, setRating] = useState<string | null>(null)
  const [actualSpot, setActualSpot] = useState("")
  const [notes, setNotes] = useState("")
  const [sent, setSent] = useState(false)

  async function submit() {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recommended_spot: recommendedSpot,
        actual_spot: actualSpot || null,
        rating,
        notes,
        conditions_summary: conditionsSummary,
      }),
    })
    setSent(true)
  }

  const sectionStyle = {
    borderTop: "1px solid var(--border)",
    paddingTop: "1.75rem",
  }

  const labelStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.8rem",
    color: "var(--muted)",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    display: "block",
    marginBottom: "0.875rem",
  }

  if (sent) {
    return (
      <section style={sectionStyle}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.875rem",
          color: "var(--go)",
          letterSpacing: "0.04em",
        }}>
          Logged. The agent will learn from this.
        </p>
      </section>
    )
  }

  return (
    <section style={sectionStyle}>
      <p style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.25rem",
        fontWeight: 600,
        color: "var(--text)",
        marginBottom: "1.5rem",
        letterSpacing: "0.01em",
      }}>
        How was the call?
      </p>

      <div>
        <span style={labelStyle}>Rate the pick</span>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {ratings.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setRating(value)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                padding: "0.6rem 1.1rem",
                border: `1px solid ${rating === value ? "var(--accent)" : "var(--border)"}`,
                background: rating === value ? "var(--accent)" : "transparent",
                color: rating === value ? "var(--bg)" : "var(--muted)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                textTransform: "uppercase" as const,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Where did you actually surf?</label>
        <select
          value={actualSpot}
          onChange={(e) => setActualSpot(e.target.value)}
          style={{
            width: "100%",
            padding: "0.65rem 0.875rem",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: actualSpot ? "var(--text)" : "var(--muted)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            letterSpacing: "0.04em",
            outline: "none",
            appearance: "none" as const,
            WebkitAppearance: "none" as const,
            cursor: "pointer",
          }}
        >
          <option value="">Select a spot</option>
          {SPOTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={labelStyle}>Notes (optional)</label>
        <input
          type="text"
          placeholder="Anything worth knowing..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            width: "100%",
            padding: "0.65rem 0.875rem",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            letterSpacing: "0.04em",
            outline: "none",
          }}
        />
      </div>

      <button
        onClick={submit}
        disabled={!rating}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.85rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          padding: "0.7rem 1.5rem",
          border: "1px solid var(--accent)",
          background: "transparent",
          color: "var(--accent)",
          cursor: rating ? "pointer" : "not-allowed",
          opacity: rating ? 1 : 0.3,
          transition: "all 0.15s ease",
        }}
      >
        Log session
      </button>
    </section>
  )
}
