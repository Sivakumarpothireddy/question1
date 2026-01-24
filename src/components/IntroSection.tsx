import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

const theme = {
  bg: "#f8fafc",
  text: "#0f172a",
  textMuted: "#64748b",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  pink: "#ec4899",
  green: "#10b981",
};

export const IntroSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = interpolate(frame, [0, 50], [80, 0], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [0, 50], [0, 1], { extrapolateRight: "clamp" });

  const yearScale = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 100 } });
  const lineWidth = interpolate(frame, [60, 120], [0, 700], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [100, 140], [0, 1], { extrapolateRight: "clamp" });
  const cardOpacity = interpolate(frame, [150, 190], [0, 1], { extrapolateRight: "clamp" });
  const cardY = interpolate(frame, [150, 190], [30, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${theme.bg} 0%, #e0e7ff 50%, #fce7f3 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Floating shapes */}
      {[
        { x: "10%", y: "20%", size: 300, color: theme.blue },
        { x: "80%", y: "70%", size: 250, color: theme.purple },
        { x: "70%", y: "15%", size: 200, color: theme.pink },
        { x: "20%", y: "75%", size: 180, color: theme.green },
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
            background: `radial-gradient(circle, ${shape.color}20 0%, transparent 70%)`,
            filter: "blur(40px)",
            transform: `translateY(${Math.sin(frame * 0.02 + i) * 20}px)`,
          }}
        />
      ))}

      {/* Animated dots */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = (i * 67) % 100;
        const y = (i * 43) % 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: i % 2 === 0 ? theme.blue : theme.purple,
              opacity: 0.3,
              transform: `translateY(${Math.sin(frame * 0.03 + i) * 15}px)`,
            }}
          />
        );
      })}

      {/* Badge */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 100,
            padding: "12px 32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <span style={{ fontSize: 16, color: theme.blue, fontWeight: 600, letterSpacing: 3 }}>
            DOCUMENT EXPLAINER
          </span>
        </div>
      </div>

      {/* Title */}
      <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
        <h1 style={{ fontSize: 76, fontWeight: 900, color: theme.text, margin: 0, letterSpacing: -2 }}>
          Joint Seat Allocation
        </h1>
        <h1
          style={{
            fontSize: 76,
            fontWeight: 900,
            background: `linear-gradient(90deg, ${theme.blue}, ${theme.purple}, ${theme.pink})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            letterSpacing: -2,
          }}
        >
          Authority
        </h1>
      </div>

      {/* Year badge */}
      <div style={{ transform: `scale(${Math.max(0, yearScale)})`, marginTop: 36 }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${theme.blue}, ${theme.purple})`,
            borderRadius: 20,
            padding: "20px 60px",
            boxShadow: `0 10px 40px ${theme.blue}40`,
          }}
        >
          <span style={{ fontSize: 52, fontWeight: 900, color: "#fff", letterSpacing: 6 }}>2025</span>
        </div>
      </div>

      {/* Line */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${theme.blue}, ${theme.purple}, ${theme.pink}, transparent)`,
          marginTop: 50,
          marginBottom: 40,
          borderRadius: 2,
        }}
      />

      {/* Subtitle */}
      <p style={{ fontSize: 26, color: theme.textMuted, opacity: subtitleOpacity, letterSpacing: 4 }}>
        IITs • NITs • IIITs • GFTIs
      </p>

      {/* Card */}
      <div style={{ opacity: cardOpacity, transform: `translateY(${cardY}px)`, marginTop: 30 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: "28px 50px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 22, color: theme.text, margin: 0, fontWeight: 600 }}>
            Registration-cum-Locked Choices
          </p>
          <p style={{ fontSize: 16, color: theme.blue, margin: "8px 0 0 0" }}>
            Seat Allotment Document Breakdown
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
