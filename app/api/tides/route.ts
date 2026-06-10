import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

async function findStation(lat: number, lng: number) {
  const { stations } = await import("@neaps/tide-database")

  let nearest = null
  let minDist = Infinity
  const toRad = (v: number) => (v * Math.PI) / 180

  for (const s of stations) {
    const station = s as any
    const slat = station.latitude ?? station.position?.lat ?? station.coordinates?.lat ?? station.lat
    const slng = station.longitude ?? station.position?.lng ?? station.coordinates?.lng ?? station.lon ?? station.lng
    if (slat == null || slng == null) continue

    const dLat = toRad(slat - lat)
    const dLng = toRad(slng - lng)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat)) * Math.cos(toRad(slat)) * Math.sin(dLng / 2) ** 2
    const distance = 2 * 6371 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    if (distance < minDist) { minDist = distance; nearest = station }
  }

  return nearest
}

// Returns mid-tide moments: the midpoint in time between each consecutive high/low extreme
async function getMidTides(lat: number, lng: number, days: number) {
  const TidePredictor = (await import("@neaps/tide-predictor")).default

  const station = await findStation(lat, lng)
  if (!station) throw new Error("No tide station found near this location")

  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + days)

  const s = station as any
  const constituents = s.harmonic_constituents ?? s.constituents ?? s.harmonics ?? s.data
  if (!constituents) throw new Error("No harmonic data for nearest station")

  const extremes: any[] = TidePredictor(constituents).getExtremesPrediction({ start, end })
  extremes.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

  const midTides: { time: Date }[] = []
  for (let i = 0; i < extremes.length - 1; i++) {
    const t1 = new Date(extremes[i].time).getTime()
    const t2 = new Date(extremes[i + 1].time).getTime()
    midTides.push({ time: new Date((t1 + t2) / 2) })
  }

  return midTides
}

// Sunrise/sunset via the standard solar position algorithm
function sunTimes(date: Date, lat: number, lng: number): { rise: Date; set: Date } | null {
  const toRad = (d: number) => (d * Math.PI) / 180
  const toDeg = (r: number) => (r * 180) / Math.PI

  const JD = date.getTime() / 86400000 + 2440587.5
  const n = JD - 2451545.0

  const Jstar = n - lng / 360
  const M = ((357.5291 + 0.98560028 * Jstar) % 360 + 360) % 360
  const C = 1.9148 * Math.sin(toRad(M)) + 0.02 * Math.sin(toRad(2 * M)) + 0.0003 * Math.sin(toRad(3 * M))
  const λ = ((M + C + 180 + 102.9372) % 360 + 360) % 360

  const Jtransit = 2451545 + Jstar + 0.0053 * Math.sin(toRad(M)) - 0.0069 * Math.sin(toRad(2 * λ))

  const sinDec = Math.sin(toRad(λ)) * Math.sin(toRad(23.4397))
  const cosDec = Math.cos(Math.asin(sinDec))
  const cosH = (Math.sin(toRad(-0.833)) - Math.sin(toRad(lat)) * sinDec) / (Math.cos(toRad(lat)) * cosDec)

  if (cosH < -1 || cosH > 1) return null // polar day/night

  const H = toDeg(Math.acos(cosH))
  const toDate = (jd: number) => new Date((jd - 2440587.5) * 86400000)

  return { rise: toDate(Jtransit - H / 360), set: toDate(Jtransit + H / 360) }
}

function generateICS(midTides: { time: Date }[], windowHours: number, lat: number, lng: number, location: string) {
  const pad = (n: number) => String(n).padStart(2, "0")
  const formatDate = (d: Date) =>
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" + pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    "00Z"

  const ms = windowHours * 3600000
  const events: string[] = []

  for (const tide of midTides) {
    const rawStart = new Date(tide.time.getTime() - ms)
    const rawEnd   = new Date(tide.time.getTime() + ms)

    const sun = sunTimes(tide.time, lat, lng)
    const start = sun ? new Date(Math.max(rawStart.getTime(), sun.rise.getTime())) : rawStart
    const end   = sun ? new Date(Math.min(rawEnd.getTime(),   sun.set.getTime()))  : rawEnd

    if (start >= end) continue // entirely outside daylight

    events.push([
      "BEGIN:VEVENT",
      `DTSTART:${formatDate(start)}`,
      `DTEND:${formatDate(end)}`,
      `SUMMARY:Busy`,
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE",
      `UID:midtide-${formatDate(tide.time)}@surf-agent`,
      "END:VEVENT",
    ].join("\r\n"))
  }

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Surf Agent//Tide Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Mid Tide Windows",
    "X-WR-TIMEZONE:UTC",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n")
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const location = url.searchParams.get("location") || "Peniche"
  const days = Math.min(parseInt(url.searchParams.get("days") || "7"), 30)
  const window = parseFloat(url.searchParams.get("window") || "1")

  const locations: Record<string, { lat: number; lng: number }> = {
    peniche:    { lat: 39.36, lng: -9.38 },
    ericeira:   { lat: 39.01, lng: -9.42 },
    nazare:     { lat: 39.60, lng: -9.07 },
    sagres:     { lat: 37.01, lng: -8.94 },
    mundaka:    { lat: 43.41, lng: -2.70 },
    zarautz:    { lat: 43.29, lng: -2.17 },
    somo:       { lat: 43.46, lng: -3.61 },
    elpalmar:   { lat: 36.17, lng: -6.05 },
    hossegor:   { lat: 43.67, lng: -1.43 },
    biarritz:   { lat: 43.48, lng: -1.56 },
    lacanau:    { lat: 45.00, lng: -1.20 },
    guethary:   { lat: 43.44, lng: -1.61 },
  }

  const coords = locations[location.toLowerCase()] ?? locations.peniche

  try {
    const midTides = await getMidTides(coords.lat, coords.lng, days)
    const ics = generateICS(midTides, window, coords.lat, coords.lng, location)

    return new NextResponse(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="tides-${location.toLowerCase()}.ics"`,
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Tide error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
