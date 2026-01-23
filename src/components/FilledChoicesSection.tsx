import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { filledChoices } from "../data";

const SUBSECTION_DURATION = 600;
const CHOICES_PER_SUBSECTION = 3;
const TOTAL_SUBSECTIONS = 14;

// Noise function for organic movement
const noise = (x: number, y: number, t: number) => {
  return Math.sin(x * 0.5 + t) * Math.cos(y * 0.3 + t * 0.7) * 0.5 + 0.5;
};

// Animated DNA helix background
const DNAHelix: React.FC<{ frame: number }> = ({ frame }) => {
  const points = Array.from({ length: 30 }).map((_, i) => {
    const y = (i / 30) * 120 - 10;
    const wave1 = Math.sin((i * 0.3) + frame * 0.03) * 30;
    const wave2 = Math.sin((i * 0.3) + frame * 0.03 + Math.PI) * 30;
    return { y, x1: 50 + wave1, x2: 50 + wave2 };
  });

  return (
    <svg
      style={{
        position: "absolute",
        right: "-5%",
        top: "10%",
        width: "300px",
        height: "80%",
        opacity: 0.15,
      }}
    >
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={`${p.x1}%`} cy={`${p.y}%`} r="4" fill={colors.neonBlue} />
          <circle cx={`${p.x2}%`} cy={`${p.y}%`} r="4" fill={colors.neonPink} />
          {i % 3 === 0 && (
            <line
              x1={`${p.x1}%`}
              y1={`${p.y}%`}
              x2={`${p.x2}%`}
              y2={`${p.y}%`}
              stroke={colors.neonPurple}
              strokeWidth="1"
              opacity="0.5"
            />
          )}
        </g>
      ))}
    </svg>
  );
};

// Scanning line effect
const ScanLine: React.FC<{ frame: number }> = ({ frame }) => {
  const position = (frame * 2) % 150 - 25;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: `${position}%`,
        height: "2px",
        background: `linear-gradient(90deg, transparent, ${colors.neonBlue}60, ${colors.neonPink}60, transparent)`,
        boxShadow: `0 0 20px ${colors.neonBlue}, 0 0 40px ${colors.neonPink}40`,
        opacity: 0.6,
        pointerEvents: "none",
      }}
    />
  );
};

// Morphing blob background
const MorphingBlob: React.FC<{ frame: number; color: string; x: number; y: number; size: number; speed: number }> = ({
  frame, color, x, y, size, speed
}) => {
  const morph1 = 30 + Math.sin(frame * speed) * 20;
  const morph2 = 30 + Math.cos(frame * speed * 0.7) * 20;
  const morph3 = 30 + Math.sin(frame * speed * 1.3) * 20;
  const morph4 = 30 + Math.cos(frame * speed * 0.5) * 20;
  const rotation = frame * speed * 10;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: `${morph1}% ${morph2}% ${morph3}% ${morph4}%`,
        background: `radial-gradient(circle, ${color}40 0%, ${color}10 50%, transparent 70%)`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        filter: "blur(30px)",
        pointerEvents: "none",
      }}
    />
  );
};

// Hexagon grid pattern
const HexGrid: React.FC<{ frame: number }> = ({ frame }) => {
  const hexagons = Array.from({ length: 40 }).map((_, i) => ({
    x: (i % 8) * 14 + (Math.floor(i / 8) % 2) * 7,
    y: Math.floor(i / 8) * 12,
    delay: i * 0.1,
    pulse: Math.sin((frame + i * 10) * 0.05) * 0.5 + 0.5,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 0.1, overflow: "hidden" }}>
      {hexagons.map((hex, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${hex.x}%`,
            top: `${hex.y}%`,
            width: "60px",
            height: "52px",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            background: `linear-gradient(135deg, ${colors.neonPurple}${Math.round(hex.pulse * 30).toString(16).padStart(2, '0')}, transparent)`,
            border: `1px solid ${colors.neonPurple}20`,
          }}
        />
      ))}
    </div>
  );
};

// Electric arc effect
const ElectricArc: React.FC<{ frame: number; startX: number; startY: number; endX: number; endY: number; color: string }> = ({
  frame, startX, startY, endX, endY, color
}) => {
  const segments = 8;
  const points = Array.from({ length: segments + 1 }).map((_, i) => {
    const t = i / segments;
    const baseX = startX + (endX - startX) * t;
    const baseY = startY + (endY - startY) * t;
    const offset = i > 0 && i < segments ? (Math.random() - 0.5) * 20 * Math.sin(frame * 0.5 + i) : 0;
    return `${baseX + offset},${baseY + offset}`;
  });

  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.4 }}>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        filter={`drop-shadow(0 0 5px ${color})`}
      />
    </svg>
  );
};

// Glitch text effect component
const GlitchText: React.FC<{ text: string; frame: number; color: string; size: string }> = ({ text, frame, color, size }) => {
  const glitchActive = Math.sin(frame * 0.3) > 0.95;
  const offset = glitchActive ? Math.random() * 4 - 2 : 0;
  const skew = glitchActive ? Math.random() * 2 - 1 : 0;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Red channel */}
      <span
        style={{
          position: "absolute",
          left: glitchActive ? -2 : 0,
          color: colors.neonPink,
          fontSize: size,
          fontWeight: 900,
          opacity: glitchActive ? 0.7 : 0,
          transform: `skewX(${skew}deg)`,
        }}
      >
        {text}
      </span>
      {/* Blue channel */}
      <span
        style={{
          position: "absolute",
          left: glitchActive ? 2 : 0,
          color: colors.neonBlue,
          fontSize: size,
          fontWeight: 900,
          opacity: glitchActive ? 0.7 : 0,
          transform: `skewX(${-skew}deg)`,
        }}
      >
        {text}
      </span>
      {/* Main text */}
      <span
        style={{
          position: "relative",
          color: color,
          fontSize: size,
          fontWeight: 900,
          transform: `translateX(${offset}px)`,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// Animated choice card with extreme effects
const ChoiceCard: React.FC<{
  choice: { no: number; institute: string; program: string };
  index: number;
  frame: number;
  fps: number;
}> = ({ choice, index, frame, fps }) => {
  const entranceDelay = index * 15;

  // Multi-stage entrance animation
  const stage1 = spring({ frame: frame - entranceDelay, fps, config: { damping: 15, stiffness: 100 } });
  const stage2 = spring({ frame: frame - entranceDelay - 10, fps, config: { damping: 12, stiffness: 80 } });
  const stage3 = spring({ frame: frame - entranceDelay - 20, fps, config: { damping: 10, stiffness: 60 } });

  // 3D transforms
  const rotateX = interpolate(stage1, [0, 1], [90, 0]);
  const rotateY = interpolate(stage1, [0, 1], [-45, 0]);
  const rotateZ = interpolate(stage1, [0, 1], [15, 0]);
  const translateZ = interpolate(stage1, [0, 1], [-500, 0]);
  const translateY = interpolate(stage1, [0, 1], [200, 0]);
  const translateX = interpolate(stage1, [0, 1], [-100, 0]);
  const scale = interpolate(stage1, [0, 1], [0.3, 1]);
  const opacity = interpolate(stage1, [0, 1], [0, 1]);

  // Continuous floating
  const floatY = Math.sin((frame + index * 40) * 0.02) * 8;
  const floatX = Math.cos((frame + index * 30) * 0.015) * 4;
  const floatRotate = Math.sin((frame + index * 50) * 0.01) * 1;

  // Glow intensity
  const glowIntensity = 0.6 + Math.sin((frame + index * 20) * 0.04) * 0.4;

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

  // Animated counter
  const counterProgress = spring({ frame: frame - entranceDelay - 25, fps, config: { damping: 20, stiffness: 50 } });
  const displayNumber = Math.round(interpolate(counterProgress, [0, 1], [0, choice.no]));

  // Bar animation with overshoot
  const barProgress = spring({ frame: frame - entranceDelay - 30, fps, config: { damping: 8, stiffness: 50, mass: 0.5 } });
  const barWidth = Math.max(35, 100 - (choice.no * 1.5));

  // Shine position
  const shinePos = ((frame - entranceDelay) * 1.5) % 300 - 100;

  // Text reveal
  const textReveal = interpolate(stage2, [0, 1], [0, 100]);

  return (
    <div style={{ perspective: "2000px", marginBottom: "24px" }}>
      <div
        style={{
          transform: `
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            rotateZ(${rotateZ + floatRotate}deg)
            translateX(${translateX + floatX}px)
            translateY(${translateY + floatY}px)
            translateZ(${translateZ}px)
            scale(${scale})
          `,
          opacity,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Card glow effect */}
        <div
          style={{
            position: "absolute",
            inset: "-20px",
            background: `radial-gradient(ellipse at center, ${color}30 0%, transparent 70%)`,
            filter: "blur(20px)",
            opacity: glowIntensity,
            borderRadius: "40px",
          }}
        />

        {/* Main card */}
        <div
          style={{
            background: `linear-gradient(135deg, rgba(20,20,35,0.95) 0%, rgba(30,20,40,0.95) 100%)`,
            backdropFilter: "blur(30px)",
            border: `2px solid ${color}60`,
            borderRadius: "20px",
            padding: "24px 28px",
            position: "relative",
            overflow: "hidden",
            boxShadow: `
              0 0 ${60 * glowIntensity}px ${color}40,
              0 30px 60px rgba(0,0,0,0.5),
              inset 0 1px 0 rgba(255,255,255,0.1),
              inset 0 -1px 0 rgba(0,0,0,0.3)
            `,
          }}
        >
          {/* Animated border gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "20px",
              padding: "2px",
              background: `conic-gradient(from ${frame * 2}deg, ${color}, ${colors.neonPurple}, ${color})`,
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              opacity: 0.5,
            }}
          />

          {/* Multiple shine sweeps */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${shinePos}%`,
              width: "60px",
              height: "100%",
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)`,
              transform: "skewX(-20deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${shinePos - 50}%`,
              width: "30px",
              height: "100%",
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)`,
              transform: "skewX(-20deg)",
            }}
          />

          {/* Content layout - SIDE BY SIDE */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px", position: "relative", zIndex: 1 }}>
            {/* Rank circle with effects */}
            <div style={{ position: "relative", width: "90px", height: "90px", flexShrink: 0 }}>
              {/* Outer spinning ring */}
              <svg width="90" height="90" style={{ position: "absolute", transform: `rotate(${frame * 3}deg)` }}>
                <defs>
                  <linearGradient id={`grad-${choice.no}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={colors.neonPurple} />
                  </linearGradient>
                </defs>
                <circle cx="45" cy="45" r="42" fill="none" stroke={`url(#grad-${choice.no})`} strokeWidth="2" strokeDasharray="8 4" />
              </svg>

              {/* Middle ring */}
              <svg width="90" height="90" style={{ position: "absolute", transform: `rotate(${-frame * 2}deg)` }}>
                <circle cx="45" cy="45" r="35" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="15 10" opacity="0.6" />
              </svg>

              {/* Inner pulsing circle */}
              <div
                style={{
                  position: "absolute",
                  inset: "15px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
                  transform: `scale(${1 + Math.sin(frame * 0.1) * 0.1})`,
                }}
              />

              {/* Number */}
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: "36px", fontWeight: "900", color: colors.white, textShadow: `0 0 30px ${color}`, lineHeight: 1 }}>
                  {String(displayNumber).padStart(2, "0")}
                </div>
                <div style={{ fontSize: "9px", fontWeight: "700", color, letterSpacing: "2px", marginTop: "2px" }}>RANK</div>
              </div>
            </div>

            {/* College and Course - SIDE BY SIDE */}
            <div style={{ flex: 1, display: "flex", gap: "20px", alignItems: "center", minWidth: 0 }}>
              {/* College Name */}
              <div style={{ flex: 1.2, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${color}, ${color}80)`,
                      color: "#000",
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "800",
                      letterSpacing: "1px",
                      boxShadow: `0 0 15px ${color}60`,
                    }}
                  >
                    {tag}
                  </div>
                  <span style={{ fontSize: "10px", color: colors.textMuted, letterSpacing: "1px" }}>COLLEGE</span>
                </div>
                <div
                  style={{
                    overflow: "hidden",
                    clipPath: `inset(0 ${100 - textReveal}% 0 0)`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      margin: 0,
                      color: colors.white,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textShadow: `0 2px 10px rgba(0,0,0,0.5)`,
                    }}
                  >
                    {instituteShort}
                  </h3>
                </div>
              </div>

              {/* Vertical divider with glow */}
              <div
                style={{
                  width: "2px",
                  height: "60px",
                  background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
                  boxShadow: `0 0 10px ${color}60`,
                  opacity: stage2,
                }}
              />

              {/* Course/Program */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ marginBottom: "6px" }}>
                  <span style={{ fontSize: "10px", color: colors.textMuted, letterSpacing: "1px" }}>PROGRAM</span>
                </div>
                <div
                  style={{
                    overflow: "hidden",
                    clipPath: `inset(0 ${100 - textReveal}% 0 0)`,
                  }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: 0,
                      color: color,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {programShort}
                  </p>
                </div>
              </div>
            </div>

            {/* Priority bar */}
            <div style={{ width: "120px", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "9px", color: colors.textMuted, letterSpacing: "1px" }}>PRIORITY</span>
                <span style={{ fontSize: "12px", fontWeight: "800", color }}>{Math.round(barWidth)}%</span>
              </div>
              <div style={{ height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${barWidth * barProgress}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${color}, ${colors.neonPurple})`,
                    borderRadius: "4px",
                    boxShadow: `0 0 15px ${color}`,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Epic animated header
const EpicHeader: React.FC<{ frame: number; fps: number; subsection: number; startIdx: number; endIdx: number; total: number }> = ({
  frame, fps, subsection, startIdx, endIdx, total
}) => {
  const headerSpring = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const titleScale = interpolate(headerSpring, [0, 1], [0.5, 1]);
  const titleY = interpolate(headerSpring, [0, 1], [-80, 0]);
  const titleOpacity = interpolate(headerSpring, [0, 1], [0, 1]);

  // Letter by letter animation for title
  const title = "FILLED CHOICES";
  const letterDelay = 2;

  return (
    <div
      style={{
        marginBottom: "35px",
        transform: `translateY(${titleY}px)`,
        opacity: titleOpacity,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Left - animated title */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* Section number with multiple rings */}
          <div style={{ position: "relative", width: "100px", height: "100px" }}>
            {/* Outermost ring */}
            <svg width="100" height="100" style={{ position: "absolute", transform: `rotate(${frame}deg)` }}>
              <circle cx="50" cy="50" r="48" fill="none" stroke={`${colors.neonPink}30`} strokeWidth="1" strokeDasharray="3 6" />
            </svg>
            <svg width="100" height="100" style={{ position: "absolute", transform: `rotate(${-frame * 0.7}deg)` }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke={`${colors.neonPurple}40`} strokeWidth="2" strokeDasharray="10 5" />
            </svg>
            <svg width="100" height="100" style={{ position: "absolute", transform: `rotate(${frame * 1.5}deg)` }}>
              <circle cx="50" cy="50" r="36" fill="none" stroke={`${colors.neonPink}50`} strokeWidth="2" strokeDasharray="20 10" />
            </svg>

            {/* Center content */}
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
              <span style={{ fontSize: "10px", color: colors.textMuted, letterSpacing: "2px" }}>SECTION</span>
              <GlitchText
                text={String(subsection + 1).padStart(2, "0")}
                frame={frame}
                color={colors.neonPink}
                size="32px"
              />
            </div>
          </div>

          {/* Animated title */}
          <div>
            <div style={{ display: "flex", overflow: "hidden" }}>
              {title.split("").map((letter, i) => {
                const letterProgress = spring({
                  frame: frame - i * letterDelay,
                  fps,
                  config: { damping: 15, stiffness: 150 },
                });
                const y = interpolate(letterProgress, [0, 1], [50, 0]);
                const opacity = interpolate(letterProgress, [0, 1], [0, 1]);
                const rotate = interpolate(letterProgress, [0, 1], [-20, 0]);

                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      fontSize: "52px",
                      fontWeight: "900",
                      color: colors.white,
                      transform: `translateY(${y}px) rotate(${rotate}deg)`,
                      opacity,
                      textShadow: `0 0 30px ${colors.neonPink}50`,
                      marginRight: letter === " " ? "15px" : "2px",
                    }}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
            <div
              style={{
                fontSize: "16px",
                color: colors.textMuted,
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <span>Displaying choices</span>
              <span
                style={{
                  background: `linear-gradient(90deg, ${colors.neonPink}, ${colors.neonOrange})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "800",
                  fontSize: "20px",
                }}
              >
                {startIdx + 1}-{endIdx}
              </span>
              <span>of {total}</span>
            </div>
          </div>
        </div>

        {/* Right - progress visualization */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", color: colors.textMuted, letterSpacing: "2px", marginBottom: "12px" }}>
            PROGRESS
          </div>
          {/* Circular progress */}
          <div style={{ position: "relative", width: "80px", height: "80px", marginLeft: "auto" }}>
            <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke={`url(#progressGrad)`}
                strokeWidth="6"
                strokeDasharray={`${(subsection + 1) / TOTAL_SUBSECTIONS * 220} 220`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={colors.neonPink} />
                  <stop offset="100%" stopColor={colors.neonOrange} />
                </linearGradient>
              </defs>
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "800",
                color: colors.white,
              }}
            >
              {Math.round(((subsection + 1) / TOTAL_SUBSECTIONS) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Animated divider line */}
      <div style={{ marginTop: "25px", position: "relative", height: "3px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent, ${colors.neonPink}50, ${colors.neonPurple}50, transparent)`,
          }}
        />
        {/* Moving pulse */}
        <div
          style={{
            position: "absolute",
            top: "-2px",
            left: `${(frame * 0.5) % 100}%`,
            width: "100px",
            height: "7px",
            background: `radial-gradient(ellipse, ${colors.white} 0%, transparent 70%)`,
            filter: "blur(2px)",
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

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse at 0% 0%, ${colors.neonPurple}20 0%, transparent 50%),
          radial-gradient(ellipse at 100% 100%, ${colors.neonBlue}15 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, ${colors.neonPink}10 0%, transparent 70%),
          linear-gradient(180deg, #030308 0%, #0a0515 50%, #0f0a1a 100%)
        `,
        overflow: "hidden",
      }}
    >
      {/* Hexagon grid */}
      <HexGrid frame={frame} />

      {/* DNA Helix */}
      <DNAHelix frame={frame} />

      {/* Morphing blobs */}
      <MorphingBlob frame={frame} color={colors.neonPurple} x={10} y={20} size={400} speed={0.02} />
      <MorphingBlob frame={frame} color={colors.neonBlue} x={90} y={80} size={350} speed={0.025} />
      <MorphingBlob frame={frame} color={colors.neonPink} x={50} y={50} size={500} speed={0.015} />

      {/* Scan line */}
      <ScanLine frame={frame} />

      {/* Electric arcs */}
      <ElectricArc frame={frame} startX={0} startY={200} endX={200} endY={100} color={colors.neonBlue} />
      <ElectricArc frame={frame} startX={1920} startY={800} endX={1700} endY={900} color={colors.neonPink} />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "45px 60px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <EpicHeader
          frame={frameInSubsection}
          fps={fps}
          subsection={currentSubsection}
          startIdx={highlightStartIndex}
          endIdx={highlightEndIndex}
          total={filledChoices.totalChoices}
        />

        <div style={{ flex: 1 }}>
          {currentChoices.map((choice, idx) => (
            <ChoiceCard
              key={`${currentSubsection}-${choice.no}`}
              choice={choice}
              index={idx}
              frame={frameInSubsection}
              fps={fps}
            />
          ))}
        </div>

        {/* Bottom stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: "50px", paddingTop: "15px" }}>
          {[
            { label: "IIT", count: filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length, color: colors.neonBlue },
            { label: "NIT", count: filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length, color: colors.neonGreen },
            { label: "GFTI", count: filledChoices.totalChoices - filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length - filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length, color: colors.neonPink },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: item.color,
                  boxShadow: `0 0 15px ${item.color}`,
                  animation: "pulse 2s infinite",
                }}
              />
              <span style={{ fontSize: "13px", color: colors.textMuted }}>{item.label}</span>
              <span style={{ fontSize: "20px", fontWeight: "900", color: item.color, textShadow: `0 0 10px ${item.color}50` }}>
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Corner accents */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "150px", height: "150px", overflow: "hidden", opacity: 0.4 }}>
        <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: `conic-gradient(from 180deg, transparent, ${colors.neonPink}40, transparent)`, transform: `rotate(${frame}deg)` }} />
      </div>
      <div style={{ position: "absolute", bottom: 0, right: 0, width: "150px", height: "150px", overflow: "hidden", opacity: 0.4 }}>
        <div style={{ position: "absolute", bottom: "-50%", right: "-50%", width: "200%", height: "200%", background: `conic-gradient(from 0deg, transparent, ${colors.neonPurple}40, transparent)`, transform: `rotate(${-frame}deg)` }} />
      </div>
    </AbsoluteFill>
  );
};
