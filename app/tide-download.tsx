"use client"

import { useState, useEffect } from "react"

const TIDE_TYPES = [
  { label: "High tide",  value: "high" },
  { label: "Mid tide",   value: "mid"  },
  { label: "Low tide",   value: "low"  },
]

const SLOT_OPTIONS = [
  { label: "30 min",  value: 0.5 },
  { label: "1 hour",  value: 1   },
  { label: "1h 30",   value: 1.5 },
  { label: "2 hours", value: 2   },
  { label: "2h 30",   value: 2.5 },
  { label: "3 hours", value: 3   },
]

const DURATION_OPTIONS = [
  { label: "1 week",  value: 7   },
  { label: "2 weeks", value: 14  },
  { label: "4 weeks", value: 28  },
  { label: "1 year",  value: 365 },
]

export default function TideDownload({ location = "peniche" }: { location?: string }) {
  const [tideType, setTideType]       = useState("mid")
  const [slotHours, setSlotHours]     = useState(1)
  const [durationDays, setDurationDays] = useState(7)
  const [showPreview, setShowPreview] = useState(false)
  const [tides, setTides]             = useState<any[]>([])
  const [downloadConfirmed, setDownloadConfirmed] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)

  const apiHref = `/api/tides?location=${location}&days=${durationDays}&slot=${slotHours}&tide=${tideType}`

  const [webcalUrl, setWebcalUrl]   = useState("")
  const [googleCalUrl, setGoogleCalUrl] = useState("")
  const [outlookUrl, setOutlookUrl] = useState("")

  useEffect(() => {
    const wc = `webcal://${window.location.host}/api/tides?location=${location}&days=${durationDays}&slot=${slotHours}&tide=${tideType}`
    setWebcalUrl(wc)
    setGoogleCalUrl(`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(wc)}`)
    setOutlookUrl(`https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(wc)}`)
  }, [durationDays, slotHours, tideType])

  const fetchPreview = async () => {
    setPreviewLoading(true)
    try {
      const response = await fetch(apiHref)
      const ics = await response.text()
      setTides(parseICS(ics))
      setShowPreview(true)
    } catch (e) {
      console.error("Failed to fetch preview:", e)
    }
    setPreviewLoading(false)
  }

  const parseICS = (ics: string) => {
    const events: any[] = []
    for (const block of ics.split("BEGIN:VEVENT").slice(1)) {
      const dtstart = block.match(/DTSTART:(\d{8}T\d{6}Z)/)
      const dtend   = block.match(/DTEND:(\d{8}T\d{6}Z)/)
      if (dtstart && dtend) events.push({ start: fmt(dtstart[1]), end: fmt(dtend[1]) })
    }
    return events
  }

  const fmt = (s: string) =>
    `${s.slice(4,6)}/${s.slice(6,8)} ${s.slice(9,11)}:${s.slice(11,13)}`

  const selectStyle: React.CSSProperties = {
    width: "100%",
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
    cursor: "pointer",
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "0.95rem",
    color: "var(--muted)",
  }

  const calBtnStyle = (bg: string, color: string, border: string): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    padding: "0.7rem 1rem",
    borderRadius: "10px",
    border,
    background: bg,
    color,
    fontFamily: "var(--font-body)",
    fontSize: "0.9rem",
    fontWeight: 500,
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
  })

  return (
    <div style={{ marginTop: "clamp(2rem, 5vw, 3rem)", marginBottom: "clamp(2rem, 5vw, 3rem)", padding: "1.75rem", borderRadius: "16px", background: "#fff", boxShadow: "0 20px 60px rgba(15, 23, 42, 0.06)" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.2rem" }}>
            Fun Fact
          </p>
          <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text)" }}>
            Calendar Blocker
          </p>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          <path d="M19 4H18V2H16V4H8V2H6V4H5C3.9 4 3 4.9 3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20ZM19 7H5V6H19V7ZM7 12H11V16H7V12Z" fill="#1a73e8" />
        </svg>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: "9rem" }}>
          <span style={labelStyle}>Select when</span>
          <select value={tideType} onChange={e => setTideType(e.target.value)} style={selectStyle}>
            {TIDE_TYPES.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: "9rem" }}>
          <span style={labelStyle}>Timeslot</span>
          <select value={slotHours} onChange={e => setSlotHours(Number(e.target.value))} style={selectStyle}>
            {SLOT_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: "9rem" }}>
          <span style={labelStyle}>For how long?</span>
          <select value={durationDays} onChange={e => setDurationDays(Number(e.target.value))} style={selectStyle}>
            {DURATION_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "stretch" }}>
          <a href={googleCalUrl} target="_blank" rel="noopener noreferrer" style={calBtnStyle("#fff", "#4285f4", "1px solid #dadce0")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </a>

          <a href={webcalUrl} style={calBtnStyle("#fff", "#1c1c1e", "1px solid #e0e0e0")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            Apple
          </a>

          <a href={outlookUrl} target="_blank" rel="noopener noreferrer" style={calBtnStyle("#fff", "#0078d4", "1px solid #d0e4f7")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 6.5C2 5.4 2.9 4.5 4 4.5h16c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-11z" fill="#0078d4"/><path d="M2 6.5l10 7 10-7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Outlook
          </a>

          <a href={apiHref} download="tides.ics" onClick={() => { setDownloadConfirmed(true); setTimeout(() => setDownloadConfirmed(false), 3000) }}
            style={calBtnStyle("transparent", "var(--muted)", "1px solid var(--border)")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            .ics
          </a>

          <button onClick={() => showPreview ? setShowPreview(false) : fetchPreview()}
            disabled={previewLoading} title="Preview"
            style={{ ...(calBtnStyle("transparent", "var(--muted)", "1px solid var(--border)") as any), cursor: "pointer", background: showPreview ? "var(--surface)" : "transparent" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>

      {showPreview && (
        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: "1rem" }}>
            {TIDE_TYPES.find(t => t.value === tideType)?.label} windows — next {durationDays} days
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "300px", overflowY: "auto" }}>
            {tides.length > 0 ? tides.map((tide, i) => (
              <div key={i} style={{ fontSize: "0.9rem", color: "var(--text)", padding: "0.75rem", background: "var(--surface)", borderRadius: "8px" }}>
                <div style={{ fontWeight: 500 }}>{tide.start} → {tide.end}</div>
              </div>
            )) : (
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No events found for the selected period.</p>
            )}
          </div>
        </div>
      )}

      {downloadConfirmed && (
        <div style={{ position: "fixed", bottom: "2rem", right: "2rem", background: "var(--accent)", color: "#fff", padding: "1rem 1.5rem", borderRadius: "8px", fontFamily: "var(--font-body)", fontSize: "0.95rem", boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)", zIndex: 2000 }}>
          ✓ Calendar downloaded!
        </div>
      )}
    </div>
  )
}
