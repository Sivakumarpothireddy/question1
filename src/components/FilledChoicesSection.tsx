import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors } from "../styles";
import { filledChoices } from "../data";

const ROW_HEIGHT = 110;
const TOTAL_DURATION = 8400; // 14 sections * 600 frames

export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();

  // Continuous smooth scroll from start to end
  const totalScrollDistance = (filledChoices.choices.length - 3) * ROW_HEIGHT;
  const scrollY = interpolate(frame, [0, TOTAL_DURATION], [0, totalScrollDistance], {
    extrapolateRight: "clamp",
  });

  // Which row is at the top of the highlight zone
  const topHighlightRow = scrollY / ROW_HEIGHT;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #08080f 0%, #0f0f18 100%)",
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
          padding: "25px 50px",
          background: "linear-gradient(180deg, #08080f 0%, transparent 100%)",
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
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: 0 }}>
            Filled Choices
          </h1>
        </div>
        <p style={{ fontSize: 16, color: colors.textMuted, margin: 0 }}>
          {filledChoices.totalChoices} preferences
        </p>
      </div>

      {/* Scrolling list */}
      <div
        style={{
          position: "absolute",
          top: 90,
          bottom: 0,
          left: 40,
          right: 40,
          overflow: "hidden",
        }}
      >
        <div style={{ transform: `translateY(${-scrollY + 150}px)` }}>
          {filledChoices.choices.map((choice, index) => {
            // Calculate how "highlighted" this row is based on scroll position
            const distanceFromCenter = Math.abs(index - (topHighlightRow + 1.5));
            const isHighlighted = distanceFromCenter < 1.5;
            const highlightAmount = isHighlighted ? 1 - (distanceFromCenter / 1.5) : 0;

            const accentColor = choice.institute.includes("Indian Institute of Technology")
              ? colors.neonBlue
              : choice.institute.includes("National Institute of Technology")
              ? colors.neonGreen
              : colors.neonPink;

            const tag = choice.institute.includes("Indian Institute of Technology")
              ? "IIT"
              : choice.institute.includes("National Institute of Technology")
              ? "NIT"
              : "GFTI";

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
                  padding: "8px 0",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: `linear-gradient(90deg, ${accentColor}${Math.floor(highlightAmount * 20).toString(16).padStart(2, '0')}, transparent)`,
                    border: `${highlightAmount > 0.3 ? 2 : 1}px solid ${accentColor}${Math.floor(highlightAmount * 80 + 10).toString(16).padStart(2, '0')}`,
                    borderRadius: 14,
                    padding: "0 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    opacity: 0.3 + highlightAmount * 0.7,
                    transform: `scale(${0.95 + highlightAmount * 0.05})`,
                  }}
                >
                  {/* Rank */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: highlightAmount > 0.5
                        ? `linear-gradient(135deg, ${accentColor}, ${colors.neonPurple})`
                        : "rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 900, color: highlightAmount > 0.5 ? "#fff" : colors.textMuted }}>
                      {String(choice.no).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Tag */}
                  <div
                    style={{
                      background: highlightAmount > 0.5 ? accentColor : "rgba(255,255,255,0.1)",
                      color: highlightAmount > 0.5 ? "#000" : colors.textMuted,
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {tag}
                  </div>

                  {/* College */}
                  <div style={{ flex: 1.2, minWidth: 0 }}>
                    <p style={{ fontSize: 9, color: colors.textMuted, margin: "0 0 2px 0", fontWeight: 700 }}>COLLEGE</p>
                    <p style={{
                      fontSize: 14 + highlightAmount * 2,
                      fontWeight: highlightAmount > 0.5 ? 700 : 500,
                      color: highlightAmount > 0.5 ? "#fff" : colors.textMuted,
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {shortInstitute}
                    </p>
                  </div>

                  {/* Divider */}
                  <div style={{ width: 1, height: 35, background: `${accentColor}30` }} />

                  {/* Program */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 9, color: colors.textMuted, margin: "0 0 2px 0", fontWeight: 700 }}>PROGRAM</p>
                    <p style={{
                      fontSize: 12 + highlightAmount * 2,
                      fontWeight: highlightAmount > 0.5 ? 600 : 400,
                      color: highlightAmount > 0.5 ? colors.neonPurple : colors.textMuted,
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {shortProgram}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top fade */}
      <div style={{
        position: "absolute",
        top: 80,
        left: 0,
        right: 0,
        height: 80,
        background: "linear-gradient(180deg, #08080f, transparent)",
        zIndex: 50,
        pointerEvents: "none",
      }} />

      {/* Bottom fade */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        background: "linear-gradient(0deg, #08080f, transparent)",
        zIndex: 50,
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
