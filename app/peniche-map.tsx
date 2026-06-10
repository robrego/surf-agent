"use client"
import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"

const SIZE = 180
const PENICHE: [number, number] = [39.355, -9.383]

const COMPASS = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
const bearing = (d: number) => COMPASS[Math.round(((d % 360) + 360) / 22.5) % 16]

function pt(cx: number, cy: number, deg: number, r: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

function arrow(cx: number, cy: number, deg: number) {
  const TAIL_R = 72, TIP_R = 14, HEAD_W = 7, HEAD_LEN = 12
  const dirRad = (deg * Math.PI) / 180
  const ux = Math.sin(dirRad), uy = -Math.cos(dirRad)
  const px = -uy, py = ux

  const tailX = cx + TAIL_R * ux, tailY = cy + TAIL_R * uy
  const tipX  = cx + TIP_R  * ux, tipY  = cy + TIP_R  * uy
  const baseR = TIP_R + HEAD_LEN
  const baseX = cx + baseR * ux, baseY = cy + baseR * uy
  const lX = baseX - HEAD_W * px, lY = baseY - HEAD_W * py
  const rX = baseX + HEAD_W * px, rY = baseY + HEAD_W * py

  return {
    shaft: `M ${tailX.toFixed(1)} ${tailY.toFixed(1)} L ${baseX.toFixed(1)} ${baseY.toFixed(1)}`,
    head:  `${lX.toFixed(1)},${lY.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)} ${rX.toFixed(1)},${rY.toFixed(1)}`,
  }
}

export default function PenicheMap({
  windDir,
  swellDir,
}: {
  windDir: number
  swellDir: number
  spotFacing: number | null
}) {
  const cx = SIZE / 2, cy = SIZE / 2
  const swell = arrow(cx, cy, swellDir)
  const wind  = arrow(cx, cy, windDir)
  const [slx, sly] = pt(cx, cy, swellDir, 83)
  const [wlx, wly] = pt(cx, cy, windDir,  83)

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{
        position: "relative",
        width: SIZE,
        height: SIZE,
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid var(--border)",
      }}>
        <MapContainer
          center={PENICHE}
          zoom={11}
          style={{ width: SIZE, height: SIZE }}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          keyboard={false}
          attributionControl={false}
        >
          <TileLayer url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
        </MapContainer>

        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ position: "absolute", inset: 0, width: SIZE, height: SIZE, pointerEvents: "none", zIndex: 1000 }}
        >
          {/* Swell: blue */}
          <path d={swell.shaft} stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
          <polygon points={swell.head} fill="white" stroke="white" strokeWidth="4" strokeLinejoin="round" />
          <path d={swell.shaft} stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <polygon points={swell.head} fill="#1d4ed8" />

          {/* Wind: black */}
          <path d={wind.shaft} stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
          <polygon points={wind.head} fill="white" stroke="white" strokeWidth="4" strokeLinejoin="round" />
          <path d={wind.shaft} stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <polygon points={wind.head} fill="#111" />

          {/* Bearing labels */}
          <text x={slx} y={sly} textAnchor="middle" dominantBaseline="middle"
            fontSize="7.5" fontWeight="700" fontFamily="monospace"
            stroke="white" strokeWidth="3" paintOrder="stroke" fill="#1d4ed8">
            {bearing(swellDir)}
          </text>
          <text x={wlx} y={wly} textAnchor="middle" dominantBaseline="middle"
            fontSize="7.5" fontWeight="700" fontFamily="monospace"
            stroke="white" strokeWidth="3" paintOrder="stroke" fill="#111">
            {bearing(windDir)}
          </text>

          {/* N */}
          <text x={cx} y={9} textAnchor="middle" fontSize="7" fontWeight="700"
            fontFamily="monospace"
            stroke="white" strokeWidth="2.5" paintOrder="stroke" fill="#94a3b8">N</text>
        </svg>
      </div>

      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: "var(--muted)", opacity: 0.4, margin: "0.35rem 0 0" }}>
        © CARTO © OpenStreetMap
      </p>
    </div>
  )
}
