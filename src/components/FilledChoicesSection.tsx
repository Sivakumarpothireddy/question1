import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors, containerStyle } from "../styles";
import { filledChoices } from "../data";

// Constants for timing
const SUBSECTION_DURATION = 600; // 10 seconds at 60fps
const CHOICES_PER_SUBSECTION = 3;
const TOTAL_SUBSECTIONS = 14;
const ROW_HEIGHT = 70; // Height of each normal choice row
const HIGHLIGHTED_ROW_HEIGHT = 95; // Height of highlighted rows (bigger)

export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate which subsection we're in (0-13)
  const currentSubsection = Math.floor(frame / SUBSECTION_DURATION);
  const frameInSubsection = frame % SUBSECTION_DURATION;

  // Calculate which choices are highlighted (indices 0-40)
  const highlightStartIndex = currentSubsection * CHOICES_PER_SUBSECTION;
  const highlightEndIndex = Math.min(highlightStartIndex + CHOICES_PER_SUBSECTION, filledChoices.choices.length);

  // Calculate scroll position to show highlighted choices with 3 rows above them
  // This ensures highlighted choices are always visible and never go above screen
  const ROWS_ABOVE_HIGHLIGHTED = 3; // Always show 3 non-highlighted rows above
  const VISIBLE_HEIGHT = 650; // Approximate visible area height
  const ROW_WITH_MARGIN = ROW_HEIGHT + 8;

  const getScrollPosition = (subsection: number) => {
    const targetIndex = subsection * CHOICES_PER_SUBSECTION;

    // Calculate position of the first highlighted choice
    let highlightedPosition = targetIndex * ROW_WITH_MARGIN;

    // We want 3 rows visible above the highlighted section
    // So scroll position = highlighted position - (3 rows height)
    const scrollWithRowsAbove = highlightedPosition - (ROWS_ABOVE_HIGHLIGHTED * ROW_WITH_MARGIN);

    // Calculate maximum scroll (don't scroll past the point where last items would go above)
    // Total content height
    const totalContentHeight = filledChoices.choices.length * ROW_WITH_MARGIN;
    // Max scroll = total height - visible height (with some padding)
    const maxScroll = Math.max(0, totalContentHeight - VISIBLE_HEIGHT + 50);

    // Return scroll position: minimum 0, maximum maxScroll
    return Math.max(0, Math.min(scrollWithRowsAbove, maxScroll));
  };

  const targetScrollY = getScrollPosition(currentSubsection);
  const prevScrollY = getScrollPosition(Math.max(0, currentSubsection - 1));

  // Smooth scroll transition (quick, no fade)
  const scrollProgress = interpolate(frameInSubsection, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scrollY = interpolate(scrollProgress, [0, 1], [prevScrollY, targetScrollY]);

  // Group choices by institute type for statistics
  const iitCount = filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length;
  const nitCount = filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length;
  const otherCount = filledChoices.totalChoices - iitCount - nitCount;

  const getInstituteColor = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) return "#1a365d"; // Deep blue for IIT
    if (institute.includes("National Institute of Technology")) return "#22543d"; // Deep green for NIT
    return "#744210"; // Deep orange for others
  };

  const getInstituteLightColor = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) return "#3182ce"; // Bright blue
    if (institute.includes("National Institute of Technology")) return "#38a169"; // Bright green
    return "#dd6b20"; // Bright orange
  };

  const getInstituteGradient = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) {
      return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"; // Purple-blue gradient
    }
    if (institute.includes("National Institute of Technology")) {
      return "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"; // Teal-green gradient
    }
    return "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"; // Pink-red gradient
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
    <AbsoluteFill style={{ ...containerStyle, backgroundColor: "#f0f4f8" }}>
      {/* Header - no fade */}
      <div style={{ marginBottom: "12px" }}>
        <h1
          style={{
            fontSize: "38px",
            fontWeight: "bold",
            color: "#1a365d",
            margin: "0 0 5px 0",
            textAlign: "center",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Section 5: Filled Choices ({filledChoices.totalChoices} Total)
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "#4a5568",
            margin: "0",
            textAlign: "center",
          }}
        >
          Viewing Choices <span style={{ fontWeight: "bold", color: "#667eea" }}>{highlightStartIndex + 1} - {highlightEndIndex}</span> of 41
        </p>
      </div>

      {/* Main content area */}
      <div style={{ display: "flex", gap: "20px", flex: 1, minHeight: 0 }}>
        {/* Scrolling choices list */}
        <div
          style={{
            flex: "3",
            position: "relative",
            overflow: "hidden",
            borderRadius: "16px",
            border: "3px solid #e2e8f0",
            backgroundColor: "#ffffff",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
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
              padding: "12px",
            }}
          >
            {filledChoices.choices.map((choice, index) => {
              const highlighted = isHighlighted(index);

              // Zoom animation for highlighted items
              const zoomScale = highlighted
                ? spring({
                    frame: frameInSubsection - 10,
                    fps,
                    config: { damping: 12, stiffness: 180, mass: 0.4 },
                  })
                : 0;

              const finalScale = highlighted ? 1 + (Math.min(zoomScale, 1) * 0.08) : 1; // 8% zoom for highlighted

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
                    padding: highlighted ? "16px 20px" : "10px 15px",
                    marginBottom: "8px",
                    borderRadius: highlighted ? "16px" : "10px",
                    backgroundColor: highlighted ? "#ffffff" : (index % 2 === 0 ? "#f7fafc" : "#ffffff"),
                    border: highlighted ? "none" : "1px solid #e2e8f0",
                    transform: `scale(${finalScale})`,
                    transformOrigin: "left center",
                    boxShadow: highlighted
                      ? "0 20px 60px rgba(102, 126, 234, 0.4), 0 8px 25px rgba(0,0,0,0.15)"
                      : "none",
                    zIndex: highlighted ? 100 : 1,
                    position: "relative",
                    background: highlighted ? getInstituteGradient(choice.institute) : undefined,
                    minHeight: highlighted ? `${HIGHLIGHTED_ROW_HEIGHT - 32}px` : `${ROW_HEIGHT - 20}px`,
                  }}
                >
                  {/* Choice number badge */}
                  <div
                    style={{
                      background: highlighted
                        ? "rgba(255,255,255,0.95)"
                        : getInstituteColor(choice.institute),
                      color: highlighted ? getInstituteColor(choice.institute) : "#ffffff",
                      width: highlighted ? "60px" : "42px",
                      height: highlighted ? "60px" : "42px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "900",
                      fontSize: highlighted ? "24px" : "16px",
                      marginRight: highlighted ? "20px" : "12px",
                      flexShrink: 0,
                      boxShadow: highlighted ? "0 4px 15px rgba(0,0,0,0.2)" : "none",
                      border: highlighted ? `3px solid ${getInstituteColor(choice.institute)}` : "none",
                    }}
                  >
                    {choice.no}
                  </div>

                  {/* Institute tag */}
                  <div
                    style={{
                      background: highlighted
                        ? "rgba(255,255,255,0.9)"
                        : getInstituteLightColor(choice.institute),
                      color: highlighted ? getInstituteColor(choice.institute) : "#ffffff",
                      padding: highlighted ? "8px 16px" : "5px 10px",
                      borderRadius: "8px",
                      fontSize: highlighted ? "14px" : "11px",
                      fontWeight: "800",
                      marginRight: highlighted ? "20px" : "12px",
                      flexShrink: 0,
                      minWidth: highlighted ? "50px" : "38px",
                      textAlign: "center",
                      letterSpacing: "0.5px",
                      boxShadow: highlighted ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                    }}
                  >
                    {getInstituteTag(choice.institute)}
                  </div>

                  {/* Institute and program */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: highlighted ? "20px" : "14px",
                        fontWeight: highlighted ? "800" : "600",
                        color: highlighted ? "#ffffff" : "#2d3748",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textShadow: highlighted ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
                        letterSpacing: highlighted ? "0.3px" : "0",
                      }}
                    >
                      {instituteShort}
                    </div>
                    <div
                      style={{
                        fontSize: highlighted ? "16px" : "12px",
                        color: highlighted ? "rgba(255,255,255,0.9)" : "#718096",
                        fontWeight: highlighted ? "600" : "normal",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginTop: highlighted ? "4px" : "2px",
                      }}
                    >
                      {programShort}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Top gradient overlay */}
          {scrollY > 0 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "60px",
                background: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
                pointerEvents: "none",
                zIndex: 50,
              }}
            />
          )}

          {/* Bottom gradient overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60px",
              background: "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
              zIndex: 50,
            }}
          />
        </div>

        {/* Side panel */}
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Currently viewing */}
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#ffffff",
              padding: "25px 20px",
              borderRadius: "16px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
            }}
          >
            <p style={{ fontSize: "12px", margin: "0 0 8px 0", opacity: 0.9, textTransform: "uppercase", letterSpacing: "1px" }}>
              Now Viewing
            </p>
            <h3 style={{ fontSize: "42px", fontWeight: "900", margin: "0", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
              {highlightStartIndex + 1}-{highlightEndIndex}
            </h3>
          </div>

          {/* Progress */}
          <div
            style={{
              background: "linear-gradient(135deg, #1a365d 0%, #2c5282 100%)",
              color: "#ffffff",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(26, 54, 93, 0.3)",
            }}
          >
            <p style={{ fontSize: "11px", margin: "0 0 10px 0", opacity: 0.8, textTransform: "uppercase", letterSpacing: "1px" }}>
              Progress
            </p>
            <div
              style={{
                width: "100%",
                height: "12px",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "6px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: `${(highlightEndIndex / 41) * 100}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #48bb78, #38a169)",
                  borderRadius: "6px",
                }}
              />
            </div>
            <p style={{ fontSize: "14px", margin: 0, fontWeight: "600" }}>
              {highlightEndIndex} of 41 viewed
            </p>
          </div>

          {/* Distribution */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "18px",
              borderRadius: "16px",
              border: "2px solid #e2e8f0",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ fontSize: "11px", margin: "0 0 15px 0", color: "#718096", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>
              Distribution
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "14px", height: "14px", background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: "4px" }} />
                  <span style={{ fontSize: "14px", color: "#2d3748", fontWeight: "500" }}>IITs</span>
                </div>
                <span style={{ fontSize: "20px", fontWeight: "800", color: "#667eea" }}>{iitCount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "14px", height: "14px", background: "linear-gradient(135deg, #11998e, #38ef7d)", borderRadius: "4px" }} />
                  <span style={{ fontSize: "14px", color: "#2d3748", fontWeight: "500" }}>NITs</span>
                </div>
                <span style={{ fontSize: "20px", fontWeight: "800", color: "#38a169" }}>{nitCount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "14px", height: "14px", background: "linear-gradient(135deg, #f093fb, #f5576c)", borderRadius: "4px" }} />
                  <span style={{ fontSize: "14px", color: "#2d3748", fontWeight: "500" }}>Others</span>
                </div>
                <span style={{ fontSize: "20px", fontWeight: "800", color: "#dd6b20" }}>{otherCount}</span>
              </div>
            </div>
          </div>

          {/* Subsection */}
          <div
            style={{
              background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              color: "#ffffff",
              padding: "18px",
              borderRadius: "16px",
              textAlign: "center",
              boxShadow: "0 8px 25px rgba(17, 153, 142, 0.3)",
            }}
          >
            <h3 style={{ fontSize: "28px", fontWeight: "900", margin: "0 0 3px 0" }}>
              {currentSubsection + 1}/{TOTAL_SUBSECTIONS}
            </h3>
            <p style={{ fontSize: "11px", margin: 0, opacity: 0.9, textTransform: "uppercase", letterSpacing: "1px" }}>
              Subsection
            </p>
          </div>

          {/* Tip */}
          <div
            style={{
              background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
              padding: "15px",
              borderRadius: "16px",
              fontSize: "12px",
              color: "#744210",
              lineHeight: 1.5,
              fontWeight: "500",
            }}
          >
            <strong style={{ display: "block", marginBottom: "5px" }}>💡 Tip</strong>
            Choices ordered by preference. Higher choices attempted first!
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
