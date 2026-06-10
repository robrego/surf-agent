import React from "react"
import { runAgent } from "@/lib/agent"
import FeedbackForm from "./feedback-form"
export const dynamic = "force-dynamic"

function formatValue(val: string): React.ReactNode[] {
  const parts = val.split(/([\d.]+(?:km\/h|mph|m\/s|ft|m|s))/g)
  return parts.map((part, i) => {
    const m = part.match(/^([\d.]+)(km\/h|mph|m\/s|ft|m|s)$/)
    if (m) {
      return (
        <span key={i} style={{ whiteSpace: "nowrap" }}>
          <span style={{ fontWeight: 600 }}>{m[1]}</span>
          <span style={{ fontSize: "0.78em", opacity: 0.55, marginLeft: "0.05em" }}>{m[2]}</span>
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

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

        <header style={{ marginBottom: "clamp(2.5rem, 6vw, 5rem)" }}>
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
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--muted)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}>
              Peniche Surf Agent
            </h1>
          </div>
        </header>

        {error ? (
          <p style={{ color: "#ef4444", fontSize: "1rem", fontFamily: "var(--font-mono)" }}>{error}</p>
        ) : brief ? (
          <>
            <section style={{ marginBottom: "clamp(2rem, 5vw, 4rem)" }}>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
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
            }}>
              {(brief.brief ?? "").split(/\.\s+/).map((sentence: string, i: number, arr: string[]) => (
                <p key={i} style={{
                  fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                  lineHeight: 1.7,
                  color: "var(--text)",
                  opacity: 0.75,
                  maxWidth: "560px",
                  marginBottom: i < arr.length - 1 ? "0.75rem" : 0,
                }}>
                  {sentence}{i < arr.length - 1 ? "." : ""}
                </p>
              ))}
            </section>

            <section style={{
              marginBottom: "clamp(1.5rem, 4vw, 3rem)",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { label: "Swell", value: brief.conditions_summary?.swell ?? "--" },
                  { label: "Wind", value: brief.conditions_summary?.wind ?? "--" },
                  { label: "Window", value: brief.conditions_summary?.best_window ?? "--" },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "1.25rem",
                    background: "#fff",
                    border: "1px solid var(--border)",
                    padding: "0.875rem 1.25rem",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      minWidth: "4rem",
                      flexShrink: 0,
                    }}>
                      {label}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "1rem",
                      color: "var(--text)",
                      lineHeight: 1.5,
                    }}>
                      {formatValue(value)}
                    </span>
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
            Open-Meteo · learns from feedback
          </p>
        </footer>
      </div>
    </main>
  )
}
