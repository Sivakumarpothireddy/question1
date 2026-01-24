import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

const theme = {
  bg: "#f8fafc",
  card: "#ffffff",
  text: "#0f172a",
  textMuted: "#64748b",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  pink: "#ec4899",
  green: "#10b981",
  border: "#e2e8f0",
};

export const OutroSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 100 } });
  const titleOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [40, 70], [30, 0], { extrapolateRight: "clamp" });
  const summaryOpacity = interpolate(frame, [100, 130], [0, 1], { extrapolateRight: "clamp" });
  const footerOpacity = interpolate(frame, [180, 210], [0, 1], { extrapolateRight: "clamp" });

  const summaryItems = [
    { icon: "👤", label: "Candidate", value: "KUNCHE NAGA VARUN SANDEEP" },
    { icon: "🎫", label: "Application", value: "250310809241" },
    { icon: "🏆", label: "JEE Advanced Rank", value: "8,541 (CRL)" },
    { icon: "📋", label: "Choices Filed", value: "41 Options" },
    { icon: "🔒", label: "Status", value: "System Locked" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${theme.bg} 0%, #e0e7ff 30%, #fce7f3 70%, #dbeafe 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Decorative shapes */}
      {[
        { x: "15%", y: "25%", size: 300, color: theme.blue },
        { x: "85%", y: "75%", size: 250, color: theme.purple },
        { x: "80%", y: "20%", size: 200, color: theme.pink },
      ].map((shape, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: shape.x,
            top: shape.y,
            width: shape.size,
            height: shape.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${shape.color}18 0%, transparent 70%)`,
            filter: "blur(50px)",
            transform: `translateY(${Math.sin(frame * 0.02 + i) * 15}px)`,
          }}
        />
      ))}

      {/* Logo */}
      <div style={{ transform: `scale(${Math.max(0, logoScale)})`, opacity: logoScale, marginBottom: 28 }}>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.blue}, ${theme.purple})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 15px 50px ${theme.blue}40`,
          }}
        >
          <span style={{ fontSize: 48, color: "#fff" }}>✓</span>
        </div>
      </div>

      {/* Title */}
      <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, textAlign: "center", marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 52,
            fontWeight: 900,
            background: `linear-gradient(90deg, ${theme.blue}, ${theme.purple}, ${theme.pink})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 12px 0",
            letterSpacing: -1,
          }}
        >
          Document Complete
        </h1>
        <p style={{ fontSize: 20, color: theme.textMuted }}>JoSAA 2025 Registration Summary</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center", maxWidth: 1100, opacity: summaryOpacity }}>
        {summaryItems.map((item, index) => {
          const delay = 100 + index * 15;
          const cardScale = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });

          return (
            <div
              key={index}
              style={{
                background: theme.card,
                borderRadius: 18,
                padding: "18px 26px",
                minWidth: 190,
                transform: `scale(${Math.max(0, cardScale)})`,
                opacity: cardScale,
                display: "flex",
                alignItems: "center",
                gap: 14,
                boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                border: `1px solid ${theme.border}`,
              }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 12, background: `linear-gradient(135deg, ${theme.blue}15, ${theme.purple}15)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: 11, color: theme.textMuted, margin: "0 0 4px 0", textTransform: "uppercase" }}>{item.label}</p>
                <p style={{ fontSize: 14, color: theme.text, margin: 0, fontWeight: 600 }}>{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ position: "absolute", bottom: 50, textAlign: "center", opacity: footerOpacity }}>
        <div style={{ width: 350, height: 2, background: `linear-gradient(90deg, transparent, ${theme.blue}, ${theme.purple}, transparent)`, margin: "0 auto 20px", borderRadius: 1 }} />
        <p style={{ fontSize: 16, color: theme.textMuted }}>JoSAA 2025 • Joint Seat Allocation Authority</p>
        <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>IITs • NITs • IIITs • GFTIs • Academic Year 2025-26</p>
      </div>
    </AbsoluteFill>
  );
};
