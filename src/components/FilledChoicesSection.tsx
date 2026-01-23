import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig, Easing } from "remotion";
import { colors } from "../styles";
import { filledChoices } from "../data";

const SUBSECTION_DURATION = 600; // 10 seconds at 60fps
const CHOICES_PER_SUBSECTION = 3;
const TOTAL_SUBSECTIONS = 14;

// Floating particle component
const Particle: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  speed: number;
  frame: number;
}> = ({ x, y, size, color, delay, speed, frame }) => {
  const float = Math.sin((frame + delay) * speed * 0.02) * 20;
  const pulse = 0.5 + Math.sin((frame + delay) * 0.05) * 0.5;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}, transparent)`,
        transform: `translateY(${float}px)`,
        opacity: pulse * 0.6,
        filter: `blur(${size / 4}px)`,
        pointerEvents: "none",
      }}
    />
  );
};

// Animated grid background
const AnimatedGrid: React.FC<{ frame: number }> = ({ frame }) => {
  const gridOffset = (frame * 0.5) % 60;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.15,
        backgroundImage: `
          linear-gradient(${colors.neonPurple}20 1px, transparent 1px),
          linear-gradient(90deg, ${colors.neonPurple}20 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        backgroundPosition: `${gridOffset}px ${gridOffset}px`,
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
      }}
    />
  );
};

// Glowing orb component
const GlowingOrb: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  frame: number;
  pulseSpeed: number;
}> = ({ x, y, size, color, frame, pulseSpeed }) => {
  const scale = 1 + Math.sin(frame * pulseSpeed) * 0.2;
  const opacity = 0.3 + Math.sin(frame * pulseSpeed * 0.5) * 0.2;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}60 0%, ${color}20 40%, transparent 70%)`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        filter: "blur(40px)",
        pointerEvents: "none",
      }}
    />
  );
};

// Animated choice card with 3D effects
const ChoiceCard: React.FC<{
  choice: { no: number; institute: string; program: string };
  index: number;
  frame: number;
  fps: number;
  totalInView: number;
}> = ({ choice, index, frame, fps, totalInView }) => {
  // Staggered entrance
  const entranceDelay = index * 12;

  // Spring animation for entrance
  const entranceProgress = spring({
    frame: frame - entranceDelay,
    fps,
    config: { damping: 12, stiffness: 80, mass: 1 },
  });

  // 3D rotation on entrance
  const rotateX = interpolate(entranceProgress, [0, 1], [45, 0]);
  const rotateY = interpolate(entranceProgress, [0, 1], [-30, 0]);
  const translateZ = interpolate(entranceProgress, [0, 1], [-200, 0]);
  const translateY = interpolate(entranceProgress, [0, 1], [100, 0]);
  const scale = interpolate(entranceProgress, [0, 1], [0.5, 1]);
  const opacity = interpolate(entranceProgress, [0, 1], [0, 1]);

  // Floating animation after entrance
  const floatOffset = Math.sin((frame + index * 50) * 0.03) * 5;

  // Glow pulse
  const glowPulse = 0.5 + Math.sin((frame + index * 30) * 0.05) * 0.3;

  const getInstituteColor = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) return colors.neonBlue;
    if (institute.includes("National Institute of Technology")) return colors.neonGreen;
    return colors.neonPink;
  };

  const getInstituteGradient = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) {
      return `linear-gradient(135deg, ${colors.neonBlue}40, ${colors.neonPurple}40)`;
    }
    if (institute.includes("National Institute of Technology")) {
      return `linear-gradient(135deg, ${colors.neonGreen}40, ${colors.neonBlue}40)`;
    }
    return `linear-gradient(135deg, ${colors.neonPink}40, ${colors.neonOrange}40)`;
  };

  const getInstituteTag = (institute: string): string => {
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

  const color = getInstituteColor(choice.institute);
  const tag = getInstituteTag(choice.institute);

  // Animated counter for rank number
  const counterProgress = spring({
    frame: frame - entranceDelay - 15,
    fps,
    config: { damping: 15, stiffness: 60, mass: 1 },
  });
  const displayNumber = Math.round(interpolate(counterProgress, [0, 1], [0, choice.no]));

  // Progress bar animation
  const barProgress = spring({
    frame: frame - entranceDelay - 20,
    fps,
    config: { damping: 18, stiffness: 70, mass: 0.8 },
  });
  const barWidth = Math.max(40, 100 - (choice.no * 1.5));

  // Shine sweep animation
  const shinePosition = interpolate(
    (frame - entranceDelay - 30) % 120,
    [0, 120],
    [-100, 200],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        perspective: "1000px",
        marginBottom: "30px",
      }}
    >
      <div
        style={{
          transform: `
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(${translateZ}px)
            translateY(${translateY + floatOffset}px)
            scale(${scale})
          `,
          opacity,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Card container */}
        <div
          style={{
            background: getInstituteGradient(choice.institute),
            backdropFilter: "blur(20px)",
            border: `2px solid ${color}50`,
            borderRadius: "24px",
            padding: "28px 32px",
            position: "relative",
            overflow: "hidden",
            boxShadow: `
              0 0 ${40 * glowPulse}px ${color}30,
              0 20px 60px rgba(0,0,0,0.4),
              inset 0 1px 0 rgba(255,255,255,0.1)
            `,
          }}
        >
          {/* Animated shine sweep */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${shinePosition}%`,
              width: "50px",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              transform: "skewX(-20deg)",
              pointerEvents: "none",
            }}
          />

          {/* Top section with rank */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "24px" }}>
            {/* Animated rank number */}
            <div
              style={{
                position: "relative",
                width: "100px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {/* Rotating ring */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `3px solid transparent`,
                  borderTopColor: color,
                  borderRightColor: `${color}50`,
                  transform: `rotate(${frame * 2}deg)`,
                  opacity: 0.8,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: "8px",
                  borderRadius: "50%",
                  border: `2px solid transparent`,
                  borderBottomColor: color,
                  borderLeftColor: `${color}30`,
                  transform: `rotate(${-frame * 1.5}deg)`,
                  opacity: 0.6,
                }}
              />

              {/* Number */}
              <div style={{ textAlign: "center", zIndex: 1 }}>
                <div
                  style={{
                    fontSize: "42px",
                    fontWeight: "900",
                    color: colors.white,
                    lineHeight: 1,
                    textShadow: `0 0 30px ${color}`,
                  }}
                >
                  {String(displayNumber).padStart(2, "0")}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    color: color,
                    letterSpacing: "2px",
                    marginTop: "4px",
                  }}
                >
                  RANK
                </div>
              </div>
            </div>

            {/* Institute info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                {/* Tag with pulse */}
                <div
                  style={{
                    background: color,
                    color: "#000",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "800",
                    letterSpacing: "1px",
                    boxShadow: `0 0 ${20 * glowPulse}px ${color}60`,
                  }}
                >
                  {tag}
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    color: colors.textSecondary,
                    fontWeight: "500",
                  }}
                >
                  {programShort}
                </span>
              </div>

              {/* Institute name with gradient text */}
              <h3
                style={{
                  fontSize: "26px",
                  fontWeight: "800",
                  margin: 0,
                  background: `linear-gradient(90deg, ${colors.white}, ${color})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {instituteShort}
              </h3>

              {/* Animated progress bar */}
              <div style={{ marginTop: "16px" }}>
                <div
                  style={{
                    height: "8px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: `${barWidth * barProgress}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${color}, ${color}80)`,
                      borderRadius: "4px",
                      boxShadow: `0 0 15px ${color}60`,
                      position: "relative",
                    }}
                  >
                    {/* Inner glow */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "6px",
                    fontSize: "11px",
                    color: colors.textMuted,
                  }}
                >
                  <span>Priority Level</span>
                  <span style={{ color, fontWeight: "700" }}>{Math.round(barWidth)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Animated section title
const SectionTitle: React.FC<{ frame: number; fps: number; subsection: number; startIdx: number; endIdx: number; total: number }> = ({
  frame,
  fps,
  subsection,
  startIdx,
  endIdx,
  total,
}) => {
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.8 },
  });

  const titleY = interpolate(titleSpring, [0, 1], [-50, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleScale = interpolate(titleSpring, [0, 1], [0.8, 1]);

  // Glitch effect for numbers
  const glitchOffset = Math.random() > 0.98 ? Math.random() * 4 - 2 : 0;

  return (
    <div
      style={{
        marginBottom: "40px",
        transform: `translateY(${titleY}px) scale(${titleScale})`,
        opacity: titleOpacity,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Left side */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Animated section badge */}
          <div
            style={{
              position: "relative",
              width: "80px",
              height: "80px",
            }}
          >
            {/* Outer rotating ring */}
            <svg
              width="80"
              height="80"
              style={{
                position: "absolute",
                transform: `rotate(${frame * 1}deg)`,
              }}
            >
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke={`${colors.neonPink}30`}
                strokeWidth="2"
                strokeDasharray="20 10"
              />
            </svg>
            <svg
              width="80"
              height="80"
              style={{
                position: "absolute",
                transform: `rotate(${-frame * 0.5}deg)`,
              }}
            >
              <circle
                cx="40"
                cy="40"
                r="30"
                fill="none"
                stroke={`${colors.neonPurple}40`}
                strokeWidth="2"
                strokeDasharray="15 8"
              />
            </svg>

            {/* Center number */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: "900",
                color: colors.neonPink,
                textShadow: `0 0 20px ${colors.neonPink}80`,
                transform: `translateX(${glitchOffset}px)`,
              }}
            >
              {String(subsection + 1).padStart(2, "0")}
            </div>
          </div>

          <div>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "900",
                margin: 0,
                background: `linear-gradient(90deg, ${colors.white}, ${colors.neonPink})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              FILLED CHOICES
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: colors.textMuted,
                margin: "6px 0 0 2px",
                fontWeight: "500",
              }}
            >
              Showing choices{" "}
              <span style={{ color: colors.neonPink, fontWeight: "700" }}>
                {startIdx + 1}-{endIdx}
              </span>{" "}
              of <span style={{ color: colors.white }}>{total}</span>
            </p>
          </div>
        </div>

        {/* Right side - progress */}
        <div
          style={{
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: colors.textMuted,
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            SECTION PROGRESS
          </div>
          <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
            {Array.from({ length: TOTAL_SUBSECTIONS }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === subsection ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background:
                    i === subsection
                      ? `linear-gradient(90deg, ${colors.neonPink}, ${colors.neonOrange})`
                      : i < subsection
                      ? colors.neonPink
                      : "rgba(255,255,255,0.2)",
                  boxShadow: i === subsection ? `0 0 15px ${colors.neonPink}` : "none",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Animated line */}
      <div
        style={{
          marginTop: "24px",
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${colors.neonPink}, ${colors.neonPurple}, transparent)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Moving highlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${(frame % 200) - 50}%`,
            width: "100px",
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${colors.white}, transparent)`,
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

  const highlightStartIndex = currentSubsection * CHOICES_PER_SUBSECTION;
  const highlightEndIndex = Math.min(highlightStartIndex + CHOICES_PER_SUBSECTION, filledChoices.choices.length);

  const currentChoices = filledChoices.choices.slice(highlightStartIndex, highlightEndIndex);

  // Generate particles
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    x: (i * 17 + 10) % 100,
    y: (i * 23 + 5) % 100,
    size: 20 + (i % 5) * 15,
    color: [colors.neonBlue, colors.neonPink, colors.neonPurple, colors.neonGreen][i % 4],
    delay: i * 20,
    speed: 0.5 + (i % 3) * 0.3,
  }));

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse at 20% 20%, ${colors.neonPurple}15 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, ${colors.neonBlue}15 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, ${colors.neonPink}08 0%, transparent 60%),
          linear-gradient(160deg, #05050a 0%, #0a0812 50%, #100818 100%)
        `,
        overflow: "hidden",
      }}
    >
      {/* Animated grid background */}
      <AnimatedGrid frame={frame} />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <Particle key={i} {...p} frame={frame} />
      ))}

      {/* Glowing orbs */}
      <GlowingOrb x={15} y={30} size={300} color={colors.neonPurple} frame={frame} pulseSpeed={0.02} />
      <GlowingOrb x={85} y={70} size={250} color={colors.neonBlue} frame={frame} pulseSpeed={0.025} />
      <GlowingOrb x={50} y={50} size={400} color={colors.neonPink} frame={frame} pulseSpeed={0.015} />

      {/* Content container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "50px 70px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Animated section title */}
        <SectionTitle
          frame={frameInSubsection}
          fps={fps}
          subsection={currentSubsection}
          startIdx={highlightStartIndex}
          endIdx={highlightEndIndex}
          total={filledChoices.totalChoices}
        />

        {/* Choice cards */}
        <div style={{ flex: 1 }}>
          {currentChoices.map((choice, idx) => (
            <ChoiceCard
              key={`${currentSubsection}-${choice.no}`}
              choice={choice}
              index={idx}
              frame={frameInSubsection}
              fps={fps}
              totalInView={currentChoices.length}
            />
          ))}
        </div>

        {/* Bottom info bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            paddingTop: "20px",
          }}
        >
          {[
            { label: "IIT", count: filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length, color: colors.neonBlue },
            { label: "NIT", count: filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length, color: colors.neonGreen },
            { label: "GFTI", count: filledChoices.totalChoices - filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length - filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length, color: colors.neonPink },
          ].map((item, i) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                opacity: 0.8,
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: item.color,
                  boxShadow: `0 0 10px ${item.color}`,
                }}
              />
              <span style={{ fontSize: "14px", color: colors.textMuted }}>{item.label}</span>
              <span style={{ fontSize: "18px", fontWeight: "800", color: item.color }}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Corner decorations */}
      <svg
        style={{ position: "absolute", top: 20, left: 20, opacity: 0.3 }}
        width="60"
        height="60"
      >
        <path d="M0 30 L30 0 L60 0 L60 10 L35 10 L10 35 L10 60 L0 60 Z" fill={colors.neonPink} />
      </svg>
      <svg
        style={{ position: "absolute", bottom: 20, right: 20, opacity: 0.3, transform: "rotate(180deg)" }}
        width="60"
        height="60"
      >
        <path d="M0 30 L30 0 L60 0 L60 10 L35 10 L10 35 L10 60 L0 60 Z" fill={colors.neonPurple} />
      </svg>
    </AbsoluteFill>
  );
};
