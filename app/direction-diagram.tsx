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

  function polar(compassDeg: number, r: number): [number, number] {
    const rad = ((compassDeg - 90) * Math.PI) / 180
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
  }

  const [ss1x, ss1y] = polar(swellDir, cr)
  const [ss2x, ss2y] = polar(swellDir, 9)

  const [ws1x, ws1y] = polar(windDir, cr)
  const [ws2x, ws2y] = polar(windDir, 17)

  let coast: { c1x: number; c1y: number; c2x: number; c2y: number } | null = null
  if (spotFacing !== null) {
    const facingRad = (spotFacing * Math.PI) / 180
    const fvx = Math.sin(facingRad)
    const fvy = -Math.cos(facingRad)
    const pvx = Math.cos(facingRad)
    const pvy = Math.sin(facingRad)
    const ccx = cx + 22 * fvx
    const ccy = cy + 22 * fvy
    coast = {
      c1x: ccx + 15 * pvx, c1y: ccy + 15 * pvy,
      c2x: ccx - 15 * pvx, c2y: ccy - 15 * pvy,
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
      <svg viewBox="0 0 100 100" style={{ width: 88, height: 88, flexShrink: 0 }}>
        <defs>
          <marker id="arr-swell" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
            <polygon points="0 0, 5 2, 0 4" fill="#60a5fa" />
          </marker>
          <marker id="arr-wind" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
            <polygon points="0 0, 5 2, 0 4" fill="#94a3b8" />
          </marker>
        </defs>

        <circle cx={cx} cy={cy} r={cr} fill="none" stroke="var(--border)" strokeWidth="0.75" />

        {compassPts.map(({ label, deg }) => {
          const [lx, ly] = polar(deg, cr + 9)
          return (
            <text key={label} x={lx} y={ly}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)"
            >
              {label}
            </text>
          )
        })}

        {coast && (
          <line
            x1={coast.c1x} y1={coast.c1y} x2={coast.c2x} y2={coast.c2y}
            stroke="var(--text)" strokeWidth="3" strokeLinecap="round" opacity="0.45"
          />
        )}

        <line
          x1={ss1x} y1={ss1y} x2={ss2x} y2={ss2y}
          stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"
          markerEnd="url(#arr-swell)"
        />

        <line
          x1={ws1x} y1={ws1y} x2={ws2x} y2={ws2y}
          stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"
          strokeDasharray="3 2"
          markerEnd="url(#arr-wind)"
        />
      </svg>

      <div style={{ display: "flex", gap: "0.875rem" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
          <svg width="18" height="6" viewBox="0 0 18 6">
            <line x1="0" y1="3" x2="13" y2="3" stroke="#60a5fa" strokeWidth="2" />
            <polygon points="13,0 18,3 13,6" fill="#60a5fa" />
          </svg>
          swell
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
          <svg width="18" height="6" viewBox="0 0 18 6">
            <line x1="0" y1="3" x2="13" y2="3" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" />
            <polygon points="13,0 18,3 13,6" fill="#94a3b8" />
          </svg>
          wind
        </span>
        {coast && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
            <svg width="18" height="6" viewBox="0 0 18 6">
              <line x1="0" y1="3" x2="18" y2="3" stroke="var(--text)" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
            </svg>
            coast
          </span>
        )}
      </div>
    </div>
  )
}
