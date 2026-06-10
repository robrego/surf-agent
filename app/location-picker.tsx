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
      <button
        onClick={() => !isPending && setOpen((o) => !o)}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1.15rem",
          fontWeight: 500,
          padding: "0.7rem 2.5rem 0.7rem 1.1rem",
          borderRadius: "12px",
          border: "1.5px solid var(--border)",
          background: "var(--surface)",
          color: isPending ? "var(--muted)" : "var(--text)",
          cursor: isPending ? "wait" : "pointer",
          outline: "none",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          minWidth: "200px",
          transition: "opacity 0.15s ease",
          opacity: isPending ? 0.6 : 1,
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{FLAG[currentLoc.country]}</span>
        {currentLoc.name}
        <span style={{ position: "absolute", right: "0.9rem", color: "var(--muted)", fontSize: "0.75rem", lineHeight: 1 }}>
          {isPending ? "..." : open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          minWidth: "220px",
          background: "#fff",
          border: "1.5px solid var(--border)",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(15,23,42,0.10)",
          zIndex: 9999,
          overflow: "hidden",
        }}>
          {Object.entries(byCountry).map(([country, locs]) => (
            <div key={country}>
              <div style={{
                padding: "0.45rem 1rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                background: "var(--surface)",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}>
                <span style={{ fontSize: "1rem" }}>{FLAG[country]}</span>
                {COUNTRY_NAMES[country]}
              </div>
              {locs.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => select(loc.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "0.65rem 1rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    fontWeight: loc.id === current ? 600 : 400,
                    color: loc.id === current ? "var(--accent)" : "var(--text)",
                    background: loc.id === current ? "rgba(2,132,199,0.07)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
