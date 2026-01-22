import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors, containerStyle, sectionTitleStyle, cardStyle, explanationBoxStyle } from "../styles";
import { jeeAdvancedDetails } from "../data";
import { TeacherAvatar } from "./TeacherAvatar";
import { narrationScripts } from "../narration";

export const JEEAdvancedSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardTranslateY = interpolate(frame, [15, 35], [30, 0], {
    extrapolateRight: "clamp",
  });

  const highlightIndex = Math.floor(
    interpolate(frame, [40, 160], [0, jeeAdvancedDetails.fields.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const explanationOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateRight: "clamp",
  });

  const getExplanation = (index: number): string => {
    const explanations: Record<number, string> = {
      0: "The unique roll number assigned for JEE Advanced examination - required for IIT admissions.",
      1: "Registration number for JEE Advanced, used for all correspondence and verification.",
      2: "DS Status indicates Defence Service quota eligibility - 'NO' means not applicable for this candidate.",
      3: "AAT (Architecture Aptitude Test) status - 'NO' indicates the candidate didn't appear for architecture programs.",
      4: "Colour Blindness status - 'NO' means the candidate has normal color vision, eligible for all programs.",
      5: "One Eyed Vision status - 'NO' indicates normal binocular vision, meeting medical requirements for all courses.",
    };
    return explanations[index] || "";
  };

  return (
    <AbsoluteFill style={containerStyle}>
      <div
        style={{
          opacity: titleOpacity,
          marginBottom: "30px",
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
          Section 2: JEE(Advanced) Details
        </h1>
        <p
          style={{
            fontSize: "22px",
            color: colors.lightText,
            margin: "0",
            textAlign: "center",
          }}
        >
          Information specific to JEE Advanced examination and IIT eligibility
        </p>
      </div>

      <div
        style={{
          ...cardStyle,
          opacity: cardOpacity,
          transform: `translateY(${cardTranslateY}px)`,
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h2 style={sectionTitleStyle}>{jeeAdvancedDetails.title}</h2>

        <div style={{ padding: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "22px" }}>
            <tbody>
              {jeeAdvancedDetails.fields.map((field, index) => {
                const isHighlighted = index === highlightIndex;
                const rowSpring = spring({
                  frame: frame - 40 - index * 18,
                  fps,
                  config: { damping: 100, stiffness: 200, mass: 0.5 },
                });

                return (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: isHighlighted ? colors.highlight : index % 2 === 0 ? colors.tableRow : colors.white,
                      transition: "background-color 0.3s ease",
                      boxShadow: isHighlighted ? `inset 4px 0 0 ${colors.accent}` : "none",
                      opacity: rowSpring,
                    }}
                  >
                    <td
                      style={{
                        padding: "18px 25px",
                        fontWeight: "600",
                        color: colors.text,
                        width: "50%",
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      {field.label}
                    </td>
                    <td
                      style={{
                        padding: "18px 25px",
                        color: isHighlighted ? colors.accent : colors.text,
                        fontWeight: isHighlighted ? "bold" : "normal",
                        fontSize: isHighlighted ? "24px" : "22px",
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      {field.value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          ...explanationBoxStyle,
          opacity: explanationOpacity,
          maxWidth: "1200px",
          margin: "20px auto 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}>
          <div
            style={{
              backgroundColor: colors.accent,
              color: colors.white,
              padding: "10px 20px",
              borderRadius: "20px",
              fontSize: "18px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            Explanation
          </div>
          <p style={{ margin: 0, fontSize: "22px", lineHeight: 1.6 }}>
            {getExplanation(highlightIndex)}
          </p>
        </div>
      </div>

      {/* AI Teacher Avatar */}
      <TeacherAvatar narrationText={narrationScripts.jeeAdvanced.text} />
    </AbsoluteFill>
  );
};
