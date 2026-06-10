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
    <div style={{ marginBottom: "clamp(2rem, 5vw, 3rem)", padding: "1.75rem", borderRadius: "16px", background: "#fff", boxShadow: "0 20px 60px rgba(15, 23, 42, 0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <path d="M19 4H18V2H16V4H8V2H6V4H5C3.9 4 3 4.9 3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20ZM19 7H5V6H19V7ZM7 12H11V16H7V12Z" fill="#1a73e8" />
        </svg>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--text)",
          }}
        >
          Calendar blocker around high tides
        </p>
      </div>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--muted)", letterSpacing: "normal" }}>
            Before and After High Tide
          </span>
          <select
            id="tide-download-window"
            value={windowHours}
            onChange={(event) => setWindowHours(Number(event.target.value))}
            style={{
              minWidth: "9rem",
              padding: "0.95rem 1rem",
              borderRadius: "12px",
              border: "none",
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
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--muted)", letterSpacing: "normal" }}>
            For how long?
          </span>
          <select
            id="tide-download-duration"
            value={durationDays}
            onChange={(event) => setDurationDays(Number(event.target.value))}
            style={{
              minWidth: "9rem",
              padding: "0.95rem 1rem",
              borderRadius: "12px",
              border: "none",
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
            borderRadius: "12px",
            border: "none",
            background: "var(--accent)",
            color: "#fff",
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            fontWeight: 600,
            textDecoration: "none",
            minHeight: "3rem",
          }}
        >
          Download Your "Busy" Schedule
        </a>
      </div>
      <p style={{ marginTop: "0.75rem", color: "var(--muted)", fontSize: "0.85rem", fontFamily: "var(--font-body)" }}>
        ICS file for the next {durationDays} days.
      </p>
    </div>
  )
}
