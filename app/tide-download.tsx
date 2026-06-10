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

  const href = `/api/tides?location=Peniche&days=${durationDays}&window=${windowHours}`

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
    <div style={{ marginBottom: "clamp(2rem, 5vw, 3rem)", padding: "1.75rem", borderRadius: "16px", background: "#fff", boxShadow: "0 20px 60px rgba(15, 23, 42, 0.06)" }}>
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

        <button
          onClick={fetchPreview}
          disabled={previewLoading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.95rem 1.5rem",
            borderRadius: "12px",
            border: "none",
            background: "var(--surface)",
            color: "var(--accent)",
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            fontWeight: 600,
            textDecoration: "none",
            minHeight: "3rem",
            cursor: "pointer",
            opacity: previewLoading ? 0.6 : 1,
          }}
        >
          {previewLoading ? "Loading..." : "Preview"}
        </button>

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
      <div style={{ marginTop: "0.75rem", color: "var(--muted)", fontSize: "0.85rem", fontFamily: "var(--font-body)", display: "flex", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative" }}>
          <span 
            onClick={() => setShowGoogleTip(!showGoogleTip)}
            onMouseEnter={() => setShowGoogleTip(true)}
            onMouseLeave={() => setShowGoogleTip(false)}
            style={{ cursor: "pointer", borderBottom: "1px dotted var(--muted)", userSelect: "none" }}
          >
            Google Calendar
          </span>
          {showGoogleTip && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              marginTop: "0.5rem",
              background: "var(--text)",
              color: "var(--bg)",
              padding: "0.5rem 0.75rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              whiteSpace: "nowrap",
              zIndex: 1000,
            }}>
              Settings &gt; Import &amp; Export &gt; Import
            </div>
          )}
        </div>
        <div style={{ position: "relative" }}>
          <span 
            onClick={() => setShowTeamsTip(!showTeamsTip)}
            onMouseEnter={() => setShowTeamsTip(true)}
            onMouseLeave={() => setShowTeamsTip(false)}
            style={{ cursor: "pointer", borderBottom: "1px dotted var(--muted)", userSelect: "none" }}
          >
            Microsoft Teams
          </span>
          {showTeamsTip && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              marginTop: "0.5rem",
              background: "var(--text)",
              color: "var(--bg)",
              padding: "0.5rem 0.75rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              whiteSpace: "nowrap",
              zIndex: 1000,
            }}>
              Calendar app &gt; Import events &gt; select file
            </div>
          )}
        </div>
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
          <button
            onClick={() => setShowPreview(false)}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "6px",
              background: "var(--surface)",
              color: "var(--accent)",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontFamily: "var(--font-body)",
            }}
          >
            Close Preview
          </button>
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
