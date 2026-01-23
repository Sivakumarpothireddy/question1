import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { filledChoices } from "../data";

const SUBSECTION_DURATION = 600; // 10 seconds at 60fps
const CHOICES_PER_SUBSECTION = 3;
const TOTAL_SUBSECTIONS = 14;

// Skills bar item - staggered appearance like terminal output
const SkillBar: React.FC<{
  choice: { no: number; institute: string; program: string };
  index: number;
  frame: number;
  fps: number;
}> = ({ choice, index, frame, fps }) => {
  const STAGGER_DELAY = 8; // frames between each line appearing (similar to 50ms stagger)
  const delay = index * STAGGER_DELAY;

  // Fade in
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Bar fill animation with spring
  const barProgress = spring({
    frame: frame - delay - 10,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.8 },
  });

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
    .replace("(4 Years, Bachelor of Technology)", "B.Tech")
    .replace("(5 Years, Bachelor and Master of Technology (Dual Degree))", "Dual Degree")
    .replace("(4 Years, Bachelor of Science)", "B.Sc")
    .trim();

  const color = getInstituteColor(choice.institute);
  const tag = getInstituteTag(choice.institute);

  // Bar width based on rank (higher rank = longer bar)
  const barWidth = Math.max(50, 100 - (choice.no * 1.5));

  return (
    <div
      style={{
        marginBottom: "32px",
        opacity,
      }}
    >
      {/* Label row with RANK number */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
          gap: "16px",
        }}
      >
        {/* Rank number */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: "900",
            color: color,
            minWidth: "70px",
            textAlign: "right",
            fontFamily: "monospace",
            lineHeight: 1,
            textShadow: `0 0 30px ${color}60`,
          }}
        >
          {String(choice.no).padStart(2, "0")}
        </div>

        {/* Vertical divider */}
        <div
          style={{
            width: "3px",
            height: "50px",
            background: `linear-gradient(to bottom, ${color}, transparent)`,
            borderRadius: "2px",
          }}
        />

        {/* Institute info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <span
              style={{
                background: color,
                color: "#000",
                padding: "3px 10px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "800",
                letterSpacing: "0.5px",
              }}
            >
              {tag}
            </span>
            <span style={{ fontSize: "14px", color: colors.textMuted }}>
              {programShort}
            </span>
          </div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: colors.white,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {instituteShort}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          marginLeft: "89px", // Align with text after rank number
          height: "16px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Animated fill */}
        <div
          style={{
            width: `${barWidth * barProgress}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
            borderRadius: "8px",
            position: "relative",
            boxShadow: `0 0 20px ${color}40`,
          }}
        >
          {/* Shine sweep effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
              borderRadius: "8px 8px 0 0",
            }}
          />
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

  // Header animations
  const headerOpacity = interpolate(frameInSubsection, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frameInSubsection, [0, 20], [-20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0a0a0f 0%, #0f0a1a 50%, #1a0f1a 100%)",
        padding: "60px 80px",
        overflow: "hidden",
      }}
    >
      {/* Subtle background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.neonPurple}08 0%, transparent 60%)`,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Header with RANK title */}
      <div
        style={{
          marginBottom: "50px",
          position: "relative",
          zIndex: 10,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <h1
              style={{
                fontSize: "72px",
                fontWeight: "900",
                color: colors.white,
                margin: 0,
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
            >
              RANK
            </h1>
            <p style={{ fontSize: "18px", color: colors.textMuted, margin: "8px 0 0 4px" }}>
              Filled Choices • {highlightStartIndex + 1}-{highlightEndIndex} of {filledChoices.totalChoices}
            </p>
          </div>

          {/* Section indicator */}
          <div
            style={{
              textAlign: "right",
              opacity: 0.8,
            }}
          >
            <div style={{ fontSize: "14px", color: colors.textMuted, marginBottom: "4px" }}>
              SECTION
            </div>
            <div style={{ fontSize: "42px", fontWeight: "900", color: colors.neonPink, lineHeight: 1 }}>
              {String(currentSubsection + 1).padStart(2, "0")}
              <span style={{ color: colors.textMuted, fontSize: "24px" }}>/{TOTAL_SUBSECTIONS}</span>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div
          style={{
            marginTop: "24px",
            height: "2px",
            background: `linear-gradient(90deg, ${colors.neonPink}, ${colors.neonPurple}, transparent)`,
            borderRadius: "1px",
          }}
        />
      </div>

      {/* Skills bars */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {currentChoices.map((choice, idx) => (
          <SkillBar
            key={`${currentSubsection}-${choice.no}`}
            choice={choice}
            index={idx}
            frame={frameInSubsection}
            fps={fps}
          />
        ))}
      </div>

      {/* Bottom progress indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "80px",
          right: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {Array.from({ length: TOTAL_SUBSECTIONS }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentSubsection ? "40px" : "12px",
                height: "4px",
                borderRadius: "2px",
                background: i === currentSubsection
                  ? `linear-gradient(90deg, ${colors.neonPink}, ${colors.neonOrange})`
                  : i < currentSubsection
                    ? colors.neonPink + "60"
                    : "rgba(255,255,255,0.15)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
