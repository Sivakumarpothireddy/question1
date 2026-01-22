import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors, containerStyle, cardStyle } from "../styles";
import { filledChoices } from "../data";

// Constants for timing
const SUBSECTION_DURATION = 600; // 10 seconds at 60fps
const CHOICES_PER_SUBSECTION = 3;

export const FilledChoicesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate which subsection we're in (0-13)
  const currentSubsection = Math.floor(frame / SUBSECTION_DURATION);
  const frameInSubsection = frame % SUBSECTION_DURATION;

  // Calculate which choices to show
  const startChoiceIndex = currentSubsection * CHOICES_PER_SUBSECTION;
  const endChoiceIndex = Math.min(startChoiceIndex + CHOICES_PER_SUBSECTION, filledChoices.choices.length);
  const currentChoices = filledChoices.choices.slice(startChoiceIndex, endChoiceIndex);

  // Animation values for the subsection
  const titleOpacity = interpolate(frameInSubsection, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(frameInSubsection, [20, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardTranslateY = interpolate(frameInSubsection, [20, 50], [40, 0], {
    extrapolateRight: "clamp",
  });

  // Group choices by institute type for statistics
  const iitCount = filledChoices.choices.filter(c => c.institute.includes("Indian Institute of Technology")).length;
  const nitCount = filledChoices.choices.filter(c => c.institute.includes("National Institute of Technology")).length;
  const otherCount = filledChoices.totalChoices - iitCount - nitCount;

  const getChoiceExplanation = (choice: typeof filledChoices.choices[0]): string => {
    if (choice.institute.includes("Bombay") && choice.program.includes("Computer Science")) {
      return "IIT Bombay CSE - The most prestigious engineering program in India. Top choice for aspiring tech professionals!";
    }
    if (choice.institute.includes("Delhi") && choice.program.includes("Computer Science")) {
      return "IIT Delhi CSE - Another top-tier program with excellent placements and research opportunities.";
    }
    if (choice.program.includes("Computer Science")) {
      return `Computer Science at ${choice.institute.replace("Indian Institute of Technology", "IIT").replace("National Institute of Technology", "NIT")} - Excellent career prospects in tech industry.`;
    }
    if (choice.program.includes("Artificial Intelligence")) {
      return `AI/ML program - Cutting-edge curriculum preparing students for the future of technology.`;
    }
    if (choice.program.includes("Mathematics and Computing")) {
      return `Mathematics and Computing - Perfect blend of mathematical rigor and programming skills for quant roles.`;
    }
    if (choice.program.includes("Electrical")) {
      return `Electrical Engineering - Core branch with diverse opportunities in power, electronics, and tech.`;
    }
    if (choice.program.includes("Electronics")) {
      return `Electronics and Communication - Strong foundation for careers in semiconductors, telecom, and embedded systems.`;
    }
    if (choice.program.includes("Chemical")) {
      return `Chemical Engineering - Opportunities in pharmaceuticals, petrochemicals, and process industries.`;
    }
    if (choice.program.includes("Civil")) {
      return `Civil Engineering - Build the infrastructure of tomorrow with this foundational engineering branch.`;
    }
    if (choice.program.includes("Mechanical")) {
      return `Mechanical Engineering - Versatile branch covering automotive, aerospace, and manufacturing.`;
    }
    if (choice.program.includes("Data Science")) {
      return `Data Science program - High-demand field combining statistics, programming, and domain expertise.`;
    }
    return `${choice.institute.replace("Indian Institute of Technology", "IIT").replace("National Institute of Technology", "NIT")} - Quality education with good placement record.`;
  };

  const getInstituteColor = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) return colors.primary;
    if (institute.includes("National Institute of Technology")) return colors.success;
    return colors.secondary;
  };

  const getInstituteTag = (institute: string): string => {
    if (institute.includes("Indian Institute of Technology")) return "IIT";
    if (institute.includes("National Institute of Technology")) return "NIT";
    if (institute.includes("MANIT") || institute.includes("Maulana Azad")) return "NIT";
    return "GFTI";
  };

  return (
    <AbsoluteFill style={containerStyle}>
      {/* Header */}
      <div
        style={{
          opacity: titleOpacity,
          marginBottom: "20px",
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
            fontSize: "22px",
            color: colors.lightText,
            margin: "0",
            textAlign: "center",
          }}
        >
          Subsection {currentSubsection + 1} of 14 | Showing Choices {startChoiceIndex + 1} - {endChoiceIndex} of 41
        </p>
      </div>

      {/* Main content area */}
      <div style={{ display: "flex", gap: "25px", flex: 1, minHeight: 0 }}>
        {/* Choices cards */}
        <div
          style={{
            flex: "3",
            opacity: cardOpacity,
            transform: `translateY(${cardTranslateY}px)`,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {currentChoices.map((choice, index) => {
            const cardSpring = spring({
              frame: frameInSubsection - 30 - index * 15,
              fps,
              config: { damping: 12, stiffness: 100, mass: 0.5 },
            });

            const instituteShort = choice.institute
              .replace("Indian Institute of Technology", "IIT")
              .replace("National Institute of Technology", "NIT")
              .replace("Maulana Azad National Institute of Technology", "MANIT")
              .replace("Shri G. S. Institute of Technology and Science", "SGSITS");

            const programShort = choice.program
              .replace("(4 Years, Bachelor of Technology)", "")
              .replace("(5 Years, Bachelor and Master of Technology (Dual Degree))", "(Dual Degree)")
              .replace("(4 Years, Bachelor of Science)", "(B.Sc)")
              .trim();

            return (
              <div
                key={choice.no}
                style={{
                  ...cardStyle,
                  opacity: cardSpring,
                  transform: `scale(${cardSpring})`,
                  display: "flex",
                  overflow: "hidden",
                }}
              >
                {/* Choice number */}
                <div
                  style={{
                    backgroundColor: getInstituteColor(choice.institute),
                    color: colors.white,
                    padding: "25px 30px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "100px",
                  }}
                >
                  <span style={{ fontSize: "14px", opacity: 0.8 }}>Choice</span>
                  <span style={{ fontSize: "48px", fontWeight: "bold" }}>{choice.no}</span>
                  <span
                    style={{
                      fontSize: "14px",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      marginTop: "8px",
                    }}
                  >
                    {getInstituteTag(choice.institute)}
                  </span>
                </div>

                {/* Choice details */}
                <div style={{ flex: 1, padding: "20px 25px" }}>
                  <h3
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: colors.text,
                      margin: "0 0 10px 0",
                    }}
                  >
                    {instituteShort}
                  </h3>
                  <p
                    style={{
                      fontSize: "20px",
                      color: colors.accent,
                      margin: "0 0 15px 0",
                      fontWeight: "500",
                    }}
                  >
                    {programShort}
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: colors.lightText,
                      margin: 0,
                      lineHeight: 1.5,
                      backgroundColor: colors.highlight,
                      padding: "12px 15px",
                      borderRadius: "8px",
                      borderLeft: `4px solid ${colors.accent}`,
                    }}
                  >
                    {getChoiceExplanation(choice)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Side panel with statistics */}
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            opacity: interpolate(frameInSubsection, [60, 90], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {/* Progress indicator */}
          <div
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "16px", margin: "0 0 10px 0", opacity: 0.8 }}>Progress</h3>
            <div
              style={{
                width: "100%",
                height: "12px",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "6px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: `${((currentSubsection + 1) / 14) * 100}%`,
                  height: "100%",
                  backgroundColor: colors.accent,
                  borderRadius: "6px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <p style={{ fontSize: "14px", margin: 0 }}>
              {endChoiceIndex} of 41 choices shown
            </p>
          </div>

          {/* Distribution */}
          <div
            style={{
              backgroundColor: colors.tableRow,
              padding: "20px",
              borderRadius: "12px",
              border: `1px solid ${colors.border}`,
            }}
          >
            <h3 style={{ fontSize: "16px", margin: "0 0 15px 0", color: colors.text }}>
              Choice Distribution
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "12px", backgroundColor: colors.primary, borderRadius: "3px" }} />
                  <span style={{ fontSize: "14px", color: colors.text }}>IITs</span>
                </div>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: colors.primary }}>{iitCount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "12px", backgroundColor: colors.success, borderRadius: "3px" }} />
                  <span style={{ fontSize: "14px", color: colors.text }}>NITs</span>
                </div>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: colors.success }}>{nitCount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "12px", backgroundColor: colors.secondary, borderRadius: "3px" }} />
                  <span style={{ fontSize: "14px", color: colors.text }}>Others</span>
                </div>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: colors.secondary }}>{otherCount}</span>
              </div>
            </div>
          </div>

          {/* Current subsection info */}
          <div
            style={{
              backgroundColor: colors.accent,
              color: colors.white,
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "32px", fontWeight: "bold", margin: "0 0 5px 0" }}>
              {currentSubsection + 1}/14
            </h3>
            <p style={{ fontSize: "14px", margin: 0, opacity: 0.9 }}>
              Current Subsection
            </p>
          </div>

          {/* Tip box */}
          <div
            style={{
              backgroundColor: colors.highlight,
              padding: "15px",
              borderRadius: "12px",
              border: `2px solid ${colors.accent}`,
              fontSize: "14px",
              color: colors.text,
              lineHeight: 1.5,
            }}
          >
            <strong>Tip:</strong> Choices are ordered by preference. Higher choices are attempted first during seat allocation.
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
};
