import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { jeeAdvancedDetails } from "../data";

// Hexagon background pattern
const HexagonPattern: React.FC<{ frame: number }> = ({ frame }) => {
  const hexagons = [];
  for (let i = 0; i < 15; i++) {
    const x = (i % 5) * 400 + (Math.floor(i / 5) % 2) * 200;
    const y = Math.floor(i / 5) * 350;
    const delay = i * 10;
    const opacity = interpolate(frame, [delay, delay + 40], [0, 0.05], { extrapolateRight: "clamp" });
    const rotation = interpolate(frame, [0, 600], [0, 30], { extrapolateRight: "clamp" });

    hexagons.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: "200px",
          height: "230px",
          opacity,
          transform: `rotate(${rotation}deg)`,
          background: `conic-gradient(from 0deg, ${colors.neonPurple}20, transparent, ${colors.neonBlue}20, transparent)`,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      />
    );
  }
  return <>{hexagons}</>;
};

// Status badge component
const StatusBadge: React.FC<{
  label: string;
  value: string;
  icon: string;
  color: string;
  delay: number;
  frame: number;
  fps: number;
}> = ({ label, value, icon, color, delay, frame, fps }) => {
  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "20px",
        padding: "24px",
        textAlign: "center",
        transform: `scale(${Math.max(0, scale)})`,
        opacity: scale,
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${color}40, ${color}20)`,
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          fontSize: "28px",
        }}
      >
        {icon}
      </div>
      <p style={{ fontSize: "12px", color: colors.textMuted, margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "1px" }}>
        {label}
      </p>
      <p style={{ fontSize: "20px", color, margin: 0, fontWeight: "700" }}>
        {value}
      </p>
    </div>
  );
};

export const JEEAdvancedSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 30], [-40, 0], { extrapolateRight: "clamp" });

  const highlightIndex = Math.floor(
    interpolate(frame, [60, 500], [0, jeeAdvancedDetails.fields.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const icons = ["🎫", "📝", "🎖️", "🎨", "👁️", "👀"];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0a0a0f 0%, #1a0a2e 50%, #0a1a2e 100%)",
        padding: "50px 60px",
        overflow: "hidden",
      }}
    >
      <HexagonPattern frame={frame} />

      {/* Glowing orbs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.neonPurple}20 0%, transparent 70%)`,
          filter: "blur(40px)",
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
              background: `linear-gradient(135deg, ${colors.neonPurple}, ${colors.neonPink})`,
              borderRadius: "12px",
              padding: "10px 20px",
              boxShadow: `0 0 30px ${colors.neonPurple}50`,
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "700", color: colors.white }}>02</span>
          </div>
          <h1 style={{ fontSize: "42px", fontWeight: "800", color: colors.white, margin: 0 }}>
            JEE Advanced Details
          </h1>
        </div>
        <p style={{ fontSize: "18px", color: colors.textSecondary, margin: "12px 0 0 0", textAlign: "center" }}>
          Examination eligibility and medical status
        </p>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", gap: "30px", flex: 1, position: "relative", zIndex: 10 }}>
        {/* Left: Main data cards */}
        <div style={{ flex: 2 }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "24px",
              padding: "30px",
              backdropFilter: "blur(10px)",
            }}
          >
            {jeeAdvancedDetails.fields.slice(0, 2).map((field, index) => {
              const isHighlighted = index === highlightIndex;
              const delay = 40 + index * 15;
              const cardSpring = spring({
                frame: frame - delay,
                fps,
                config: { damping: 12, stiffness: 100, mass: 0.5 },
              });

              return (
                <div
                  key={index}
                  style={{
                    background: isHighlighted
                      ? `linear-gradient(135deg, ${colors.neonPurple}15, ${colors.neonBlue}15)`
                      : "rgba(255, 255, 255, 0.02)",
                    border: isHighlighted ? `2px solid ${colors.neonPurple}` : "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "16px",
                    padding: "24px",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    transform: `translateX(${interpolate(cardSpring, [0, 1], [-50, 0])}px)`,
                    opacity: cardSpring,
                    boxShadow: isHighlighted ? `0 0 30px ${colors.neonPurple}30` : "none",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background: isHighlighted
                        ? `linear-gradient(135deg, ${colors.neonPurple}, ${colors.neonPink})`
                        : "rgba(255, 255, 255, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      flexShrink: 0,
                    }}
                  >
                    {icons[index]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "14px", color: colors.textMuted, margin: "0 0 6px 0" }}>{field.label}</p>
                    <p
                      style={{
                        fontSize: "22px",
                        color: isHighlighted ? colors.neonPurple : colors.white,
                        margin: 0,
                        fontWeight: "600",
                        fontFamily: "monospace",
                        letterSpacing: "1px",
                        textShadow: isHighlighted ? `0 0 20px ${colors.neonPurple}50` : "none",
                      }}
                    >
                      {field.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Status badges */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignContent: "start" }}>
          {jeeAdvancedDetails.fields.slice(2).map((field, index) => {
            const actualIndex = index + 2;
            const isHighlighted = actualIndex === highlightIndex;
            const value = field.value;
            const isYes = value === "YES";

            return (
              <StatusBadge
                key={actualIndex}
                label={field.label}
                value={value}
                icon={icons[actualIndex]}
                color={isHighlighted ? colors.neonPurple : isYes ? colors.neonGreen : colors.textSecondary}
                delay={60 + index * 20}
                frame={frame}
                fps={fps}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom info bar */}
      <div
        style={{
          marginTop: "30px",
          background: `linear-gradient(90deg, ${colors.neonPurple}20, ${colors.neonBlue}20)`,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "20px 30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
          opacity: interpolate(frame, [150, 180], [0, 1], { extrapolateRight: "clamp" }),
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: colors.textMuted, margin: "0 0 4px 0" }}>ELIGIBLE FOR</p>
          <p style={{ fontSize: "18px", color: colors.neonGreen, margin: 0, fontWeight: "700" }}>IIT Admissions ✓</p>
        </div>
        <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.2)" }} />
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: colors.textMuted, margin: "0 0 4px 0" }}>MEDICAL STATUS</p>
          <p style={{ fontSize: "18px", color: colors.neonGreen, margin: 0, fontWeight: "700" }}>All Clear ✓</p>
        </div>
        <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.2)" }} />
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: colors.textMuted, margin: "0 0 4px 0" }}>ARCHITECTURE</p>
          <p style={{ fontSize: "18px", color: colors.textSecondary, margin: 0, fontWeight: "700" }}>Not Applicable</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
