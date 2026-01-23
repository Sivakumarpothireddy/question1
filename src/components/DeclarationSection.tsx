import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { declaration } from "../data";

export const DeclarationSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 30], [-40, 0], { extrapolateRight: "clamp" });

  const cardScale = spring({
    frame: frame - 40,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });

  const checkScale = spring({
    frame: frame - 120,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.3 },
  });

  const badgesOpacity = interpolate(frame, [180, 210], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #0a1a0f 50%, #0f1a0a 100%)",
        padding: "50px 60px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.neonGreen}10 0%, transparent 70%)`,
          filter: "blur(60px)",
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
            <span style={{ fontSize: "18px", fontWeight: "700", color: colors.white }}>06</span>
          </div>
          <h1 style={{ fontSize: "42px", fontWeight: "800", color: colors.white, margin: 0 }}>
            Declaration
          </h1>
        </div>
        <p style={{ fontSize: "18px", color: colors.textSecondary, margin: "12px 0 0 0", textAlign: "center" }}>
          Acknowledgment and agreement to JoSAA rules
        </p>
      </div>

      {/* Main card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            width: "100%",
            transform: `scale(${Math.max(0, cardScale)})`,
            opacity: cardScale,
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "32px",
              overflow: "hidden",
              boxShadow: `0 0 60px ${colors.neonGreen}10, 0 20px 60px rgba(0,0,0,0.3)`,
            }}
          >
            {/* Card header */}
            <div
              style={{
                background: `linear-gradient(135deg, ${colors.neonGreen}30, ${colors.neonBlue}30)`,
                padding: "30px 40px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${colors.neonGreen}, ${colors.neonBlue})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                }}
              >
                📋
              </div>
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: colors.white, margin: 0 }}>
                  {declaration.title}
                </h2>
                <p style={{ fontSize: "14px", color: colors.textSecondary, margin: "4px 0 0 0" }}>
                  Business Rules Agreement
                </p>
              </div>
            </div>

            {/* Card content */}
            <div style={{ padding: "40px" }}>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: `1px solid ${colors.neonGreen}30`,
                  borderRadius: "20px",
                  padding: "30px",
                  marginBottom: "30px",
                }}
              >
                <h3
                  style={{
                    fontSize: "20px",
                    color: colors.neonGreen,
                    margin: "0 0 20px 0",
                    fontWeight: "700",
                  }}
                >
                  {declaration.heading}
                </h3>
                <p
                  style={{
                    fontSize: "18px",
                    color: colors.textPrimary,
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  {declaration.content}
                </p>
              </div>

              {/* Checkmark */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                  transform: `scale(${Math.max(0, checkScale)})`,
                  opacity: checkScale,
                }}
              >
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${colors.neonGreen}, ${colors.neonBlue})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 40px ${colors.neonGreen}60`,
                  }}
                >
                  <span style={{ fontSize: "36px", color: colors.white }}>✓</span>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "24px",
                      color: colors.neonGreen,
                      margin: 0,
                      fontWeight: "700",
                      textShadow: `0 0 20px ${colors.neonGreen}50`,
                    }}
                  >
                    Declaration Acknowledged
                  </p>
                  <p style={{ fontSize: "14px", color: colors.textSecondary, margin: "4px 0 0 0" }}>
                    Submitted and verified
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom info badges */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "30px",
          opacity: badgesOpacity,
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "20px 30px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "24px" }}>⚖️</span>
          <div>
            <p style={{ fontSize: "12px", color: colors.textMuted, margin: 0 }}>LEGAL STATUS</p>
            <p style={{ fontSize: "16px", color: colors.white, margin: "2px 0 0 0", fontWeight: "600" }}>Legally Binding</p>
          </div>
        </div>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "20px 30px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "24px" }}>📜</span>
          <div>
            <p style={{ fontSize: "12px", color: colors.textMuted, margin: 0 }}>COMMITMENT</p>
            <p style={{ fontSize: "16px", color: colors.white, margin: "2px 0 0 0", fontWeight: "600" }}>To JoSAA 2025 Rules</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
