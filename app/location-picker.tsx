"use client"
import { useRouter } from "next/navigation"
import { useTransition, useState, useRef, useEffect } from "react"
import { LOCATIONS } from "@/lib/locations"

const FLAG: Record<string, string> = { PT: "🇵🇹", ES: "🇪🇸", FR: "🇫🇷" }
const COUNTRY_NAMES: Record<string, string> = { PT: "Portugal", ES: "Spain", FR: "France" }

export default function LocationPicker({ current }: { current: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentLoc = LOCATIONS.find((l) => l.id === current) ?? LOCATIONS[0]

  const byCountry = LOCATIONS.reduce((acc, loc) => {
    if (!acc[loc.country]) acc[loc.country] = []
    acc[loc.country].push(loc)
    return acc
  }, {} as Record<string, typeof LOCATIONS>)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const select = (id: string) => {
    setOpen(false)
    startTransition(() => {
      router.push(id === "peniche" ? "/" : `/?loc=${id}`)
    })
  }

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* Trigger */}
      <button
        onClick={() => !isPending && setOpen((o) => !o)}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1.15rem",
          fontWeight: 500,
          padding: "0.7rem 2.5rem 0.7rem 1.1rem",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: isPending ? "var(--muted)" : "var(--text)",
          cursor: isPending ? "wait" : "pointer",
          outline: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          minWidth: "200px",
          transition: "opacity 0.15s ease",
          opacity: isPending ? 0.6 : 1,
          position: "relative",
        }}
      >
        <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{FLAG[currentLoc.country]}</span>
        {currentLoc.name}
        <span style={{ position: "absolute", right: "0.9rem", color: "var(--muted)", fontSize: "0.75rem" }}>
          {isPending ? "..." : open ? "▴" : "▾"}
        </span>
      </button>

      {/* Megamenu */}
      {open && (
        <>
          <style>{`
            .loc-megamenu { display: flex; flex-direction: row; min-width: 480px; }
            .loc-col { border-right: 1px solid var(--border); }
            .loc-col:last-child { border-right: none; }
            @media (max-width: 540px) {
              .loc-megamenu { flex-direction: column; min-width: min(92vw, 300px); left: 0; }
              .loc-col { border-right: none; border-bottom: 1px solid var(--border); }
              .loc-col:last-child { border-bottom: none; }
            }
          `}</style>
          <div className="loc-megamenu" style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            boxShadow: "0 12px 40px rgba(15,23,42,0.12)",
            zIndex: 9999,
            overflow: "hidden",
          }}>
          {Object.entries(byCountry).map(([country, locs]) => (
            <div
              key={country}
              className="loc-col"
              style={{ flex: 1 }}
            >
              {/* Country header */}
              <div style={{
                padding: "0.75rem 1.1rem 0.6rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                borderBottom: "1px solid var(--border)",
                background: "var(--surface)",
              }}>
                <span style={{ fontSize: "1.1rem" }}>{FLAG[country]}</span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  fontWeight: 600,
                }}>
                  {COUNTRY_NAMES[country]}
                </span>
              </div>

              {/* Location list */}
              <div style={{ padding: "0.4rem 0" }}>
                {locs.map((loc) => {
                  const active = loc.id === current
                  return (
                    <button
                      key={loc.id}
                      onClick={() => select(loc.id)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "0.55rem 1.1rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        fontWeight: active ? 600 : 400,
                        color: active ? "var(--accent)" : "var(--text)",
                        background: active ? "rgba(2,132,199,0.07)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = "var(--surface)"
                      }}
                      onMouseLeave={(e) => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"
                      }}
                    >
                      {loc.name}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
          </div>
        </>
      )}
    </div>
  )
}
