import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { candidateDetails } from "../data";

// Animated background grid
const GridBackground: React.FC<{ frame: number }> = ({ frame }) => {
  const lines = [];
  for (let i = 0; i < 20; i++) {
    const opacity = interpolate(frame, [i * 5, i * 5 + 30], [0, 0.1], { extrapolateRight: "clamp" });
    lines.push(
      <div
        key={`h-${i}`}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${i * 5.5}%`,
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${colors.neonBlue}30, transparent)`,
          opacity,
        }}
      />
    );
    lines.push(
      <div
        key={`v-${i}`}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${i * 5.5}%`,
          width: "1px",
          background: `linear-gradient(180deg, transparent, ${colors.neonPurple}30, transparent)`,
          opacity,
        }}
      />
    );
  }
  return <>{lines}</>;
};

// Data card component
const DataCard: React.FC<{
  label: string;
  value: string;
  index: number;
  frame: number;
  fps: number;
  isHighlighted: boolean;
  icon: string;
}> = ({ label, value, index, frame, fps, isHighlighted, icon }) => {
  const delay = 30 + index * 8;

  const cardSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });

  const x = index % 2 === 0 ? -100 : 100;
  const translateX = interpolate(cardSpring, [0, 1], [x, 0]);

  return (
    <div
      style={{
        background: isHighlighted
          ? `linear-gradient(135deg, ${colors.neonBlue}20, ${colors.neonPurple}20)`
          : "rgba(255, 255, 255, 0.03)",
        border: isHighlighted
          ? `2px solid ${colors.neonBlue}`
          : "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        padding: "18px 24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transform: `translateX(${translateX}px)`,
        opacity: cardSpring,
        boxShadow: isHighlighted
          ? `0 0 30px ${colors.neonBlue}30, 0 10px 40px rgba(0,0,0,0.2)`
          : "0 4px 20px rgba(0,0,0,0.2)",
        transition: "border-color 0.3s, background 0.3s",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: isHighlighted
            ? `linear-gradient(135deg, ${colors.neonBlue}, ${colors.neonPurple})`
            : "rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "13px",
            color: colors.textMuted,
            margin: "0 0 4px 0",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: "18px",
            color: isHighlighted ? colors.neonBlue : colors.white,
            margin: 0,
            fontWeight: isHighlighted ? "700" : "500",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textShadow: isHighlighted ? `0 0 20px ${colors.neonBlue}50` : "none",
          }}
        >
          {value}
        </p>
      </div>

      {/* Highlight indicator */}
      {isHighlighted && (
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: colors.neonBlue,
            boxShadow: `0 0 10px ${colors.neonBlue}, 0 0 20px ${colors.neonBlue}`,
          }}
        />
      )}
    </div>
  );
};

export const CandidateDetailsSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation timings
  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 30], [-50, 0], { extrapolateRight: "clamp" });

  // Highlight index cycles through fields
  const highlightIndex = Math.floor(
    interpolate(frame, [60, 550], [0, candidateDetails.fields.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Profile card animation
  const profileScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.5 },
  });

  // Icons for each field
  const icons = ["📋", "👤", "👨", "👩", "⚧", "🎂", "🏷️", "♿", "📍", "🌍", "🎓"];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #1a1a2e 100%)",
        padding: "50px 60px",
        overflow: "hidden",
      }}
    >
      {/* Animated grid background */}
      <GridBackground frame={frame} />

      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          right: "-200px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.neonBlue}15 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-300px",
          left: "-200px",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.neonPurple}10 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          marginBottom: "30px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px", justifyContent: "center" }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.neonBlue}, ${colors.neonPurple})`,
              borderRadius: "12px",
              padding: "10px 20px",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "700", color: colors.white }}>01</span>
          </div>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "800",
              color: colors.white,
              margin: 0,
              letterSpacing: "-1px",
            }}
          >
            Candidate Details
          </h1>
        </div>
        <p
          style={{
            fontSize: "18px",
            color: colors.textSecondary,
            margin: "12px 0 0 0",
            textAlign: "center",
          }}
        >
          Personal information of the applicant
        </p>
      </div>

      {/* Main content grid */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          flex: 1,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Left: Profile Card */}
        <div
          style={{
            width: "320px",
            flexShrink: 0,
            transform: `scale(${Math.max(0, profileScale)})`,
            opacity: profileScale,
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              padding: "30px",
              textAlign: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.neonBlue}, ${colors.neonPurple})`,
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "48px",
                boxShadow: `0 0 40px ${colors.neonBlue}40`,
              }}
            >
              👨‍🎓
            </div>

            {/* Name */}
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: colors.white,
                margin: "0 0 8px 0",
                lineHeight: 1.3,
              }}
            >
              {candidateDetails.fields[1].value}
            </h2>

            {/* Application ID */}
            <p
              style={{
                fontSize: "14px",
                color: colors.neonBlue,
                margin: "0 0 20px 0",
                fontFamily: "monospace",
              }}
            >
              {candidateDetails.fields[0].value}
            </p>

            {/* Quick stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                <p style={{ fontSize: "11px", color: colors.textMuted, margin: "0 0 4px 0" }}>Category</p>
                <p style={{ fontSize: "14px", color: colors.neonGreen, margin: 0, fontWeight: "600" }}>
                  GEN-EWS
                </p>
              </div>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                <p style={{ fontSize: "11px", color: colors.textMuted, margin: "0 0 4px 0" }}>State</p>
                <p style={{ fontSize: "14px", color: colors.neonOrange, margin: 0, fontWeight: "600" }}>
                  AP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Data Cards Grid */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            alignContent: "start",
          }}
        >
          {candidateDetails.fields.map((field, index) => (
            <DataCard
              key={index}
              label={field.label}
              value={field.value}
              index={index}
              frame={frame}
              fps={fps}
              isHighlighted={index === highlightIndex}
              icon={icons[index] || "📄"}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
