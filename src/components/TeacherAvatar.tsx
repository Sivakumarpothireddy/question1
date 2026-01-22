import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";

interface TeacherAvatarProps {
  narrationText: string;
  isVisible?: boolean;
}

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({ narrationText, isVisible = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.8 },
  });

  // Talking animation - mouth opens and closes
  const talkingCycle = Math.sin(frame * 0.5) * 0.5 + 0.5;
  const mouthHeight = interpolate(talkingCycle, [0, 1], [4, 16]);

  // Subtle body movement
  const bodyBob = Math.sin(frame * 0.05) * 4;
  const headTilt = Math.sin(frame * 0.03) * 2;

  // Blinking animation
  const blinkFrame = frame % 180;
  const isBlinking = blinkFrame > 175;
  const eyeHeight = isBlinking ? 2 : 16;

  // Hand gesture animation
  const handGesture = Math.sin(frame * 0.08) * 8;

  // Text display animation
  const textOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "30px",
        right: "30px",
        width: "750px",
        height: "650px",
        transform: `scale(${entranceSpring})`,
        transformOrigin: "bottom right",
        zIndex: 100,
      }}
    >
      {/* Speech bubble with narration text - 3x larger */}
      <div
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          right: "220px",
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          borderRadius: "24px",
          padding: "24px 30px",
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
          opacity: textOpacity,
          maxHeight: "200px",
          overflow: "hidden",
          border: `3px solid ${colors.accent}`,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "22px",
            lineHeight: 1.5,
            color: colors.text,
            fontFamily: "'Segoe UI', sans-serif",
            fontWeight: "500",
          }}
        >
          {narrationText.slice(0, 280)}
          {narrationText.length > 280 ? "..." : ""}
        </p>
        {/* Speech bubble arrow */}
        <div
          style={{
            position: "absolute",
            bottom: "-20px",
            right: "80px",
            width: 0,
            height: 0,
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderTop: `20px solid ${colors.accent}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-14px",
            right: "84px",
            width: 0,
            height: 0,
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            borderTop: "16px solid rgba(255, 255, 255, 0.98)",
          }}
        />
      </div>

      {/* Avatar container - 3x larger (600x600) */}
      <svg
        width="600"
        height="600"
        viewBox="0 0 200 200"
        style={{
          position: "absolute",
          bottom: "0px",
          right: "0px",
        }}
      >
        {/* Gaming Chair */}
        <g transform={`translate(30, 60)`}>
          {/* Chair back */}
          <path
            d="M40 20 L50 0 L110 0 L120 20 L120 100 L40 100 Z"
            fill="#1a1a2e"
            stroke="#e94560"
            strokeWidth="3"
          />
          {/* Chair back design */}
          <path
            d="M55 10 L55 90 M105 10 L105 90"
            stroke="#e94560"
            strokeWidth="2"
            opacity="0.5"
          />
          {/* Chair headrest */}
          <ellipse cx="80" cy="5" rx="25" ry="8" fill="#1a1a2e" stroke="#e94560" strokeWidth="2" />

          {/* Chair seat */}
          <ellipse cx="80" cy="105" rx="45" ry="12" fill="#1a1a2e" stroke="#e94560" strokeWidth="2" />

          {/* Chair armrests */}
          <rect x="25" y="70" width="15" height="40" rx="3" fill="#1a1a2e" stroke="#e94560" strokeWidth="2" />
          <rect x="120" y="70" width="15" height="40" rx="3" fill="#1a1a2e" stroke="#e94560" strokeWidth="2" />

          {/* Chair base */}
          <path
            d="M60 115 L60 140 L50 150 M100 115 L100 140 L110 150 M80 115 L80 145"
            stroke="#333"
            strokeWidth="4"
            fill="none"
          />
          {/* Chair wheels */}
          <circle cx="50" cy="152" r="6" fill="#444" />
          <circle cx="110" cy="152" r="6" fill="#444" />
          <circle cx="80" cy="147" r="6" fill="#444" />
        </g>

        {/* Teacher Body */}
        <g transform={`translate(70, ${70 + bodyBob})`}>
          {/* Body/Torso */}
          <path
            d="M0 50 Q-15 60 -20 90 L60 90 Q55 60 40 50 Z"
            fill="#3498db"
          />
          {/* Collar */}
          <path
            d="M10 50 L20 65 L30 50"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />

          {/* Left Arm */}
          <g transform={`rotate(${-10 + handGesture}, 0, 55)`}>
            <path
              d="M-5 55 Q-25 70 -30 90"
              fill="none"
              stroke="#3498db"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Left Hand */}
            <circle cx="-32" cy="92" r="8" fill="#f5d0a9" />
          </g>

          {/* Right Arm - gesturing */}
          <g transform={`rotate(${5 - handGesture * 0.5}, 40, 55)`}>
            <path
              d="M45 55 Q65 65 75 50"
              fill="none"
              stroke="#3498db"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Right Hand */}
            <circle cx="78" cy="48" r="8" fill="#f5d0a9" />
            {/* Pointing finger */}
            <line
              x1="82"
              y1="45"
              x2="92"
              y2="40"
              stroke="#f5d0a9"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Teacher Head */}
        <g transform={`translate(90, ${45 + bodyBob}) rotate(${headTilt})`}>
          {/* Neck */}
          <rect x="-8" y="25" width="16" height="15" fill="#f5d0a9" />

          {/* Head shape */}
          <ellipse cx="0" cy="0" rx="28" ry="32" fill="#f5d0a9" />

          {/* Hair */}
          <path
            d="M-28 -5 Q-30 -30 -15 -35 Q0 -40 15 -35 Q30 -30 28 -5"
            fill="#2c3e50"
          />
          <path
            d="M-25 -5 Q-20 -15 0 -18 Q20 -15 25 -5"
            fill="#2c3e50"
          />

          {/* Glasses */}
          <g transform="translate(0, -2)">
            <rect x="-22" y="-5" width="18" height="14" rx="3" fill="none" stroke="#333" strokeWidth="2" />
            <rect x="4" y="-5" width="18" height="14" rx="3" fill="none" stroke="#333" strokeWidth="2" />
            <line x1="-4" y1="2" x2="4" y2="2" stroke="#333" strokeWidth="2" />
            {/* Lens reflection */}
            <line x1="-18" y1="-2" x2="-14" y2="2" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <line x1="8" y1="-2" x2="12" y2="2" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          </g>

          {/* Eyes */}
          <ellipse cx="-13" cy="0" rx="5" ry={eyeHeight / 2} fill="#2c3e50" />
          <ellipse cx="13" cy="0" rx="5" ry={eyeHeight / 2} fill="#2c3e50" />
          {/* Eye shine */}
          {!isBlinking && (
            <>
              <circle cx="-11" cy="-1" r="2" fill="white" />
              <circle cx="15" cy="-1" r="2" fill="white" />
            </>
          )}

          {/* Eyebrows */}
          <path d="M-20 -10 Q-13 -13 -6 -10" fill="none" stroke="#2c3e50" strokeWidth="2" />
          <path d="M6 -10 Q13 -13 20 -10" fill="none" stroke="#2c3e50" strokeWidth="2" />

          {/* Nose */}
          <path d="M0 5 L2 12 L-2 12" fill="none" stroke="#d4a574" strokeWidth="2" />

          {/* Mouth - animated for talking */}
          <ellipse
            cx="0"
            cy="20"
            rx="8"
            ry={mouthHeight}
            fill="#c0392b"
          />
          {/* Teeth hint when mouth is open */}
          {mouthHeight > 8 && (
            <rect x="-6" y="17" width="12" height="3" fill="white" rx="1" />
          )}

          {/* Ears */}
          <ellipse cx="-28" cy="5" rx="5" ry="8" fill="#f5d0a9" />
          <ellipse cx="28" cy="5" rx="5" ry="8" fill="#f5d0a9" />
        </g>

        {/* Name tag */}
        <g transform="translate(50, 175)">
          <rect x="0" y="0" width="100" height="22" rx="4" fill={colors.primary} />
          <text
            x="50"
            y="15"
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontFamily="'Segoe UI', sans-serif"
            fontWeight="bold"
          >
            AI TEACHER
          </text>
        </g>
      </svg>
    </div>
  );
};
