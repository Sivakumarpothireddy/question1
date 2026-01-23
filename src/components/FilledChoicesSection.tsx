import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { filledChoices } from "../data";

const SUBSECTION_DURATION = 600; // 10 seconds at 60fps
const CHOICES_PER_SUBSECTION = 3;
const TOTAL_SUBSECTIONS = 14;

// Animated skill/rank bar component
const RankBar: React.FC<{
  choice: { no: number; institute: string; program: string };
  index: number;
  frame: number;
  fps: number;
  cardIndex: number;
}> = ({ choice, index, frame, fps, cardIndex }) => {
  const delay = 20 + cardIndex * 25;

  // Bar animation
  const barProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.8 },
  });

  // Text fade in
  const textOpacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Slide in from left
  const slideX = interpolate(frame, [delay, delay + 30], [-50, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const getInstituteColor = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) return colors.neonBlue;
    if (institute.includes("National Institute of Technology")) return colors.neonGreen;
    return colors.neonPink;
  };

  const getInstituteGradient = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) {
      return `linear-gradient(90deg, ${colors.neonBlue}, ${colors.neonPurple})`;
    }
    if (institute.includes("National Institute of Technology")) {
      return `linear-gradient(90deg, ${colors.neonGreen}, ${colors.neonBlue})`;
    }
    return `linear-gradient(90deg, ${colors.neonPink}, ${colors.neonOrange})`;
  };

  const getInstituteTag = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) return "IIT";
    if (institute.includes("National Institute of Technology")) return "NIT";
    return "GFTI";
  };

  const instituteShort = choice.institute
    .replace("Indian Institute of Technology", "IIT")
    .replace("National Institute of Technology", "NIT")
    .replace("Maulana Azad National Institute of Technology", "MANIT")
    .replace("Shri G. S. Institute of Technology and Science", "SGSITS");

  const programShort = choice.program
    .replace("(4 Years, Bachelor of Technology)", "B.Tech")
    .replace("(5 Years, Bachelor and Master of Technology (Dual Degree))", "Dual Degree")
    .replace("(4 Years, Bachelor of Science)", "B.Sc")
    .trim();

  const color = getInstituteColor(choice.institute);

  // Bar fills to different widths based on choice number (visual effect)
  const barWidth = Math.max(60, 100 - (choice.no * 1.2));

  return (
    <div
      style={{
        marginBottom: "24px",
        transform: `translateX(${slideX}px)`,
        opacity: textOpacity,
      }}
    >
      {/* Top row: Rank and Institute info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
          gap: "16px",
        }}
      >
        {/* Rank badge */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: getInstituteGradient(choice.institute),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: `0 8px 24px ${color}50`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", display: "block" }}>RANK</span>
            <span style={{ fontSize: "24px", fontWeight: "900", color: colors.white }}>{choice.no}</span>
          </div>
        </div>

        {/* Institute info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <span
              style={{
                background: `${color}30`,
                color: color,
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "0.5px",
              }}
            >
              {getInstituteTag(choice.institute)}
            </span>
            <span style={{ fontSize: "13px", color: colors.textMuted }}>
              {programShort}
            </span>
          </div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: colors.white,
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {instituteShort}
          </h3>
        </div>

        {/* Choice number on right */}
        <div
          style={{
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "12px", color: colors.textMuted }}>Choice</span>
          <span
            style={{
              fontSize: "28px",
              fontWeight: "900",
              color: color,
              display: "block",
              lineHeight: 1,
              textShadow: `0 0 20px ${color}50`,
            }}
          >
            #{choice.no}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "12px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "6px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Animated fill */}
        <div
          style={{
            width: `${barWidth * barProgress}%`,
            height: "100%",
            background: getInstituteGradient(choice.institute),
            borderRadius: "6px",
            boxShadow: `0 0 20px ${color}60`,
            position: "relative",
          }}
        >
          {/* Shine effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
              borderRadius: "6px 6px 0 0",
            }}
          />
        </div>

        {/* Percentage text */}
        <div
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "10px",
            fontWeight: "700",
            color: colors.white,
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          {Math.round(barWidth)}%
        </div>
      </div>
    </div>
  );
};

export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSubsection = Math.floor(frame / SUBSECTION_DURATION);
  const frameInSubsection = frame % SUBSECTION_DURATION;

  const highlightStartIndex = currentSubsection * CHOICES_PER_SUBSECTION;
  const highlightEndIndex = Math.min(highlightStartIndex + CHOICES_PER_SUBSECTION, filledChoices.choices.length);

  const currentChoices = filledChoices.choices.slice(highlightStartIndex, highlightEndIndex);

  const iitCount = filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length;
  const nitCount = filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length;
  const otherCount = filledChoices.totalChoices - iitCount - nitCount;

  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 30], [-30, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0a0a0f 0%, #0f0a1a 50%, #1a0f1a 100%)",
        padding: "50px 60px",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.neonPurple}10 0%, transparent 60%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.neonBlue}10 0%, transparent 60%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          marginBottom: "40px",
          position: "relative",
          zIndex: 10,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                background: `linear-gradient(135deg, ${colors.neonPink}, ${colors.neonOrange})`,
                borderRadius: "14px",
                padding: "12px 22px",
                boxShadow: `0 0 30px ${colors.neonPink}50`,
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "800", color: colors.white }}>05</span>
            </div>
            <div>
              <h1 style={{ fontSize: "38px", fontWeight: "800", color: colors.white, margin: 0 }}>
                Filled Choices
              </h1>
              <p style={{ fontSize: "14px", color: colors.textSecondary, margin: "4px 0 0 0" }}>
                College preferences by priority
              </p>
            </div>
          </div>

          {/* Current viewing badge */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "11px", color: colors.textMuted, display: "block" }}>VIEWING</span>
              <span style={{ fontSize: "24px", fontWeight: "900", color: colors.neonPink }}>
                {highlightStartIndex + 1}-{highlightEndIndex}
              </span>
            </div>
            <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.1)" }} />
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "11px", color: colors.textMuted, display: "block" }}>OF</span>
              <span style={{ fontSize: "24px", fontWeight: "900", color: colors.white }}>
                {filledChoices.totalChoices}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", gap: "40px", flex: 1, position: "relative", zIndex: 10 }}>
        {/* Left: Rank bars */}
        <div
          style={{
            flex: 2,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "30px",
          }}
        >
          {currentChoices.map((choice, idx) => (
            <RankBar
              key={choice.no}
              choice={choice}
              index={highlightStartIndex + idx}
              frame={frameInSubsection}
              fps={fps}
              cardIndex={idx}
            />
          ))}
        </div>

        {/* Right: Stats panel */}
        <div style={{ width: "280px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Section progress */}
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.neonPink}15, ${colors.neonOrange}15)`,
              border: `1px solid ${colors.neonPink}30`,
              borderRadius: "20px",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "11px", color: colors.textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Section
            </span>
            <div style={{ marginTop: "8px" }}>
              <span style={{ fontSize: "48px", fontWeight: "900", color: colors.neonPink }}>
                {currentSubsection + 1}
              </span>
              <span style={{ fontSize: "24px", fontWeight: "600", color: colors.textSecondary }}>
                /{TOTAL_SUBSECTIONS}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", color: colors.textMuted }}>Progress</span>
              <span style={{ fontSize: "14px", fontWeight: "700", color: colors.white }}>
                {Math.round((highlightEndIndex / 41) * 100)}%
              </span>
            </div>
            <div style={{ height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${(highlightEndIndex / 41) * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${colors.neonPink}, ${colors.neonOrange})`,
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>

          {/* Distribution */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            <span style={{ fontSize: "11px", color: colors.textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Distribution
            </span>
            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: colors.neonBlue }} />
                <span style={{ fontSize: "14px", color: colors.textSecondary, flex: 1 }}>IITs</span>
                <span style={{ fontSize: "18px", fontWeight: "800", color: colors.neonBlue }}>{iitCount}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: colors.neonGreen }} />
                <span style={{ fontSize: "14px", color: colors.textSecondary, flex: 1 }}>NITs</span>
                <span style={{ fontSize: "18px", fontWeight: "800", color: colors.neonGreen }}>{nitCount}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: colors.neonPink }} />
                <span style={{ fontSize: "14px", color: colors.textSecondary, flex: 1 }}>Others</span>
                <span style={{ fontSize: "18px", fontWeight: "800", color: colors.neonPink }}>{otherCount}</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              padding: "16px",
              fontSize: "12px",
              color: colors.textMuted,
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: colors.textSecondary }}>Note:</strong> Bar length indicates preference priority. Higher ranked choices are attempted first during seat allocation.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
