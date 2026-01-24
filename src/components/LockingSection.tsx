import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { lockingDetails } from "../data";

const theme = {
  bg: "#f8fafc",
  card: "#ffffff",
  text: "#0f172a",
  textMuted: "#64748b",
  orange: "#f97316",
  yellow: "#eab308",
  green: "#10b981",
  border: "#e2e8f0",
};

export const LockingSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 30], [-40, 0], { extrapolateRight: "clamp" });

  const lockScale = spring({ frame: frame - 50, fps, config: { damping: 10, stiffness: 100 } });

  const icons = ["📊", "🔒", "🌐", "📅", "🔐"];

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${theme.bg} 0%, #fef3c7 50%, #ffedd5 100%)`, padding: "50px 60px", fontFamily: "'Inter', sans-serif" }}>
      {/* Decorative rings */}
      <div style={{ position: "absolute", top: "50%", left: "28%", transform: "translate(-50%, -50%)" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", width: 180 + i * 60, height: 180 + i * 60, borderRadius: "50%", border: `2px solid ${theme.orange}${20 - i * 5}`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
        ))}
      </div>

      {/* Header */}
      <div style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)`, marginBottom: 30, textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: `linear-gradient(135deg, ${theme.orange}, ${theme.yellow})`, borderRadius: 12, padding: "10px 20px", boxShadow: `0 4px 20px ${theme.orange}30` }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>04</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: theme.text, margin: 0 }}>Locking Status</h1>
        </div>
        <p style={{ fontSize: 16, color: theme.textMuted, marginTop: 10 }}>Choice verification and security details</p>
      </div>

      {/* Content */}
      <div style={{ display: "flex", gap: 40, flex: 1, position: "relative", zIndex: 10 }}>
        {/* Lock animation */}
        <div style={{ width: 340, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: `scale(${Math.max(0, lockScale)})`, opacity: lockScale }}>
            <div style={{ width: 160, height: 160, borderRadius: "50%", background: `linear-gradient(135deg, ${theme.orange}, ${theme.yellow})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 20px 50px ${theme.orange}35` }}>
              <span style={{ fontSize: 70 }}>🔒</span>
            </div>
          </div>

          <div style={{ marginTop: 28, textAlign: "center", opacity: interpolate(frame, [100, 130], [0, 1], { extrapolateRight: "clamp" }) }}>
            <p style={{ fontSize: 26, fontWeight: 800, color: theme.green, margin: "0 0 6px 0" }}>SYSTEM LOCKED</p>
            <p style={{ fontSize: 14, color: theme.textMuted }}>Choices are final and secure</p>
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 28, opacity: interpolate(frame, [140, 170], [0, 1], { extrapolateRight: "clamp" }) }}>
            <div style={{ background: theme.card, border: `1px solid ${theme.orange}30`, borderRadius: 16, padding: "18px 24px", textAlign: "center", boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: theme.orange, margin: 0 }}>41</p>
              <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>Choices</p>
            </div>
            <div style={{ background: theme.card, border: `1px solid ${theme.green}30`, borderRadius: 16, padding: "18px 24px", textAlign: "center", boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: theme.green, margin: 0 }}>✓</p>
              <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>Verified</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ flex: 1, background: theme.card, borderRadius: 24, padding: 30, boxShadow: "0 10px 40px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 18, color: theme.text, margin: "0 0 24px 0", fontWeight: 700 }}>Verification Details</h3>

          {lockingDetails.fields.map((field, index) => {
            const delay = 60 + index * 20;
            const cardOpacity = interpolate(frame, [delay, delay + 30], [0, 1], { extrapolateRight: "clamp" });
            const cardX = interpolate(frame, [delay, delay + 30], [30, 0], { extrapolateRight: "clamp" });

            return (
              <div
                key={index}
                style={{
                  background: theme.bg,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: cardOpacity,
                  transform: `translateX(${cardX}px)`,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `linear-gradient(135deg, ${theme.orange}20, ${theme.yellow}20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  {icons[index]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, color: theme.textMuted, margin: "0 0 4px 0" }}>{field.label}</p>
                  <p style={{ fontSize: field.label === "Locking Code" ? 11 : 15, color: field.label === "Locking Status" ? theme.green : theme.text, margin: 0, fontWeight: 600, fontFamily: field.label === "Locking Code" || field.label === "Locking IP" ? "monospace" : "inherit", wordBreak: field.label === "Locking Code" ? "break-all" : "normal" }}>
                    {field.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
