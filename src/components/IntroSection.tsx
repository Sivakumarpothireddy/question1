import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../styles";
import { TeacherAvatar } from "./TeacherAvatar";
import { narrationScripts } from "../narration";

export const IntroSection: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleScale = interpolate(frame, [0, 30], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(frame, [40, 80], [0, 600], {
    extrapolateRight: "clamp",
  });

  const descriptionOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: colors.white,
            margin: "0 0 20px 0",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Joint Seat Allocation Authority
        </h1>
        <h2
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            color: colors.accent,
            margin: "0",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          JoSAA 2025
        </h2>
      </div>

      <div
        style={{
          width: `${lineWidth}px`,
          height: "4px",
          backgroundColor: colors.accent,
          marginTop: "40px",
          marginBottom: "40px",
          borderRadius: "2px",
        }}
      />

      <div
        style={{
          opacity: subtitleOpacity,
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: "36px",
            color: colors.white,
            margin: "0 0 15px 0",
            fontWeight: "normal",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          IITs, NITs, IIITs and Other-GFTIs
        </h3>
        <h4
          style={{
            fontSize: "28px",
            color: "#a0aec0",
            margin: "0",
            fontWeight: "normal",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Academic Year 2025-26
        </h4>
      </div>

      <div
        style={{
          opacity: descriptionOpacity,
          marginTop: "50px",
          padding: "30px 50px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          maxWidth: "1000px",
        }}
      >
        <p
          style={{
            fontSize: "26px",
            color: colors.white,
            textAlign: "center",
            lineHeight: 1.6,
            margin: 0,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Registration-cum-Locked Choices for Seat Allotment
        </p>
        <p
          style={{
            fontSize: "22px",
            color: "#a0aec0",
            textAlign: "center",
            lineHeight: 1.6,
            margin: "15px 0 0 0",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Let's explore this document section by section
        </p>
      </div>

      {/* AI Teacher Avatar */}
      <TeacherAvatar narrationText={narrationScripts.intro.text} />
    </AbsoluteFill>
  );
};
