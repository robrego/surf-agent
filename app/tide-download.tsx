"use client"

import { useState } from "react"

const WINDOW_OPTIONS = [1, 1.5, 2, 2.5, 3]
const DURATION_OPTIONS = [
  { label: "1 week", value: 7 },
  { label: "2 weeks", value: 14 },
  { label: "4 weeks", value: 28 },
]

export default function TideDownload() {
  const [windowHours, setWindowHours] = useState(2)
  const [durationDays, setDurationDays] = useState(7)

  const href = `/api/tides?location=Peniche&days=${durationDays}&window=${windowHours}`

  return (
    <div style={{ marginBottom: "clamp(2rem, 5vw, 3rem)" }}>
      <p
        style={{
          marginBottom: "1rem",
          fontFamily: "var(--font-body)",
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "var(--text)",
        }}
      >
        Calendar Blocker Around High Tides
      </p>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Before and After High Tide
          </span>
          <select
            id="tide-download-window"
            value={windowHours}
            onChange={(event) => setWindowHours(Number(event.target.value))}
            style={{
              minWidth: "9rem",
              padding: "0.95rem 1rem",
              borderRadius: "4px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              cursor: "pointer",
            }}
          >
            {WINDOW_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} hour{option !== 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
            For how long?
          </span>
          <select
            id="tide-download-duration"
            value={durationDays}
            onChange={(event) => setDurationDays(Number(event.target.value))}
            style={{
              minWidth: "9rem",
              padding: "0.95rem 1rem",
              borderRadius: "4px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              cursor: "pointer",
            }}
          >
            {DURATION_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <a
          href={href}
          download="peniche-tides.ics"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.95rem 1.5rem",
            borderRadius: "4px",
            border: "1px solid var(--accent)",
            background: "var(--accent)",
            color: "#fff",
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Download Your "Busy" Schedule
        </a>
      </div>
      <p style={{ marginTop: "0.75rem", color: "var(--muted)", fontSize: "0.95rem", fontFamily: "var(--font-body)" }}>
        Download the ICS file for the next {durationDays} days.
      </p>
    </div>
  )
}
