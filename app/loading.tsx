export default function Loading() {
  const shimmer: React.CSSProperties = {
    background: "linear-gradient(90deg, var(--surface) 25%, #e8e8e8 50%, var(--surface) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
    borderRadius: "8px",
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 5rem)" }}>
        <header style={{ marginBottom: "clamp(2.5rem, 6vw, 5rem)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Surf Check
          </p>
          <div style={{ ...shimmer, width: "200px", height: "48px" }} />
        </header>

        <section style={{ marginBottom: "clamp(2rem, 5vw, 4rem)" }}>
          <div style={{ ...shimmer, width: "60%", height: "clamp(2.5rem, 7vw, 4.5rem)", marginBottom: "1.25rem" }} />
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div style={{ ...shimmer, width: "80px", height: "28px" }} />
            <div style={{ ...shimmer, width: "120px", height: "20px" }} />
          </div>
        </section>

        <section style={{ marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ ...shimmer, width: `${85 - i * 10}%`, height: "20px", marginBottom: "0.75rem" }} />
          ))}
        </section>

        <section style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start", marginBottom: "clamp(1.5rem, 4vw, 3rem)" }}>
          <div style={{ ...shimmer, width: "300px", height: "260px", borderRadius: "16px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, minWidth: "220px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...shimmer, height: "64px", borderRadius: "16px" }} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
