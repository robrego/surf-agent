import { getSessions, buildFeedbackContext } from "./feedback"
import { SPOTS } from "./spots"

const PENICHE_LAT = 39.36
const PENICHE_LNG = -9.38

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

function parseConditions(marine: any, weather: any) {
  const hours = marine.hourly.time.map((t: string, i: number) => ({
    time: t,
    swellHeight: marine.hourly.swell_wave_height?.[i] ?? null,
    swellDirection: marine.hourly.swell_wave_direction?.[i] ?? null,
    swellPeriod: marine.hourly.swell_wave_period?.[i] ?? null,
    waveHeight: marine.hourly.wave_height?.[i] ?? null,
    windSpeed: weather.hourly.wind_speed_10m?.[i] ?? null,
    windDirection: weather.hourly.wind_direction_10m?.[i] ?? null,
    windGusts: weather.hourly.wind_gusts_10m?.[i] ?? null,
  }))

  return { fetchedAt: new Date().toISOString(), hours }
}

function getDaylightHours(conditions: any) {
  const today = new Date().toISOString().slice(0, 10)
  let hours = conditions.hours.filter((h: any) => {
    const hour = parseInt(h.time.split("T")[1].split(":")[0])
    return h.time.startsWith(today) && hour >= 6 && hour <= 19
  })

  if (hours.length === 0) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().slice(0, 10)
    hours = conditions.hours.filter((h: any) => {
      const hour = parseInt(h.time.split("T")[1].split(":")[0])
      return h.time.startsWith(tomorrowStr) && hour >= 6 && hour <= 19
    })
  }

  if (hours.length === 0) throw new Error("No forecast data available")
  return hours
}

function buildPrompt(hours: any[], feedback: string) {
  const spots = SPOTS.map((s) => ({
    name: s.name,
    facing: s.facing,
    idealSwellDir: [s.swellDirMin, s.swellDirMax],
    idealSwellSize: [s.swellMin, s.swellMax],
    offshoreWindDir: [s.offshoreWindMin, s.offshoreWindMax],
    minPeriod: s.periodMin,
    tide: s.tide,
    notes: s.notes,
  }))

  return `You are a surf forecasting agent for Peniche, Portugal. The surfer rides goofy stance and prefers rights.

## Today's hourly conditions (Open-Meteo)
${JSON.stringify(hours, null, 2)}

## Spot profiles (12 spots around Peniche)
${JSON.stringify(spots, null, 2)}

## Your task
CRITICAL RULE: Wind is the #1 factor. If wind speed exceeds 20km/h, any spot where the wind is onshore (wind direction within 40 degrees of the spot's facing direction) is ELIMINATED. Do not recommend blown-out spots.

1. First, check wind speed and direction across the day. Eliminate all spots where wind is onshore and strong (>20km/h).
2. From remaining spots, match swell direction and size to each spot's ideal range.
3. Check period meets minimum.
4. Surfer rides goofy, no preference on lefts or rights.
5. Report the actual wind speed range across the full day. If it's strong, say so clearly.
6. Pick ONE best spot and time window from the non-eliminated spots. Give a runner-up.
7. If ALL spots are blown out, say so honestly.

${feedback}

Respond ONLY with valid JSON, no markdown, no backticks:
{
  "spot": "spot name",
  "time_window": "e.g. 07:00-10:00",
  "brief": "3-4 casual sentences like texting a surf buddy. Be honest about conditions.",
  "confidence": "high/medium/low",
  "runner_up": "spot name",
  "conditions_summary": {
    "swell": "e.g. 1.2m NW at 11s",
    "wind": "e.g. strong N 30km/h gusting 55km/h",
    "best_window": "e.g. early morning before wind picks up"
  }
}`
}

export async function runAgent() {
  const [marine, weather] = await Promise.all([
    fetchMarineData(),
    fetchWeatherData(),
  ])

  const conditions = parseConditions(marine, weather)
  const hours = getDaylightHours(conditions)
  const sessions = await getSessions()
  const feedbackContext = buildFeedbackContext(sessions)
  const prompt = buildPrompt(hours, feedbackContext)

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error("GROQ_API_KEY not set")

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 800,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const text = (data.choices?.[0]?.message?.content ?? "")
    .replace(/```json|```/g, "")
    .trim()

  return { ...JSON.parse(text), raw_conditions: conditions }
}