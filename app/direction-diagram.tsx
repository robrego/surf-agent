export default function DirectionDiagram({
  windDir,
  swellDir,
  spotFacing,
}: {
  windDir: number
  swellDir: number
  spotFacing: number | null
}) {
  const cx = 50, cy = 50, cr = 34

  // Compass degrees → SVG coords (0=N up, clockwise)
  function toXY(deg: number, r: number): [number, number] {
    const rad = ((deg - 90) * Math.PI) / 180
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
  }

  // Swell: arrow from rim toward center (swell arriving FROM swellDir)
  const [ss1x, ss1y] = toXY(swellDir, cr)
  const [ss2x, ss2y] = toXY(swellDir, 9)

  // Wind: shorter arrow from rim (wind coming FROM windDir)
  const [ws1x, ws1y] = toXY(windDir, cr)
  const [ws2x, ws2y] = toXY(windDir, 17)

  // Coast: on the LAND side = opposite of facing (facing = where ocean is)
  let coast: { c1x: number; c1y: number; c2x: number; c2y: number } | null = null
  if (spotFacing !== null) {
    const landDir = (spotFacing + 180) % 360
    // Coast center: 20 units toward land from compass center
    const landRad = ((landDir - 90) * Math.PI) / 180
    const lcx = cx + 20 * Math.cos(landRad)
    const lcy = cy + 20 * Math.sin(landRad)
    // Perpendicular unit vector (coast runs perp to landDir)
    const perpRad = (landDir * Math.PI) / 180
    const pvx = Math.cos(perpRad)
    const pvy = Math.sin(perpRad)
    const half = 18
    coast = {
      c1x: lcx + half * pvx, c1y: lcy + half * pvy,
      c2x: lcx - half * pvx, c2y: lcy - half * pvy,
    }
  }

  const compassPts = [
    { label: "N", deg: 0 },
    { label: "E", deg: 90 },
    { label: "S", deg: 180 },
    { label: "W", deg: 270 },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <svg viewBox="0 0 100 100" style={{ width: 96, height: 96, flexShrink: 0 }}>
        <defs>
          <marker id="arr-swell" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
            <polygon points="0 0, 5 2, 0 4" fill="#60a5fa" />
          </marker>
          <marker id="arr-wind" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
            <polygon points="0 0, 5 2, 0 4" fill="#94a3b8" />
          </marker>
        </defs>

        {/* Compass circle */}
        <circle cx={cx} cy={cy} r={cr} fill="none" stroke="var(--border)" strokeWidth="0.75" />

        {/* N/S/E/W */}
        {compassPts.map(({ label, deg }) => {
          const [lx, ly] = toXY(deg, cr + 9)
          return (
            <text key={label} x={lx} y={ly}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)"
            >
              {label}
            </text>
          )
        })}

        {/* Coast — green, on land side */}
        {coast && (
          <line
            x1={coast.c1x} y1={coast.c1y}
            x2={coast.c2x} y2={coast.c2y}
            stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round"
          />
        )}

        {/* Swell arrow */}
        <line
          x1={ss1x} y1={ss1y} x2={ss2x} y2={ss2y}
          stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"
          markerEnd="url(#arr-swell)"
        />

        {/* Wind arrow */}
        <line
          x1={ws1x} y1={ws1y} x2={ws2x} y2={ws2y}
          stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"
          strokeDasharray="3 2"
          markerEnd="url(#arr-wind)"
        />
      </svg>

      <div style={{ display: "flex", gap: "0.875rem" }}>
        {[
          { color: "#60a5fa", label: "swell", dashed: false },
          { color: "#94a3b8", label: "wind", dashed: true },
          ...(coast ? [{ color: "#22c55e", label: "coast", dashed: false }] : []),
        ].map(({ color, label, dashed }) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
            <svg width="16" height="6" viewBox="0 0 16 6">
              <line x1="0" y1="3" x2="11" y2="3" stroke={color} strokeWidth={label === "coast" ? 3.5 : label === "swell" ? 2 : 1.5} strokeDasharray={dashed ? "3 2" : undefined} strokeLinecap="round" />
              {label !== "coast" && <polygon points="11,0 16,3 11,6" fill={color} />}
            </svg>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
