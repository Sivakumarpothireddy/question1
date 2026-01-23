import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { filledChoices } from "../data";

// Constants for timing
const SUBSECTION_DURATION = 600; // 10 seconds at 60fps
const CHOICES_PER_SUBSECTION = 3;
const TOTAL_SUBSECTIONS = 14;
const ROW_HEIGHT = 70;
const HIGHLIGHTED_ROW_HEIGHT = 95;

export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSubsection = Math.floor(frame / SUBSECTION_DURATION);
  const frameInSubsection = frame % SUBSECTION_DURATION;

  const highlightStartIndex = currentSubsection * CHOICES_PER_SUBSECTION;
  const highlightEndIndex = Math.min(highlightStartIndex + CHOICES_PER_SUBSECTION, filledChoices.choices.length);

  const ROWS_ABOVE_HIGHLIGHTED = 3;
  const VISIBLE_HEIGHT = 650;
  const ROW_WITH_MARGIN = ROW_HEIGHT + 8;

  const getScrollPosition = (subsection: number) => {
    const targetIndex = subsection * CHOICES_PER_SUBSECTION;
    let highlightedPosition = targetIndex * ROW_WITH_MARGIN;
    const scrollWithRowsAbove = highlightedPosition - (ROWS_ABOVE_HIGHLIGHTED * ROW_WITH_MARGIN);
    const totalContentHeight = filledChoices.choices.length * ROW_WITH_MARGIN;
    const maxScroll = Math.max(0, totalContentHeight - VISIBLE_HEIGHT + 50);
    return Math.max(0, Math.min(scrollWithRowsAbove, maxScroll));
  };

  const targetScrollY = getScrollPosition(currentSubsection);
  const prevScrollY = getScrollPosition(Math.max(0, currentSubsection - 1));

  const scrollProgress = interpolate(frameInSubsection, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const scrollY = interpolate(scrollProgress, [0, 1], [prevScrollY, targetScrollY]);

  const iitCount = filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length;
  const nitCount = filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length;
  const otherCount = filledChoices.totalChoices - iitCount - nitCount;

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
    if (institute.includes("MANIT") || institute.includes("Maulana Azad")) return "NIT";
    return "GFTI";
  };

  const isHighlighted = (index: number): boolean => {
    return index >= highlightStartIndex && index < highlightEndIndex;
  };

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #0f1a1a 50%, #1a0f1a 100%)",
        padding: "50px 60px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px", position: "relative", zIndex: 10 }}>
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
          <h1 style={{ fontSize: "38px", fontWeight: "800", color: colors.white, margin: 0 }}>
            Filled Choices ({filledChoices.totalChoices} Total)
          </h1>
        </div>
        <p style={{ fontSize: "16px", color: colors.textSecondary, margin: "10px 0 0 0", textAlign: "center" }}>
          Viewing <span style={{ color: colors.neonPink, fontWeight: "700" }}>{highlightStartIndex + 1} - {highlightEndIndex}</span> of 41
        </p>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", gap: "20px", flex: 1, minHeight: 0, position: "relative", zIndex: 10 }}>
        {/* Scrolling list */}
        <div
          style={{
            flex: "3",
            position: "relative",
            overflow: "hidden",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
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

              const zoomScale = highlighted
                ? spring({
                    frame: frameInSubsection - 10,
                    fps,
                    config: { damping: 12, stiffness: 180, mass: 0.4 },
                  })
                : 0;

              const finalScale = highlighted ? 1 + (Math.min(zoomScale, 1) * 0.06) : 1;

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
                    borderRadius: highlighted ? "16px" : "12px",
                    background: highlighted
                      ? getInstituteGradient(choice.institute)
                      : "rgba(255,255,255,0.03)",
                    border: highlighted ? "none" : "1px solid rgba(255,255,255,0.06)",
                    transform: `scale(${finalScale})`,
                    transformOrigin: "left center",
                    boxShadow: highlighted
                      ? `0 15px 40px ${getInstituteColor(choice.institute)}40, 0 5px 20px rgba(0,0,0,0.3)`
                      : "none",
                    zIndex: highlighted ? 100 : 1,
                    position: "relative",
                    minHeight: highlighted ? `${HIGHLIGHTED_ROW_HEIGHT - 32}px` : `${ROW_HEIGHT - 20}px`,
                  }}
                >
                  {/* Number badge */}
                  <div
                    style={{
                      background: highlighted ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.1)",
                      color: highlighted ? getInstituteColor(choice.institute) : colors.textSecondary,
                      width: highlighted ? "55px" : "40px",
                      height: highlighted ? "55px" : "40px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "900",
                      fontSize: highlighted ? "22px" : "14px",
                      marginRight: highlighted ? "18px" : "12px",
                      flexShrink: 0,
                      boxShadow: highlighted ? "0 4px 15px rgba(0,0,0,0.2)" : "none",
                    }}
                  >
                    {choice.no}
                  </div>

                  {/* Tag */}
                  <div
                    style={{
                      background: highlighted ? "rgba(255,255,255,0.9)" : `${getInstituteColor(choice.institute)}30`,
                      color: highlighted ? getInstituteColor(choice.institute) : getInstituteColor(choice.institute),
                      padding: highlighted ? "6px 14px" : "4px 10px",
                      borderRadius: "8px",
                      fontSize: highlighted ? "12px" : "10px",
                      fontWeight: "800",
                      marginRight: highlighted ? "18px" : "12px",
                      flexShrink: 0,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {getInstituteTag(choice.institute)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: highlighted ? "18px" : "13px",
                        fontWeight: highlighted ? "700" : "500",
                        color: highlighted ? colors.white : colors.textPrimary,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textShadow: highlighted ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
                      }}
                    >
                      {instituteShort}
                    </div>
                    <div
                      style={{
                        fontSize: highlighted ? "14px" : "11px",
                        color: highlighted ? "rgba(255,255,255,0.85)" : colors.textMuted,
                        fontWeight: highlighted ? "500" : "normal",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginTop: "3px",
                      }}
                    >
                      {programShort}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overlays */}
          {scrollY > 0 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "60px",
                background: "linear-gradient(to bottom, rgba(10,10,15,1) 0%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 50,
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60px",
              background: "linear-gradient(to top, rgba(10,10,15,1) 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 50,
            }}
          />
        </div>

        {/* Side panel */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Now viewing */}
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.neonPink}, ${colors.neonOrange})`,
              padding: "25px 20px",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow: `0 10px 30px ${colors.neonPink}40`,
            }}
          >
            <p style={{ fontSize: "11px", margin: "0 0 8px 0", opacity: 0.9, textTransform: "uppercase", letterSpacing: "2px" }}>
              Now Viewing
            </p>
            <h3 style={{ fontSize: "42px", fontWeight: "900", margin: 0, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
              {highlightStartIndex + 1}-{highlightEndIndex}
            </h3>
          </div>

          {/* Progress */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "20px",
              borderRadius: "20px",
            }}
          >
            <p style={{ fontSize: "11px", margin: "0 0 12px 0", color: colors.textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Progress
            </p>
            <div style={{ height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden", marginBottom: "12px" }}>
              <div
                style={{
                  width: `${(highlightEndIndex / 41) * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${colors.neonGreen}, ${colors.neonBlue})`,
                  borderRadius: "4px",
                }}
              />
            </div>
            <p style={{ fontSize: "14px", margin: 0, color: colors.white, fontWeight: "600" }}>
              {highlightEndIndex} of 41 viewed
            </p>
          </div>

          {/* Distribution */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "18px",
              borderRadius: "20px",
            }}
          >
            <p style={{ fontSize: "11px", margin: "0 0 15px 0", color: colors.textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Distribution
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "12px", height: "12px", background: `linear-gradient(135deg, ${colors.neonBlue}, ${colors.neonPurple})`, borderRadius: "3px" }} />
                  <span style={{ fontSize: "13px", color: colors.textSecondary }}>IITs</span>
                </div>
                <span style={{ fontSize: "18px", fontWeight: "800", color: colors.neonBlue }}>{iitCount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "12px", height: "12px", background: `linear-gradient(135deg, ${colors.neonGreen}, ${colors.neonBlue})`, borderRadius: "3px" }} />
                  <span style={{ fontSize: "13px", color: colors.textSecondary }}>NITs</span>
                </div>
                <span style={{ fontSize: "18px", fontWeight: "800", color: colors.neonGreen }}>{nitCount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "12px", height: "12px", background: `linear-gradient(135deg, ${colors.neonPink}, ${colors.neonOrange})`, borderRadius: "3px" }} />
                  <span style={{ fontSize: "13px", color: colors.textSecondary }}>Others</span>
                </div>
                <span style={{ fontSize: "18px", fontWeight: "800", color: colors.neonPink }}>{otherCount}</span>
              </div>
            </div>
          </div>

          {/* Subsection */}
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.neonGreen}30, ${colors.neonBlue}30)`,
              border: `1px solid ${colors.neonGreen}50`,
              padding: "18px",
              borderRadius: "20px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "28px", fontWeight: "900", margin: "0 0 3px 0", color: colors.neonGreen }}>
              {currentSubsection + 1}/{TOTAL_SUBSECTIONS}
            </h3>
            <p style={{ fontSize: "11px", margin: 0, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "1px" }}>
              Subsection
            </p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
