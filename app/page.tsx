import { runAgent } from "@/lib/agent"
import FeedbackForm from "./feedback-form"
import DirectionDiagram from "./direction-diagram"
import TideDownload from "./tide-download"
export const dynamic = "force-dynamic"

function formatValue(val: string) {
  return val.split(/([\d.]+)/g).map((part, i) =>
    /^[\d.]+$/.test(part)
      ? <strong key={i} style={{ fontWeight: 600 }}>{part}</strong>
      : <span key={i} style={{ fontSize: "0.8em", opacity: 0.7 }}>{part}</span>
  )
}

export default async function Home() {
  let brief: any = null
  let error: string | null = null

  try {
    brief = await runAgent()
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error"
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 5rem)" }}>

        <header style={{ marginBottom: "clamp(2.5rem, 6vw, 5rem)" }}>
          <div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--muted)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}>
              Peniche Surf Check
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
                  borderRadius: "4px",
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
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1.05rem, 2.5vw, 1.15rem)",
                  lineHeight: 1.7,
                  color: "var(--text)",
                  opacity: 0.75,
                  maxWidth: "720px",
                  marginBottom: i < arr.length - 1 ? "0.75rem" : 0,
                }}>
                  {sentence}{i < arr.length - 1 ? "." : ""}
                </p>
              ))}
            </section>

            <section style={{
              marginBottom: "clamp(1.5rem, 4vw, 3rem)",
              display: "flex",
              gap: "1.5rem",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}>
              {brief.windDir != null && brief.swellDir != null && (
                <DirectionDiagram
                  windDir={brief.windDir}
                  swellDir={brief.swellDir}
                  spotFacing={brief.spotFacing}
                />
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, minWidth: "220px" }}>
                {[
                  { label: "Swell", value: brief.conditions_summary?.swell ?? "--", dot: "#1d4ed8" },
                  { label: "Wind", value: brief.conditions_summary?.wind ?? "--", dot: "#111" },
                  { label: "Window", value: brief.conditions_summary?.best_window ?? "--", dot: null },
                ].map(({ label, value, dot }) => (
                  <div key={label} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    background: "#fff",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    padding: "1.1rem 1.4rem",
                  }}>
                    <span style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      minWidth: "4rem",
                      flexShrink: 0,
                    }}>
                      {dot && <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot, flexShrink: 0, display: "inline-block" }} />}
                      {label}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1.15rem",
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

            <TideDownload />

            <FeedbackForm
              recommendedSpot={brief.spot}
              conditionsSummary={brief.conditions_summary}
            />
          </>
        ) : null}

        <footer style={{
          paddingTop: "2.5rem",
          marginTop: "2.5rem",
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
