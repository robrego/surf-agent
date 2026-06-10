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
  const [showGoogleTip, setShowGoogleTip] = useState(false)
  const [showTeamsTip, setShowTeamsTip] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [tides, setTides] = useState<any[]>([])
  const [downloadConfirmed, setDownloadConfirmed] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const href = `/api/tides?location=Peniche&days=${durationDays}&window=${windowHours}`

  const webcalUrl = typeof window !== "undefined"
    ? `webcal://${window.location.host}/api/tides?location=Peniche&days=${durationDays}&window=${windowHours}`
    : ""

  const googleImportUrl = typeof window !== "undefined"
    ? `https://calendar.google.com/calendar/r/settings/export`
    : ""

  const copyWebcal = () => {
    navigator.clipboard.writeText(webcalUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const fetchPreview = async () => {
    setPreviewLoading(true)
    try {
      const response = await fetch(href)
      const ics = await response.text()
      const events = parseICS(ics)
      setTides(events)
      setShowPreview(true)
    } catch (e) {
      console.error("Failed to fetch preview:", e)
    }
    setPreviewLoading(false)
  }

  const parseICS = (ics: string) => {
    const events: any[] = []
    const eventBlocks = ics.split("BEGIN:VEVENT")
    for (let i = 1; i < eventBlocks.length; i++) {
      const block = eventBlocks[i]
      const match = block.match(/DESCRIPTION:Busy period around peak high tide at (\d{2}:\d{2}) \(([\d.]+)m\)/)
      const dtstart = block.match(/DTSTART:(\d{8}T\d{6}Z)/)
      const dtend = block.match(/DTEND:(\d{8}T\d{6}Z)/)
      if (match && dtstart && dtend) {
        events.push({
          time: match[1],
          height: match[2],
          start: formatDateString(dtstart[1]),
          end: formatDateString(dtend[1]),
        })
      }
    }
    return events
  }

  const formatDateString = (dateStr: string) => {
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    const hour = dateStr.slice(9, 11)
    const minute = dateStr.slice(11, 13)
    return `${month}/${day} ${hour}:${minute}`
  }

  const handleDownload = () => {
    setDownloadConfirmed(true)
    setTimeout(() => setDownloadConfirmed(false), 3000)
  }

  return (
    <div style={{ marginTop: "clamp(2rem, 5vw, 3rem)", marginBottom: "clamp(2rem, 5vw, 3rem)", padding: "1.75rem", borderRadius: "16px", background: "#fff", boxShadow: "0 20px 60px rgba(15, 23, 42, 0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", justifyContent: "space-between" }}>
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <path d="M19 4H18V2H16V4H8V2H6V4H5C3.9 4 3 4.9 3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20ZM19 7H5V6H19V7ZM7 12H11V16H7V12Z" fill="#1a73e8" />
        </svg>
      </div>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--muted)", letterSpacing: "normal" }}>
            Before and after high tide
          </span>
          <select
            id="tide-download-window"
            value={windowHours}
            onChange={(event) => setWindowHours(Number(event.target.value))}
            style={{
              width: "100%",
              minWidth: "11rem",
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
              width: "100%",
              minWidth: "11rem",
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
          onClick={handleDownload}
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

      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => showPreview ? setShowPreview(false) : fetchPreview()}
          disabled={previewLoading}
          style={{
            fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.06em",
            padding: "0.25rem 0.65rem", borderRadius: "20px",
            border: "1.5px solid var(--border)", background: "transparent",
            color: "var(--muted)", cursor: "pointer", opacity: previewLoading ? 0.5 : 1,
          }}
        >
          {previewLoading ? "loading..." : showPreview ? "hide preview" : "preview"}
        </button>
      </div>

      {/* Google Calendar on iPhone */}
      <div style={{
        marginTop: "1.25rem", padding: "1rem 1.25rem",
        background: "var(--surface)", borderRadius: "12px",
      }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", margin: "0 0 0.4rem" }}>
          Add to Google Calendar (iPhone)
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--muted)", margin: "0 0 0.75rem", lineHeight: 1.5 }}>
          Copy the link below → open Google Calendar → Other calendars → From URL → paste
        </p>
        <button onClick={copyWebcal} style={{
          fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 600,
          padding: "0.5rem 1.25rem", borderRadius: "8px", border: "none",
          background: copied ? "var(--go)" : "var(--accent)", color: "#fff",
          cursor: "pointer", transition: "background 0.15s",
        }}>
          {copied ? "Copied!" : "Copy subscription link"}
        </button>
      </div>

      {showPreview && (
        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: "1rem" }}>
            High tides for the next {durationDays} days
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "300px", overflowY: "auto" }}>
            {tides.length > 0 ? (
              tides.map((tide, i) => (
                <div key={i} style={{ fontSize: "0.9rem", color: "var(--text)", padding: "0.75rem", background: "var(--surface)", borderRadius: "8px" }}>
                  <div style={{ fontWeight: 500 }}>Peak: {tide.time} ({tide.height}m)</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.25rem" }}>Busy: {tide.start} → {tide.end}</div>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No high tides found for the selected period.</p>
            )}
          </div>
        </div>
      )}

      {downloadConfirmed && (
        <div style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          background: "var(--accent)",
          color: "#fff",
          padding: "1rem 1.5rem",
          borderRadius: "8px",
          fontFamily: "var(--font-body)",
          fontSize: "0.95rem",
          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)",
          zIndex: 2000,
        }}>
          ✓ Calendar downloaded successfully!
        </div>
      )}
    </div>
  )
}
