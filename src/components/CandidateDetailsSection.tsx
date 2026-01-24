import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { candidateDetails } from "../data";

const theme = {
  bg: "#f8fafc",
  card: "#ffffff",
  text: "#0f172a",
  textMuted: "#64748b",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  green: "#10b981",
  orange: "#f97316",
  border: "#e2e8f0",
};

export const CandidateDetailsSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 30], [-40, 0], { extrapolateRight: "clamp" });

  const profileScale = spring({ frame: frame - 20, fps, config: { damping: 15, stiffness: 100 } });

  const highlightIndex = Math.floor(
    interpolate(frame, [60, 550], [0, candidateDetails.fields.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );

  const icons = ["📋", "👤", "👨", "👩", "⚧", "🎂", "🏷️", "♿", "📍", "🌍", "🎓"];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${theme.bg} 0%, #e0e7ff 50%, #f0fdf4 100%)`,
        padding: "50px 60px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Decorative shapes */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `${theme.blue}10`, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: -100, left: -100, width: 350, height: 350, borderRadius: "50%", background: `${theme.purple}10`, filter: "blur(60px)" }} />

      {/* Header */}
      <div style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)`, marginBottom: 30, textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: `linear-gradient(135deg, ${theme.blue}, ${theme.purple})`, borderRadius: 12, padding: "10px 20px", boxShadow: `0 4px 20px ${theme.blue}30` }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>01</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: theme.text, margin: 0 }}>Candidate Details</h1>
        </div>
        <p style={{ fontSize: 16, color: theme.textMuted, marginTop: 10 }}>Personal information of the applicant</p>
      </div>

      {/* Content */}
      <div style={{ display: "flex", gap: 30, flex: 1 }}>
        {/* Profile Card */}
        <div style={{ width: 300, flexShrink: 0, transform: `scale(${Math.max(0, profileScale)})`, opacity: profileScale }}>
          <div style={{ background: theme.card, borderRadius: 24, padding: 30, boxShadow: "0 10px 40px rgba(0,0,0,0.06)", textAlign: "center" }}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: `linear-gradient(135deg, ${theme.blue}, ${theme.purple})`, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>
              👨‍🎓
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.text, margin: "0 0 8px 0", lineHeight: 1.4 }}>{candidateDetails.fields[1].value}</h2>
            <p style={{ fontSize: 13, color: theme.blue, margin: "0 0 20px 0", fontFamily: "monospace" }}>{candidateDetails.fields[0].value}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: theme.bg, borderRadius: 12, padding: 12 }}>
                <p style={{ fontSize: 10, color: theme.textMuted, margin: "0 0 4px 0" }}>Category</p>
                <p style={{ fontSize: 14, color: theme.green, margin: 0, fontWeight: 700 }}>GEN-EWS</p>
              </div>
              <div style={{ background: theme.bg, borderRadius: 12, padding: 12 }}>
                <p style={{ fontSize: 10, color: theme.textMuted, margin: "0 0 4px 0" }}>State</p>
                <p style={{ fontSize: 14, color: theme.orange, margin: 0, fontWeight: 700 }}>AP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Cards */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignContent: "start" }}>
          {candidateDetails.fields.map((field, index) => {
            const delay = 30 + index * 8;
            const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
            const isHighlighted = index === highlightIndex;

            return (
              <div
                key={index}
                style={{
                  background: isHighlighted ? `linear-gradient(135deg, ${theme.blue}10, ${theme.purple}10)` : theme.card,
                  border: isHighlighted ? `2px solid ${theme.blue}` : `1px solid ${theme.border}`,
                  borderRadius: 16,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  opacity: cardSpring,
                  transform: `translateX(${interpolate(cardSpring, [0, 1], [index % 2 === 0 ? -50 : 50, 0])}px)`,
                  boxShadow: isHighlighted ? `0 8px 30px ${theme.blue}20` : "0 2px 10px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: isHighlighted ? `linear-gradient(135deg, ${theme.blue}, ${theme.purple})` : theme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {icons[index] || "📄"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, color: theme.textMuted, margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>{field.label}</p>
                  <p style={{ fontSize: 15, color: isHighlighted ? theme.blue : theme.text, margin: 0, fontWeight: isHighlighted ? 700 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{field.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
