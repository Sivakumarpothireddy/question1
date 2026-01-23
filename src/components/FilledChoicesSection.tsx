import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { filledChoices } from "../data";

const SUBSECTION_DURATION = 600; // 10 seconds at 60fps
const CHOICES_PER_SUBSECTION = 3;
const ROW_HEIGHT = 130; // Height of each row

// Flowing particles
const FlowingParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const x = (i * 47 + 12) % 100;
    const baseY = ((frame * 1.0 + i * 70) % 1300) - 50;
    const size = 2 + (i % 3) * 2;
    const color = [colors.neonBlue, colors.neonPink, colors.neonPurple][i % 3];
    return { x, y: baseY / 12, size, color };
  });

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size * 3,
            borderRadius: "50%",
            background: `linear-gradient(to bottom, ${p.color}60, transparent)`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </>
  );
};

// Single row component
const ChoiceRow: React.FC<{
  choice: { no: number; institute: string; program: string };
  isHighlighted: boolean;
  frame: number;
}> = ({ choice, isHighlighted, frame }) => {
  // Glow pulse for highlighted
  const glowPulse = isHighlighted ? 0.5 + Math.sin((frame + choice.no * 12) * 0.04) * 0.4 : 0;

  // Colors
  const getColor = (inst: string) => {
    if (inst.includes("Indian Institute of Technology")) return colors.neonBlue;
    if (inst.includes("National Institute of Technology")) return colors.neonGreen;
    return colors.neonPink;
  };

  const getTag = (inst: string) => {
    if (inst.includes("Indian Institute of Technology")) return "IIT";
    if (inst.includes("National Institute of Technology")) return "NIT";
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

  const color = getColor(choice.institute);
  const tag = getTag(choice.institute);
  const barWidth = Math.max(35, 100 - choice.no * 1.5);

  return (
    <div
      style={{
        height: ROW_HEIGHT,
        padding: "10px 0",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          flex: 1,
          background: isHighlighted
            ? `linear-gradient(135deg, rgba(25,25,50,0.95), rgba(35,25,55,0.95))`
            : `linear-gradient(135deg, rgba(15,15,28,0.5), rgba(20,15,32,0.5))`,
          border: `2px solid ${isHighlighted ? color + "70" : "rgba(255,255,255,0.06)"}`,
          borderRadius: "14px",
          padding: isHighlighted ? "16px 20px" : "12px 16px",
          position: "relative",
          overflow: "hidden",
          transform: isHighlighted ? "scale(1)" : "scale(0.95)",
          opacity: isHighlighted ? 1 : 0.45,
          boxShadow: isHighlighted
            ? `0 0 ${30 * glowPulse}px ${color}30, 0 10px 40px rgba(0,0,0,0.4)`
            : "0 5px 20px rgba(0,0,0,0.2)",
          transition: "transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Animated border for highlighted */}
        {isHighlighted && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "14px",
              padding: "2px",
              background: `conic-gradient(from ${frame * 2}deg, ${color}, ${colors.neonPurple}, ${color})`,
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              opacity: 0.5,
            }}
          />
        )}

        {/* Shine sweep for highlighted */}
        {isHighlighted && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${((frame * 2) % 400) - 100}%`,
              width: "80px",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              transform: "skewX(-20deg)",
            }}
          />
        )}

        {/* Row content */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative", zIndex: 1 }}>
          {/* Rank */}
          <div style={{ position: "relative", width: isHighlighted ? "60px" : "45px", height: isHighlighted ? "60px" : "45px", flexShrink: 0 }}>
            {isHighlighted && (
              <>
                <svg width="60" height="60" style={{ position: "absolute", transform: `rotate(${frame * 2}deg)` }}>
                  <circle cx="30" cy="30" r="28" fill="none" stroke={color} strokeWidth="2" strokeDasharray="5 3" opacity="0.7" />
                </svg>
                <svg width="60" height="60" style={{ position: "absolute", transform: `rotate(${-frame * 1.5}deg)` }}>
                  <circle cx="30" cy="30" r="22" fill="none" stroke={colors.neonPurple} strokeWidth="1.5" strokeDasharray="8 4" opacity="0.5" />
                </svg>
              </>
            )}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div
                style={{
                  fontSize: isHighlighted ? "24px" : "16px",
                  fontWeight: "900",
                  color: isHighlighted ? colors.white : colors.textMuted,
                  textShadow: isHighlighted ? `0 0 15px ${color}` : "none",
                  lineHeight: 1,
                }}
              >
                {String(choice.no).padStart(2, "0")}
              </div>
              {isHighlighted && (
                <div style={{ fontSize: "7px", fontWeight: "700", color, letterSpacing: "1px", marginTop: "2px" }}>RANK</div>
              )}
            </div>
          </div>

          {/* College */}
          <div style={{ flex: 1.3, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
              <div
                style={{
                  background: isHighlighted ? color : `${color}40`,
                  color: isHighlighted ? "#000" : colors.textMuted,
                  padding: isHighlighted ? "3px 8px" : "2px 6px",
                  borderRadius: "4px",
                  fontSize: isHighlighted ? "9px" : "8px",
                  fontWeight: "800",
                  boxShadow: isHighlighted ? `0 0 8px ${color}40` : "none",
                }}
              >
                {tag}
              </div>
              <span style={{ fontSize: "8px", color: colors.textMuted }}>COLLEGE</span>
            </div>
            <div
              style={{
                fontSize: isHighlighted ? "15px" : "12px",
                fontWeight: isHighlighted ? "700" : "500",
                color: isHighlighted ? colors.white : colors.textMuted,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {instituteShort}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              width: "2px",
              height: isHighlighted ? "40px" : "28px",
              background: isHighlighted
                ? `linear-gradient(to bottom, transparent, ${color}, transparent)`
                : "rgba(255,255,255,0.06)",
              boxShadow: isHighlighted ? `0 0 6px ${color}40` : "none",
            }}
          />

          {/* Program */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: "3px" }}>
              <span style={{ fontSize: "8px", color: colors.textMuted }}>PROGRAM</span>
            </div>
            <div
              style={{
                fontSize: isHighlighted ? "13px" : "10px",
                fontWeight: "600",
                color: isHighlighted ? color : colors.textMuted,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {programShort}
            </div>
          </div>

          {/* Priority bar - only for highlighted */}
          {isHighlighted && (
            <div style={{ width: "85px", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "7px", color: colors.textMuted }}>PRIORITY</span>
                <span style={{ fontSize: "10px", fontWeight: "800", color }}>{Math.round(barWidth)}%</span>
              </div>
              <div style={{ height: "5px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${color}, ${colors.neonPurple})`,
                    borderRadius: "3px",
                    boxShadow: `0 0 8px ${color}`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Header
const Header: React.FC<{ frame: number; currentSection: number; highlightStart: number; highlightEnd: number; total: number }> = ({
  frame, currentSection, highlightStart, highlightEnd, total
}) => {
  return (
    <div style={{ padding: "0 50px", marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Section badge */}
          <div style={{ position: "relative", width: "65px", height: "65px" }}>
            <svg width="65" height="65" style={{ position: "absolute", transform: `rotate(${frame}deg)` }}>
              <circle cx="32.5" cy="32.5" r="30" fill="none" stroke={`${colors.neonPink}30`} strokeWidth="1" strokeDasharray="4 3" />
            </svg>
            <svg width="65" height="65" style={{ position: "absolute", transform: `rotate(${-frame * 0.6}deg)` }}>
              <circle cx="32.5" cy="32.5" r="24" fill="none" stroke={`${colors.neonPurple}50`} strokeWidth="2" strokeDasharray="6 3" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "7px", color: colors.textMuted, letterSpacing: "1px" }}>SECTION</span>
              <span style={{ fontSize: "20px", fontWeight: "900", color: colors.neonPink, textShadow: `0 0 10px ${colors.neonPink}` }}>
                {String(currentSection + 1).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "900", color: colors.white, margin: 0 }}>FILLED CHOICES</h1>
            <p style={{ fontSize: "12px", color: colors.textMuted, margin: "3px 0 0 2px" }}>
              Viewing <span style={{ color: colors.neonPink, fontWeight: "700" }}>{highlightStart + 1}-{highlightEnd}</span> of {total}
            </p>
          </div>
        </div>

        {/* Progress circle */}
        <div style={{ position: "relative", width: "55px", height: "55px" }}>
          <svg width="55" height="55" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="27.5" cy="27.5" r="23" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            <circle
              cx="27.5"
              cy="27.5"
              r="23"
              fill="none"
              stroke={colors.neonPink}
              strokeWidth="4"
              strokeDasharray={`${((currentSection + 1) / 14) * 145} 145`}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 4px ${colors.neonPink})` }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: colors.white }}>
            {Math.round(((currentSection + 1) / 14) * 100)}%
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div style={{ marginTop: "15px", height: "2px", background: `linear-gradient(90deg, transparent, ${colors.neonPink}40, ${colors.neonPurple}40, transparent)`, position: "relative" }}>
        <div style={{ position: "absolute", top: "-2px", left: `${(frame * 0.5) % 100}%`, width: "50px", height: "6px", background: `radial-gradient(ellipse, ${colors.white} 0%, transparent 70%)` }} />
      </div>
    </div>
  );
};

export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate current position in the scroll
  const totalFrames = SUBSECTION_DURATION * 14; // Total duration for all sections
  const currentSubsection = Math.floor(frame / SUBSECTION_DURATION);
  const frameInSubsection = frame % SUBSECTION_DURATION;

  // Smooth scroll position - scrolls continuously
  const baseScrollPosition = currentSubsection * CHOICES_PER_SUBSECTION * ROW_HEIGHT;

  // Add smooth transition at the end of each section
  const transitionStart = SUBSECTION_DURATION - 90; // Start transition 1.5s before end
  const transitionProgress = frameInSubsection >= transitionStart
    ? spring({
        frame: frameInSubsection - transitionStart,
        fps,
        config: { damping: 25, stiffness: 50, mass: 1 },
      })
    : 0;

  const scrollOffset = baseScrollPosition + (transitionProgress * CHOICES_PER_SUBSECTION * ROW_HEIGHT);

  // Which items are highlighted
  const highlightStartIndex = currentSubsection * CHOICES_PER_SUBSECTION;
  const highlightEndIndex = Math.min(highlightStartIndex + CHOICES_PER_SUBSECTION, filledChoices.choices.length);

  // Center position for the viewport
  const viewportCenterY = 350; // Where the highlighted items should be centered
  const listTopOffset = viewportCenterY - ROW_HEIGHT * 1.5 - scrollOffset;

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse at 20% 10%, ${colors.neonPurple}12 0%, transparent 50%),
          radial-gradient(ellipse at 80% 90%, ${colors.neonBlue}10 0%, transparent 50%),
          linear-gradient(180deg, #030308 0%, #060510 50%, #090812 100%)
        `,
        overflow: "hidden",
      }}
    >
      {/* Scrolling grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage: `linear-gradient(0deg, ${colors.neonPurple}60 1px, transparent 1px)`,
          backgroundSize: "100% 65px",
          backgroundPosition: `0 ${(frame * 1.2) % 65}px`,
          maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        }}
      />

      {/* Particles */}
      <FlowingParticles frame={frame} />

      {/* Side accents */}
      <div style={{ position: "absolute", left: 0, top: "10%", width: "3px", height: "80%", background: `linear-gradient(to bottom, transparent, ${colors.neonPink}40, transparent)`, filter: "blur(5px)" }} />
      <div style={{ position: "absolute", right: 0, top: "20%", width: "3px", height: "60%", background: `linear-gradient(to bottom, transparent, ${colors.neonBlue}40, transparent)`, filter: "blur(5px)" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", paddingTop: "30px" }}>
        <Header
          frame={frame}
          currentSection={currentSubsection}
          highlightStart={highlightStartIndex}
          highlightEnd={highlightEndIndex}
          total={filledChoices.totalChoices}
        />

        {/* Scrolling table container */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            maskImage: "linear-gradient(to bottom, transparent 2%, black 12%, black 88%, transparent 98%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 2%, black 12%, black 88%, transparent 98%)",
          }}
        >
          {/* The scrolling list */}
          <div
            style={{
              position: "absolute",
              left: "50px",
              right: "50px",
              top: listTopOffset,
            }}
          >
            {filledChoices.choices.map((choice, idx) => {
              const isHighlighted = idx >= highlightStartIndex && idx < highlightEndIndex;

              return (
                <ChoiceRow
                  key={choice.no}
                  choice={choice}
                  isHighlighted={isHighlighted}
                  frame={frame}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: "30px", padding: "12px 0 20px" }}>
          {[
            { label: "IIT", count: filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length, color: colors.neonBlue },
            { label: "NIT", count: filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length, color: colors.neonGreen },
            { label: "GFTI", count: filledChoices.totalChoices - filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length - filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length, color: colors.neonPink },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
              <span style={{ fontSize: "10px", color: colors.textMuted }}>{item.label}</span>
              <span style={{ fontSize: "14px", fontWeight: "800", color: item.color }}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll down indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "70px",
          left: "50%",
          transform: `translateX(-50%) translateY(${Math.sin(frame * 0.08) * 6}px)`,
          opacity: 0.4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "14px",
              height: "14px",
              borderRight: `2px solid ${colors.neonPink}`,
              borderBottom: `2px solid ${colors.neonPink}`,
              transform: "rotate(45deg)",
              opacity: 1 - i * 0.3,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
