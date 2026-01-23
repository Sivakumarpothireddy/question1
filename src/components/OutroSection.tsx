import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";

export const OutroSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations
  const logoScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 10, stiffness: 80, mass: 0.5 },
  });

  const titleOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [40, 70], [40, 0], { extrapolateRight: "clamp" });

  const summaryOpacity = interpolate(frame, [100, 130], [0, 1], { extrapolateRight: "clamp" });

  const footerOpacity = interpolate(frame, [180, 210], [0, 1], { extrapolateRight: "clamp" });

  // Floating particles
  const particles = Array.from({ length: 30 }, (_, i) => {
    const seed = i * 123.456;
    const x = (seed % 100) * 19.2;
    const startY = 1080 + (i % 10) * 50;
    const speed = 0.5 + (i % 5) * 0.2;
    const y = startY - frame * speed;
    const size = 4 + (i % 4) * 2;
    const opacity = interpolate(frame, [0, 60], [0, 0.4], { extrapolateRight: "clamp" }) * (1 - (i % 3) * 0.2);
    const glowColor = i % 3 === 0 ? colors.neonBlue : i % 3 === 1 ? colors.neonPurple : colors.neonPink;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y % 1200,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: glowColor,
          opacity: opacity > 0 ? opacity : 0,
          boxShadow: `0 0 ${size * 2}px ${glowColor}`,
        }}
      />
    );
  });

  const summaryItems = [
    { icon: "👤", label: "Candidate", value: "POTHIREDDY SIVAKUMAR REDDY" },
    { icon: "🎫", label: "Application", value: "250310039497" },
    { icon: "🏆", label: "JEE Advanced Rank", value: "8,541 (CRL)" },
    { icon: "📋", label: "Choices Filed", value: "41 Options" },
    { icon: "🔒", label: "Status", value: "System Locked" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Floating particles */}
      {particles}

      {/* Glowing background circles */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.neonBlue}15 0%, transparent 60%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Logo/Badge */}
      <div
        style={{
          transform: `scale(${Math.max(0, logoScale)})`,
          opacity: logoScale,
          marginBottom: "30px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${colors.neonBlue}, ${colors.neonPurple})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 60px ${colors.neonBlue}60, 0 0 120px ${colors.neonPurple}30`,
          }}
        >
          <span style={{ fontSize: "56px" }}>✓</span>
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
          marginBottom: "40px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: "56px",
            fontWeight: "900",
            background: `linear-gradient(90deg, ${colors.neonBlue}, ${colors.neonPurple}, ${colors.neonPink})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 15px 0",
            letterSpacing: "-1px",
          }}
        >
          Document Complete
        </h1>
        <p
          style={{
            fontSize: "22px",
            color: colors.textSecondary,
            margin: 0,
          }}
        >
          JoSAA 2025 Registration Summary
        </p>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "1200px",
          opacity: summaryOpacity,
          position: "relative",
          zIndex: 10,
        }}
      >
        {summaryItems.map((item, index) => {
          const delay = 100 + index * 20;
          const cardScale = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 100, mass: 0.4 },
          });

          return (
            <div
              key={index}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "20px 30px",
                minWidth: "200px",
                transform: `scale(${Math.max(0, cardScale)})`,
                opacity: cardScale,
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, ${colors.neonBlue}30, ${colors.neonPurple}30)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: "12px", color: colors.textMuted, margin: "0 0 4px 0", textTransform: "uppercase" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: "16px", color: colors.white, margin: 0, fontWeight: "600" }}>
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          opacity: footerOpacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.neonBlue}50, ${colors.neonPurple}50, transparent)`,
            height: "1px",
            width: "400px",
            margin: "0 auto 20px",
          }}
        />
        <p
          style={{
            fontSize: "18px",
            color: colors.textSecondary,
            margin: 0,
          }}
        >
          JoSAA 2025 • Joint Seat Allocation Authority
        </p>
        <p
          style={{
            fontSize: "14px",
            color: colors.textMuted,
            margin: "8px 0 0 0",
          }}
        >
          IITs • NITs • IIITs • GFTIs • Academic Year 2025-26
        </p>
      </div>
    </AbsoluteFill>
  );
};
