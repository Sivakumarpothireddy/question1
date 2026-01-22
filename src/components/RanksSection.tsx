import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors, containerStyle, sectionTitleStyle, cardStyle, explanationBoxStyle } from "../styles";
import { ranksData } from "../data";

export const RanksSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  const highlightPhase = Math.floor(
    interpolate(frame, [50, 200], [0, 4], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const explanationOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateRight: "clamp",
  });

  const getExplanation = (phase: number): string => {
    const explanations: Record<number, string> = {
      0: "JEE Main Rank (15540) is used for NITs, IIITs, and GFTIs admission. JEE Advanced Rank (8541) is used for IIT admissions.",
      1: "CRL (Common Rank List) shows the overall ranking among all candidates. This is the primary rank used for general category seat allocation.",
      2: "GEN-EWS Rank (2040 Main, 1004 Advanced) is the rank within the Economically Weaker Section category, providing additional reservation benefits.",
      3: "The B.Arch and B.Planning columns show '--' because the candidate didn't appear for these papers or isn't eligible for architecture programs.",
    };
    return explanations[phase] || explanations[0];
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
          Section 3: Rank(s)
        </h1>
        <p
          style={{
            fontSize: "22px",
            color: colors.lightText,
            margin: "0",
            textAlign: "center",
          }}
        >
          JEE Main and JEE Advanced rankings across different categories
        </p>
      </div>

      <div
        style={{
          ...cardStyle,
          opacity: cardOpacity,
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h2 style={sectionTitleStyle}>{ranksData.title}</h2>

        <div style={{ padding: "25px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "20px" }}>
            <thead>
              <tr style={{ backgroundColor: colors.secondary }}>
                <th style={{ padding: "15px 20px", color: colors.white, textAlign: "left", fontWeight: "600" }}>
                  Rank List
                </th>
                <th style={{ padding: "15px 20px", color: colors.white, textAlign: "center", fontWeight: "600" }}>
                  JEE(Main) B.E./B.Tech
                </th>
                <th style={{ padding: "15px 20px", color: colors.white, textAlign: "center", fontWeight: "600" }}>
                  JEE(Main) B.Arch
                </th>
                <th style={{ padding: "15px 20px", color: colors.white, textAlign: "center", fontWeight: "600" }}>
                  JEE(Main) B.Planning
                </th>
                <th style={{ padding: "15px 20px", color: colors.white, textAlign: "center", fontWeight: "600" }}>
                  JEE(Advanced)
                </th>
              </tr>
            </thead>
            <tbody>
              {ranksData.fields.map((field, index) => {
                const isHighlighted = index === highlightPhase || (index === 0 && highlightPhase === 0);
                const rowSpring = spring({
                  frame: frame - 40 - index * 20,
                  fps,
                  config: { damping: 100, stiffness: 200, mass: 0.5 },
                });

                return (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: isHighlighted ? colors.highlight : index % 2 === 0 ? colors.tableRow : colors.white,
                      boxShadow: isHighlighted ? `inset 4px 0 0 ${colors.accent}` : "none",
                      opacity: rowSpring,
                    }}
                  >
                    <td
                      style={{
                        padding: "18px 20px",
                        fontWeight: "600",
                        color: colors.text,
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      {field.label}
                    </td>
                    <td
                      style={{
                        padding: "18px 20px",
                        textAlign: "center",
                        color: isHighlighted ? colors.accent : colors.text,
                        fontWeight: isHighlighted ? "bold" : "normal",
                        fontSize: isHighlighted ? "24px" : "20px",
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      {field.value}
                    </td>
                    <td
                      style={{
                        padding: "18px 20px",
                        textAlign: "center",
                        color: colors.lightText,
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      --
                    </td>
                    <td
                      style={{
                        padding: "18px 20px",
                        textAlign: "center",
                        color: colors.lightText,
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      --
                    </td>
                    <td
                      style={{
                        padding: "18px 20px",
                        textAlign: "center",
                        color: isHighlighted ? colors.success : colors.text,
                        fontWeight: isHighlighted ? "bold" : "normal",
                        fontSize: isHighlighted ? "24px" : "20px",
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      {field.advanced}
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
          maxWidth: "1400px",
          margin: "25px auto 0",
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
            Key Insight
          </div>
          <p style={{ margin: 0, fontSize: "22px", lineHeight: 1.6 }}>
            {getExplanation(highlightPhase)}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginTop: "20px",
          opacity: interpolate(frame, [120, 150], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            backgroundColor: colors.primary,
            color: colors.white,
            padding: "15px 25px",
            borderRadius: "10px",
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          <strong>Better JEE Advanced Rank</strong>
          <br />
          8541 vs 15540 (Main)
        </div>
        <div
          style={{
            backgroundColor: colors.success,
            color: colors.white,
            padding: "15px 25px",
            borderRadius: "10px",
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          <strong>EWS Advantage</strong>
          <br />
          Rank 1004 in EWS category
        </div>
      </div>

    </AbsoluteFill>
  );
};
