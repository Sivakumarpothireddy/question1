import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { jeeAdvancedDetails } from "../data";

const theme = {
  bg: "#f8fafc",
  card: "#ffffff",
  text: "#0f172a",
  textMuted: "#64748b",
  purple: "#8b5cf6",
  pink: "#ec4899",
  green: "#10b981",
  border: "#e2e8f0",
};

export const JEEAdvancedSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 30], [-40, 0], { extrapolateRight: "clamp" });

  const highlightIndex = Math.floor(
    interpolate(frame, [60, 500], [0, jeeAdvancedDetails.fields.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );

  const icons = ["🎫", "📝", "🎖️", "🎨", "👁️", "👀"];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${theme.bg} 0%, #fae8ff 50%, #ede9fe 100%)`,
        padding: "50px 60px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Decorative */}
      <div style={{ position: "absolute", top: "20%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: `${theme.purple}15`, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: "20%", left: "10%", width: 250, height: 250, borderRadius: "50%", background: `${theme.pink}15`, filter: "blur(50px)" }} />

      {/* Header */}
      <div style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)`, marginBottom: 40, textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: `linear-gradient(135deg, ${theme.purple}, ${theme.pink})`, borderRadius: 12, padding: "10px 20px", boxShadow: `0 4px 20px ${theme.purple}30` }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>02</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: theme.text, margin: 0 }}>JEE Advanced Details</h1>
        </div>
        <p style={{ fontSize: 16, color: theme.textMuted, marginTop: 10 }}>Examination eligibility and medical status</p>
      </div>

      {/* Content */}
      <div style={{ display: "flex", gap: 30, flex: 1 }}>
        {/* Main cards */}
        <div style={{ flex: 2 }}>
          <div style={{ background: theme.card, borderRadius: 24, padding: 30, boxShadow: "0 10px 40px rgba(0,0,0,0.06)" }}>
            {jeeAdvancedDetails.fields.slice(0, 2).map((field, index) => {
              const delay = 40 + index * 15;
              const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
              const isHighlighted = index === highlightIndex;

              return (
                <div
                  key={index}
                  style={{
                    background: isHighlighted ? `linear-gradient(135deg, ${theme.purple}10, ${theme.pink}10)` : theme.bg,
                    border: isHighlighted ? `2px solid ${theme.purple}` : `1px solid ${theme.border}`,
                    borderRadius: 16,
                    padding: 24,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    opacity: cardSpring,
                    transform: `translateX(${interpolate(cardSpring, [0, 1], [-30, 0])}px)`,
                    boxShadow: isHighlighted ? `0 8px 30px ${theme.purple}15` : "none",
                  }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: isHighlighted ? `linear-gradient(135deg, ${theme.purple}, ${theme.pink})` : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                    {icons[index]}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, color: theme.textMuted, margin: "0 0 6px 0" }}>{field.label}</p>
                    <p style={{ fontSize: 22, color: isHighlighted ? theme.purple : theme.text, margin: 0, fontWeight: 700, fontFamily: "monospace", letterSpacing: 1 }}>{field.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status badges */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignContent: "start" }}>
          {jeeAdvancedDetails.fields.slice(2).map((field, index) => {
            const actualIndex = index + 2;
            const delay = 60 + index * 20;
            const scale = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
            const isHighlighted = actualIndex === highlightIndex;
            const isYes = field.value === "YES";

            return (
              <div
                key={actualIndex}
                style={{
                  background: theme.card,
                  borderRadius: 20,
                  padding: 24,
                  textAlign: "center",
                  transform: `scale(${Math.max(0, scale)})`,
                  opacity: scale,
                  boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
                  border: isHighlighted ? `2px solid ${theme.purple}` : `1px solid ${theme.border}`,
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: isHighlighted ? `${theme.purple}20` : theme.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 26 }}>
                  {icons[actualIndex]}
                </div>
                <p style={{ fontSize: 11, color: theme.textMuted, margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>{field.label}</p>
                <p style={{ fontSize: 18, color: isHighlighted ? theme.purple : isYes ? theme.green : theme.textMuted, margin: 0, fontWeight: 700 }}>{field.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          marginTop: 30,
          background: theme.card,
          borderRadius: 16,
          padding: "20px 40px",
          display: "flex",
          justifyContent: "center",
          gap: 60,
          boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
          opacity: interpolate(frame, [150, 180], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {[
          { label: "ELIGIBLE FOR", value: "IIT Admissions ✓", color: theme.green },
          { label: "MEDICAL STATUS", value: "All Clear ✓", color: theme.green },
          { label: "ARCHITECTURE", value: "Not Applicable", color: theme.textMuted },
        ].map((item, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <p style={{ fontSize: 11, color: theme.textMuted, margin: "0 0 4px 0" }}>{item.label}</p>
            <p style={{ fontSize: 16, color: item.color, margin: 0, fontWeight: 700 }}>{item.value}</p>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
