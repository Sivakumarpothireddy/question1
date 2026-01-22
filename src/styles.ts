import { CSSProperties } from "react";

export const colors = {
  primary: "#1a365d",
  secondary: "#2c5282",
  accent: "#3182ce",
  highlight: "#ebf8ff",
  text: "#2d3748",
  lightText: "#718096",
  white: "#ffffff",
  tableHeader: "#2b6cb0",
  tableRow: "#f7fafc",
  tableRowAlt: "#edf2f7",
  success: "#38a169",
  border: "#e2e8f0",
};

export const containerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  backgroundColor: colors.white,
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  display: "flex",
  flexDirection: "column",
  padding: "40px",
  boxSizing: "border-box",
};

export const headerStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: "30px",
};

export const mainTitleStyle: CSSProperties = {
  fontSize: "42px",
  fontWeight: "bold",
  color: colors.primary,
  margin: "0 0 10px 0",
};

export const subTitleStyle: CSSProperties = {
  fontSize: "24px",
  color: colors.secondary,
  margin: "0",
};

export const sectionTitleStyle: CSSProperties = {
  fontSize: "36px",
  fontWeight: "bold",
  color: colors.white,
  backgroundColor: colors.tableHeader,
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
  color: colors.text,
  width: "40%",
  backgroundColor: colors.tableRow,
};

export const valueCellStyle: CSSProperties = {
  ...tableCellStyle,
  color: colors.text,
  backgroundColor: colors.white,
};

export const highlightedRowStyle: CSSProperties = {
  backgroundColor: colors.highlight,
  boxShadow: `0 0 10px ${colors.accent}`,
};

export const explanationBoxStyle: CSSProperties = {
  backgroundColor: colors.highlight,
  border: `2px solid ${colors.accent}`,
  borderRadius: "8px",
  padding: "20px",
  marginTop: "20px",
  fontSize: "22px",
  color: colors.text,
  lineHeight: 1.6,
};

export const pointerStyle: CSSProperties = {
  width: "30px",
  height: "30px",
  backgroundColor: colors.accent,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: colors.white,
  fontSize: "18px",
  fontWeight: "bold",
};

export const cardStyle: CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  flex: 1,
};
