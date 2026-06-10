import { runAgent } from "@/lib/agent"
import FeedbackForm from "./feedback-form"
export const dynamic = "force-dynamic"

export default async function Home() {
  let brief: any = null
  let error: string | null = null

  try {
    brief = await runAgent()
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error"
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="max-w-lg mx-auto px-5 py-12">
        <header className="mb-8">
          <h1 className="text-2xl font-medium tracking-tight">
            Peniche surf agent
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </header>

        {error ? (
          <p className="text-red-600 text-sm">{error}</p>
        ) : brief ? (
          <>
            <section className="mb-8">
              <div className="flex items-baseline gap-3 mb-1">
                <h2 className="text-4xl font-medium">{brief.spot}</h2>
                <span className="text-sm px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                  {brief.confidence}
                </span>
              </div>
              <p className="text-sm text-teal-700 font-medium mb-4">
                {brief.time_window}
              </p>
              <p className="text-base text-stone-600 leading-relaxed">
                {brief.brief}
              </p>
            </section>

            <section className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-white rounded-lg p-3 border border-stone-200">
                <p className="text-xs text-stone-400 mb-1">Swell</p>
                <p className="text-sm font-medium">
                  {brief.conditions_summary?.swell ?? "--"}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-stone-200">
                <p className="text-xs text-stone-400 mb-1">Wind</p>
                <p className="text-sm font-medium">
                  {brief.conditions_summary?.wind ?? "--"}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-stone-200">
                <p className="text-xs text-stone-400 mb-1">Window</p>
                <p className="text-sm font-medium">
                  {brief.conditions_summary?.best_window ?? "--"}
                </p>
              </div>
            </section>

            <p className="text-xs text-stone-400 mb-8">
              Runner-up: {brief.runner_up}
            </p>

            <FeedbackForm
              recommendedSpot={brief.spot}
              conditionsSummary={brief.conditions_summary}
            />
          </>
        ) : null}

        <footer className="pt-8 mt-8 border-t border-stone-200">
          <p className="text-xs text-stone-400">
            Open-Meteo data · Llama 3.3 via Groq · learns from your feedback
          </p>
        </footer>
      </div>
    </main>
  )
}