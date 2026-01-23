import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";

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
        background: "rgba(255, 255, 255, 0.03)",
        border: `2px solid ${color}40`,
        borderRadius: "24px",
        padding: size === "large" ? "40px" : "24px",
        textAlign: "center",
        transform: `scale(${scale})`,
        opacity,
        boxShadow: `0 0 40px ${color}20, inset 0 0 60px ${color}05`,
      }}
    >
      <p
        style={{
          fontSize: "12px",
          color: colors.textMuted,
          margin: "0 0 8px 0",
          textTransform: "uppercase",
          letterSpacing: "2px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: size === "large" ? "72px" : "48px",
          fontWeight: "900",
          color: color,
          margin: "0",
          fontFamily: "monospace",
          textShadow: `0 0 30px ${color}60`,
          lineHeight: 1,
        }}
      >
        {displayValue.toLocaleString()}
      </p>
      <p
        style={{
          fontSize: "14px",
          color: colors.textSecondary,
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
    <div style={{ marginBottom: "20px", opacity }}>
      <p style={{ fontSize: "14px", color: colors.textSecondary, margin: "0 0 12px 0" }}>{label}</p>

      <div style={{ marginBottom: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span style={{ fontSize: "12px", color: colors.neonBlue }}>JEE Main</span>
          <span style={{ fontSize: "14px", color: colors.neonBlue, fontWeight: "700" }}>{mainRank.toLocaleString()}</span>
        </div>
        <div style={{ height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <div
            style={{
              width: `${mainWidth}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${colors.neonBlue}, ${colors.neonPurple})`,
              borderRadius: "4px",
            }}
          />
        </div>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span style={{ fontSize: "12px", color: colors.neonGreen }}>JEE Advanced</span>
          <span style={{ fontSize: "14px", color: colors.neonGreen, fontWeight: "700" }}>{advancedRank.toLocaleString()}</span>
        </div>
        <div style={{ height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
          <div
            style={{
              width: `${advWidth}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${colors.neonGreen}, ${colors.neonBlue})`,
              borderRadius: "4px",
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
        background: "linear-gradient(135deg, #0a0f0a 0%, #0a1a1a 50%, #1a1a0a 100%)",
        padding: "50px 60px",
        overflow: "hidden",
      }}
    >
      {/* Animated background circles */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          border: `1px solid ${colors.neonGreen}10`,
          opacity: interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp" }),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          border: `1px solid ${colors.neonBlue}15`,
          opacity: interpolate(frame, [20, 80], [0, 1], { extrapolateRight: "clamp" }),
        }}
      />

      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          marginBottom: "40px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px", justifyContent: "center" }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.neonGreen}, ${colors.neonBlue})`,
              borderRadius: "12px",
              padding: "10px 20px",
              boxShadow: `0 0 30px ${colors.neonGreen}50`,
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "700", color: colors.white }}>03</span>
          </div>
          <h1 style={{ fontSize: "42px", fontWeight: "800", color: colors.white, margin: 0 }}>
            Rankings Overview
          </h1>
        </div>
        <p style={{ fontSize: "18px", color: colors.textSecondary, margin: "12px 0 0 0", textAlign: "center" }}>
          JEE Main and JEE Advanced performance metrics
        </p>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", gap: "30px", flex: 1, position: "relative", zIndex: 10 }}>
        {/* Left: Big counters */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          <AnimatedCounter
            value={8541}
            frame={frame}
            delay={40}
            label="JEE Advanced Rank"
            sublabel="All India Rank (CRL)"
            color={colors.neonGreen}
            size="large"
          />
          <AnimatedCounter
            value={1004}
            frame={frame}
            delay={80}
            label="EWS Category Rank"
            sublabel="JEE Advanced"
            color={colors.neonBlue}
            size="medium"
          />
        </div>

        {/* Center: Visual comparison */}
        <div
          style={{
            flex: 1.5,
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            padding: "30px",
          }}
        >
          <h3 style={{ fontSize: "18px", color: colors.white, margin: "0 0 30px 0", fontWeight: "600" }}>
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
              marginTop: "30px",
              background: `linear-gradient(135deg, ${colors.neonGreen}20, ${colors.neonBlue}20)`,
              borderRadius: "16px",
              padding: "20px",
              opacity: interpolate(frame, [160, 190], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${colors.neonGreen}, ${colors.neonBlue})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                📈
              </div>
              <div>
                <p style={{ fontSize: "14px", color: colors.textSecondary, margin: "0 0 4px 0" }}>Performance Insight</p>
                <p style={{ fontSize: "18px", color: colors.white, margin: 0, fontWeight: "600" }}>
                  <span style={{ color: colors.neonGreen }}>45% better</span> rank in JEE Advanced vs JEE Main
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: JEE Main counters */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          <AnimatedCounter
            value={15540}
            frame={frame}
            delay={50}
            label="JEE Main Rank"
            sublabel="B.E./B.Tech"
            color={colors.neonBlue}
            size="large"
          />
          <AnimatedCounter
            value={2040}
            frame={frame}
            delay={90}
            label="EWS Category Rank"
            sublabel="JEE Main"
            color={colors.neonPurple}
            size="medium"
          />
        </div>
      </div>

      {/* Bottom badges */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "30px",
          opacity: interpolate(frame, [200, 230], [0, 1], { extrapolateRight: "clamp" }),
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.neonGreen}30, ${colors.neonGreen}10)`,
            border: `1px solid ${colors.neonGreen}50`,
            borderRadius: "12px",
            padding: "15px 25px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "24px" }}>🎯</span>
          <span style={{ color: colors.neonGreen, fontWeight: "600" }}>Eligible for Top IITs</span>
        </div>
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.neonBlue}30, ${colors.neonBlue}10)`,
            border: `1px solid ${colors.neonBlue}50`,
            borderRadius: "12px",
            padding: "15px 25px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "24px" }}>⭐</span>
          <span style={{ color: colors.neonBlue, fontWeight: "600" }}>EWS Reservation Advantage</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
