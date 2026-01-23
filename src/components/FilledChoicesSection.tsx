import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { filledChoices } from "../data";

const SUBSECTION_DURATION = 600; // 10 seconds at 60fps
const CHOICES_PER_SUBSECTION = 3;
const TOTAL_SUBSECTIONS = 14;

// Large choice card component
const ChoiceCard: React.FC<{
  choice: { no: number; institute: string; program: string };
  index: number;
  frame: number;
  fps: number;
  cardIndex: number; // 0, 1, or 2 within the current 3
}> = ({ choice, index, frame, fps, cardIndex }) => {
  const delay = 30 + cardIndex * 15;

  const cardSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });

  const slideX = interpolate(cardSpring, [0, 1], [100, 0]);
  const opacity = cardSpring;

  const getInstituteGradient = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) {
      return `linear-gradient(135deg, ${colors.neonBlue} 0%, ${colors.neonPurple} 100%)`;
    }
    if (institute.includes("National Institute of Technology")) {
      return `linear-gradient(135deg, ${colors.neonGreen} 0%, ${colors.neonBlue} 100%)`;
    }
    return `linear-gradient(135deg, ${colors.neonPink} 0%, ${colors.neonOrange} 100%)`;
  };

  const getInstituteColor = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) return colors.neonBlue;
    if (institute.includes("National Institute of Technology")) return colors.neonGreen;
    return colors.neonPink;
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
    .replace("(4 Years, Bachelor of Technology)", "B.Tech - 4 Years")
    .replace("(5 Years, Bachelor and Master of Technology (Dual Degree))", "Dual Degree - 5 Years")
    .replace("(4 Years, Bachelor of Science)", "B.Sc - 4 Years")
    .trim();

  const color = getInstituteColor(choice.institute);

  return (
    <div
      style={{
        background: getInstituteGradient(choice.institute),
        borderRadius: "24px",
        padding: "28px",
        transform: `translateX(${slideX}px)`,
        opacity,
        boxShadow: `0 20px 50px ${color}50, 0 10px 30px rgba(0,0,0,0.3)`,
        display: "flex",
        alignItems: "center",
        gap: "24px",
      }}
    >
      {/* Rank number */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        <span
          style={{
            fontSize: "32px",
            fontWeight: "900",
            color: color,
          }}
        >
          {choice.no}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Tag */}
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.2)",
            padding: "6px 16px",
            borderRadius: "20px",
            marginBottom: "12px",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: "800", color: colors.white, letterSpacing: "1px" }}>
            {getInstituteTag(choice.institute)}
          </span>
        </div>

        {/* Institute name */}
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "800",
            color: colors.white,
            margin: "0 0 8px 0",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            lineHeight: 1.2,
          }}
        >
          {instituteShort}
        </h3>

        {/* Program */}
        <p
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.9)",
            margin: 0,
            fontWeight: "500",
          }}
        >
          {programShort}
        </p>
      </div>

      {/* Choice indicator */}
      <div
        style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: "16px",
          padding: "16px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", margin: "0 0 4px 0", textTransform: "uppercase" }}>
          Choice
        </p>
        <p style={{ fontSize: "28px", fontWeight: "900", color: colors.white, margin: 0 }}>
          #{choice.no}
        </p>
      </div>
    </div>
  );
};

// Mini choice dot for progress indicator
const MiniChoice: React.FC<{
  index: number;
  isActive: boolean;
  isPast: boolean;
  institute: string;
}> = ({ index, isActive, isPast, institute }) => {
  const getColor = () => {
    if (institute.includes("Indian Institute of Technology")) return colors.neonBlue;
    if (institute.includes("National Institute of Technology")) return colors.neonGreen;
    return colors.neonPink;
  };

  return (
    <div
      style={{
        width: isActive ? "12px" : "8px",
        height: isActive ? "12px" : "8px",
        borderRadius: "50%",
        background: isActive ? getColor() : isPast ? `${getColor()}80` : "rgba(255,255,255,0.2)",
        boxShadow: isActive ? `0 0 10px ${getColor()}` : "none",
        transition: "all 0.3s ease",
      }}
    />
  );
};

export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSubsection = Math.floor(frame / SUBSECTION_DURATION);
  const frameInSubsection = frame % SUBSECTION_DURATION;

  const highlightStartIndex = currentSubsection * CHOICES_PER_SUBSECTION;
  const highlightEndIndex = Math.min(highlightStartIndex + CHOICES_PER_SUBSECTION, filledChoices.choices.length);

  // Get current 3 choices
  const currentChoices = filledChoices.choices.slice(highlightStartIndex, highlightEndIndex);

  const iitCount = filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length;
  const nitCount = filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length;
  const otherCount = filledChoices.totalChoices - iitCount - nitCount;

  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #0f1a1a 50%, #1a0f1a 100%)",
        padding: "40px 50px",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "30%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.neonPurple}15 0%, transparent 60%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ marginBottom: "25px", position: "relative", zIndex: 10, opacity: headerOpacity }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", justifyContent: "center" }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.neonPink}, ${colors.neonOrange})`,
              borderRadius: "12px",
              padding: "10px 20px",
              boxShadow: `0 0 30px ${colors.neonPink}50`,
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "700", color: colors.white }}>05</span>
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", color: colors.white, margin: 0 }}>
            Filled Choices
          </h1>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "8px 20px",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: "700", color: colors.white }}>
              {highlightStartIndex + 1}-{highlightEndIndex} of {filledChoices.totalChoices}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", gap: "30px", flex: 1, position: "relative", zIndex: 10 }}>
        {/* Left: Current 3 choices */}
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "16px", justifyContent: "center" }}>
          {currentChoices.map((choice, idx) => (
            <ChoiceCard
              key={choice.no}
              choice={choice}
              index={highlightStartIndex + idx}
              frame={frameInSubsection}
              fps={fps}
              cardIndex={idx}
            />
          ))}
        </div>

        {/* Right: Stats and progress */}
        <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Progress circular */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
              padding: "25px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: `conic-gradient(${colors.neonPink} ${(highlightEndIndex / 41) * 360}deg, rgba(255,255,255,0.1) 0deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 15px",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "#0a0a0f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontSize: "28px", fontWeight: "900", color: colors.white }}>
                  {Math.round((highlightEndIndex / 41) * 100)}%
                </span>
              </div>
            </div>
            <p style={{ fontSize: "14px", color: colors.textSecondary, margin: 0 }}>
              {highlightEndIndex} of 41 choices viewed
            </p>
          </div>

          {/* Subsection indicator */}
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.neonPink}20, ${colors.neonOrange}20)`,
              border: `1px solid ${colors.neonPink}40`,
              borderRadius: "20px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "11px", color: colors.textMuted, margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "1px" }}>
              Section
            </p>
            <p style={{ fontSize: "36px", fontWeight: "900", color: colors.neonPink, margin: 0 }}>
              {currentSubsection + 1}<span style={{ fontSize: "20px", color: colors.textSecondary }}>/{TOTAL_SUBSECTIONS}</span>
            </p>
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
            <p style={{ fontSize: "11px", color: colors.textMuted, margin: "0 0 15px 0", textTransform: "uppercase", letterSpacing: "1px" }}>
              Distribution
            </p>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `linear-gradient(135deg, ${colors.neonBlue}, ${colors.neonPurple})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: colors.white }}>{iitCount}</span>
                </div>
                <span style={{ fontSize: "11px", color: colors.textSecondary }}>IITs</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `linear-gradient(135deg, ${colors.neonGreen}, ${colors.neonBlue})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: colors.white }}>{nitCount}</span>
                </div>
                <span style={{ fontSize: "11px", color: colors.textSecondary }}>NITs</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `linear-gradient(135deg, ${colors.neonPink}, ${colors.neonOrange})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: colors.white }}>{otherCount}</span>
                </div>
                <span style={{ fontSize: "11px", color: colors.textSecondary }}>Others</span>
              </div>
            </div>
          </div>

          {/* Mini progress dots */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "15px",
            }}
          >
            <p style={{ fontSize: "10px", color: colors.textMuted, margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center" }}>
              All Choices
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", justifyContent: "center" }}>
              {filledChoices.choices.map((choice, idx) => (
                <MiniChoice
                  key={idx}
                  index={idx}
                  isActive={idx >= highlightStartIndex && idx < highlightEndIndex}
                  isPast={idx < highlightStartIndex}
                  institute={choice.institute}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
