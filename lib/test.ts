import { runAgent } from "./agent"

async function main() {
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY=gsk_... npx tsx lib/test.ts")
    process.exit(1)
  }

  console.log("Fetching conditions from Open-Meteo...")

  const result = await runAgent()

  console.log("\n=================================")
  console.log("  PENICHE SURF BRIEF")
  console.log("=================================\n")
  console.log(`  Spot:       ${result.spot}`)
  console.log(`  Window:     ${result.time_window}`)
  console.log(`  Confidence: ${result.confidence}`)
  console.log(`  Runner-up:  ${result.runner_up}`)
  console.log(`\n  ${result.brief}\n`)
  console.log(`  Swell:  ${result.conditions_summary?.swell}`)
  console.log(`  Wind:   ${result.conditions_summary?.wind}`)
  console.log(`  Window: ${result.conditions_summary?.best_window}`)
  console.log("\n=================================")
}

main()