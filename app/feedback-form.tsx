"use client"

import { useState } from "react"

const SPOTS = [
  "Supertubos", "Consolacao", "Molhe Leste", "Lagide", "Gamboa",
  "Cerro", "Meio da Baia", "Cantinho da Baia", "Baleal", "Belgas",
  "Praia del Rey", "Cortico", "Areia Branca", "Didn't surf"
]

export default function FeedbackForm({
  recommendedSpot,
  conditionsSummary,
}: {
  recommendedSpot: string
  conditionsSummary: any
}) {
  const [rating, setRating] = useState<string | null>(null)
  const [actualSpot, setActualSpot] = useState("")
  const [notes, setNotes] = useState("")
  const [sent, setSent] = useState(false)

  async function submit() {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recommended_spot: recommendedSpot,
        actual_spot: actualSpot || null,
        rating,
        notes,
        conditions_summary: conditionsSummary,
      }),
    })
    setSent(true)
  }

  if (sent) {
    return (
      <section className="border border-stone-200 rounded-lg p-4 bg-white">
        <p className="text-sm text-stone-500">Logged. The agent will learn from this.</p>
      </section>
    )
  }

  return (
    <section className="border border-stone-200 rounded-lg p-4 bg-white">
      <p className="text-sm font-medium mb-3">How was the call?</p>

      <div className="flex gap-2 mb-4">
        {["good", "ok", "bad"].map((r) => (
          <button
            key={r}
            onClick={() => setRating(r)}
            className={`px-4 py-2 rounded text-sm border ${
              rating === r
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
            }`}
          >
            {r === "good" ? "Spot on" : r === "ok" ? "Decent" : "Wrong call"}
          </button>
        ))}
      </div>

      <select
        value={actualSpot}
        onChange={(e) => setActualSpot(e.target.value)}
        className="w-full p-2 border border-stone-200 rounded text-sm mb-3 bg-white"
      >
        <option value="">Where did you actually surf?</option>
        {SPOTS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Any notes? (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-2 border border-stone-200 rounded text-sm mb-3"
      />

      <button
        onClick={submit}
        disabled={!rating}
        className="px-4 py-2 bg-stone-900 text-white rounded text-sm disabled:opacity-30"
      >
        Log session
      </button>
    </section>
  )
}