import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors, containerStyle } from "../styles";
import { filledChoices } from "../data";

// Constants for timing
const SUBSECTION_DURATION = 600; // 10 seconds at 60fps
const CHOICES_PER_SUBSECTION = 3;
const TOTAL_SUBSECTIONS = 14;
const ROW_HEIGHT = 80; // Height of each choice row in pixels
const VISIBLE_AREA_HEIGHT = 720; // Height of the scrollable area

export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate which subsection we're in (0-13)
  const currentSubsection = Math.floor(frame / SUBSECTION_DURATION);
  const frameInSubsection = frame % SUBSECTION_DURATION;

  // Calculate which choices are highlighted (indices 0-40)
  const highlightStartIndex = currentSubsection * CHOICES_PER_SUBSECTION;
  const highlightEndIndex = Math.min(highlightStartIndex + CHOICES_PER_SUBSECTION, filledChoices.choices.length);

  // Calculate scroll position - smooth scroll to show highlighted choices
  const targetScrollY = Math.max(0, (highlightStartIndex * ROW_HEIGHT) - 100); // 100px offset from top

  // Smooth scroll transition at the start of each subsection
  const scrollProgress = interpolate(frameInSubsection, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Get previous scroll position
  const prevSubsection = Math.max(0, currentSubsection - 1);
  const prevScrollY = Math.max(0, (prevSubsection * CHOICES_PER_SUBSECTION * ROW_HEIGHT) - 100);

  // Interpolate between previous and current scroll position
  const scrollY = interpolate(scrollProgress, [0, 1], [prevScrollY, targetScrollY]);

  // Animation values
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const listOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Group choices by institute type for statistics
  const iitCount = filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length;
  const nitCount = filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length;
  const otherCount = filledChoices.totalChoices - iitCount - nitCount;

  const getInstituteColor = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) return colors.primary;
    if (institute.includes("National Institute of Technology")) return colors.success;
    return colors.secondary;
  };

  const getInstituteTag = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) return "IIT";
    if (institute.includes("National Institute of Technology")) return "NIT";
    if (institute.includes("MANIT") || institute.includes("Maulana Azad")) return "NIT";
    return "GFTI";
  };

  const isHighlighted = (index: number): boolean => {
    return index >= highlightStartIndex && index < highlightEndIndex;
  };

  return (
    <AbsoluteFill style={containerStyle}>
      {/* Header */}
      <div
        style={{
          opacity: titleOpacity,
          marginBottom: "15px",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            color: colors.primary,
            margin: "0 0 5px 0",
            textAlign: "center",
          }}
        >
          Section 5: Filled Choices ({filledChoices.totalChoices} Total)
        </h1>
        <p
          style={{
            fontSize: "20px",
            color: colors.lightText,
            margin: "0",
            textAlign: "center",
          }}
        >
          Viewing Choices {highlightStartIndex + 1} - {highlightEndIndex} of 41 | Subsection {currentSubsection + 1} of {TOTAL_SUBSECTIONS}
        </p>
      </div>

      {/* Main content area */}
      <div style={{ display: "flex", gap: "20px", flex: 1, minHeight: 0 }}>
        {/* Scrolling choices list */}
        <div
          style={{
            flex: "3",
            opacity: listOpacity,
            position: "relative",
            overflow: "hidden",
            borderRadius: "12px",
            border: `2px solid ${colors.border}`,
            backgroundColor: colors.white,
          }}
        >
          {/* Scrollable container */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              transform: `translateY(-${scrollY}px)`,
              padding: "10px",
            }}
          >
            {filledChoices.choices.map((choice, index) => {
              const highlighted = isHighlighted(index);

              // Highlight animation
              const highlightScale = highlighted
                ? spring({
                    frame: frameInSubsection - 30,
                    fps,
                    config: { damping: 15, stiffness: 150, mass: 0.5 },
                  })
                : 1;

              const instituteShort = choice.institute
                .replace("Indian Institute of Technology", "IIT")
                .replace("National Institute of Technology", "NIT")
                .replace("Maulana Azad National Institute of Technology", "MANIT")
                .replace("Shri G. S. Institute of Technology and Science", "SGSITS");

              const programShort = choice.program
                .replace("(4 Years, Bachelor of Technology)", "(B.Tech)")
                .replace("(5 Years, Bachelor and Master of Technology (Dual Degree))", "(Dual)")
                .replace("(4 Years, Bachelor of Science)", "(B.Sc)")
                .trim();

              return (
                <div
                  key={choice.no}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 15px",
                    marginBottom: "6px",
                    borderRadius: "8px",
                    backgroundColor: highlighted ? colors.highlight : (index % 2 === 0 ? colors.tableRow : colors.white),
                    border: highlighted ? `3px solid ${colors.accent}` : `1px solid ${colors.border}`,
                    transform: highlighted ? `scale(${Math.min(highlightScale, 1.02)})` : "scale(1)",
                    boxShadow: highlighted ? `0 4px 12px rgba(0,0,0,0.15)` : "none",
                    transition: "background-color 0.2s ease",
                    height: `${ROW_HEIGHT - 16}px`,
                  }}
                >
                  {/* Choice number */}
                  <div
                    style={{
                      backgroundColor: highlighted ? getInstituteColor(choice.institute) : colors.lightText,
                      color: colors.white,
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "18px",
                      marginRight: "15px",
                      flexShrink: 0,
                    }}
                  >
                    {choice.no}
                  </div>

                  {/* Institute tag */}
                  <div
                    style={{
                      backgroundColor: getInstituteColor(choice.institute),
                      color: colors.white,
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginRight: "15px",
                      flexShrink: 0,
                      minWidth: "40px",
                      textAlign: "center",
                    }}
                  >
                    {getInstituteTag(choice.institute)}
                  </div>

                  {/* Institute and program */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: highlighted ? "17px" : "15px",
                        fontWeight: highlighted ? "bold" : "600",
                        color: highlighted ? colors.primary : colors.text,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {instituteShort}
                    </div>
                    <div
                      style={{
                        fontSize: highlighted ? "14px" : "13px",
                        color: highlighted ? colors.accent : colors.lightText,
                        fontWeight: highlighted ? "500" : "normal",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {programShort}
                    </div>
                  </div>

                  {/* Highlight indicator */}
                  {highlighted && (
                    <div
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.white,
                        padding: "6px 12px",
                        borderRadius: "15px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        marginLeft: "10px",
                        flexShrink: 0,
                      }}
                    >
                      VIEWING
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Scroll indicators */}
          {scrollY > 0 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "40px",
                background: "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))",
                pointerEvents: "none",
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40px",
              background: "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Side panel with statistics */}
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            opacity: interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {/* Progress indicator */}
          <div
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
              padding: "18px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "14px", margin: "0 0 8px 0", opacity: 0.8 }}>Progress</h3>
            <div
              style={{
                width: "100%",
                height: "10px",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "5px",
                overflow: "hidden",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: `${(highlightEndIndex / 41) * 100}%`,
                  height: "100%",
                  backgroundColor: colors.accent,
                  borderRadius: "5px",
                }}
              />
            </div>
            <p style={{ fontSize: "13px", margin: 0 }}>
              {highlightEndIndex} of 41 choices viewed
            </p>
          </div>

          {/* Current highlight info */}
          <div
            style={{
              backgroundColor: colors.accent,
              color: colors.white,
              padding: "18px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "28px", fontWeight: "bold", margin: "0 0 5px 0" }}>
              {highlightStartIndex + 1}-{highlightEndIndex}
            </h3>
            <p style={{ fontSize: "13px", margin: 0, opacity: 0.9 }}>
              Currently Viewing
            </p>
          </div>

          {/* Distribution */}
          <div
            style={{
              backgroundColor: colors.tableRow,
              padding: "15px",
              borderRadius: "12px",
              border: `1px solid ${colors.border}`,
            }}
          >
            <h3 style={{ fontSize: "14px", margin: "0 0 12px 0", color: colors.text }}>
              Choice Distribution
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", backgroundColor: colors.primary, borderRadius: "3px" }} />
                  <span style={{ fontSize: "13px", color: colors.text }}>IITs</span>
                </div>
                <span style={{ fontSize: "16px", fontWeight: "bold", color: colors.primary }}>{iitCount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", backgroundColor: colors.success, borderRadius: "3px" }} />
                  <span style={{ fontSize: "13px", color: colors.text }}>NITs</span>
                </div>
                <span style={{ fontSize: "16px", fontWeight: "bold", color: colors.success }}>{nitCount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", backgroundColor: colors.secondary, borderRadius: "3px" }} />
                  <span style={{ fontSize: "13px", color: colors.text }}>Others</span>
                </div>
                <span style={{ fontSize: "16px", fontWeight: "bold", color: colors.secondary }}>{otherCount}</span>
              </div>
            </div>
          </div>

          {/* Subsection counter */}
          <div
            style={{
              backgroundColor: colors.secondary,
              color: colors.white,
              padding: "15px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 3px 0" }}>
              {currentSubsection + 1}/{TOTAL_SUBSECTIONS}
            </h3>
            <p style={{ fontSize: "12px", margin: 0, opacity: 0.9 }}>
              Subsection
            </p>
          </div>

          {/* Tip box */}
          <div
            style={{
              backgroundColor: colors.highlight,
              padding: "12px",
              borderRadius: "12px",
              border: `2px solid ${colors.accent}`,
              fontSize: "12px",
              color: colors.text,
              lineHeight: 1.4,
            }}
          >
            <strong>Tip:</strong> Choices are ordered by preference. Higher choices are attempted first during seat allocation.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
