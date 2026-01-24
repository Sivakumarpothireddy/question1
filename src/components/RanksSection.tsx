import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

const theme = {
  bg: "#f8fafc",
  card: "#ffffff",
  text: "#0f172a",
  textMuted: "#64748b",
  green: "#10b981",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  border: "#e2e8f0",
};

// Animated counter component
const AnimatedCounter: React.FC<{
  value: number;
  frame: number;
  delay: number;
  label: string;
  sublabel: string;
  color: string;
  size?: "large" | "medium";
}> = ({ value, frame, delay, label, sublabel, color, size = "medium" }) => {
  const progress = interpolate(frame, [delay, delay + 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const displayValue = Math.floor(value * progress);
  const scale = interpolate(frame, [delay, delay + 20], [0.8, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        padding: size === "large" ? 40 : 24,
        textAlign: "center",
        transform: `scale(${scale})`,
        opacity,
        boxShadow: `0 10px 40px rgba(0,0,0,0.06)`,
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: theme.textMuted,
          margin: "0 0 8px 0",
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: size === "large" ? 64 : 44,
          fontWeight: 900,
          color: color,
          margin: 0,
          fontFamily: "monospace",
          lineHeight: 1,
        }}
      >
        {displayValue.toLocaleString()}
      </p>
      <p
        style={{
          fontSize: 14,
          color: theme.textMuted,
          margin: "10px 0 0 0",
        }}
      >
        {sublabel}
      </p>
    </div>
  );
};

// Comparison bar
const ComparisonBar: React.FC<{
  mainRank: number;
  advancedRank: number;
  frame: number;
  delay: number;
  label: string;
}> = ({ mainRank, advancedRank, frame, delay, label }) => {
  const maxRank = Math.max(mainRank, advancedRank);
  const mainWidth = interpolate(frame, [delay, delay + 40], [0, (mainRank / maxRank) * 100], {
    extrapolateRight: "clamp",
  });
  const advWidth = interpolate(frame, [delay + 20, delay + 60], [0, (advancedRank / maxRank) * 100], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ marginBottom: 24, opacity }}>
      <p style={{ fontSize: 14, color: theme.textMuted, margin: "0 0 14px 0", fontWeight: 600 }}>{label}</p>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: theme.blue, fontWeight: 600 }}>JEE Main</span>
          <span style={{ fontSize: 14, color: theme.blue, fontWeight: 700 }}>{mainRank.toLocaleString()}</span>
        </div>
        <div style={{ height: 10, background: theme.bg, borderRadius: 5, overflow: "hidden", border: `1px solid ${theme.border}` }}>
          <div
            style={{
              width: `${mainWidth}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${theme.blue}, ${theme.purple})`,
              borderRadius: 5,
            }}
          />
        </div>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: theme.green, fontWeight: 600 }}>JEE Advanced</span>
          <span style={{ fontSize: 14, color: theme.green, fontWeight: 700 }}>{advancedRank.toLocaleString()}</span>
        </div>
        <div style={{ height: 10, background: theme.bg, borderRadius: 5, overflow: "hidden", border: `1px solid ${theme.border}` }}>
          <div
            style={{
              width: `${advWidth}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${theme.green}, ${theme.blue})`,
              borderRadius: 5,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const RanksSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 30], [-40, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${theme.bg} 0%, #dcfce7 50%, #dbeafe 100%)`,
        padding: "50px 60px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Decorative shapes */}
      <div style={{ position: "absolute", top: "15%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: `${theme.green}15`, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "15%", width: 280, height: 280, borderRadius: "50%", background: `${theme.blue}15`, filter: "blur(50px)" }} />

      {/* Header */}
      <div style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)`, marginBottom: 40, textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: `linear-gradient(135deg, ${theme.green}, ${theme.blue})`, borderRadius: 12, padding: "10px 20px", boxShadow: `0 4px 20px ${theme.green}30` }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>03</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: theme.text, margin: 0 }}>Rankings Overview</h1>
        </div>
        <p style={{ fontSize: 16, color: theme.textMuted, marginTop: 10 }}>JEE Main and JEE Advanced performance metrics</p>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", gap: 24, flex: 1, position: "relative", zIndex: 10 }}>
        {/* Left: Big counters */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          <AnimatedCounter
            value={8541}
            frame={frame}
            delay={40}
            label="JEE Advanced Rank"
            sublabel="All India Rank (CRL)"
            color={theme.green}
            size="large"
          />
          <AnimatedCounter
            value={1004}
            frame={frame}
            delay={80}
            label="EWS Category Rank"
            sublabel="JEE Advanced"
            color={theme.blue}
            size="medium"
          />
        </div>

        {/* Center: Visual comparison */}
        <div
          style={{
            flex: 1.5,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 24,
            padding: 30,
            boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ fontSize: 18, color: theme.text, margin: "0 0 28px 0", fontWeight: 700 }}>
            Rank Comparison
          </h3>

          <ComparisonBar
            mainRank={15540}
            advancedRank={8541}
            frame={frame}
            delay={60}
            label="Common Rank List (CRL)"
          />

          <ComparisonBar
            mainRank={2040}
            advancedRank={1004}
            frame={frame}
            delay={100}
            label="GEN-EWS Category Rank"
          />

          {/* Improvement indicator */}
          <div
            style={{
              marginTop: 28,
              background: `linear-gradient(135deg, ${theme.green}15, ${theme.blue}15)`,
              borderRadius: 16,
              padding: 20,
              border: `1px solid ${theme.green}30`,
              opacity: interpolate(frame, [160, 190], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.green}, ${theme.blue})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  boxShadow: `0 6px 20px ${theme.green}30`,
                }}
              >
                📈
              </div>
              <div>
                <p style={{ fontSize: 13, color: theme.textMuted, margin: "0 0 4px 0" }}>Performance Insight</p>
                <p style={{ fontSize: 17, color: theme.text, margin: 0, fontWeight: 600 }}>
                  <span style={{ color: theme.green, fontWeight: 700 }}>45% better</span> rank in JEE Advanced vs JEE Main
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: JEE Main counters */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          <AnimatedCounter
            value={15540}
            frame={frame}
            delay={50}
            label="JEE Main Rank"
            sublabel="B.E./B.Tech"
            color={theme.blue}
            size="large"
          />
          <AnimatedCounter
            value={2040}
            frame={frame}
            delay={90}
            label="EWS Category Rank"
            sublabel="JEE Main"
            color={theme.purple}
            size="medium"
          />
        </div>
      </div>

      {/* Bottom badges */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          marginTop: 28,
          opacity: interpolate(frame, [200, 230], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.green}40`,
            borderRadius: 16,
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
          }}
        >
          <span style={{ fontSize: 24 }}>🎯</span>
          <span style={{ color: theme.green, fontWeight: 700, fontSize: 15 }}>Eligible for Top IITs</span>
        </div>
        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.blue}40`,
            borderRadius: 16,
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
          }}
        >
          <span style={{ fontSize: 24 }}>⭐</span>
          <span style={{ color: theme.blue, fontWeight: 700, fontSize: 15 }}>EWS Reservation Advantage</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
