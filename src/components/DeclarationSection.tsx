import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors, containerStyle, cardStyle } from "../styles";
import { declaration } from "../data";

export const DeclarationSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.5 },
  });

  const checkmarkScale = spring({
    frame: frame - 80,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.3 },
  });

  const noteOpacity = interpolate(frame, [100, 130], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={containerStyle}>
      <div
        style={{
          opacity: titleOpacity,
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: colors.primary,
            margin: "0 0 5px 0",
            textAlign: "center",
          }}
        >
          Section 6: Declaration
        </h1>
        <p
          style={{
            fontSize: "22px",
            color: colors.lightText,
            margin: "0",
            textAlign: "center",
          }}
        >
          Acknowledgment and agreement to JoSAA rules
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <div
          style={{
            ...cardStyle,
            opacity: cardOpacity,
            transform: `scale(${cardScale})`,
            maxWidth: "1000px",
            width: "100%",
          }}
        >
          <div
            style={{
              backgroundColor: colors.primary,
              padding: "25px 35px",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: colors.white,
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <span style={{ fontSize: "36px" }}>📋</span>
              {declaration.title}
            </h2>
          </div>

          <div style={{ padding: "40px" }}>
            <div
              style={{
                backgroundColor: colors.highlight,
                border: `2px solid ${colors.accent}`,
                borderRadius: "12px",
                padding: "30px",
                marginBottom: "30px",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  color: colors.primary,
                  margin: "0 0 20px 0",
                  fontWeight: "bold",
                }}
              >
                {declaration.heading}
              </h3>
              <p
                style={{
                  fontSize: "20px",
                  color: colors.text,
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {declaration.content}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                transform: `scale(${checkmarkScale})`,
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: colors.success,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  color: colors.white,
                }}
              >
                ✓
              </div>
              <span
                style={{
                  fontSize: "24px",
                  color: colors.success,
                  fontWeight: "bold",
                }}
              >
                Declaration Acknowledged
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          opacity: noteOpacity,
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            backgroundColor: colors.secondary,
            color: colors.white,
            padding: "20px 30px",
            borderRadius: "12px",
            fontSize: "18px",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          <strong>Important:</strong> By submitting, the candidate agrees to follow all JoSAA 2025 admission rules and processes.
        </div>
        <div
          style={{
            backgroundColor: colors.accent,
            color: colors.white,
            padding: "20px 30px",
            borderRadius: "12px",
            fontSize: "18px",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          <strong>Legal Binding:</strong> This declaration serves as the candidate's commitment to the admission process.
        </div>
      </div>

    </AbsoluteFill>
  );
};
