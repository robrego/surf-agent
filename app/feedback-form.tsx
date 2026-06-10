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
    background: "#fff",
    borderRadius: "16px",
    padding: "1.75rem 1.5rem",
    marginTop: "clamp(1.5rem, 4vw, 3rem)",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.06)",
  }

  const labelStyle = {
    fontFamily: "var(--font-body)",
    fontSize: "0.9rem",
    color: "var(--muted)",
    letterSpacing: "normal",
    textTransform: "none" as const,
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
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <path d="M2 14c3-3 5-3 8-1 2.2 1.5 4.5 1.5 6.5 0 2.2-1.6 4-1.5 6.5 1" stroke="#2563eb" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M2 19.5c3-3 5-3 8-1 2.2 1.5 4.5 1.5 6.5 0 2.2-1.6 4-1.5 6.5 1" stroke="#2563eb" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.6" />
        </svg>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "var(--text)",
          margin: 0,
        }}>
          How was the forecast?
        </p>
      </div>

      <div>
        <span style={labelStyle}>Rate the pick</span>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {ratings.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setRating(value)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                padding: "0.75rem 1.4rem",
                border: "none",
                background: rating === value ? "var(--accent)" : "var(--surface)",
                color: rating === value ? "var(--bg)" : "var(--muted)",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.15s ease",
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
            padding: "0.9rem 1rem",
            border: "none",
            background: "var(--surface)",
            color: actualSpot ? "var(--text)" : "var(--muted)",
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            borderRadius: "12px",
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
            padding: "0.95rem 1rem",
            border: "none",
            background: "var(--surface)",
            color: "var(--text)",
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            borderRadius: "12px",
            outline: "none",
          }}
        />
      </div>

      <button
        onClick={submit}
        disabled={!rating}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1rem",
          fontWeight: 500,
          padding: "0.85rem 1.75rem",
          border: "none",
          background: "var(--accent)",
          color: "#fff",
          borderRadius: "12px",
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
