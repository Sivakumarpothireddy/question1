import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { filledChoices } from "../data";

const SUBSECTION_DURATION = 600; // 10 seconds at 60fps
const CHOICES_PER_SUBSECTION = 3;

// ============ HEAVY MOTION DESIGN ELEMENTS ============

// Digital Rain Matrix Effect
const DigitalRain: React.FC<{ frame: number }> = ({ frame }) => {
  const columns = Array.from({ length: 40 }).map((_, i) => {
    const x = (i / 40) * 100;
    const speed = 0.5 + (i % 5) * 0.3;
    const chars = "01アイウエオカキクケコサシスセソ";
    const charIndex = Math.floor((frame * speed + i * 7) % chars.length);
    const y = ((frame * speed * 2 + i * 50) % 140) - 20;
    const opacity = 0.15 + Math.sin(frame * 0.02 + i) * 0.1;

    return { x, y, char: chars[charIndex], opacity };
  });

  return (
    <>
      {columns.map((col, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${col.x}%`,
            top: `${col.y}%`,
            fontSize: "14px",
            fontFamily: "monospace",
            color: colors.neonGreen,
            opacity: col.opacity,
            textShadow: `0 0 10px ${colors.neonGreen}`,
            transform: "translateZ(0)",
          }}
        >
          {col.char}
        </div>
      ))}
    </>
  );
};

// Morphing Blob Animation
const MorphingBlob: React.FC<{ frame: number; color: string; size: number; x: number; y: number; speed: number }> = ({
  frame, color, size, x, y, speed
}) => {
  const morph1 = 30 + Math.sin(frame * speed * 0.02) * 20;
  const morph2 = 70 + Math.cos(frame * speed * 0.025 + 1) * 20;
  const morph3 = 30 + Math.sin(frame * speed * 0.018 + 2) * 20;
  const morph4 = 70 + Math.cos(frame * speed * 0.022 + 3) * 20;
  const rotation = frame * speed * 0.3;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: `${morph1}% ${morph2}% ${morph3}% ${morph4}%`,
        background: `radial-gradient(ellipse at 30% 30%, ${color}40, ${color}10, transparent)`,
        filter: "blur(40px)",
        transform: `rotate(${rotation}deg) translateZ(0)`,
        opacity: 0.6,
      }}
    />
  );
};

// Pulsing Energy Rings
const EnergyRings: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
      {[0, 1, 2, 3].map((i) => {
        const delay = i * 40;
        const progress = ((frame + delay) % 160) / 160;
        const scale = 0.5 + progress * 2;
        const opacity = Math.max(0, 1 - progress * 1.2);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 600,
              height: 600,
              marginLeft: -300,
              marginTop: -300,
              borderRadius: "50%",
              border: `2px solid ${colors.neonPink}`,
              transform: `scale(${scale}) translateZ(0)`,
              opacity: opacity * 0.3,
              boxShadow: `0 0 30px ${colors.neonPink}40`,
            }}
          />
        );
      })}
    </div>
  );
};

// Floating Particles System
const ParticleSystem: React.FC<{ frame: number }> = ({ frame }) => {
  const particles = Array.from({ length: 50 }).map((_, i) => {
    const baseX = (i * 37 + 13) % 100;
    const baseY = (i * 23 + 7) % 100;
    const floatX = Math.sin(frame * 0.015 + i * 0.5) * 30;
    const floatY = Math.cos(frame * 0.012 + i * 0.7) * 30;
    const scale = 0.5 + Math.sin(frame * 0.03 + i) * 0.5;
    const color = [colors.neonBlue, colors.neonPink, colors.neonPurple, colors.neonGreen][i % 4];

    return { x: baseX + floatX / 10, y: baseY + floatY / 10, scale, color };
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
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: p.color,
            transform: `scale(${p.scale}) translateZ(0)`,
            boxShadow: `0 0 10px ${p.color}`,
            opacity: 0.6,
          }}
        />
      ))}
    </>
  );
};

// Scan Line Effect
const ScanLines: React.FC<{ frame: number }> = ({ frame }) => {
  const scanY = (frame * 3) % 1200;

  return (
    <>
      {/* Horizontal scan lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.1) 3px,
            rgba(0,0,0,0.1) 6px
          )`,
          pointerEvents: "none",
          opacity: 0.3,
        }}
      />
      {/* Moving scan beam */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY,
          height: 100,
          background: `linear-gradient(to bottom, transparent, ${colors.neonBlue}10, ${colors.neonBlue}20, ${colors.neonBlue}10, transparent)`,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

// Glitch Text Effect Component
const GlitchText: React.FC<{ text: string; frame: number; fontSize: number; color: string }> = ({
  text, frame, fontSize, color
}) => {
  const glitchActive = frame % 120 < 6;
  const offsetX = glitchActive ? (Math.random() - 0.5) * 10 : 0;
  const offsetY = glitchActive ? (Math.random() - 0.5) * 5 : 0;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Chromatic aberration layers */}
      {glitchActive && (
        <>
          <span
            style={{
              position: "absolute",
              fontSize,
              fontWeight: 900,
              color: colors.neonPink,
              left: -3,
              opacity: 0.7,
              clipPath: `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`,
            }}
          >
            {text}
          </span>
          <span
            style={{
              position: "absolute",
              fontSize,
              fontWeight: 900,
              color: colors.neonBlue,
              left: 3,
              opacity: 0.7,
              clipPath: `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`,
            }}
          >
            {text}
          </span>
        </>
      )}
      <span
        style={{
          fontSize,
          fontWeight: 900,
          color,
          transform: `translate(${offsetX}px, ${offsetY}px)`,
          display: "inline-block",
          textShadow: `0 0 20px ${color}, 0 0 40px ${color}50`,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ============ 3D CHOICE CARD COMPONENT ============
const Choice3DCard: React.FC<{
  choice: { no: number; institute: string; program: string };
  position: "left" | "center-top" | "center-mid" | "center-bot" | "right" | "far-left" | "far-right";
  index: number;
  frame: number;
  fps: number;
  entryProgress: number;
}> = ({ choice, position, index, frame, fps, entryProgress }) => {
  // Position configurations - vertically stacked center cards
  const positionConfigs = {
    "far-left": { x: -750, y: 0, z: -500, rotateY: 50, rotateX: 0, scale: 0.45, opacity: 0.15 },
    "left": { x: -500, y: 0, z: -250, rotateY: 35, rotateX: 0, scale: 0.65, opacity: 0.4 },
    "center-top": { x: 0, y: -230, z: 50, rotateY: 0, rotateX: -5, scale: 0.95, opacity: 1 },
    "center-mid": { x: 0, y: 0, z: 100, rotateY: 0, rotateX: 0, scale: 1, opacity: 1 },
    "center-bot": { x: 0, y: 230, z: 50, rotateY: 0, rotateX: 5, scale: 0.95, opacity: 1 },
    "right": { x: 500, y: 0, z: -250, rotateY: -35, rotateX: 0, scale: 0.65, opacity: 0.4 },
    "far-right": { x: 750, y: 0, z: -500, rotateY: -50, rotateX: 0, scale: 0.45, opacity: 0.15 },
  };

  const config = positionConfigs[position];
  const isCenter = position.startsWith("center");

  // Floating animation for center cards
  const floatY = isCenter ? Math.sin(frame * 0.03 + index * 2) * 6 : 0;
  const floatRotate = isCenter ? Math.sin(frame * 0.02 + index) * 1.5 : 0;

  // Entry animation
  const entryY = interpolate(entryProgress, [0, 1], [80, 0]);
  const entryScale = interpolate(entryProgress, [0, 1], [0.8, config.scale]);
  const entryOpacity = interpolate(entryProgress, [0, 1], [0, config.opacity]);

  // Color based on institute type
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

  const accentColor = getColor(choice.institute);
  const tag = getTag(choice.institute);

  // Glow pulse for center cards
  const glowPulse = isCenter ? 0.5 + Math.sin(frame * 0.05) * 0.5 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `
          translateX(calc(-50% + ${config.x}px))
          translateY(calc(-50% + ${config.y + floatY + entryY}px))
          translateZ(${config.z}px)
          rotateY(${config.rotateY + floatRotate}deg)
          rotateX(${config.rotateX}deg)
          scale(${entryScale})
        `,
        opacity: entryOpacity,
        width: isCenter ? 580 : 450,
        transformStyle: "preserve-3d",
        transition: "transform 0.3s ease-out, opacity 0.3s ease",
        zIndex: position === "center-mid" ? 30 : position.startsWith("center") ? 20 : 10,
      }}
    >
      {/* Card glow effect */}
      {isCenter && (
        <div
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: 30,
            background: `radial-gradient(ellipse at center, ${accentColor}30, transparent 70%)`,
            filter: "blur(20px)",
            opacity: glowPulse,
          }}
        />
      )}

      {/* Main card */}
      <div
        style={{
          background: isCenter
            ? `linear-gradient(135deg, rgba(20,20,40,0.95), rgba(30,20,50,0.95))`
            : `linear-gradient(135deg, rgba(15,15,25,0.8), rgba(20,15,35,0.8))`,
          borderRadius: 20,
          border: `2px solid ${isCenter ? accentColor + "80" : "rgba(255,255,255,0.1)"}`,
          padding: isCenter ? "28px" : "20px",
          position: "relative",
          overflow: "hidden",
          boxShadow: isCenter
            ? `0 0 50px ${accentColor}30, 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`
            : "0 10px 40px rgba(0,0,0,0.3)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Animated border glow */}
        {isCenter && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              padding: 2,
              background: `conic-gradient(from ${frame * 3}deg, ${accentColor}, ${colors.neonPurple}, ${colors.neonPink}, ${accentColor})`,
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              opacity: 0.6,
            }}
          />
        )}

        {/* Holographic shine sweep */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${((frame * 2 + index * 100) % 500) - 100}%`,
            width: 150,
            height: "100%",
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,${isCenter ? 0.15 : 0.05}), transparent)`,
            transform: "skewX(-20deg)",
          }}
        />

        {/* Top section: Rank badge with rotating rings */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: isCenter ? 20 : 14 }}>
          {/* Rank badge */}
          <div style={{ position: "relative", width: isCenter ? 80 : 60, height: isCenter ? 80 : 60, flexShrink: 0 }}>
            {/* Rotating outer ring */}
            <svg
              width={isCenter ? 80 : 60}
              height={isCenter ? 80 : 60}
              style={{ position: "absolute", transform: `rotate(${frame * 2}deg)` }}
            >
              <circle
                cx={isCenter ? 40 : 30}
                cy={isCenter ? 40 : 30}
                r={isCenter ? 36 : 26}
                fill="none"
                stroke={accentColor}
                strokeWidth="2"
                strokeDasharray="8 4"
                opacity={isCenter ? 0.8 : 0.4}
              />
            </svg>
            {/* Counter-rotating inner ring */}
            <svg
              width={isCenter ? 80 : 60}
              height={isCenter ? 80 : 60}
              style={{ position: "absolute", transform: `rotate(${-frame * 1.5}deg)` }}
            >
              <circle
                cx={isCenter ? 40 : 30}
                cy={isCenter ? 40 : 30}
                r={isCenter ? 28 : 20}
                fill="none"
                stroke={colors.neonPurple}
                strokeWidth="1.5"
                strokeDasharray="5 3"
                opacity={isCenter ? 0.6 : 0.3}
              />
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
              <span
                style={{
                  fontSize: isCenter ? 28 : 20,
                  fontWeight: 900,
                  color: colors.white,
                  textShadow: isCenter ? `0 0 20px ${accentColor}` : "none",
                  lineHeight: 1,
                }}
              >
                {String(choice.no).padStart(2, "0")}
              </span>
              {isCenter && (
                <span style={{ fontSize: 8, fontWeight: 800, color: accentColor, letterSpacing: 2, marginTop: 2 }}>
                  RANK
                </span>
              )}
            </div>
          </div>

          {/* Institute type badge and label */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div
                style={{
                  background: isCenter ? accentColor : `${accentColor}60`,
                  color: isCenter ? "#000" : colors.textMuted,
                  padding: isCenter ? "5px 12px" : "3px 8px",
                  borderRadius: 6,
                  fontSize: isCenter ? 11 : 9,
                  fontWeight: 900,
                  letterSpacing: 1,
                  boxShadow: isCenter ? `0 0 15px ${accentColor}50` : "none",
                }}
              >
                {tag}
              </div>
              <span style={{ fontSize: 9, color: colors.textMuted, letterSpacing: 1 }}>PREFERENCE #{choice.no}</span>
            </div>
            {/* Priority indicator */}
            {isCenter && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${Math.max(30, 100 - choice.no * 1.5)}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${accentColor}, ${colors.neonPurple})`,
                      borderRadius: 2,
                      boxShadow: `0 0 10px ${accentColor}`,
                    }}
                  />
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: accentColor }}>{Math.round(Math.max(30, 100 - choice.no * 1.5))}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Divider with glow */}
        <div
          style={{
            height: 2,
            background: isCenter
              ? `linear-gradient(90deg, transparent, ${accentColor}60, ${colors.neonPurple}60, transparent)`
              : "rgba(255,255,255,0.1)",
            marginBottom: isCenter ? 20 : 14,
            position: "relative",
          }}
        >
          {isCenter && (
            <div
              style={{
                position: "absolute",
                top: -2,
                left: `${(frame * 1.5) % 100}%`,
                width: 60,
                height: 6,
                background: `radial-gradient(ellipse, ${colors.white}80, transparent)`,
              }}
            />
          )}
        </div>

        {/* COLLEGE AND PROGRAM SIDE BY SIDE */}
        <div style={{ display: "flex", gap: isCenter ? 24 : 16 }}>
          {/* College Section */}
          <div style={{ flex: 1.2, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: accentColor,
                  boxShadow: isCenter ? `0 0 10px ${accentColor}` : "none",
                }}
              />
              <span style={{ fontSize: 9, fontWeight: 700, color: colors.textMuted, letterSpacing: 1 }}>COLLEGE</span>
            </div>
            <div
              style={{
                fontSize: isCenter ? 16 : 12,
                fontWeight: 700,
                color: isCenter ? colors.white : colors.textMuted,
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {instituteShort}
            </div>
          </div>

          {/* Vertical divider */}
          <div
            style={{
              width: 2,
              background: isCenter
                ? `linear-gradient(to bottom, transparent, ${accentColor}50, transparent)`
                : "rgba(255,255,255,0.1)",
              margin: "0 4px",
            }}
          />

          {/* Program Section */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: colors.neonPurple,
                  boxShadow: isCenter ? `0 0 10px ${colors.neonPurple}` : "none",
                }}
              />
              <span style={{ fontSize: 9, fontWeight: 700, color: colors.textMuted, letterSpacing: 1 }}>PROGRAM</span>
            </div>
            <div
              style={{
                fontSize: isCenter ? 14 : 11,
                fontWeight: 600,
                color: isCenter ? colors.neonPurple : colors.textMuted,
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {programShort}
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        {isCenter && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "10%",
              right: "10%",
              height: 3,
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
              borderRadius: "3px 3px 0 0",
            }}
          />
        )}
      </div>
    </div>
  );
};

// ============ HEADER COMPONENT ============
const Header: React.FC<{
  frame: number;
  currentSection: number;
  highlightStart: number;
  highlightEnd: number;
  total: number;
}> = ({ frame, currentSection, highlightStart, highlightEnd, total }) => {
  return (
    <div style={{ position: "absolute", top: 40, left: 60, right: 60, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Left side - Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Animated section indicator */}
          <div style={{ position: "relative", width: 70, height: 70 }}>
            {/* Orbiting dots */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: [colors.neonPink, colors.neonPurple, colors.neonBlue][i],
                  transform: `rotate(${frame * 2 + i * 120}deg) translateX(30px) translateY(-50%)`,
                  boxShadow: `0 0 10px ${[colors.neonPink, colors.neonPurple, colors.neonBlue][i]}`,
                }}
              />
            ))}
            {/* Center badge */}
            <div
              style={{
                position: "absolute",
                inset: 10,
                borderRadius: "50%",
                background: "rgba(20,20,40,0.9)",
                border: `2px solid ${colors.neonPink}50`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 8, color: colors.textMuted, letterSpacing: 1 }}>SEC</span>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: colors.neonPink,
                  textShadow: `0 0 15px ${colors.neonPink}`,
                  lineHeight: 1,
                }}
              >
                {String(currentSection + 1).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div>
            <GlitchText text="FILLED CHOICES" frame={frame} fontSize={36} color={colors.white} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
              <span style={{ fontSize: 13, color: colors.textMuted }}>Showing</span>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: colors.neonPink,
                  textShadow: `0 0 10px ${colors.neonPink}`,
                }}
              >
                {highlightStart + 1} - {highlightEnd}
              </span>
              <span style={{ fontSize: 13, color: colors.textMuted }}>of {total}</span>
            </div>
          </div>
        </div>

        {/* Right side - Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Progress bar */}
          <div style={{ width: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: colors.textMuted, letterSpacing: 1 }}>PROGRESS</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: colors.neonPink }}>
                {Math.round(((currentSection + 1) / 14) * 100)}%
              </span>
            </div>
            <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
              <div
                style={{
                  width: `${((currentSection + 1) / 14) * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${colors.neonPink}, ${colors.neonPurple})`,
                  borderRadius: 4,
                  boxShadow: `0 0 20px ${colors.neonPink}50`,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>

          {/* Circular progress */}
          <div style={{ position: "relative", width: 60, height: 60 }}>
            <svg width="60" height="60" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle
                cx="30"
                cy="30"
                r="26"
                fill="none"
                stroke={colors.neonPurple}
                strokeWidth="4"
                strokeDasharray={`${((currentSection + 1) / 14) * 163} 163`}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${colors.neonPurple})` }}
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
                fontWeight: 900,
                color: colors.white,
              }}
            >
              {currentSection + 1}/{14}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============
export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate current subsection
  const currentSubsection = Math.min(Math.floor(frame / SUBSECTION_DURATION), 13);
  const frameInSubsection = frame % SUBSECTION_DURATION;

  // Current highlighted choices
  const highlightStartIndex = currentSubsection * CHOICES_PER_SUBSECTION;
  const highlightEndIndex = Math.min(highlightStartIndex + CHOICES_PER_SUBSECTION, filledChoices.choices.length);

  // Get choices to display (3 center + context)
  const centerChoices = filledChoices.choices.slice(highlightStartIndex, highlightEndIndex);
  const prevChoice = highlightStartIndex > 0 ? filledChoices.choices[highlightStartIndex - 1] : null;
  const nextChoice = highlightEndIndex < filledChoices.choices.length ? filledChoices.choices[highlightEndIndex] : null;

  // Entry animations for cards
  const getEntryProgress = (index: number) => {
    const startFrame = index * 8; // Stagger
    return spring({
      frame: Math.max(0, frameInSubsection - startFrame),
      fps,
      config: { damping: 20, stiffness: 100, mass: 0.8 },
    });
  };

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, ${colors.neonPurple}15 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, ${colors.neonBlue}12 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, ${colors.neonPink}08 0%, transparent 60%),
          linear-gradient(180deg, #030308 0%, #080812 50%, #0a0815 100%)
        `,
        overflow: "hidden",
        perspective: "1200px",
      }}
    >
      {/* Background effects */}
      <DigitalRain frame={frame} />
      <MorphingBlob frame={frame} color={colors.neonPurple} size={600} x={-10} y={20} speed={1} />
      <MorphingBlob frame={frame} color={colors.neonBlue} size={500} x={80} y={60} speed={1.2} />
      <MorphingBlob frame={frame} color={colors.neonPink} size={400} x={40} y={-10} speed={0.8} />
      <EnergyRings frame={frame} />
      <ParticleSystem frame={frame} />
      <ScanLines frame={frame} />

      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${colors.neonPurple}08 1px, transparent 1px),
            linear-gradient(90deg, ${colors.neonPurple}08 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          opacity: 0.5,
        }}
      />

      {/* Header */}
      <Header
        frame={frame}
        currentSection={currentSubsection}
        highlightStart={highlightStartIndex}
        highlightEnd={highlightEndIndex}
        total={filledChoices.totalChoices}
      />

      {/* 3D Card Stage */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformStyle: "preserve-3d",
          perspective: "1200px",
        }}
      >
        {/* Far left context card */}
        {prevChoice && highlightStartIndex > 1 && (
          <Choice3DCard
            choice={filledChoices.choices[highlightStartIndex - 2]}
            position="far-left"
            index={-2}
            frame={frame}
            fps={fps}
            entryProgress={1}
          />
        )}

        {/* Left context card (previous) */}
        {prevChoice && (
          <Choice3DCard
            choice={prevChoice}
            position="left"
            index={-1}
            frame={frame}
            fps={fps}
            entryProgress={1}
          />
        )}

        {/* Center cards (highlighted) - stacked vertically */}
        {centerChoices.map((choice, idx) => {
          const centerPositions: Array<"center-top" | "center-mid" | "center-bot"> = ["center-top", "center-mid", "center-bot"];
          return (
            <Choice3DCard
              key={choice.no}
              choice={choice}
              position={centerPositions[idx] || "center-mid"}
              index={idx}
              frame={frame}
              fps={fps}
              entryProgress={getEntryProgress(idx)}
            />
          );
        })}

        {/* Right context card (next) */}
        {nextChoice && (
          <Choice3DCard
            choice={nextChoice}
            position="right"
            index={centerChoices.length}
            frame={frame}
            fps={fps}
            entryProgress={1}
          />
        )}

        {/* Far right context card */}
        {nextChoice && highlightEndIndex < filledChoices.choices.length - 1 && (
          <Choice3DCard
            choice={filledChoices.choices[highlightEndIndex + 1]}
            position="far-right"
            index={centerChoices.length + 1}
            frame={frame}
            fps={fps}
            entryProgress={1}
          />
        )}
      </div>

      {/* Bottom stats bar */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "center",
          gap: 60,
        }}
      >
        {[
          { label: "IIT", count: filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length, color: colors.neonBlue },
          { label: "NIT", count: filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length, color: colors.neonGreen },
          { label: "GFTI", count: filledChoices.totalChoices - filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length - filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length, color: colors.neonPink },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: item.color,
                boxShadow: `0 0 15px ${item.color}`,
              }}
            />
            <span style={{ fontSize: 14, color: colors.textMuted, fontWeight: 600 }}>{item.label}</span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: item.color,
                textShadow: `0 0 10px ${item.color}50`,
              }}
            >
              {item.count}
            </span>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <div
        style={{
          position: "absolute",
          left: 30,
          top: "50%",
          transform: `translateY(-50%) translateX(${Math.sin(frame * 0.05) * 5}px)`,
          opacity: prevChoice ? 0.6 : 0.2,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: `2px solid ${colors.neonPink}`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 15px ${colors.neonPink}30`,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderLeft: `3px solid ${colors.neonPink}`,
              borderBottom: `3px solid ${colors.neonPink}`,
              transform: "rotate(45deg) translateX(2px)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 30,
          top: "50%",
          transform: `translateY(-50%) translateX(${-Math.sin(frame * 0.05) * 5}px)`,
          opacity: nextChoice ? 0.6 : 0.2,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: `2px solid ${colors.neonPink}`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 15px ${colors.neonPink}30`,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRight: `3px solid ${colors.neonPink}`,
              borderTop: `3px solid ${colors.neonPink}`,
              transform: "rotate(45deg) translateX(-2px)",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
