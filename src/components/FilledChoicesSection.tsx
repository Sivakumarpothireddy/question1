import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { filledChoices } from "../data";

const TOTAL_DURATION = 8400;
const ROW_HEIGHT = 140;

export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth scroll - moves through all 41 choices one by one
  const scrollProgress = interpolate(frame, [0, TOTAL_DURATION], [0, filledChoices.choices.length - 1], {
    extrapolateRight: "clamp",
  });

  // Current center choice (the one most in focus)
  const centerIndex = scrollProgress;

  return (
    <AbsoluteFill
      style={{
        background: "#030306",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 800,
          height: 400,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse, ${colors.neonBlue}08 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: -0.5 }}>
            Choice Preferences
          </h1>
          <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0 0" }}>
            41 colleges ranked by priority
          </p>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 12, color: "#555" }}>CURRENT</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: colors.neonBlue }}>
            {String(Math.floor(centerIndex) + 1).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 14, color: "#444" }}>/ 41</span>
        </div>
      </div>

      {/* Scrolling choices */}
      <div
        style={{
          position: "absolute",
          top: 120,
          bottom: 60,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {filledChoices.choices.map((choice, index) => {
          // Distance from the current scroll position
          const distance = index - centerIndex;

          // Only render choices within view range
          if (Math.abs(distance) > 4) return null;

          // Calculate visual properties based on distance from center
          const absDistance = Math.abs(distance);
          const isCurrent = absDistance < 0.5;

          // Y position - spread out from center
          const yOffset = distance * ROW_HEIGHT;

          // Scale - largest at center
          const scale = interpolate(absDistance, [0, 1, 2, 3], [1, 0.88, 0.78, 0.7], {
            extrapolateRight: "clamp",
          });

          // Opacity - brightest at center
          const opacity = interpolate(absDistance, [0, 1, 2, 3], [1, 0.5, 0.25, 0.1], {
            extrapolateRight: "clamp",
          });

          // Blur for distant items
          const blur = interpolate(absDistance, [0, 1, 2], [0, 1, 3], {
            extrapolateRight: "clamp",
          });

          // Colors
          const isIIT = choice.institute.includes("Indian Institute of Technology");
          const isNIT = choice.institute.includes("National Institute of Technology");
          const accentColor = isIIT ? colors.neonBlue : isNIT ? colors.neonGreen : colors.neonPink;
          const tag = isIIT ? "IIT" : isNIT ? "NIT" : "GFTI";

          // Shorten names
          const collegeName = choice.institute
            .replace("Indian Institute of Technology", "IIT")
            .replace("National Institute of Technology", "NIT")
            .replace("Maulana Azad National Institute of Technology", "MANIT")
            .replace("Shri G. S. Institute of Technology and Science", "SGSITS");

          const programName = choice.program
            .replace("(4 Years, Bachelor of Technology)", "")
            .replace("(5 Years, Bachelor and Master of Technology (Dual Degree))", "• Dual Degree")
            .replace("(4 Years, Bachelor of Science)", "• B.Sc")
            .trim();

          return (
            <div
              key={choice.no}
              style={{
                position: "absolute",
                transform: `translateY(${yOffset}px) scale(${scale})`,
                opacity,
                filter: blur > 0 ? `blur(${blur}px)` : "none",
                width: "85%",
                maxWidth: 1100,
                zIndex: 100 - Math.floor(absDistance * 10),
                transition: "filter 0.1s",
              }}
            >
              <div
                style={{
                  background: isCurrent
                    ? `linear-gradient(135deg, rgba(15,15,25,0.95), rgba(20,20,35,0.95))`
                    : "rgba(10,10,18,0.8)",
                  border: isCurrent
                    ? `1px solid ${accentColor}40`
                    : "1px solid rgba(255,255,255,0.04)",
                  borderRadius: 20,
                  padding: isCurrent ? "28px 36px" : "22px 30px",
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  boxShadow: isCurrent
                    ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${accentColor}15`
                    : "0 10px 30px rgba(0,0,0,0.3)",
                }}
              >
                {/* Rank number - large and prominent */}
                <div
                  style={{
                    width: isCurrent ? 72 : 56,
                    height: isCurrent ? 72 : 56,
                    borderRadius: 16,
                    background: isCurrent
                      ? `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`
                      : "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: isCurrent ? `0 8px 24px ${accentColor}40` : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: isCurrent ? 28 : 22,
                      fontWeight: 900,
                      color: isCurrent ? "#000" : "#444",
                      fontFamily: "monospace",
                    }}
                  >
                    {String(choice.no).padStart(2, "0")}
                  </span>
                </div>

                {/* Institute tag */}
                <div
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    background: isCurrent ? `${accentColor}20` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isCurrent ? accentColor + "40" : "rgba(255,255,255,0.05)"}`,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: isCurrent ? accentColor : "#555",
                      letterSpacing: 1.5,
                    }}
                  >
                    {tag}
                  </span>
                </div>

                {/* College name */}
                <div style={{ flex: 1.3, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: isCurrent ? 20 : 16,
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? "#fff" : "#666",
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      letterSpacing: -0.3,
                    }}
                  >
                    {collegeName}
                  </p>
                </div>

                {/* Separator */}
                <div
                  style={{
                    width: 1,
                    height: 40,
                    background: isCurrent
                      ? `linear-gradient(180deg, transparent, ${accentColor}30, transparent)`
                      : "rgba(255,255,255,0.06)",
                  }}
                />

                {/* Program name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: isCurrent ? 16 : 14,
                      fontWeight: isCurrent ? 500 : 400,
                      color: isCurrent ? accentColor : "#555",
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {programName}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 60,
          right: 60,
          height: 3,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 2,
        }}
      >
        <div
          style={{
            width: `${(scrollProgress / 40) * 100}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${colors.neonBlue}, ${colors.neonPurple})`,
            borderRadius: 2,
            boxShadow: `0 0 20px ${colors.neonBlue}50`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
