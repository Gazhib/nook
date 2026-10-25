import type { CSSProperties } from "react";

const paths = {
  arrow: "M4 12h16m-6-6 6 6-6 6",
  back: "M20 12H4m6-6-6 6 6 6",
  plus: "M12 5v14M5 12h14",
  rooms: "M3 3h18v18H3V3Zm9 0v10h9M3 13h9v8",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  share: "M12 16V3m-5 5 5-5 5 5M5 13v7h14v-7",
  chevron: "m9 5 7 7-7 7",
  close: "m6 6 12 12M6 18 18 6",
  help: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 3.9m.1 3h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
  grid: "M3 3h6v6H3zm12 0h6v6h-6zM3 15h6v6H3zm12 0h6v6h-6z",
  lock: "M5 10h14v11H5V10Zm3 0V7a4 4 0 0 1 8 0v3m-4 5v2",
  check: "m5 12 4 4L19 6",
} as const;

export function Icon({
  name,
  size = 18,
  className = "",
  style,
}: {
  name: keyof typeof paths;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  );
}
