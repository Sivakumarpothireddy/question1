import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";

export const OutroSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleScale = spring({
    frame: frame,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.5 },
  });

  const summaryOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardsOpacity = interpolate(frame, [50, 90], [0, 1], {
    extrapolateRight: "clamp",
  });

  const thankYouOpacity = interpolate(frame, [100, 130], [0, 1], {
    extrapolateRight: "clamp",
  });

  const sections = [
    { icon: "👤", title: "Candidate Details", desc: "Personal information" },
    { icon: "📝", title: "JEE Advanced", desc: "Exam details & eligibility" },
    { icon: "🏆", title: "Rankings", desc: "JEE Main & Advanced ranks" },
    { icon: "🔒", title: "Locking Status", desc: "Choices verification" },
    { icon: "📋", title: "41 Choices", desc: "College preferences" },
    { icon: "✅", title: "Declaration", desc: "Rules acknowledgment" },
  ];

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
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            color: colors.white,
            margin: "0 0 15px 0",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Document Summary
        </h1>
        <p
          style={{
            fontSize: "24px",
            color: "#a0aec0",
            margin: 0,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          JoSAA 2025 Registration-cum-Locked Choices
        </p>
      </div>

      <div
        style={{
          opacity: summaryOpacity,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: "25px 40px",
          borderRadius: "16px",
          marginBottom: "40px",
          maxWidth: "900px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "22px",
            color: colors.white,
            lineHeight: 1.6,
            margin: 0,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          <strong>KUNCHE NAGA VARUN SANDEEP</strong> from Andhra Pradesh has registered for JoSAA 2025
          with <strong>JEE Advanced Rank 8541</strong> (EWS Rank 1004) and locked <strong>41 choices</strong> across IITs, NITs, and other institutions.
        </p>
      </div>

      <div
        style={{
          opacity: cardsOpacity,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          maxWidth: "1100px",
          width: "100%",
        }}
      >
        {sections.map((section, index) => {
          const cardSpring = spring({
            frame: frame - 50 - index * 8,
            fps,
            config: { damping: 15, stiffness: 150, mass: 0.4 },
          });

          return (
            <div
              key={index}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "25px",
                borderRadius: "12px",
                textAlign: "center",
                transform: `scale(${cardSpring})`,
                opacity: cardSpring,
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>{section.icon}</div>
              <h3
                style={{
                  fontSize: "20px",
                  color: colors.white,
                  margin: "0 0 5px 0",
                  fontWeight: "bold",
                }}
              >
                {section.title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#a0aec0",
                  margin: 0,
                }}
              >
                {section.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div
        style={{
          opacity: thankYouOpacity,
          marginTop: "50px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "200px",
            height: "4px",
            backgroundColor: colors.accent,
            margin: "0 auto 30px",
            borderRadius: "2px",
          }}
        />
        <h2
          style={{
            fontSize: "36px",
            color: colors.accent,
            margin: "0 0 10px 0",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Thank You for Watching!
        </h2>
        <p
          style={{
            fontSize: "18px",
            color: "#a0aec0",
            margin: 0,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          JoSAA 2025 Document Explainer
        </p>
      </div>
    </AbsoluteFill>
  );
};
