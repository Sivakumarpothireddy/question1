import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors, containerStyle, sectionTitleStyle, cardStyle, explanationBoxStyle } from "../styles";
import { lockingDetails } from "../data";

export const LockingSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  const highlightIndex = Math.floor(
    interpolate(frame, [40, 180], [0, lockingDetails.fields.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const explanationOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateRight: "clamp",
  });

  const lockedBadgeScale = spring({
    frame: frame - 60,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.5 },
  });

  const getExplanation = (index: number): string => {
    const explanations: Record<number, string> = {
      0: "The candidate has filled 41 college choices in order of preference. This is a comprehensive list covering top IITs, NITs, and other institutions.",
      1: "'System Locked' means the choices have been automatically locked by the system after the deadline, and no further changes can be made.",
      2: "The IP address from which the choices were last saved - used for security and verification purposes.",
      3: "The last modification was on June 9, 2025 at 8:02 AM IST, capturing the exact moment of final submission.",
      4: "A unique cryptographic code that verifies the authenticity and integrity of the locked choices - prevents tampering.",
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
          Section 4: Locking of Choices
        </h1>
        <p
          style={{
            fontSize: "22px",
            color: colors.lightText,
            margin: "0",
            textAlign: "center",
          }}
        >
          Status and verification details of the submitted choices
        </p>
      </div>

      <div style={{ display: "flex", gap: "30px", flex: 1 }}>
        <div
          style={{
            ...cardStyle,
            opacity: cardOpacity,
            flex: "2",
          }}
        >
          <h2 style={sectionTitleStyle}>{lockingDetails.title}</h2>

          <div style={{ padding: "25px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "20px" }}>
              <tbody>
                {lockingDetails.fields.map((field, index) => {
                  const isHighlighted = index === highlightIndex;
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
                          padding: "18px 25px",
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
                          padding: "18px 25px",
                          color: isHighlighted ? colors.accent : colors.text,
                          fontWeight: isHighlighted ? "bold" : "normal",
                          fontSize: field.label === "Locking Code" ? "14px" : "20px",
                          fontFamily: field.label === "Locking Code" ? "monospace" : "inherit",
                          borderBottom: `1px solid ${colors.border}`,
                          wordBreak: field.label === "Locking Code" ? "break-all" : "normal",
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
            flex: "1",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            opacity: interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              backgroundColor: colors.success,
              color: colors.white,
              padding: "30px",
              borderRadius: "16px",
              textAlign: "center",
              transform: `scale(${lockedBadgeScale})`,
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>🔒</div>
            <h3 style={{ fontSize: "28px", margin: "0 0 10px 0" }}>System Locked</h3>
            <p style={{ fontSize: "16px", margin: 0, opacity: 0.9 }}>
              Choices are final and secure
            </p>
          </div>

          <div
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
              padding: "25px",
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "56px", margin: "0", fontWeight: "bold" }}>41</h3>
            <p style={{ fontSize: "18px", margin: "5px 0 0 0" }}>Total Choices Filed</p>
          </div>

          <div
            style={{
              backgroundColor: colors.secondary,
              color: colors.white,
              padding: "20px",
              borderRadius: "16px",
            }}
          >
            <h4 style={{ fontSize: "16px", margin: "0 0 8px 0", opacity: 0.8 }}>Last Saved</h4>
            <p style={{ fontSize: "18px", margin: 0, fontWeight: "bold" }}>
              09 Jun 2025
              <br />
              08:02 IST
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          ...explanationBoxStyle,
          opacity: explanationOpacity,
          marginTop: "20px",
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
            What This Means
          </div>
          <p style={{ margin: 0, fontSize: "20px", lineHeight: 1.6 }}>
            {getExplanation(highlightIndex)}
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
