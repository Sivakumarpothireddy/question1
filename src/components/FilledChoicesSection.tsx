import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { filledChoices } from "../data";

const SUBSECTION_DURATION = 600; // 10 seconds at 60fps
const CHOICES_PER_SUBSECTION = 3;
const ROW_HEIGHT = 120; // Height of each row

export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate current subsection and scroll position
  const currentSubsection = Math.min(Math.floor(frame / SUBSECTION_DURATION), 13);
  const frameInSubsection = frame % SUBSECTION_DURATION;

  // Smooth scroll: animate between subsections
  const baseScroll = currentSubsection * CHOICES_PER_SUBSECTION * ROW_HEIGHT;

  // Transition starts 1 second before subsection ends
  const transitionStart = SUBSECTION_DURATION - 60;
  const transitionProgress = frameInSubsection >= transitionStart
    ? spring({
        frame: frameInSubsection - transitionStart,
        fps,
        config: { damping: 30, stiffness: 80, mass: 1 },
      })
    : 0;

  // Scroll position with smooth transition to next section
  const scrollY = baseScroll + (transitionProgress * CHOICES_PER_SUBSECTION * ROW_HEIGHT);

  // Which choices are currently highlighted
  const highlightStart = currentSubsection * CHOICES_PER_SUBSECTION;
  const highlightEnd = Math.min(highlightStart + CHOICES_PER_SUBSECTION, 41);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0a0a12 0%, #12121a 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "30px 50px",
          background: "linear-gradient(180deg, #0a0a12 0%, transparent 100%)",
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.neonPink}, ${colors.neonPurple})`,
              borderRadius: 10,
              padding: "8px 16px",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>05</span>
          </div>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: 0 }}>
              Filled Choices
            </h1>
            <p style={{ fontSize: 14, color: colors.textMuted, margin: "4px 0 0 0" }}>
              {highlightStart + 1}-{highlightEnd} of {filledChoices.totalChoices} preferences
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 10, color: colors.textMuted, margin: 0 }}>SECTION</p>
            <p style={{ fontSize: 24, fontWeight: 900, color: colors.neonPink, margin: 0 }}>
              {currentSubsection + 1}/14
            </p>
          </div>
        </div>
      </div>

      {/* Scrolling list container */}
      <div
        style={{
          position: "absolute",
          top: 120,
          bottom: 80,
          left: 50,
          right: 50,
          overflow: "hidden",
        }}
      >
        {/* The scrolling content */}
        <div
          style={{
            transform: `translateY(${-scrollY + 200}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          {filledChoices.choices.map((choice, index) => {
            const isHighlighted = index >= highlightStart && index < highlightEnd;

            // Color based on institute
            const getColor = () => {
              if (choice.institute.includes("Indian Institute of Technology")) return colors.neonBlue;
              if (choice.institute.includes("National Institute of Technology")) return colors.neonGreen;
              return colors.neonPink;
            };

            const getTag = () => {
              if (choice.institute.includes("Indian Institute of Technology")) return "IIT";
              if (choice.institute.includes("National Institute of Technology")) return "NIT";
              return "GFTI";
            };

            const accentColor = getColor();
            const tag = getTag();

            // Shorten names
            const shortInstitute = choice.institute
              .replace("Indian Institute of Technology", "IIT")
              .replace("National Institute of Technology", "NIT")
              .replace("Maulana Azad National Institute of Technology", "MANIT")
              .replace("Shri G. S. Institute of Technology and Science", "SGSITS");

            const shortProgram = choice.program
              .replace("(4 Years, Bachelor of Technology)", "B.Tech")
              .replace("(5 Years, Bachelor and Master of Technology (Dual Degree))", "Dual Degree")
              .replace("(4 Years, Bachelor of Science)", "B.Sc");

            return (
              <div
                key={choice.no}
                style={{
                  height: ROW_HEIGHT,
                  padding: "10px 0",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: isHighlighted
                      ? `linear-gradient(90deg, ${accentColor}15, transparent)`
                      : "rgba(255,255,255,0.02)",
                    border: isHighlighted
                      ? `2px solid ${accentColor}50`
                      : "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 16,
                    padding: "0 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    opacity: isHighlighted ? 1 : 0.4,
                    transform: isHighlighted ? "scale(1)" : "scale(0.96)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Rank number */}
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      background: isHighlighted
                        ? `linear-gradient(135deg, ${accentColor}, ${colors.neonPurple})`
                        : "rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 900,
                        color: isHighlighted ? "#fff" : colors.textMuted,
                      }}
                    >
                      {String(choice.no).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Tag */}
                  <div
                    style={{
                      background: isHighlighted ? accentColor : "rgba(255,255,255,0.1)",
                      color: isHighlighted ? "#000" : colors.textMuted,
                      padding: "4px 12px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {tag}
                  </div>

                  {/* College - left side */}
                  <div style={{ flex: 1.2, minWidth: 0 }}>
                    <p style={{ fontSize: 10, color: colors.textMuted, margin: "0 0 4px 0", fontWeight: 700 }}>
                      COLLEGE
                    </p>
                    <p
                      style={{
                        fontSize: isHighlighted ? 16 : 14,
                        fontWeight: isHighlighted ? 700 : 500,
                        color: isHighlighted ? "#fff" : colors.textMuted,
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {shortInstitute}
                    </p>
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      width: 1,
                      height: 40,
                      background: isHighlighted ? `${accentColor}40` : "rgba(255,255,255,0.1)",
                    }}
                  />

                  {/* Program - right side */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 10, color: colors.textMuted, margin: "0 0 4px 0", fontWeight: 700 }}>
                      PROGRAM
                    </p>
                    <p
                      style={{
                        fontSize: isHighlighted ? 14 : 12,
                        fontWeight: isHighlighted ? 600 : 400,
                        color: isHighlighted ? colors.neonPurple : colors.textMuted,
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {shortProgram}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          background: "linear-gradient(0deg, #0a0a12 0%, transparent 100%)",
          zIndex: 50,
        }}
      />

      {/* Top gradient fade */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          height: 50,
          background: "linear-gradient(180deg, #0a0a12 0%, transparent 100%)",
          zIndex: 50,
        }}
      />
    </AbsoluteFill>
  );
};
