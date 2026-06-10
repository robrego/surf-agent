import { SPOTS, type SpotProfile } from "./spots"
import { getSessions, buildFeedbackContext } from "./feedback"

const PENICHE_LAT = 39.36
const PENICHE_LNG = -9.38

// ---- DATA FETCHING ----

export async function fetchMarineData() {
  const url = new URL("https://marine-api.open-meteo.com/v1/marine")
  url.searchParams.set("latitude", String(PENICHE_LAT))
  url.searchParams.set("longitude", String(PENICHE_LNG))
  url.searchParams.set(
    "hourly",
    "swell_wave_height,swell_wave_direction,swell_wave_period,wave_height,wave_direction,wave_period"
  )
  url.searchParams.set("timezone", "Europe/Lisbon")
  url.searchParams.set("forecast_days", "2")
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Marine API error: ${res.status}`)
  return res.json()
}

export async function fetchWeatherData() {
  const url = new URL("https://api.open-meteo.com/v1/forecast")
  url.searchParams.set("latitude", String(PENICHE_LAT))
  url.searchParams.set("longitude", String(PENICHE_LNG))
  url.searchParams.set("hourly", "wind_speed_10m,wind_direction_10m,wind_gusts_10m")
  url.searchParams.set("timezone", "Europe/Lisbon")
  url.searchParams.set("forecast_days", "2")
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  return res.json()
}

// ---- GEOMETRY ----

function angleDiff(a: number, b: number): number {
  let d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

function windRelation(
  windDir: number,
  spotFacing: number
): "offshore" | "cross-offshore" | "cross-onshore" | "onshore" {
  // Wind blowing FROM windDir. Spot faces spotFacing (where waves come from).
  // Offshore = wind blowing from land to sea = wind dir opposite to spot facing
  const offshoreDir = (spotFacing + 180) % 360
  const diff = angleDiff(windDir, offshoreDir)

  if (diff <= 30) return "offshore"
  if (diff <= 75) return "cross-offshore"
  if (diff <= 120) return "cross-onshore"
  return "onshore"
}

function swellMatch(
  swellDir: number,
  min: number,
  max: number
): "ideal" | "ok" | "poor" {
  // Handle wrap-around (e.g. min=350, max=20)
  if (min <= max) {
    if (swellDir >= min && swellDir <= max) return "ideal"
  } else {
    if (swellDir >= min || swellDir <= max) return "ideal"
  }
  // Check if close (within 20°)
  const midpoint = min <= max ? (min + max) / 2 : ((min + max + 360) / 2) % 360
  const diff = angleDiff(swellDir, midpoint)
  if (diff < 40) return "ok"
  return "poor"
}

// ---- SCORING ----

interface HourConditions {
  time: string
  swellHeight: number
  swellDir: number
  swellPeriod: number
  windSpeed: number
  windDir: number
  windGusts: number
}

interface SpotScore {
  name: string
  score: number
  windStatus: "offshore" | "cross-offshore" | "cross-onshore" | "onshore"
  swellStatus: "ideal" | "ok" | "poor"
  sizeStatus: "good" | "small" | "big"
  periodOk: boolean
  eliminated: boolean
  eliminationReason: string | null
  bestHour: number
  notes: string
}

function scoreSpot(spot: SpotProfile, hours: HourConditions[]): SpotScore {
  let bestScore = -999
  let bestHour = 6
  let bestWind: SpotScore["windStatus"] = "onshore"
  let bestSwell: SpotScore["swellStatus"] = "poor"
  let bestSize: SpotScore["sizeStatus"] = "small"
  let bestPeriod = false

  for (const h of hours) {
    let score = 0
    const hour = parseInt(h.time.split("T")[1].split(":")[0])

    // Wind (most important factor)
    const wind = windRelation(h.windDir, spot.facing)
    if (wind === "offshore") score += 40
    else if (wind === "cross-offshore") score += 25
    else if (wind === "cross-onshore") score += 5
    else score -= 20

    // Strong wind penalty (applies to both onshore AND cross-onshore)
    if (h.windSpeed > 20) {
      if (wind === "onshore") score -= 30
      else if (wind === "cross-onshore") score -= 20
    }
    if (h.windSpeed > 30) {
      if (wind === "onshore") score -= 15 // extra penalty
      else if (wind === "cross-onshore") score -= 10
    }

    // Light wind bonus
    if (h.windSpeed < 15) score += 10

    // Swell direction
    const swell = swellMatch(h.swellDir, spot.swellDirMin, spot.swellDirMax)
    if (swell === "ideal") score += 30
    else if (swell === "ok") score += 15
    else score -= 10

    // Swell size (but only counts if swell direction is right)
    let size: "good" | "small" | "big" = "good"
    if (swell === "poor") {
      // Wrong swell direction = waves don't arrive, regardless of open ocean height
      score -= 15
      size = "small"
    } else if (h.swellHeight >= spot.swellMin && h.swellHeight <= spot.swellMax) {
      score += 20
    } else if (h.swellHeight < spot.swellMin) {
      score += 5
      size = "small"
    } else {
      score -= 5
      size = "big"
    }

    // Period
    const periodOk = h.swellPeriod >= spot.periodMin
    if (periodOk) score += 10
    else score -= 5

    if (score > bestScore) {
      bestScore = score
      bestHour = hour
      bestWind = wind
      bestSwell = swell
      bestSize = size
      bestPeriod = periodOk
    }
  }

  // Determine elimination
  let eliminated = false
  let eliminationReason: string | null = null

  // Eliminate if onshore OR cross-onshore with strong wind for most of the day
  const badWindHours = hours.filter((h) => {
    const w = windRelation(h.windDir, spot.facing)
    return (w === "onshore" || w === "cross-onshore") && h.windSpeed > 20
  }).length

  if (badWindHours > hours.length * 0.5) {
    eliminated = true
    const avgSpeed = Math.round(hours.reduce((s, h) => s + h.windSpeed, 0) / hours.length)
    const w = windRelation(hours[0].windDir, spot.facing)
    eliminationReason = `${w} wind ~${avgSpeed}km/h most of the day`
  }

  // Also eliminate if swell direction is poor (waves don't arrive)
  const poorSwellHours = hours.filter(
    (h) => swellMatch(h.swellDir, spot.swellDirMin, spot.swellDirMax) === "poor"
  ).length
  if (poorSwellHours > hours.length * 0.7) {
    eliminated = true
    eliminationReason = (eliminationReason ? eliminationReason + " + " : "") + "swell direction doesn't reach this spot"
  }

  return {
    name: spot.name,
    score: bestScore,
    windStatus: bestWind,
    swellStatus: bestSwell,
    sizeStatus: bestSize,
    periodOk: bestPeriod,
    eliminated,
    eliminationReason,
    bestHour,
    notes: spot.notes,
  }
}

// ---- PARSE & FILTER ----

function parseHours(marine: any, weather: any): HourConditions[] {
  const hours: HourConditions[] = []
  for (let i = 0; i < marine.hourly.time.length; i++) {
    hours.push({
      time: marine.hourly.time[i],
      swellHeight: marine.hourly.swell_wave_height?.[i] ?? 0,
      swellDir: marine.hourly.swell_wave_direction?.[i] ?? 0,
      swellPeriod: marine.hourly.swell_wave_period?.[i] ?? 0,
      windSpeed: weather.hourly.wind_speed_10m?.[i] ?? 0,
      windDir: weather.hourly.wind_direction_10m?.[i] ?? 0,
      windGusts: weather.hourly.wind_gusts_10m?.[i] ?? 0,
    })
  }
  return hours
}

function getDaylightHours(hours: HourConditions[]): HourConditions[] {
  const today = new Date().toISOString().slice(0, 10)
  let daylight = hours.filter((h) => {
    const hour = parseInt(h.time.split("T")[1].split(":")[0])
    return h.time.startsWith(today) && hour >= 6 && hour <= 19
  })

  if (daylight.length === 0) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tStr = tomorrow.toISOString().slice(0, 10)
    daylight = hours.filter((h) => {
      const hour = parseInt(h.time.split("T")[1].split(":")[0])
      return h.time.startsWith(tStr) && hour >= 6 && hour <= 19
    })
  }

  if (daylight.length === 0) throw new Error("No forecast data available")
  return daylight
}

// ---- PROMPT BUILDING ----

function buildPrompt(
  viable: SpotScore[],
  eliminated: SpotScore[],
  conditionsSummary: string,
  feedback: string
): string {
  const viableText = viable
    .map(
      (s, i) =>
        `${i + 1}. ${s.name} (score: ${s.score}) — wind: ${s.windStatus}, swell: ${s.swellStatus}, size: ${s.sizeStatus}, period: ${s.periodOk ? "ok" : "short"}, best hour: ${s.bestHour}:00. Notes: ${s.notes}`
    )
    .join("\n")

  const elimText = eliminated
    .map((s) => `- ${s.name}: ELIMINATED — ${s.eliminationReason}`)
    .join("\n")

  return `You are a surf agent. Your job is to write a morning brief based on pre-scored data. DO NOT second-guess the scoring — the math is already done.

## Conditions today
${conditionsSummary}

## Viable spots (ranked by score, highest first)
${viableText || "NONE — all spots are blown out or have poor conditions."}

## Eliminated spots
${elimText || "None eliminated."}
${feedback}
## Score calibration (max possible score is ~110)
- 80+: great day, go surf
- 50–79: decent, worth it
- 20–49: marginal — mention it's not ideal
- 0–19: poor — be honest, probably not worth it
- negative: bad — say so

## Your task
- Write a 2 sentence morning brief like texting a surf buddy
- Recommend the #1 viable spot and suggest a time window around its best hour
- Mention the runner-up
- Calibrate your tone to the absolute score, not just the ranking. If the top score is marginal or poor, say so clearly — don't spin it positively just because it's the best of a bad bunch.
- If no spots are viable, say it's a rest day. But check if any eliminated spots scored above 0 — if so, mention the highest-scoring one as a "long shot if you're desperate" option.
- Surfer rides goofy, no preference on lefts or rights

Respond ONLY with valid JSON, no markdown, no backticks:
{
  "spot": "top spot name or 'Rest day'",
  "time_window": "e.g. 07:00-10:00",
  "brief": "2 casual sentences",
  "confidence": "high/medium/low",
  "runner_up": "second spot name or 'none'",
  "conditions_summary": {
    "swell": "e.g. 1.2m NW at 11s",
    "wind": "e.g. strong N 30km/h gusting 55km/h",
    "best_window": "e.g. early morning before wind builds"
  }
}`
}

// ---- MAIN AGENT ----

export async function runAgent() {
  // 1. Fetch data
  const [marine, weather] = await Promise.all([
    fetchMarineData(),
    fetchWeatherData(),
  ])

  // 2. Parse
  const allHours = parseHours(marine, weather)
  const daylight = getDaylightHours(allHours)

  // 3. Score every spot (code does the geometry)
  const scores = SPOTS.map((spot) => scoreSpot(spot, daylight))
  scores.sort((a, b) => b.score - a.score)

  const viable = scores.filter((s) => !s.eliminated)
  const eliminated = scores.filter((s) => s.eliminated)

  // 4. Build conditions summary for context
  const avgWind = Math.round(
    daylight.reduce((s, h) => s + h.windSpeed, 0) / daylight.length
  )
  const maxGust = Math.round(Math.max(...daylight.map((h) => h.windGusts)))
  const avgSwell = (
    daylight.reduce((s, h) => s + h.swellHeight, 0) / daylight.length
  ).toFixed(1)
  const avgPeriod = Math.round(
    daylight.reduce((s, h) => s + h.swellPeriod, 0) / daylight.length
  )
  const sinSwellAvg = daylight.reduce((s, h) => s + Math.sin((h.swellDir * Math.PI) / 180), 0) / daylight.length
  const cosSwellAvg = daylight.reduce((s, h) => s + Math.cos((h.swellDir * Math.PI) / 180), 0) / daylight.length
  const avgSwellDir = ((Math.atan2(sinSwellAvg, cosSwellAvg) * 180) / Math.PI + 360) % 360

  // Circular mean for compass directions (handles 0°/360° boundary)
  const sinAvg = daylight.reduce((s, h) => s + Math.sin((h.windDir * Math.PI) / 180), 0) / daylight.length
  const cosAvg = daylight.reduce((s, h) => s + Math.cos((h.windDir * Math.PI) / 180), 0) / daylight.length
  const avgWindDir = ((Math.atan2(sinAvg, cosAvg) * 180) / Math.PI + 360) % 360

  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
  const compass = (d: number) => dirs[Math.round(d / 22.5) % 16]

  const condSummary = `Swell: ${avgSwell}m from ${compass(avgSwellDir)} (${avgSwellDir}°) at ${avgPeriod}s. Wind: ${compass(avgWindDir)} avg ${avgWind}km/h gusting ${maxGust}km/h.`

  // 5. Get feedback history
  const sessions = await getSessions()
  const feedback = buildFeedbackContext(sessions)

  // 6. LLM writes the brief (doesn't decide the spot)
  const prompt = buildPrompt(viable, eliminated, condSummary, feedback)

  const apiKey = process.env.CEREBRAS_API_KEY
  if (!apiKey) throw new Error("CEREBRAS_API_KEY not set")

  const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-oss-120b",
      max_tokens: 800,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Cerebras API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const text = (data.choices?.[0]?.message?.content ?? "")
    .replace(/```json|```/g, "")
    .trim()

  const result = JSON.parse(text)

  const topSpot = SPOTS.find((s) => s.name === result.spot)

  return {
    ...result,
    windDir: Math.round(avgWindDir),
    swellDir: Math.round(avgSwellDir),
    spotFacing: topSpot?.facing ?? null,
    _debug: {
      viable: viable.map((s) => ({ name: s.name, score: s.score, wind: s.windStatus })),
      eliminated: eliminated.map((s) => ({ name: s.name, reason: s.eliminationReason })),
    },
  }
}