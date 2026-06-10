"use client"
import { useRouter } from "next/navigation"
import { LOCATIONS } from "@/lib/locations"

const FLAG: Record<string, string> = { PT: "🇵🇹", ES: "🇪🇸", FR: "🇫🇷" }

export default function LocationPicker({ current }: { current: string }) {
  const router = useRouter()

  return (
    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
      {LOCATIONS.map((loc) => {
        const active = loc.id === current
        return (
          <button
            key={loc.id}
            onClick={() => router.push(loc.id === "peniche" ? "/" : `/?loc=${loc.id}`)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              padding: "0.3rem 0.65rem",
              borderRadius: "20px",
              border: active ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
              background: active ? "var(--accent)" : "transparent",
              color: active ? "#fff" : "var(--muted)",
              cursor: "pointer",
              transition: "all 0.12s ease",
              whiteSpace: "nowrap",
            }}
          >
            {FLAG[loc.country]} {loc.name}
          </button>
        )
      })}
    </div>
  )
}
