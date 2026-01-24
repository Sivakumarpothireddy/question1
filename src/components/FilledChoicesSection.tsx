import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { filledChoices } from "../data";

const SUBSECTION_DURATION = 600; // 10 seconds at 60fps
const CHOICES_PER_SUBSECTION = 3;
const TOTAL_SUBSECTIONS = 14;

// ========== BACKGROUND ANIMATION COMPONENTS ==========

// Flowing grid lines
const FlowingGrid: React.FC<{ frame: number }> = ({ frame }) => {
  const lines = [];
  const gridSize = 100;
  const offset = (frame * 0.5) % gridSize;

  // Vertical lines
  for (let i = 0; i < 25; i++) {
    const x = i * gridSize - offset;
    const opacity = 0.03 + Math.sin(frame * 0.02 + i) * 0.02;
    lines.push(
      <div
        key={`v-${i}`}
        style={{
          position: "absolute",
          left: x,
          top: 0,
          bottom: 0,
          width: 1,
          background: `linear-gradient(180deg, transparent, ${colors.neonBlue}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}, transparent)`,
        }}
      />
    );
  }

  // Horizontal lines
  for (let i = 0; i < 15; i++) {
    const y = i * gridSize - offset * 0.5;
    const opacity = 0.03 + Math.cos(frame * 0.015 + i) * 0.02;
    lines.push(
      <div
        key={`h-${i}`}
        style={{
          position: "absolute",
          top: y,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${colors.neonPurple}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}, transparent)`,
        }}
      />
    );
  }

  return <>{lines}</>;
};

// Floating orbs
const FloatingOrbs: React.FC<{ frame: number }> = ({ frame }) => {
  const orbs = [
    { x: 10, y: 20, size: 400, color: colors.neonBlue, speed: 0.008 },
    { x: 80, y: 70, size: 350, color: colors.neonPurple, speed: 0.012 },
    { x: 50, y: 40, size: 300, color: colors.neonPink, speed: 0.01 },
    { x: 20, y: 80, size: 250, color: colors.neonGreen, speed: 0.015 },
  ];

  return (
    <>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${orb.x + Math.sin(frame * orb.speed + i) * 5}%`,
            top: `${orb.y + Math.cos(frame * orb.speed + i * 2) * 5}%`,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color}15 0%, transparent 70%)`,
            filter: "blur(60px)",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </>
  );
};

// Particle system
const Particles: React.FC<{ frame: number }> = ({ frame }) => {
  const particles = Array.from({ length: 40 }).map((_, i) => {
    const seed = i * 137.5;
    const x = (seed % 100);
    const baseY = ((seed * 3) % 100);
    const floatY = Math.sin(frame * 0.02 + i * 0.5) * 20;
    const floatX = Math.cos(frame * 0.015 + i * 0.7) * 10;
    const size = 2 + (i % 4);
    const opacity = 0.3 + Math.sin(frame * 0.03 + i) * 0.2;
    const particleColors = [colors.neonBlue, colors.neonPink, colors.neonPurple, colors.neonGreen];

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x + floatX / 5}%`,
          top: `${baseY + floatY / 5}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: particleColors[i % 4],
          opacity,
          boxShadow: `0 0 ${size * 2}px ${particleColors[i % 4]}`,
        }}
      />
    );
  });

  return <>{particles}</>;
};

// ========== CHOICE CARD COMPONENT ==========
const ChoiceCard: React.FC<{
  choice: { no: number; institute: string; program: string };
  isHighlighted: boolean;
  isAbove: boolean;
  isBelow: boolean;
  frame: number;
  fps: number;
  animationDelay: number;
  scrollProgress: number;
}> = ({ choice, isHighlighted, isAbove, isBelow, frame, fps, animationDelay, scrollProgress }) => {

  // Entry animation
  const entrySpring = spring({
    frame: Math.max(0, frame - animationDelay),
    fps,
    config: { damping: 20, stiffness: 120, mass: 0.8 },
  });

  // Determine card styling based on position
  const getCardStyle = () => {
    if (isHighlighted) {
      return {
        scale: 1,
        opacity: 1,
        y: 0,
        blur: 0,
      };
    }
    if (isAbove || isBelow) {
      return {
        scale: 0.92,
        opacity: 0.4,
        y: isAbove ? -10 : 10,
        blur: 2,
      };
    }
    return { scale: 0.85, opacity: 0.2, y: 0, blur: 4 };
  };

  const style = getCardStyle();

  // Floating animation for highlighted cards
  const floatY = isHighlighted ? Math.sin(frame * 0.04 + choice.no) * 3 : 0;

  // Color based on institute type
  const getAccentColor = () => {
    if (choice.institute.includes("Indian Institute of Technology")) return colors.neonBlue;
    if (choice.institute.includes("National Institute of Technology")) return colors.neonGreen;
    return colors.neonPink;
  };

  const getTag = () => {
    if (choice.institute.includes("Indian Institute of Technology")) return "IIT";
    if (choice.institute.includes("National Institute of Technology")) return "NIT";
    return "GFTI";
  };

  const accentColor = getAccentColor();
  const tag = getTag();

  // Shorten names for display
  const shortInstitute = choice.institute
    .replace("Indian Institute of Technology", "IIT")
    .replace("National Institute of Technology", "NIT")
    .replace("Maulana Azad National Institute of Technology", "MANIT")
    .replace("Shri G. S. Institute of Technology and Science", "SGSITS");

  const shortProgram = choice.program
    .replace("(4 Years, Bachelor of Technology)", "B.Tech")
    .replace("(5 Years, Bachelor and Master of Technology (Dual Degree))", "Dual Degree")
    .replace("(4 Years, Bachelor of Science)", "B.Sc")
    .replace("Electronics and Communication Engineering", "ECE")
    .replace("Electronics and Telecommunication Engineering", "ETC")
    .replace("Electrical and Electronics Engineering", "EEE")
    .replace("Computer Science and Engineering", "CSE")
    .replace("Artificial Intelligence and Data Science", "AI & DS")
    .replace("Artificial Intelligence", "AI")
    .replace("Data Science and Artificial Intelligence", "DS & AI")
    .replace("Mathematics and Computing", "Math & Computing")
    .replace("Statistics and Data Science", "Stats & DS")
    .replace("Chemical Engineering", "Chemical")
    .replace("Mechanical Engineering", "Mechanical")
    .replace("Civil Engineering", "Civil")
    .replace("Electrical Engineering", "Electrical");

  return (
    <div
      style={{
        transform: `scale(${style.scale * entrySpring}) translateY(${style.y + floatY}px)`,
        opacity: style.opacity * entrySpring,
        filter: style.blur > 0 ? `blur(${style.blur}px)` : "none",
        marginBottom: 16,
        transition: "transform 0.4s ease, opacity 0.4s ease, filter 0.4s ease",
      }}
    >
      <div
        style={{
          background: isHighlighted
            ? `linear-gradient(135deg, rgba(20, 20, 35, 0.95), rgba(30, 25, 45, 0.95))`
            : "rgba(15, 15, 25, 0.7)",
          border: isHighlighted
            ? `2px solid ${accentColor}60`
            : "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          padding: isHighlighted ? "24px 28px" : "18px 22px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          boxShadow: isHighlighted
            ? `0 0 40px ${accentColor}25, 0 15px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`
            : "0 5px 20px rgba(0,0,0,0.2)",
          backdropFilter: "blur(20px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated border glow for highlighted */}
        {isHighlighted && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              padding: 2,
              background: `conic-gradient(from ${frame * 2}deg, ${accentColor}, ${colors.neonPurple}, ${colors.neonPink}, ${accentColor})`,
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              opacity: 0.5,
            }}
          />
        )}

        {/* Shine effect */}
        {isHighlighted && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${((frame * 1.5) % 400) - 100}%`,
              width: 150,
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              transform: "skewX(-20deg)",
            }}
          />
        )}

        {/* Rank Badge */}
        <div
          style={{
            position: "relative",
            width: isHighlighted ? 70 : 56,
            height: isHighlighted ? 70 : 56,
            flexShrink: 0,
          }}
        >
          {/* Rotating ring for highlighted */}
          {isHighlighted && (
            <svg
              width="70"
              height="70"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `rotate(${frame * 1.5}deg)`,
              }}
            >
              <circle
                cx="35"
                cy="35"
                r="32"
                fill="none"
                stroke={accentColor}
                strokeWidth="2"
                strokeDasharray="10 5"
                opacity="0.6"
              />
            </svg>
          )}

          {/* Inner circle */}
          <div
            style={{
              position: "absolute",
              inset: isHighlighted ? 8 : 4,
              borderRadius: "50%",
              background: isHighlighted
                ? `linear-gradient(135deg, ${accentColor}, ${colors.neonPurple})`
                : "rgba(255, 255, 255, 0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isHighlighted ? `0 0 20px ${accentColor}50` : "none",
            }}
          >
            <span
              style={{
                fontSize: isHighlighted ? 22 : 18,
                fontWeight: 900,
                color: isHighlighted ? "#fff" : colors.textMuted,
                lineHeight: 1,
              }}
            >
              {String(choice.no).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Institute Type Badge */}
        <div
          style={{
            background: isHighlighted ? accentColor : `${accentColor}40`,
            color: isHighlighted ? colors.darkBg : colors.textMuted,
            padding: isHighlighted ? "6px 14px" : "4px 10px",
            borderRadius: 8,
            fontSize: isHighlighted ? 12 : 10,
            fontWeight: 800,
            letterSpacing: 1,
            flexShrink: 0,
            boxShadow: isHighlighted ? `0 0 15px ${accentColor}40` : "none",
          }}
        >
          {tag}
        </div>

        {/* College and Program - SIDE BY SIDE */}
        <div style={{ flex: 1, display: "flex", gap: 20, minWidth: 0 }}>
          {/* College */}
          <div style={{ flex: 1.2, minWidth: 0 }}>
            <div
              style={{
                fontSize: 10,
                color: colors.textMuted,
                marginBottom: 4,
                fontWeight: 700,
                letterSpacing: 1,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: accentColor,
                  boxShadow: isHighlighted ? `0 0 8px ${accentColor}` : "none",
                }}
              />
              COLLEGE
            </div>
            <div
              style={{
                fontSize: isHighlighted ? 16 : 13,
                fontWeight: isHighlighted ? 700 : 500,
                color: isHighlighted ? colors.white : colors.textMuted,
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {shortInstitute}
            </div>
          </div>

          {/* Vertical Divider */}
          <div
            style={{
              width: 2,
              background: isHighlighted
                ? `linear-gradient(180deg, transparent, ${accentColor}40, transparent)`
                : "rgba(255,255,255,0.1)",
              alignSelf: "stretch",
              margin: "4px 0",
            }}
          />

          {/* Program */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 10,
                color: colors.textMuted,
                marginBottom: 4,
                fontWeight: 700,
                letterSpacing: 1,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 2,
                  background: colors.neonPurple,
                  boxShadow: isHighlighted ? `0 0 8px ${colors.neonPurple}` : "none",
                }}
              />
              PROGRAM
            </div>
            <div
              style={{
                fontSize: isHighlighted ? 14 : 12,
                fontWeight: isHighlighted ? 600 : 400,
                color: isHighlighted ? colors.neonPurple : colors.textMuted,
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {shortProgram}
            </div>
          </div>
        </div>

        {/* Priority indicator for highlighted */}
        {isHighlighted && (
          <div style={{ width: 60, flexShrink: 0 }}>
            <div
              style={{
                fontSize: 9,
                color: colors.textMuted,
                marginBottom: 4,
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              PRIORITY
            </div>
            <div
              style={{
                height: 6,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.max(20, 100 - choice.no * 2)}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${accentColor}, ${colors.neonPurple})`,
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== HEADER COMPONENT ==========
const Header: React.FC<{
  frame: number;
  currentSection: number;
  startIndex: number;
  endIndex: number;
  total: number;
}> = ({ frame, currentSection, startIndex, endIndex, total }) => {
  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 30], [-30, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity: headerOpacity,
        transform: `translateY(${headerY}px)`,
        marginBottom: 30,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left - Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.neonPink}, ${colors.neonPurple})`,
            borderRadius: 12,
            padding: "10px 20px",
            boxShadow: `0 0 25px ${colors.neonPink}40`,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 800, color: colors.white }}>05</span>
        </div>
        <div>
          <h1
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: colors.white,
              margin: 0,
              letterSpacing: -1,
            }}
          >
            Filled Choices
          </h1>
          <p style={{ fontSize: 14, color: colors.textSecondary, margin: "4px 0 0 0" }}>
            Showing {startIndex + 1}-{endIndex} of {total} preferences
          </p>
        </div>
      </div>

      {/* Right - Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Section indicator */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4, letterSpacing: 1 }}>
            SECTION
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: colors.neonPink }}>
            {String(currentSection + 1).padStart(2, "0")}
            <span style={{ fontSize: 16, color: colors.textMuted }}> / {TOTAL_SUBSECTIONS}</span>
          </div>
        </div>

        {/* Circular progress */}
        <div style={{ position: "relative", width: 60, height: 60 }}>
          <svg width="60" height="60" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="30"
              cy="30"
              r="26"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            <circle
              cx="30"
              cy="30"
              r="26"
              fill="none"
              stroke={colors.neonPink}
              strokeWidth="4"
              strokeDasharray={`${((currentSection + 1) / TOTAL_SUBSECTIONS) * 163} 163`}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${colors.neonPink})` }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              color: colors.white,
            }}
          >
            {Math.round(((currentSection + 1) / TOTAL_SUBSECTIONS) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== STATS BAR COMPONENT ==========
const StatsBar: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" });

  const iitCount = filledChoices.choices.filter((c) =>
    c.institute.includes("Indian Institute of Technology")
  ).length;
  const nitCount = filledChoices.choices.filter((c) =>
    c.institute.includes("National Institute of Technology")
  ).length;
  const gftiCount = filledChoices.totalChoices - iitCount - nitCount;

  const stats = [
    { label: "IIT", count: iitCount, color: colors.neonBlue },
    { label: "NIT", count: nitCount, color: colors.neonGreen },
    { label: "GFTI", count: gftiCount, color: colors.neonPink },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 50,
        opacity,
        marginTop: 20,
      }}
    >
      {stats.map((stat) => (
        <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: stat.color,
              boxShadow: `0 0 12px ${stat.color}`,
            }}
          />
          <span style={{ fontSize: 13, color: colors.textMuted, fontWeight: 600 }}>{stat.label}</span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: stat.color,
              textShadow: `0 0 10px ${stat.color}40`,
            }}
          >
            {stat.count}
          </span>
        </div>
      ))}
    </div>
  );
};

// ========== MAIN COMPONENT ==========
export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate current subsection
  const currentSubsection = Math.min(Math.floor(frame / SUBSECTION_DURATION), TOTAL_SUBSECTIONS - 1);
  const frameInSubsection = frame % SUBSECTION_DURATION;

  // Calculate scroll progress for smooth transitions
  const transitionStart = SUBSECTION_DURATION - 60; // Start 1 second before end
  const scrollProgress =
    frameInSubsection >= transitionStart
      ? spring({
          frame: frameInSubsection - transitionStart,
          fps,
          config: { damping: 25, stiffness: 80, mass: 1 },
        })
      : 0;

  // Highlighted indices
  const highlightStartIndex = currentSubsection * CHOICES_PER_SUBSECTION;
  const highlightEndIndex = Math.min(
    highlightStartIndex + CHOICES_PER_SUBSECTION,
    filledChoices.choices.length
  );

  // Get visible choices (1 above + 3 highlighted + 1 below)
  const aboveIndex = highlightStartIndex > 0 ? highlightStartIndex - 1 : -1;
  const belowIndex =
    highlightEndIndex < filledChoices.choices.length ? highlightEndIndex : -1;

  // Build visible choices array
  const visibleChoices: Array<{
    choice: (typeof filledChoices.choices)[0];
    isHighlighted: boolean;
    isAbove: boolean;
    isBelow: boolean;
  }> = [];

  // Add above choice
  if (aboveIndex >= 0) {
    visibleChoices.push({
      choice: filledChoices.choices[aboveIndex],
      isHighlighted: false,
      isAbove: true,
      isBelow: false,
    });
  }

  // Add highlighted choices
  for (let i = highlightStartIndex; i < highlightEndIndex; i++) {
    visibleChoices.push({
      choice: filledChoices.choices[i],
      isHighlighted: true,
      isAbove: false,
      isBelow: false,
    });
  }

  // Add below choice
  if (belowIndex >= 0) {
    visibleChoices.push({
      choice: filledChoices.choices[belowIndex],
      isHighlighted: false,
      isAbove: false,
      isBelow: true,
    });
  }

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #05050a 0%, #0a0a15 50%, #0f0a15 100%)`,
        padding: "40px 60px",
        overflow: "hidden",
      }}
    >
      {/* Animated background */}
      <FlowingGrid frame={frame} />
      <FloatingOrbs frame={frame} />
      <Particles frame={frame} />

      {/* Content container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <Header
          frame={frame}
          currentSection={currentSubsection}
          startIndex={highlightStartIndex}
          endIndex={highlightEndIndex}
          total={filledChoices.totalChoices}
        />

        {/* Choices list */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 40px",
          }}
        >
          {visibleChoices.map((item, index) => (
            <ChoiceCard
              key={item.choice.no}
              choice={item.choice}
              isHighlighted={item.isHighlighted}
              isAbove={item.isAbove}
              isBelow={item.isBelow}
              frame={frameInSubsection}
              fps={fps}
              animationDelay={item.isAbove ? 0 : item.isBelow ? 40 : 10 + index * 8}
              scrollProgress={scrollProgress}
            />
          ))}
        </div>

        {/* Stats bar */}
        <StatsBar frame={frame} />
      </div>

      {/* Side decorations */}
      <div
        style={{
          position: "absolute",
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {Array.from({ length: TOTAL_SUBSECTIONS }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: i === currentSubsection ? 30 : 10,
              borderRadius: 2,
              background:
                i === currentSubsection
                  ? colors.neonPink
                  : i < currentSubsection
                  ? colors.neonPink + "60"
                  : "rgba(255,255,255,0.1)",
              boxShadow: i === currentSubsection ? `0 0 10px ${colors.neonPink}` : "none",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: `translateY(-50%) translateY(${Math.sin(frame * 0.08) * 8}px)`,
          opacity: belowIndex >= 0 ? 0.6 : 0.2,
        }}
      >
        <div
          style={{
            width: 30,
            height: 50,
            border: `2px solid ${colors.neonPink}40`,
            borderRadius: 15,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: 6,
          }}
        >
          <div
            style={{
              width: 4,
              height: 12,
              borderRadius: 2,
              background: colors.neonPink,
              animation: "none",
              transform: `translateY(${((frame * 0.1) % 20)}px)`,
              opacity: interpolate((frame * 0.1) % 20, [0, 10, 20], [1, 0.5, 0]),
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
