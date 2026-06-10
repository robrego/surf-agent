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

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 2.5rem)" }}>

        <header style={{ marginBottom: "clamp(2.5rem, 6vw, 5rem)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--muted)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}>
              {today}
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--muted)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}>
              Peniche Surf Agent
            </h1>
          </div>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--go)",
            marginTop: "0.4rem",
            boxShadow: "0 0 12px var(--go)",
          }} />
        </header>

        {error ? (
          <p style={{ color: "#ef4444", fontSize: "1rem", fontFamily: "var(--font-mono)" }}>{error}</p>
        ) : brief ? (
          <>
            <section style={{ marginBottom: "clamp(2rem, 5vw, 4rem)" }}>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem, 10vw, 7rem)",
                fontWeight: 800,
                lineHeight: 0.88,
                letterSpacing: "-0.03em",
                color: "var(--text)",
                marginBottom: "1.25rem",
              }}>
                {brief.spot}
              </h2>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: "var(--accent)",
                  color: "#fff",
                  padding: "0.3rem 0.75rem",
                  fontWeight: 500,
                }}>
                  {brief.confidence}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.875rem",
                  color: "var(--go)",
                  letterSpacing: "0.04em",
                }}>
                  {brief.time_window}
                </span>
              </div>
            </section>

            <section style={{
              marginBottom: "clamp(2rem, 5vw, 3.5rem)",
              borderTop: "1px solid var(--border)",
              paddingTop: "1.75rem",
            }}>
              <p style={{
                fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)",
                lineHeight: 1.7,
                color: "var(--text)",
                opacity: 0.75,
                maxWidth: "560px",
              }}>
                {brief.brief}
              </p>
            </section>

            <section style={{
              marginBottom: "clamp(1.5rem, 4vw, 3rem)",
              borderTop: "1px solid var(--border)",
              paddingTop: "1.75rem",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(1rem, 3vw, 2rem)" }}>
                {[
                  { label: "Swell", value: brief.conditions_summary?.swell ?? "--" },
                  { label: "Wind", value: brief.conditions_summary?.wind ?? "--" },
                  { label: "Window", value: brief.conditions_summary?.best_window ?? "--" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(0.85rem, 2vw, 1.05rem)",
                      fontWeight: 400,
                      color: "var(--text)",
                      marginBottom: "0.5rem",
                      lineHeight: 1.4,
                    }}>
                      {value}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      color: "var(--muted)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.875rem",
              color: "var(--muted)",
              marginBottom: "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "0.04em",
            }}>
              Runner-up — {brief.runner_up}
            </p>

            <FeedbackForm
              recommendedSpot={brief.spot}
              conditionsSummary={brief.conditions_summary}
            />
          </>
        ) : null}

        <footer style={{
          paddingTop: "2.5rem",
          marginTop: "2.5rem",
          borderTop: "1px solid var(--border)",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--muted)",
            letterSpacing: "0.06em",
          }}>
            Open-Meteo · Llama 3.3 via Groq · learns from feedback
          </p>
        </footer>
      </div>
    </main>
  )
}
