import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Find nearest station to coordinates
async function findStation(lat: number, lng: number) {
  const { stations } = await import("@neaps/tide-database")

  let nearest = null
  let minDist = Infinity

  const toRad = (value: number) => (value * Math.PI) / 180

  for (const s of stations) {
    const station = s as any
    if (
      !station.latitude && !station.longitude &&
      !station.position && !station.coordinates && !station.lat
    ) continue

    const slat = station.latitude ?? station.position?.lat ?? station.coordinates?.lat ?? station.lat
    const slng = station.longitude ?? station.position?.lng ?? station.coordinates?.lng ?? station.lon ?? station.lng
    if (slat == null || slng == null) continue

    const dLat = toRad(slat - lat)
    const dLng = toRad(slng - lng)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat)) * Math.cos(toRad(slat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const distance = 2 * 6371 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    if (distance < minDist) {
      minDist = distance
      nearest = station
    }
  }

  return nearest
}

// Calculate high tides for N days
async function getHighTides(lat: number, lng: number, days: number) {
  const TidePredictor = (await import("@neaps/tide-predictor")).default

  const station = await findStation(lat, lng)
  if (!station) throw new Error("No tide station found near this location")

  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(end.getDate() + days)

  const s = station as any
  const constituents =
    s.harmonic_constituents ?? s.constituents ?? s.harmonics ?? s.data
  if (!constituents) throw new Error("No harmonic data for nearest station")
  const extremes = TidePredictor(constituents).getExtremesPrediction({
    start,
    end,
  })

  // Filter to high tides only
  return extremes
    .filter(
      (e: any) =>
        e.type === "H" ||
        e.type === "high" ||
        e.isHighTide ||
        e.high === true ||
        e.label === "High"
    )
    .map((e: any) => ({
      time: new Date(e.time),
      height: e.height ?? e.level,
    }))
}

// Generate .ics calendar
function generateICS(highTides: { time: Date; height: number }[], windowHours: number, location: string) {
  const pad = (n: number) => String(n).padStart(2, "0")

  function formatDate(d: Date) {
    return (
      d.getUTCFullYear().toString() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      "T" +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      "00Z"
    )
  }

  const events = highTides.map((tide) => {
    const start = new Date(tide.time.getTime() - windowHours * 60 * 60 * 1000)
    const end = new Date(tide.time.getTime() + windowHours * 60 * 60 * 1000)
    const peakTime = tide.time.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Lisbon",
    })

    return [
      "BEGIN:VEVENT",
      `DTSTART:${formatDate(start)}`,
      `DTEND:${formatDate(end)}`,
      `SUMMARY:Busy`,
      `DESCRIPTION:Busy period around peak high tide at ${peakTime} (${tide.height?.toFixed(1) || "?"}m)`,
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE",
      `UID:tide-${formatDate(tide.time)}@surf-agent`,
      "END:VEVENT",
    ].join("\r\n")
  })

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Surf Agent//Tide Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:High Tide Windows",
    "X-WR-TIMEZONE:Europe/Lisbon",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n")
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const location = url.searchParams.get("location") || "Peniche"
  const days = Math.min(parseInt(url.searchParams.get("days") || "7"), 30)
  const window = parseFloat(url.searchParams.get("window") || "2")

  // Peniche coordinates (add more locations later)
  const locations: Record<string, { lat: number; lng: number }> = {
    peniche: { lat: 39.36, lng: -9.38 },
    almagreira: { lat: 39.33, lng: -9.37 },
  }

  const coords = locations[location.toLowerCase()] || locations.peniche

  try {
    const highTides = await getHighTides(coords.lat, coords.lng, days)
    const ics = generateICS(highTides, window, location)

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
