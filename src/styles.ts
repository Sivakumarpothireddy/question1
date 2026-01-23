import { CSSProperties } from "react";

// Modern Dark Theme with Neon Accents
export const colors = {
  // Dark backgrounds
  darkBg: "#0a0a0f",
  darkCard: "#12121a",
  darkSurface: "#1a1a2e",

  // Neon accents
  neonBlue: "#00d4ff",
  neonPurple: "#a855f7",
  neonPink: "#ec4899",
  neonGreen: "#22c55e",
  neonOrange: "#f97316",
  neonYellow: "#facc15",

  // Text
  white: "#ffffff",
  textPrimary: "#f0f0f5",
  textSecondary: "#a0a0b0",
  textMuted: "#606070",

  // Glass effect colors
  glassBg: "rgba(255, 255, 255, 0.05)",
  glassBorder: "rgba(255, 255, 255, 0.1)",
  glassHighlight: "rgba(255, 255, 255, 0.15)",

  // Legacy (for compatibility)
  primary: "#667eea",
  secondary: "#764ba2",
  accent: "#00d4ff",
  success: "#22c55e",
  warning: "#f97316",
  text: "#f0f0f5",
  lightText: "#a0a0b0",
  border: "rgba(255, 255, 255, 0.1)",
  tableRow: "rgba(255, 255, 255, 0.03)",
  highlight: "rgba(0, 212, 255, 0.1)",
  tableHeader: "#667eea",
};

// Modern container style with dark theme
export const containerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  padding: "50px 60px",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  display: "flex",
  flexDirection: "column",
  background: "linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)",
  boxSizing: "border-box",
};

// Glassmorphism card style
export const glassCard: CSSProperties = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
};

// Legacy styles for compatibility
export const headerStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: "30px",
};

export const mainTitleStyle: CSSProperties = {
  fontSize: "42px",
  fontWeight: "bold",
  color: colors.neonBlue,
  margin: "0 0 10px 0",
};

export const subTitleStyle: CSSProperties = {
  fontSize: "24px",
  color: colors.textSecondary,
  margin: "0",
};

export const sectionTitleStyle: CSSProperties = {
  fontSize: "36px",
  fontWeight: "bold",
  color: colors.white,
  padding: "15px 25px",
  borderRadius: "8px 8px 0 0",
  margin: "0",
};

export const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "20px",
};

export const tableCellStyle: CSSProperties = {
  padding: "12px 20px",
  borderBottom: `1px solid ${colors.border}`,
  textAlign: "left",
};

export const labelCellStyle: CSSProperties = {
  ...tableCellStyle,
  fontWeight: "600",
  color: colors.textPrimary,
  width: "40%",
};

export const valueCellStyle: CSSProperties = {
  ...tableCellStyle,
  color: colors.textPrimary,
};

export const highlightedRowStyle: CSSProperties = {
  boxShadow: `0 0 20px ${colors.neonBlue}40`,
};

export const explanationBoxStyle: CSSProperties = {
  backgroundColor: colors.glassBg,
  border: `2px solid ${colors.neonBlue}`,
  borderRadius: "16px",
  padding: "20px",
  marginTop: "20px",
  fontSize: "22px",
  color: colors.textPrimary,
  lineHeight: 1.6,
};

export const cardStyle: CSSProperties = {
  ...glassCard,
  overflow: "hidden",
  flex: 1,
};

export const pointerStyle: CSSProperties = {
  width: "30px",
  height: "30px",
  backgroundColor: colors.neonBlue,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: colors.darkBg,
  fontSize: "18px",
  fontWeight: "bold",
};
