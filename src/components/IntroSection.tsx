import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";

// Animated particle component
const Particle: React.FC<{
  index: number;
  frame: number;
  fps: number;
}> = ({ index, frame, fps }) => {
  // Each particle has unique properties based on index
  const seed = index * 137.5;
  const x = (seed % 100) * 19.2; // Spread across 1920px
  const startY = ((seed * 7) % 100) * 10.8 + 200; // Start positions
  const size = 3 + (index % 5) * 2;
  const speed = 0.3 + (index % 10) * 0.1;
  const delay = (index % 30) * 10;

  const y = startY - ((frame - delay) * speed) % 1200;
  const opacity = interpolate(
    frame,
    [delay, delay + 30, delay + 100],
    [0, 0.6, 0.3],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const glowColor = index % 3 === 0 ? colors.neonBlue : index % 3 === 1 ? colors.neonPurple : colors.neonPink;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: glowColor,
        opacity: opacity > 0 ? opacity : 0,
        boxShadow: `0 0 ${size * 3}px ${glowColor}, 0 0 ${size * 6}px ${glowColor}50`,
      }}
    />
  );
};

// Glowing ring component
const GlowRing: React.FC<{
  frame: number;
  delay: number;
  color: string;
  size: number;
}> = ({ frame, delay, color, size }) => {
  const scale = interpolate(frame, [delay, delay + 60], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const opacity = interpolate(frame, [delay, delay + 30, delay + 60], [0, 0.5, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        transform: `scale(${scale})`,
        opacity,
        boxShadow: `0 0 30px ${color}50, inset 0 0 30px ${color}20`,
      }}
    />
  );
};

export const IntroSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation timings
  const titleY = interpolate(frame, [0, 40], [100, 0], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });

  const yearScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.5 },
  });

  const lineWidth = interpolate(frame, [50, 100], [0, 800], { extrapolateRight: "clamp" });

  const subtitleOpacity = interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp" });
  const subtitleY = interpolate(frame, [80, 110], [30, 0], { extrapolateRight: "clamp" });

  const cardOpacity = interpolate(frame, [120, 150], [0, 1], { extrapolateRight: "clamp" });
  const cardScale = interpolate(frame, [120, 150], [0.9, 1], { extrapolateRight: "clamp" });

  // Generate particles
  const particles = Array.from({ length: 50 }, (_, i) => i);

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
      {/* Animated particles background */}
      {particles.map((i) => (
        <Particle key={i} index={i} frame={frame} fps={fps} />
      ))}

      {/* Glowing rings animation */}
      <div style={{ position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <GlowRing frame={frame} delay={0} color={colors.neonBlue} size={600} />
        <GlowRing frame={frame} delay={20} color={colors.neonPurple} size={700} />
        <GlowRing frame={frame} delay={40} color={colors.neonPink} size={800} />
      </div>

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* JoSAA Logo/Badge */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(168, 85, 247, 0.2))",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "100px",
              padding: "12px 40px",
              backdropFilter: "blur(10px)",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                color: colors.neonBlue,
                fontWeight: "600",
                letterSpacing: "4px",
                textTransform: "uppercase",
              }}
            >
              Document Explainer
            </span>
          </div>
        </div>

        {/* Main Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "80px",
              fontWeight: "900",
              color: colors.white,
              margin: "0",
              letterSpacing: "-2px",
              textShadow: `0 0 60px ${colors.neonBlue}50, 0 0 120px ${colors.neonPurple}30`,
            }}
          >
            Joint Seat Allocation
          </h1>
          <h1
            style={{
              fontSize: "80px",
              fontWeight: "900",
              background: `linear-gradient(90deg, ${colors.neonBlue}, ${colors.neonPurple}, ${colors.neonPink})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0",
              letterSpacing: "-2px",
            }}
          >
            Authority
          </h1>
        </div>

        {/* Year Badge */}
        <div
          style={{
            transform: `scale(${Math.max(0, yearScale)})`,
            marginTop: "30px",
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.neonBlue}, ${colors.neonPurple})`,
              borderRadius: "20px",
              padding: "20px 60px",
              boxShadow: `0 0 40px ${colors.neonBlue}60, 0 10px 40px rgba(0,0,0,0.3)`,
            }}
          >
            <span
              style={{
                fontSize: "56px",
                fontWeight: "900",
                color: colors.white,
                letterSpacing: "8px",
              }}
            >
              2025
            </span>
          </div>
        </div>

        {/* Animated line */}
        <div
          style={{
            width: lineWidth,
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${colors.neonBlue}, ${colors.neonPurple}, ${colors.neonPink}, transparent)`,
            marginTop: "50px",
            marginBottom: "40px",
            boxShadow: `0 0 20px ${colors.neonBlue}80`,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "28px",
              color: colors.textSecondary,
              margin: "0 0 15px 0",
              fontWeight: "300",
              letterSpacing: "2px",
            }}
          >
            IITs • NITs • IIITs • GFTIs
          </p>
        </div>

        {/* Info Card */}
        <div
          style={{
            opacity: cardOpacity,
            transform: `scale(${cardScale})`,
            marginTop: "30px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              padding: "30px 60px",
              backdropFilter: "blur(20px)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "24px",
                color: colors.white,
                margin: "0 0 10px 0",
                fontWeight: "500",
              }}
            >
              Registration-cum-Locked Choices
            </p>
            <p
              style={{
                fontSize: "18px",
                color: colors.neonBlue,
                margin: "0",
                fontWeight: "400",
              }}
            >
              Seat Allotment Document Breakdown
            </p>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "linear-gradient(to top, #0a0a0f, transparent)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
