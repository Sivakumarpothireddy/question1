import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { declaration } from "../data";

const theme = {
  bg: "#f8fafc",
  card: "#ffffff",
  text: "#0f172a",
  textMuted: "#64748b",
  green: "#10b981",
  blue: "#3b82f6",
  border: "#e2e8f0",
};

export const DeclarationSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 30], [-40, 0], { extrapolateRight: "clamp" });

  const cardScale = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 100 } });
  const checkScale = spring({ frame: frame - 120, fps, config: { damping: 10, stiffness: 200 } });
  const badgesOpacity = interpolate(frame, [180, 210], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${theme.bg} 0%, #dcfce7 50%, #d1fae5 100%)`, padding: "50px 60px", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Decorative */}
      <div style={{ position: "absolute", top: "20%", right: "10%", width: 350, height: 350, borderRadius: "50%", background: `${theme.green}12`, filter: "blur(60px)" }} />

      {/* Header */}
      <div style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)`, marginBottom: 40, textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: `linear-gradient(135deg, ${theme.green}, ${theme.blue})`, borderRadius: 12, padding: "10px 20px", boxShadow: `0 4px 20px ${theme.green}30` }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>06</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: theme.text, margin: 0 }}>Declaration</h1>
        </div>
        <p style={{ fontSize: 16, color: theme.textMuted, marginTop: 10 }}>Acknowledgment and agreement to JoSAA rules</p>
      </div>

      {/* Main card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: 850, width: "100%", transform: `scale(${Math.max(0, cardScale)})`, opacity: cardScale }}>
          <div style={{ background: theme.card, borderRadius: 28, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, ${theme.green}20, ${theme.blue}15)`, padding: "28px 36px", display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${theme.green}, ${theme.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>📋</div>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>{declaration.title}</h2>
                <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>Business Rules Agreement</p>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: 36 }}>
              <div style={{ background: theme.bg, border: `1px solid ${theme.green}30`, borderRadius: 20, padding: 28, marginBottom: 28 }}>
                <h3 style={{ fontSize: 18, color: theme.green, margin: "0 0 18px 0", fontWeight: 700 }}>{declaration.heading}</h3>
                <p style={{ fontSize: 16, color: theme.text, lineHeight: 1.8, margin: 0 }}>{declaration.content}</p>
              </div>

              {/* Checkmark */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, transform: `scale(${Math.max(0, checkScale)})`, opacity: checkScale }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${theme.green}, ${theme.blue})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 10px 30px ${theme.green}40` }}>
                  <span style={{ fontSize: 32, color: "#fff" }}>✓</span>
                </div>
                <div>
                  <p style={{ fontSize: 22, color: theme.green, margin: 0, fontWeight: 700 }}>Declaration Acknowledged</p>
                  <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>Submitted and verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 30, opacity: badgesOpacity }}>
        {[
          { icon: "⚖️", label: "LEGAL STATUS", value: "Legally Binding" },
          { icon: "📜", label: "COMMITMENT", value: "To JoSAA 2025 Rules" },
        ].map((badge, i) => (
          <div key={i} style={{ background: theme.card, borderRadius: 16, padding: "18px 28px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 6px 24px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 24 }}>{badge.icon}</span>
            <div>
              <p style={{ fontSize: 11, color: theme.textMuted, margin: 0 }}>{badge.label}</p>
              <p style={{ fontSize: 15, color: theme.text, margin: "2px 0 0 0", fontWeight: 600 }}>{badge.value}</p>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
