import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors, containerStyle, sectionTitleStyle, cardStyle, explanationBoxStyle } from "../styles";
import { filledChoices } from "../data";

export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Show first 15 choices with scrolling effect
  const scrollOffset = Math.floor(
    interpolate(frame, [60, 400], [0, 26], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const visibleChoices = filledChoices.choices.slice(scrollOffset, scrollOffset + 12);

  const highlightIndex = scrollOffset;

  const explanationOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateRight: "clamp",
  });

  const getExplanation = (index: number): string => {
    const choice = filledChoices.choices[index];
    if (!choice) return "";

    if (choice.institute.includes("Bombay") && choice.program.includes("Computer Science")) {
      return "IIT Bombay CSE - The most sought-after program in India. First preference shows the candidate's top aspiration!";
    }
    if (choice.program.includes("Computer Science")) {
      return `Computer Science at ${choice.institute.replace("Indian Institute of Technology", "IIT").replace("National Institute of Technology", "NIT")} - A popular choice for tech-oriented students.`;
    }
    if (choice.program.includes("Artificial Intelligence")) {
      return `AI/ML programs are gaining popularity! ${choice.institute.replace("Indian Institute of Technology", "IIT")} offers cutting-edge curriculum in this field.`;
    }
    if (choice.program.includes("Electrical")) {
      return `Electrical Engineering - A core branch with excellent placements and research opportunities.`;
    }
    if (choice.program.includes("Mathematics and Computing")) {
      return `Mathematics and Computing combines mathematical rigor with programming skills - ideal for quantitative roles.`;
    }
    return `Choice ${choice.no}: ${choice.institute.replace("Indian Institute of Technology", "IIT").replace("National Institute of Technology", "NIT")} - ${choice.program.split("(")[0].trim()}`;
  };

  // Group choices by institute type
  const iitCount = filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length;
  const nitCount = filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length;
  const otherCount = filledChoices.totalChoices - iitCount - nitCount;

  return (
    <AbsoluteFill style={containerStyle}>
      <div
        style={{
          opacity: titleOpacity,
          marginBottom: "15px",
        }}
      >
        <h1
          style={{
            fontSize: "44px",
            fontWeight: "bold",
            color: colors.primary,
            margin: "0 0 5px 0",
            textAlign: "center",
          }}
        >
          Section 5: Filled Choices
        </h1>
        <p
          style={{
            fontSize: "20px",
            color: colors.lightText,
            margin: "0",
            textAlign: "center",
          }}
        >
          41 college + program combinations in order of preference
        </p>
      </div>

      <div style={{ display: "flex", gap: "20px", flex: 1, minHeight: 0 }}>
        <div
          style={{
            ...cardStyle,
            opacity: cardOpacity,
            flex: "3",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <h2 style={{ ...sectionTitleStyle, fontSize: "28px", padding: "12px 20px" }}>
            {filledChoices.title} ({filledChoices.totalChoices} choices)
          </h2>

          <div style={{ flex: 1, overflow: "hidden", padding: "10px 15px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
              <thead>
                <tr style={{ backgroundColor: colors.secondary }}>
                  <th style={{ padding: "10px", color: colors.white, textAlign: "center", width: "50px" }}>#</th>
                  <th style={{ padding: "10px", color: colors.white, textAlign: "left" }}>Institute</th>
                  <th style={{ padding: "10px", color: colors.white, textAlign: "left" }}>Academic Program</th>
                </tr>
              </thead>
              <tbody>
                {visibleChoices.map((choice, index) => {
                  const actualIndex = scrollOffset + index;
                  const isHighlighted = actualIndex === highlightIndex;
                  const rowSpring = spring({
                    frame: frame - 50 - index * 5,
                    fps,
                    config: { damping: 100, stiffness: 300, mass: 0.3 },
                  });

                  return (
                    <tr
                      key={choice.no}
                      style={{
                        backgroundColor: isHighlighted ? colors.highlight : index % 2 === 0 ? colors.tableRow : colors.white,
                        boxShadow: isHighlighted ? `inset 4px 0 0 ${colors.accent}` : "none",
                        opacity: rowSpring,
                      }}
                    >
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          fontWeight: "bold",
                          color: isHighlighted ? colors.accent : colors.text,
                          borderBottom: `1px solid ${colors.border}`,
                        }}
                      >
                        {choice.no}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          color: colors.text,
                          borderBottom: `1px solid ${colors.border}`,
                          fontSize: "14px",
                        }}
                      >
                        {choice.institute.replace("Indian Institute of Technology", "IIT").replace("National Institute of Technology", "NIT").replace("Maulana Azad National Institute of Technology", "MANIT")}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          color: isHighlighted ? colors.accent : colors.text,
                          fontWeight: isHighlighted ? "600" : "normal",
                          borderBottom: `1px solid ${colors.border}`,
                          fontSize: "13px",
                        }}
                      >
                        {choice.program.replace("(4 Years, Bachelor of Technology)", "(B.Tech)").replace("(5 Years, Bachelor and Master of Technology (Dual Degree))", "(Dual Degree)")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: "8px 15px",
              backgroundColor: colors.tableRow,
              fontSize: "14px",
              color: colors.lightText,
              textAlign: "center",
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            Showing choices {scrollOffset + 1} - {Math.min(scrollOffset + 12, 41)} of 41
          </div>
        </div>

        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            opacity: interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "16px", margin: "0 0 10px 0", opacity: 0.8 }}>Choice Distribution</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px" }}>IITs</span>
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>{iitCount}</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(iitCount / 41) * 100}%`,
                    height: "100%",
                    backgroundColor: colors.accent,
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px" }}>NITs</span>
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>{nitCount}</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(nitCount / 41) * 100}%`,
                    height: "100%",
                    backgroundColor: colors.success,
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px" }}>Others</span>
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>{otherCount}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: colors.success,
              color: colors.white,
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "14px", margin: "0 0 8px 0", opacity: 0.9 }}>Top Priority</h3>
            <p style={{ fontSize: "16px", margin: 0, fontWeight: "bold" }}>
              IIT Bombay
              <br />
              <span style={{ fontSize: "13px", fontWeight: "normal" }}>Computer Science</span>
            </p>
          </div>

          <div
            style={{
              backgroundColor: colors.secondary,
              color: colors.white,
              padding: "15px",
              borderRadius: "12px",
              fontSize: "13px",
            }}
          >
            <strong>Strategy:</strong> Mix of dream colleges (IIT Bombay, Delhi) and realistic options (newer IITs, NITs) based on rank.
          </div>
        </div>
      </div>

      <div
        style={{
          ...explanationBoxStyle,
          opacity: explanationOpacity,
          marginTop: "12px",
          padding: "15px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div
            style={{
              backgroundColor: colors.accent,
              color: colors.white,
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            Current Choice
          </div>
          <p style={{ margin: 0, fontSize: "17px", lineHeight: 1.5 }}>
            {getExplanation(highlightIndex)}
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
