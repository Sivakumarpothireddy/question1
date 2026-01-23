import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { filledChoices } from "../data";

const SUBSECTION_DURATION = 600; // 10 seconds at 60fps
const CHOICES_PER_SUBSECTION = 3;
const SCROLL_TRANSITION_FRAMES = 60; // 1 second for scroll animation
const CARD_HEIGHT = 140; // Height of each card including margin

// Flowing particles
const FlowingParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const particles = Array.from({ length: 25 }).map((_, i) => {
    const x = (i * 41 + 15) % 100;
    const baseY = ((frame * 1.2 + i * 60) % 1400) - 100;
    const size = 2 + (i % 4) * 2;
    const opacity = 0.2 + (i % 3) * 0.15;
    const color = [colors.neonBlue, colors.neonPink, colors.neonPurple][i % 3];
    return { x, y: baseY / 12, size, opacity, color };
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
            height: p.size * 4,
            borderRadius: "50%",
            background: `linear-gradient(to bottom, ${p.color}, transparent)`,
            opacity: p.opacity,
            filter: "blur(1px)",
          }}
        />
      ))}
    </>
  );
};

// Choice card component
const ChoiceCard: React.FC<{
  choice: { no: number; institute: string; program: string };
  isHighlighted: boolean;
  yOffset: number;
  frame: number;
  fps: number;
  entryDelay: number;
}> = ({ choice, isHighlighted, yOffset, frame, fps, entryDelay }) => {
  // Entry animation
  const entrySpring = spring({
    frame: frame - entryDelay,
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  const entryScale = interpolate(entrySpring, [0, 1], [0.8, isHighlighted ? 1 : 0.88]);
  const entryOpacity = interpolate(entrySpring, [0, 1], [0, isHighlighted ? 1 : 0.35]);
  const entryX = interpolate(entrySpring, [0, 1], [isHighlighted ? -80 : -40, 0]);

  // Floating for highlighted
  const floatY = isHighlighted ? Math.sin((frame + choice.no * 20) * 0.025) * 4 : 0;
  const glowPulse = isHighlighted ? 0.6 + Math.sin((frame + choice.no * 15) * 0.04) * 0.4 : 0;

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

  // Bar animation for highlighted
  const barProgress = isHighlighted
    ? spring({ frame: frame - entryDelay - 20, fps, config: { damping: 15, stiffness: 70 } })
    : 1;
  const barWidth = Math.max(35, 100 - choice.no * 1.5);

  // Shine
  const shinePos = isHighlighted ? ((frame - entryDelay) * 1.8) % 350 - 80 : -200;

  return (
    <div
      style={{
        position: "absolute",
        left: "60px",
        right: "60px",
        top: yOffset,
        transform: `translateX(${entryX}px) translateY(${floatY}px) scale(${entryScale})`,
        opacity: entryOpacity,
        transition: "opacity 0.1s ease",
      }}
    >
      {/* Glow */}
      {isHighlighted && (
        <div
          style={{
            position: "absolute",
            inset: "-12px",
            background: `radial-gradient(ellipse, ${color}20 0%, transparent 70%)`,
            filter: "blur(15px)",
            opacity: glowPulse,
            borderRadius: "28px",
          }}
        />
      )}

      {/* Card */}
      <div
        style={{
          background: isHighlighted
            ? `linear-gradient(135deg, rgba(22,22,42,0.95), rgba(32,22,48,0.95))`
            : `linear-gradient(135deg, rgba(12,12,22,0.6), rgba(18,12,28,0.6))`,
          backdropFilter: "blur(15px)",
          border: `2px solid ${isHighlighted ? color + "60" : "rgba(255,255,255,0.08)"}`,
          borderRadius: "16px",
          padding: isHighlighted ? "18px 22px" : "12px 18px",
          position: "relative",
          overflow: "hidden",
          boxShadow: isHighlighted
            ? `0 0 ${35 * glowPulse}px ${color}25, 0 15px 40px rgba(0,0,0,0.4)`
            : "0 8px 25px rgba(0,0,0,0.2)",
        }}
      >
        {/* Animated border */}
        {isHighlighted && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "16px",
              padding: "2px",
              background: `conic-gradient(from ${frame * 2.5}deg, ${color}, ${colors.neonPurple}, ${color})`,
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              opacity: 0.5,
            }}
          />
        )}

        {/* Shine */}
        {isHighlighted && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${shinePos}%`,
              width: "70px",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              transform: "skewX(-20deg)",
            }}
          />
        )}

        {/* Content */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px", position: "relative", zIndex: 1 }}>
          {/* Rank */}
          <div style={{ position: "relative", width: isHighlighted ? "65px" : "45px", height: isHighlighted ? "65px" : "45px", flexShrink: 0 }}>
            {isHighlighted && (
              <>
                <svg width="65" height="65" style={{ position: "absolute", transform: `rotate(${frame * 2}deg)` }}>
                  <circle cx="32.5" cy="32.5" r="30" fill="none" stroke={color} strokeWidth="2" strokeDasharray="5 4" opacity="0.7" />
                </svg>
                <svg width="65" height="65" style={{ position: "absolute", transform: `rotate(${-frame * 1.3}deg)` }}>
                  <circle cx="32.5" cy="32.5" r="24" fill="none" stroke={colors.neonPurple} strokeWidth="1.5" strokeDasharray="8 5" opacity="0.5" />
                </svg>
              </>
            )}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: isHighlighted ? "26px" : "16px", fontWeight: "900", color: isHighlighted ? colors.white : colors.textMuted, textShadow: isHighlighted ? `0 0 18px ${color}` : "none", lineHeight: 1 }}>
                {String(choice.no).padStart(2, "0")}
              </div>
              {isHighlighted && <div style={{ fontSize: "7px", fontWeight: "700", color, letterSpacing: "1.5px", marginTop: "2px" }}>RANK</div>}
            </div>
          </div>

          {/* College */}
          <div style={{ flex: 1.2, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
              <div style={{ background: isHighlighted ? color : `${color}50`, color: isHighlighted ? "#000" : colors.white, padding: isHighlighted ? "3px 9px" : "2px 7px", borderRadius: "4px", fontSize: isHighlighted ? "9px" : "8px", fontWeight: "800", boxShadow: isHighlighted ? `0 0 10px ${color}40` : "none" }}>
                {tag}
              </div>
              <span style={{ fontSize: "8px", color: colors.textMuted }}>COLLEGE</span>
            </div>
            <div style={{ fontSize: isHighlighted ? "16px" : "12px", fontWeight: isHighlighted ? "700" : "500", color: isHighlighted ? colors.white : colors.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {instituteShort}
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: "2px", height: isHighlighted ? "45px" : "30px", background: isHighlighted ? `linear-gradient(to bottom, transparent, ${color}, transparent)` : "rgba(255,255,255,0.08)", boxShadow: isHighlighted ? `0 0 6px ${color}40` : "none" }} />

          {/* Program */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: "3px" }}><span style={{ fontSize: "8px", color: colors.textMuted }}>PROGRAM</span></div>
            <div style={{ fontSize: isHighlighted ? "13px" : "10px", fontWeight: "600", color: isHighlighted ? color : colors.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {programShort}
            </div>
          </div>

          {/* Priority bar */}
          {isHighlighted && (
            <div style={{ width: "90px", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "7px", color: colors.textMuted }}>PRIORITY</span>
                <span style={{ fontSize: "10px", fontWeight: "800", color }}>{Math.round(barWidth)}%</span>
              </div>
              <div style={{ height: "5px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${barWidth * barProgress}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${colors.neonPurple})`, borderRadius: "3px", boxShadow: `0 0 8px ${color}` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Header
const Header: React.FC<{ frame: number; fps: number; subsection: number; startIdx: number; endIdx: number; total: number }> = ({ frame, fps, subsection, startIdx, endIdx, total }) => {
  const headerSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });
  const titleY = interpolate(headerSpring, [0, 1], [-50, 0]);
  const titleOpacity = interpolate(headerSpring, [0, 1], [0, 1]);

  return (
    <div style={{ marginBottom: "25px", transform: `translateY(${titleY}px)`, opacity: titleOpacity, padding: "0 60px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{ position: "relative", width: "70px", height: "70px" }}>
            <svg width="70" height="70" style={{ position: "absolute", transform: `rotate(${frame}deg)` }}>
              <circle cx="35" cy="35" r="33" fill="none" stroke={`${colors.neonPink}30`} strokeWidth="1" strokeDasharray="4 4" />
            </svg>
            <svg width="70" height="70" style={{ position: "absolute", transform: `rotate(${-frame * 0.6}deg)` }}>
              <circle cx="35" cy="35" r="27" fill="none" stroke={`${colors.neonPurple}50`} strokeWidth="2" strokeDasharray="6 4" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "8px", color: colors.textMuted, letterSpacing: "1px" }}>SECTION</span>
              <span style={{ fontSize: "22px", fontWeight: "900", color: colors.neonPink, textShadow: `0 0 12px ${colors.neonPink}` }}>{String(subsection + 1).padStart(2, "0")}</span>
            </div>
          </div>
          <div>
            <h1 style={{ fontSize: "36px", fontWeight: "900", color: colors.white, margin: 0 }}>FILLED CHOICES</h1>
            <p style={{ fontSize: "13px", color: colors.textMuted, margin: "4px 0 0 2px" }}>
              Viewing <span style={{ color: colors.neonPink, fontWeight: "700" }}>{startIdx + 1}-{endIdx}</span> of {total}
            </p>
          </div>
        </div>
        <div style={{ position: "relative", width: "60px", height: "60px" }}>
          <svg width="60" height="60" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            <circle cx="30" cy="30" r="26" fill="none" stroke={colors.neonPink} strokeWidth="4" strokeDasharray={`${((subsection + 1) / 14) * 163} 163`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${colors.neonPink})` }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", color: colors.white }}>{Math.round(((subsection + 1) / 14) * 100)}%</div>
        </div>
      </div>
      <div style={{ marginTop: "15px", height: "2px", background: `linear-gradient(90deg, transparent, ${colors.neonPink}40, ${colors.neonPurple}40, transparent)`, position: "relative" }}>
        <div style={{ position: "absolute", top: "-2px", left: `${(frame * 0.4) % 100}%`, width: "60px", height: "6px", background: `radial-gradient(ellipse, ${colors.white} 0%, transparent 70%)`, filter: "blur(1px)" }} />
      </div>
    </div>
  );
};

export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSubsection = Math.floor(frame / SUBSECTION_DURATION);
  const frameInSubsection = frame % SUBSECTION_DURATION;

  // Calculate scroll offset for smooth transition
  const scrollTransitionStart = SUBSECTION_DURATION - SCROLL_TRANSITION_FRAMES;
  const isScrolling = frameInSubsection >= scrollTransitionStart;

  const scrollProgress = isScrolling
    ? spring({
        frame: frameInSubsection - scrollTransitionStart,
        fps,
        config: { damping: 20, stiffness: 60 },
      })
    : 0;

  // Current scroll offset in pixels
  const scrollOffset = scrollProgress * CARD_HEIGHT * CHOICES_PER_SUBSECTION;

  const highlightStartIndex = currentSubsection * CHOICES_PER_SUBSECTION;
  const highlightEndIndex = Math.min(highlightStartIndex + CHOICES_PER_SUBSECTION, filledChoices.choices.length);

  // Determine which choices to show (need more context for scrolling)
  const startShowIndex = Math.max(0, highlightStartIndex - 1);
  const endShowIndex = Math.min(filledChoices.choices.length, highlightEndIndex + 2);
  const visibleChoices = filledChoices.choices.slice(startShowIndex, endShowIndex);

  // Calculate base Y position for the list
  const listStartY = 180;

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse at 25% 15%, ${colors.neonPurple}12 0%, transparent 50%),
          radial-gradient(ellipse at 75% 85%, ${colors.neonBlue}10 0%, transparent 50%),
          linear-gradient(180deg, #030308 0%, #070510 50%, #0a0814 100%)
        `,
        overflow: "hidden",
      }}
    >
      {/* Background grid scrolling down */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage: `linear-gradient(0deg, ${colors.neonPurple}50 1px, transparent 1px)`,
          backgroundSize: "100% 70px",
          backgroundPosition: `0 ${(frame * 1.5) % 70}px`,
          maskImage: "linear-gradient(to bottom, transparent 5%, black 25%, black 75%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 5%, black 25%, black 75%, transparent 95%)",
        }}
      />

      {/* Particles */}
      <FlowingParticles frame={frame} />

      {/* Side glows */}
      <div style={{ position: "absolute", left: 0, top: "15%", width: "3px", height: "70%", background: `linear-gradient(to bottom, transparent, ${colors.neonPink}50, transparent)`, filter: "blur(6px)" }} />
      <div style={{ position: "absolute", right: 0, top: "25%", width: "3px", height: "55%", background: `linear-gradient(to bottom, transparent, ${colors.neonBlue}50, transparent)`, filter: "blur(6px)" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", paddingTop: "35px" }}>
        <Header frame={frameInSubsection} fps={fps} subsection={currentSubsection} startIdx={highlightStartIndex} endIdx={highlightEndIndex} total={filledChoices.totalChoices} />

        {/* Scrolling list container */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            maskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
          }}
        >
          {/* The scrolling list */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              transform: `translateY(${-scrollOffset}px)`,
            }}
          >
            {visibleChoices.map((choice, idx) => {
              const globalIndex = startShowIndex + idx;
              const isHighlighted = globalIndex >= highlightStartIndex && globalIndex < highlightEndIndex;

              // Position each card
              const relativePosition = globalIndex - highlightStartIndex;
              const yPos = listStartY + (relativePosition + 1) * CARD_HEIGHT;

              // Entry delay based on position
              const entryDelay = isHighlighted ? 5 + (globalIndex - highlightStartIndex) * 8 : 0;

              return (
                <ChoiceCard
                  key={choice.no}
                  choice={choice}
                  isHighlighted={isHighlighted}
                  yOffset={yPos}
                  frame={frameInSubsection}
                  fps={fps}
                  entryDelay={entryDelay}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: "35px", padding: "15px 0 25px" }}>
          {[
            { label: "IIT", count: filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length, color: colors.neonBlue },
            { label: "NIT", count: filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length, color: colors.neonGreen },
            { label: "GFTI", count: filledChoices.totalChoices - filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length - filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length, color: colors.neonPink },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
              <span style={{ fontSize: "11px", color: colors.textMuted }}>{item.label}</span>
              <span style={{ fontSize: "15px", fontWeight: "800", color: item.color }}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          left: "50%",
          transform: `translateX(-50%) translateY(${Math.sin(frame * 0.08) * 8}px)`,
          opacity: 0.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "16px",
              height: "16px",
              borderRight: `2px solid ${colors.neonPink}`,
              borderBottom: `2px solid ${colors.neonPink}`,
              transform: "rotate(45deg)",
              opacity: 1 - i * 0.3,
              boxShadow: `1px 1px 8px ${colors.neonPink}40`,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
