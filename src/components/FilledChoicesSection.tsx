import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { filledChoices } from "../data";

const SUBSECTION_DURATION = 600;
const CHOICES_PER_SUBSECTION = 3;
const TOTAL_SUBSECTIONS = 14;

// Animated particles flowing downward
const FlowingParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const particles = Array.from({ length: 30 }).map((_, i) => {
    const x = (i * 37 + 10) % 100;
    const baseY = ((frame * 1.5 + i * 80) % 1200) - 100;
    const size = 3 + (i % 4) * 2;
    const opacity = 0.3 + (i % 3) * 0.2;
    const color = [colors.neonBlue, colors.neonPink, colors.neonPurple, colors.neonGreen][i % 4];

    return { x, y: baseY / 10, size, opacity, color };
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
            background: `linear-gradient(to bottom, ${p.color}, transparent)`,
            opacity: p.opacity,
            filter: "blur(1px)",
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
};

// Scrolling grid lines
const ScrollingGrid: React.FC<{ frame: number }> = ({ frame }) => {
  const offset = (frame * 2) % 80;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.08,
        backgroundImage: `
          linear-gradient(0deg, ${colors.neonPurple}40 1px, transparent 1px)
        `,
        backgroundSize: "100% 80px",
        backgroundPosition: `0 ${offset}px`,
        maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        pointerEvents: "none",
      }}
    />
  );
};

// Down arrow indicator
const ScrollIndicator: React.FC<{ frame: number }> = ({ frame }) => {
  const bounce = Math.sin(frame * 0.1) * 10;
  const opacity = 0.5 + Math.sin(frame * 0.08) * 0.3;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "30px",
        left: "50%",
        transform: `translateX(-50%) translateY(${bounce}px)`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: "20px",
            height: "20px",
            borderRight: `3px solid ${colors.neonPink}`,
            borderBottom: `3px solid ${colors.neonPink}`,
            transform: "rotate(45deg)",
            opacity: 1 - i * 0.3,
            boxShadow: `2px 2px 10px ${colors.neonPink}50`,
          }}
        />
      ))}
    </div>
  );
};

// Choice card component
const ChoiceCard: React.FC<{
  choice: { no: number; institute: string; program: string };
  isHighlighted: boolean;
  position: "above" | "current" | "below";
  index: number;
  frame: number;
  fps: number;
  scrollProgress: number;
}> = ({ choice, isHighlighted, position, index, frame, fps, scrollProgress }) => {
  // Calculate vertical position based on scroll
  const baseY = position === "above" ? -120 : position === "below" ? 120 : 0;
  const scrollOffset = scrollProgress * 150;

  // Entry animation
  const entryDelay = position === "above" ? 0 : position === "current" ? 5 + index * 10 : 35;
  const entrySpring = spring({
    frame: frame - entryDelay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Scale and opacity based on highlight status
  const targetScale = isHighlighted ? 1 : 0.85;
  const targetOpacity = isHighlighted ? 1 : 0.4;
  const scale = interpolate(entrySpring, [0, 1], [0.5, targetScale]);
  const opacity = interpolate(entrySpring, [0, 1], [0, targetOpacity]);

  // 3D rotation for highlighted cards
  const rotateX = isHighlighted ? interpolate(entrySpring, [0, 1], [30, 0]) : 0;
  const translateZ = isHighlighted ? interpolate(entrySpring, [0, 1], [-100, 0]) : -50;

  // Floating animation for highlighted
  const floatY = isHighlighted ? Math.sin((frame + index * 30) * 0.03) * 4 : 0;
  const floatX = isHighlighted ? Math.cos((frame + index * 20) * 0.02) * 2 : 0;

  // Glow pulse for highlighted
  const glowPulse = isHighlighted ? 0.6 + Math.sin((frame + index * 15) * 0.05) * 0.4 : 0.2;

  // Color functions
  const getColor = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) return colors.neonBlue;
    if (institute.includes("National Institute of Technology")) return colors.neonGreen;
    return colors.neonPink;
  };

  const getTag = (institute: string): string => {
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

  const color = getColor(choice.institute);
  const tag = getTag(choice.institute);

  // Animated counter for highlighted
  const counterProgress = isHighlighted
    ? spring({ frame: frame - entryDelay - 15, fps, config: { damping: 20, stiffness: 50 } })
    : 1;
  const displayNumber = isHighlighted
    ? Math.round(interpolate(counterProgress, [0, 1], [0, choice.no]))
    : choice.no;

  // Bar animation
  const barProgress = isHighlighted
    ? spring({ frame: frame - entryDelay - 20, fps, config: { damping: 12, stiffness: 60 } })
    : 1;
  const barWidth = Math.max(35, 100 - choice.no * 1.5);

  // Shine effect
  const shinePos = isHighlighted ? ((frame - entryDelay) * 2) % 400 - 100 : -200;

  return (
    <div
      style={{
        perspective: "1500px",
        marginBottom: isHighlighted ? "20px" : "12px",
      }}
    >
      <div
        style={{
          transform: `
            translateY(${floatY}px)
            translateX(${floatX}px)
            rotateX(${rotateX}deg)
            translateZ(${translateZ}px)
            scale(${scale})
          `,
          opacity,
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Glow effect for highlighted */}
        {isHighlighted && (
          <div
            style={{
              position: "absolute",
              inset: "-15px",
              background: `radial-gradient(ellipse at center, ${color}25 0%, transparent 70%)`,
              filter: "blur(15px)",
              opacity: glowPulse,
              borderRadius: "30px",
            }}
          />
        )}

        {/* Card */}
        <div
          style={{
            background: isHighlighted
              ? `linear-gradient(135deg, rgba(25,25,45,0.95) 0%, rgba(35,25,50,0.95) 100%)`
              : `linear-gradient(135deg, rgba(15,15,25,0.7) 0%, rgba(20,15,30,0.7) 100%)`,
            backdropFilter: "blur(20px)",
            border: `2px solid ${isHighlighted ? color + "70" : "rgba(255,255,255,0.1)"}`,
            borderRadius: "16px",
            padding: isHighlighted ? "20px 24px" : "14px 20px",
            position: "relative",
            overflow: "hidden",
            boxShadow: isHighlighted
              ? `0 0 ${40 * glowPulse}px ${color}30, 0 20px 50px rgba(0,0,0,0.4)`
              : "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          {/* Animated border for highlighted */}
          {isHighlighted && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "16px",
                padding: "2px",
                background: `conic-gradient(from ${frame * 3}deg, ${color}, ${colors.neonPurple}, ${color})`,
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                opacity: 0.6,
              }}
            />
          )}

          {/* Shine sweep */}
          {isHighlighted && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${shinePos}%`,
                width: "80px",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                transform: "skewX(-20deg)",
              }}
            />
          )}

          {/* Content - Side by Side Layout */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative", zIndex: 1 }}>
            {/* Rank */}
            <div style={{ position: "relative", width: isHighlighted ? "70px" : "50px", height: isHighlighted ? "70px" : "50px", flexShrink: 0 }}>
              {/* Spinning rings for highlighted */}
              {isHighlighted && (
                <>
                  <svg
                    width="70"
                    height="70"
                    style={{ position: "absolute", transform: `rotate(${frame * 2}deg)` }}
                  >
                    <circle cx="35" cy="35" r="32" fill="none" stroke={color} strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
                  </svg>
                  <svg
                    width="70"
                    height="70"
                    style={{ position: "absolute", transform: `rotate(${-frame * 1.5}deg)` }}
                  >
                    <circle cx="35" cy="35" r="26" fill="none" stroke={colors.neonPurple} strokeWidth="1.5" strokeDasharray="10 6" opacity="0.5" />
                  </svg>
                </>
              )}

              {/* Number */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontSize: isHighlighted ? "28px" : "18px",
                    fontWeight: "900",
                    color: isHighlighted ? colors.white : colors.textMuted,
                    textShadow: isHighlighted ? `0 0 20px ${color}` : "none",
                    lineHeight: 1,
                  }}
                >
                  {String(displayNumber).padStart(2, "0")}
                </div>
                {isHighlighted && (
                  <div style={{ fontSize: "8px", fontWeight: "700", color, letterSpacing: "1.5px", marginTop: "2px" }}>
                    RANK
                  </div>
                )}
              </div>
            </div>

            {/* College */}
            <div style={{ flex: 1.2, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <div
                  style={{
                    background: isHighlighted ? color : `${color}60`,
                    color: isHighlighted ? "#000" : colors.white,
                    padding: isHighlighted ? "4px 10px" : "2px 8px",
                    borderRadius: "5px",
                    fontSize: isHighlighted ? "10px" : "9px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                    boxShadow: isHighlighted ? `0 0 12px ${color}50` : "none",
                  }}
                >
                  {tag}
                </div>
                <span style={{ fontSize: "9px", color: colors.textMuted, letterSpacing: "0.5px" }}>COLLEGE</span>
              </div>
              <div
                style={{
                  fontSize: isHighlighted ? "17px" : "13px",
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
                height: isHighlighted ? "50px" : "35px",
                background: isHighlighted
                  ? `linear-gradient(to bottom, transparent, ${color}, transparent)`
                  : "rgba(255,255,255,0.1)",
                boxShadow: isHighlighted ? `0 0 8px ${color}50` : "none",
              }}
            />

            {/* Program */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ marginBottom: "4px" }}>
                <span style={{ fontSize: "9px", color: colors.textMuted, letterSpacing: "0.5px" }}>PROGRAM</span>
              </div>
              <div
                style={{
                  fontSize: isHighlighted ? "14px" : "11px",
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
              <div style={{ width: "100px", flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "8px", color: colors.textMuted, letterSpacing: "0.5px" }}>PRIORITY</span>
                  <span style={{ fontSize: "11px", fontWeight: "800", color }}>{Math.round(barWidth)}%</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${barWidth * barProgress}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${color}, ${colors.neonPurple})`,
                      borderRadius: "3px",
                      boxShadow: `0 0 10px ${color}`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Header component
const Header: React.FC<{ frame: number; fps: number; subsection: number; startIdx: number; endIdx: number; total: number }> = ({
  frame, fps, subsection, startIdx, endIdx, total
}) => {
  const headerSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });
  const titleY = interpolate(headerSpring, [0, 1], [-60, 0]);
  const titleOpacity = interpolate(headerSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        marginBottom: "30px",
        transform: `translateY(${titleY}px)`,
        opacity: titleOpacity,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Section badge */}
          <div style={{ position: "relative", width: "80px", height: "80px" }}>
            <svg width="80" height="80" style={{ position: "absolute", transform: `rotate(${frame}deg)` }}>
              <circle cx="40" cy="40" r="38" fill="none" stroke={`${colors.neonPink}30`} strokeWidth="1" strokeDasharray="4 4" />
            </svg>
            <svg width="80" height="80" style={{ position: "absolute", transform: `rotate(${-frame * 0.7}deg)` }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke={`${colors.neonPurple}50`} strokeWidth="2" strokeDasharray="8 4" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "9px", color: colors.textMuted, letterSpacing: "1px" }}>SECTION</span>
              <span style={{ fontSize: "26px", fontWeight: "900", color: colors.neonPink, textShadow: `0 0 15px ${colors.neonPink}` }}>
                {String(subsection + 1).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div>
            <h1 style={{ fontSize: "42px", fontWeight: "900", color: colors.white, margin: 0, letterSpacing: "-1px" }}>
              FILLED CHOICES
            </h1>
            <p style={{ fontSize: "14px", color: colors.textMuted, margin: "6px 0 0 2px" }}>
              Scrolling through choices{" "}
              <span style={{ color: colors.neonPink, fontWeight: "700" }}>{startIdx + 1}-{endIdx}</span>
              {" "}of {total}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div style={{ position: "relative", width: "70px", height: "70px" }}>
          <svg width="70" height="70" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="35" cy="35" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
            <circle
              cx="35"
              cy="35"
              r="30"
              fill="none"
              stroke={colors.neonPink}
              strokeWidth="5"
              strokeDasharray={`${((subsection + 1) / TOTAL_SUBSECTIONS) * 188} 188`}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 5px ${colors.neonPink})` }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: "800", color: colors.white }}>
              {Math.round(((subsection + 1) / TOTAL_SUBSECTIONS) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Animated line with moving dot */}
      <div style={{ marginTop: "20px", position: "relative", height: "2px" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent, ${colors.neonPink}40, ${colors.neonPurple}40, transparent)` }} />
        <div
          style={{
            position: "absolute",
            top: "-3px",
            left: `${(frame * 0.4) % 100}%`,
            width: "80px",
            height: "8px",
            background: `radial-gradient(ellipse, ${colors.white} 0%, transparent 70%)`,
            filter: "blur(1px)",
          }}
        />
      </div>
    </div>
  );
};

export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSubsection = Math.floor(frame / SUBSECTION_DURATION);
  const frameInSubsection = frame % SUBSECTION_DURATION;

  // Calculate scroll progress within subsection (for transition effect)
  const scrollProgress = interpolate(
    frameInSubsection,
    [0, 30, SUBSECTION_DURATION - 30, SUBSECTION_DURATION],
    [0, 0, 0, 1],
    { extrapolateRight: "clamp" }
  );

  const highlightStartIndex = currentSubsection * CHOICES_PER_SUBSECTION;
  const highlightEndIndex = Math.min(highlightStartIndex + CHOICES_PER_SUBSECTION, filledChoices.choices.length);

  // Get choices: 1 above, 3 highlighted, 1 below
  const aboveChoice = highlightStartIndex > 0 ? filledChoices.choices[highlightStartIndex - 1] : null;
  const highlightedChoices = filledChoices.choices.slice(highlightStartIndex, highlightEndIndex);
  const belowChoice = highlightEndIndex < filledChoices.choices.length ? filledChoices.choices[highlightEndIndex] : null;

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, ${colors.neonPurple}15 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, ${colors.neonBlue}12 0%, transparent 50%),
          linear-gradient(180deg, #030308 0%, #080510 50%, #0c0815 100%)
        `,
        overflow: "hidden",
      }}
    >
      {/* Scrolling grid background */}
      <ScrollingGrid frame={frame} />

      {/* Flowing particles */}
      <FlowingParticles frame={frame} />

      {/* Side glow effects */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "20%",
          width: "4px",
          height: "60%",
          background: `linear-gradient(to bottom, transparent, ${colors.neonPink}60, transparent)`,
          filter: "blur(8px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: "30%",
          width: "4px",
          height: "50%",
          background: `linear-gradient(to bottom, transparent, ${colors.neonBlue}60, transparent)`,
          filter: "blur(8px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "40px 60px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          frame={frameInSubsection}
          fps={fps}
          subsection={currentSubsection}
          startIdx={highlightStartIndex}
          endIdx={highlightEndIndex}
          total={filledChoices.totalChoices}
        />

        {/* Choices list with scroll effect */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Above choice (faded) */}
          {aboveChoice && (
            <ChoiceCard
              choice={aboveChoice}
              isHighlighted={false}
              position="above"
              index={0}
              frame={frameInSubsection}
              fps={fps}
              scrollProgress={scrollProgress}
            />
          )}

          {/* Highlighted choices */}
          {highlightedChoices.map((choice, idx) => (
            <ChoiceCard
              key={`${currentSubsection}-${choice.no}`}
              choice={choice}
              isHighlighted={true}
              position="current"
              index={idx}
              frame={frameInSubsection}
              fps={fps}
              scrollProgress={scrollProgress}
            />
          ))}

          {/* Below choice (faded) */}
          {belowChoice && (
            <ChoiceCard
              choice={belowChoice}
              isHighlighted={false}
              position="below"
              index={0}
              frame={frameInSubsection}
              fps={fps}
              scrollProgress={scrollProgress}
            />
          )}
        </div>

        {/* Bottom stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: "40px", paddingTop: "10px" }}>
          {[
            { label: "IIT", count: filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length, color: colors.neonBlue },
            { label: "NIT", count: filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length, color: colors.neonGreen },
            { label: "GFTI", count: filledChoices.totalChoices - filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length - filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length, color: colors.neonPink },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: item.color,
                  boxShadow: `0 0 10px ${item.color}`,
                }}
              />
              <span style={{ fontSize: "12px", color: colors.textMuted }}>{item.label}</span>
              <span style={{ fontSize: "16px", fontWeight: "800", color: item.color }}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator frame={frame} />
    </AbsoluteFill>
  );
};
