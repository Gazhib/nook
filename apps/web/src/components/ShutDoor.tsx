export const ShutDoor = ({ size = 72, dashed = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "block" }}
    >
      {/* door frame */}
      <rect
        x="26"
        y="14"
        width="48"
        height="74"
        rx="3"
        fill="none"
        stroke={"#1d1a16"}
        strokeWidth="2.4"
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      {/* door panel */}
      <rect
        x="32"
        y="20"
        width="36"
        height="68"
        rx="2"
        fill={"rgba(29, 26, 22, 0.04)"}
        stroke={"#1d1a16"}
        strokeWidth="1.4"
      />
      {/* peephole — accent, echoes the "oo" mark */}
      <circle
        cx="50"
        cy="40"
        r="6"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.4"
      />
      <circle cx="50" cy="40" r="1.6" fill="var(--color-accent)" />
      {/* handle */}
      <circle
        cx="61"
        cy="56"
        r="2.4"
        fill="none"
        stroke={"#1d1a16"}
        strokeWidth="1.4"
      />
    </svg>
  );
};
