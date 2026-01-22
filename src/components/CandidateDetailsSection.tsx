import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors, containerStyle, sectionTitleStyle, cardStyle, explanationBoxStyle } from "../styles";
import { candidateDetails } from "../data";

export const CandidateDetailsSection: React.FC = () => {
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

  // Calculate which row to highlight based on frame
  const highlightIndex = Math.floor(
    interpolate(frame, [40, 240], [0, candidateDetails.fields.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const explanationOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateRight: "clamp",
  });

  const getExplanation = (index: number): string => {
    const explanations: Record<number, string> = {
      0: "The unique JEE Main application number used to identify the candidate throughout the admission process.",
      1: "The full name of the candidate as registered in the JEE examination system.",
      2: "Father's name as per official records for verification purposes.",
      3: "Mother's name as per official records for verification purposes.",
      4: "The gender of the candidate - used for category-specific seat allocation if applicable.",
      5: "Date of birth for age verification and eligibility determination.",
      6: "GEN-EWS category indicates General category with Economically Weaker Section status, providing reservation benefits.",
      7: "Person with Disability status - 'NO' indicates the candidate doesn't qualify for PwD reservation.",
      8: "Andhra Pradesh is the state of eligibility, determining home state quota for certain institutions.",
      9: "Indian nationality confirmed for admission eligibility to government institutions.",
      10: "Class XII passed within India, meeting the educational qualification requirements.",
    };
    return explanations[index] || "";
  };

  return (
    <AbsoluteFill style={containerStyle}>
      <div
        style={{
          opacity: titleOpacity,
          marginBottom: "20px",
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
          Section 1: Candidate Details
        </h1>
        <p
          style={{
            fontSize: "22px",
            color: colors.lightText,
            margin: "0",
            textAlign: "center",
          }}
        >
          Personal information of the applicant
        </p>
      </div>

      <div
        style={{
          ...cardStyle,
          opacity: cardOpacity,
          transform: `translateY(${cardTranslateY}px)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={sectionTitleStyle}>{candidateDetails.title}</h2>

        <div style={{ padding: "0", flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "18px" }}>
            <tbody>
              {candidateDetails.fields.map((field, index) => {
                const isHighlighted = index === highlightIndex;
                const rowSpring = spring({
                  frame: frame - 40 - index * 15,
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
                        padding: "14px 20px",
                        fontWeight: "600",
                        color: colors.text,
                        width: "45%",
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      {field.label}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        color: isHighlighted ? colors.accent : colors.text,
                        fontWeight: isHighlighted ? "bold" : "normal",
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
          marginTop: "15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}>
          <div
            style={{
              backgroundColor: colors.accent,
              color: colors.white,
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "16px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            Explanation
          </div>
          <p style={{ margin: 0, fontSize: "20px", lineHeight: 1.5 }}>
            {getExplanation(highlightIndex)}
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
