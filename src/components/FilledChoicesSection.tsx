import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { filledChoices } from "../data";

const TOTAL_DURATION = 8400;
const CARD_HEIGHT = 130;

// Light theme colors
const theme = {
  bg: "#f8f9fc",
  card: "#ffffff",
  cardHover: "#f0f4ff",
  text: "#1a1a2e",
  textMuted: "#6b7280",
  blue: "#3b82f6",
  green: "#10b981",
  pink: "#ec4899",
  purple: "#8b5cf6",
  border: "#e5e7eb",
  shadow: "rgba(0,0,0,0.08)",
};

export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scroll through choices one by one
  const scrollProgress = interpolate(frame, [0, TOTAL_DURATION], [0, filledChoices.choices.length - 1], {
    extrapolateRight: "clamp",
  });

  const currentIndex = scrollProgress;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${theme.bg} 0%, #eef2ff 50%, #fdf4ff 100%)`,
        fontFamily: "'Inter', -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Decorative shapes */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${theme.blue}15, ${theme.purple}10)`,
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${theme.green}12, ${theme.blue}08)`,
          filter: "blur(60px)",
        }}
      />

      {/* Floating dots pattern */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i * 97) % 100;
        const y = (i * 61) % 100;
        const size = 4 + (i % 3) * 2;
        const floatY = Math.sin(frame * 0.02 + i) * 10;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 2 === 0 ? theme.blue : theme.purple,
              opacity: 0.15,
              transform: `translateY(${floatY}px)`,
            }}
          />
        );
      })}

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 100,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${theme.blue}, ${theme.purple})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 14px ${theme.blue}40`,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>05</span>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: theme.text, margin: 0 }}>
              College Preferences
            </h1>
          </div>
          <p style={{ fontSize: 15, color: theme.textMuted, margin: 0, marginLeft: 54 }}>
            Scrolling through {filledChoices.totalChoices} ranked choices
          </p>
        </div>

        {/* Progress indicator */}
        <div
          style={{
            background: theme.card,
            borderRadius: 16,
            padding: "16px 24px",
            boxShadow: `0 4px 20px ${theme.shadow}`,
            border: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 11, color: theme.textMuted, margin: 0, fontWeight: 600, letterSpacing: 1 }}>
              VIEWING
            </p>
            <p style={{ fontSize: 28, fontWeight: 900, color: theme.blue, margin: "4px 0 0 0" }}>
              {String(Math.floor(currentIndex) + 1).padStart(2, "0")}
            </p>
          </div>
          <div style={{ width: 1, height: 40, background: theme.border }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 11, color: theme.textMuted, margin: 0, fontWeight: 600, letterSpacing: 1 }}>
              TOTAL
            </p>
            <p style={{ fontSize: 28, fontWeight: 900, color: theme.textMuted, margin: "4px 0 0 0" }}>
              41
            </p>
          </div>
        </div>
      </div>

      {/* Cards container */}
      <div
        style={{
          position: "absolute",
          top: 160,
          bottom: 100,
          left: 60,
          right: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {filledChoices.choices.map((choice, index) => {
          const distance = index - currentIndex;
          if (Math.abs(distance) > 3) return null;

          const absDistance = Math.abs(distance);
          const isCurrent = absDistance < 0.5;

          // Positioning
          const yOffset = distance * CARD_HEIGHT;
          const scale = interpolate(absDistance, [0, 1, 2, 3], [1, 0.92, 0.85, 0.78]);
          const opacity = interpolate(absDistance, [0, 1, 2, 3], [1, 0.6, 0.3, 0.15]);
          const xOffset = isCurrent ? 0 : distance > 0 ? 20 : -20;

          // Colors based on institute
          const isIIT = choice.institute.includes("Indian Institute of Technology");
          const isNIT = choice.institute.includes("National Institute of Technology");
          const accentColor = isIIT ? theme.blue : isNIT ? theme.green : theme.pink;
          const tag = isIIT ? "IIT" : isNIT ? "NIT" : "GFTI";

          const collegeName = choice.institute
            .replace("Indian Institute of Technology", "IIT")
            .replace("National Institute of Technology", "NIT")
            .replace("Maulana Azad National Institute of Technology", "MANIT")
            .replace("Shri G. S. Institute of Technology and Science", "SGSITS");

          const programName = choice.program
            .replace("(4 Years, Bachelor of Technology)", "B.Tech")
            .replace("(5 Years, Bachelor and Master of Technology (Dual Degree))", "Dual Degree")
            .replace("(4 Years, Bachelor of Science)", "B.Sc");

          return (
            <div
              key={choice.no}
              style={{
                position: "absolute",
                transform: `translateY(${yOffset}px) translateX(${xOffset}px) scale(${scale})`,
                opacity,
                width: "100%",
                maxWidth: 1000,
                zIndex: 50 - Math.floor(absDistance * 10),
              }}
            >
              <div
                style={{
                  background: isCurrent ? theme.card : "#ffffff90",
                  borderRadius: 20,
                  padding: "24px 32px",
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  boxShadow: isCurrent
                    ? `0 20px 50px ${theme.shadow}, 0 0 0 1px ${accentColor}30`
                    : `0 8px 24px ${theme.shadow}`,
                  border: isCurrent ? `2px solid ${accentColor}40` : `1px solid ${theme.border}`,
                  backdropFilter: "blur(10px)",
                }}
              >
                {/* Rank badge */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: isCurrent
                      ? `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`
                      : theme.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: isCurrent ? `0 8px 20px ${accentColor}35` : "none",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 900,
                      color: isCurrent ? "#fff" : theme.textMuted,
                    }}
                  >
                    {String(choice.no).padStart(2, "0")}
                  </span>
                </div>

                {/* Tag */}
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: isCurrent ? `${accentColor}15` : theme.bg,
                    border: `1px solid ${isCurrent ? accentColor + "30" : theme.border}`,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: isCurrent ? accentColor : theme.textMuted,
                      letterSpacing: 1,
                    }}
                  >
                    {tag}
                  </span>
                </div>

                {/* College */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: isCurrent ? 20 : 17,
                      fontWeight: 700,
                      color: isCurrent ? theme.text : theme.textMuted,
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {collegeName}
                  </p>
                </div>

                {/* Divider */}
                <div
                  style={{
                    width: 2,
                    height: 36,
                    borderRadius: 1,
                    background: isCurrent ? `${accentColor}30` : theme.border,
                  }}
                />

                {/* Program */}
                <div style={{ flex: 0.8, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: isCurrent ? 16 : 14,
                      fontWeight: 600,
                      color: isCurrent ? accentColor : theme.textMuted,
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
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

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 60,
          right: 60,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 6,
            background: theme.border,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((currentIndex + 1) / 41) * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${theme.blue}, ${theme.purple})`,
              borderRadius: 3,
              boxShadow: `0 0 12px ${theme.blue}50`,
            }}
          />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: theme.textMuted, minWidth: 50 }}>
          {Math.round(((currentIndex + 1) / 41) * 100)}%
        </span>
      </div>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          display: "flex",
          gap: 20,
        }}
      >
        {[
          { tag: "IIT", color: theme.blue },
          { tag: "NIT", color: theme.green },
          { tag: "GFTI", color: theme.pink },
        ].map((item) => (
          <div key={item.tag} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: item.color,
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted }}>
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
