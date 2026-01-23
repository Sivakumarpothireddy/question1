import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { colors } from "../styles";
import { lockingDetails } from "../data";

export const LockingSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 30], [-40, 0], { extrapolateRight: "clamp" });

  const lockScale = spring({
    frame: frame - 50,
    fps,
    config: { damping: 8, stiffness: 100, mass: 0.5 },
  });

  const pulseOpacity = interpolate(
    (frame % 60),
    [0, 30, 60],
    [0.3, 0.8, 0.3],
    { extrapolateRight: "clamp" }
  );

  const icons = ["📊", "🔒", "🌐", "📅", "🔐"];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #0a0f1a 50%, #1a0a1a 100%)",
        padding: "50px 60px",
        overflow: "hidden",
      }}
    >
      {/* Animated lock rings */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "25%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${200 + i * 80}px`,
              height: `${200 + i * 80}px`,
              borderRadius: "50%",
              border: `2px solid ${colors.neonOrange}${30 - i * 10}`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: pulseOpacity * (1 - i * 0.2),
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          marginBottom: "30px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px", justifyContent: "center" }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.neonOrange}, ${colors.neonYellow})`,
              borderRadius: "12px",
              padding: "10px 20px",
              boxShadow: `0 0 30px ${colors.neonOrange}50`,
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "700", color: colors.darkBg }}>04</span>
          </div>
          <h1 style={{ fontSize: "42px", fontWeight: "800", color: colors.white, margin: 0 }}>
            Locking Status
          </h1>
        </div>
        <p style={{ fontSize: "18px", color: colors.textSecondary, margin: "12px 0 0 0", textAlign: "center" }}>
          Choice verification and security details
        </p>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", gap: "30px", flex: 1, position: "relative", zIndex: 10 }}>
        {/* Left: Lock animation */}
        <div
          style={{
            width: "350px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              transform: `scale(${Math.max(0, lockScale)})`,
              opacity: lockScale,
            }}
          >
            <div
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.neonOrange}, ${colors.neonYellow})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 60px ${colors.neonOrange}60, 0 20px 40px rgba(0,0,0,0.3)`,
              }}
            >
              <span style={{ fontSize: "80px" }}>🔒</span>
            </div>
          </div>

          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
              opacity: interpolate(frame, [100, 130], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <p
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color: colors.neonGreen,
                margin: "0 0 8px 0",
                textShadow: `0 0 20px ${colors.neonGreen}60`,
              }}
            >
              SYSTEM LOCKED
            </p>
            <p style={{ fontSize: "14px", color: colors.textSecondary, margin: 0 }}>
              Choices are final and secure
            </p>
          </div>

          {/* Stats cards */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "30px",
              opacity: interpolate(frame, [140, 170], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${colors.neonOrange}20, ${colors.neonOrange}10)`,
                border: `1px solid ${colors.neonOrange}50`,
                borderRadius: "16px",
                padding: "20px 25px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "36px", fontWeight: "900", color: colors.neonOrange, margin: 0 }}>41</p>
              <p style={{ fontSize: "12px", color: colors.textSecondary, margin: "5px 0 0 0" }}>Choices</p>
            </div>
            <div
              style={{
                background: `linear-gradient(135deg, ${colors.neonGreen}20, ${colors.neonGreen}10)`,
                border: `1px solid ${colors.neonGreen}50`,
                borderRadius: "16px",
                padding: "20px 25px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "36px", fontWeight: "900", color: colors.neonGreen, margin: 0 }}>✓</p>
              <p style={{ fontSize: "12px", color: colors.textSecondary, margin: "5px 0 0 0" }}>Verified</p>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div
          style={{
            flex: 1,
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            padding: "30px",
          }}
        >
          <h3 style={{ fontSize: "18px", color: colors.white, margin: "0 0 24px 0", fontWeight: "600" }}>
            Verification Details
          </h3>

          {lockingDetails.fields.map((field, index) => {
            const delay = 60 + index * 20;
            const cardOpacity = interpolate(frame, [delay, delay + 30], [0, 1], { extrapolateRight: "clamp" });
            const cardX = interpolate(frame, [delay, delay + 30], [30, 0], { extrapolateRight: "clamp" });

            return (
              <div
                key={index}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  padding: "20px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  opacity: cardOpacity,
                  transform: `translateX(${cardX}px)`,
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${colors.neonOrange}30, ${colors.neonYellow}30)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    flexShrink: 0,
                  }}
                >
                  {icons[index]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", color: colors.textMuted, margin: "0 0 4px 0" }}>{field.label}</p>
                  <p
                    style={{
                      fontSize: field.label === "Locking Code" ? "12px" : "16px",
                      color: field.label === "Locking Status" ? colors.neonGreen : colors.white,
                      margin: 0,
                      fontWeight: "600",
                      fontFamily: field.label === "Locking Code" || field.label === "Locking IP" ? "monospace" : "inherit",
                      wordBreak: field.label === "Locking Code" ? "break-all" : "normal",
                    }}
                  >
                    {field.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
