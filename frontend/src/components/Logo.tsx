export const Wordmark = ({
  size = 28,
  color = "var(--color-ink)",
  accent = "var(--color-accent)",
}: {
  size?: number;
  color?: string;
  accent?: string;
}) => {
  return (
    <div
      className="font-display inline-flex items-center"
      style={{ gap: size * 0.25 }}
    >
      <svg
        width={size * 1.6}
        height={size}
        viewBox="0 0 160 100"
        className="block"
      >
        <path
          d={`M8 82 L8 32 M8 48 Q8 32 22 32 Q36 32 36 48 L36 82`}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={64}
          cy={58}
          r={22}
          fill="none"
          stroke={color}
          strokeWidth="9"
        />
        <circle
          cx={112}
          cy={58}
          r={22}
          fill="none"
          stroke={accent}
          strokeWidth="9"
        />
        <circle cx={112} cy={58} r={5.5} fill={accent} />
        <path
          d={`M146 20 L146 82 M146 58 L160 42 M146 58 L162 82`}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
