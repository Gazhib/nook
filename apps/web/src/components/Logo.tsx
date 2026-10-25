import Link from "next/link";

export const Wordmark = ({
  onClick,
  size = 28,
  color = "var(--color-ink)",
  accent = "var(--color-accent)",
}: {
  onClick?: () => void;
  size?: number;
  color?: string;
  accent?: string;
}) => {
  const mark = (
    <>
      <svg
        width={size * 1.15}
        height={size * 1.15}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 27V7h14v8h8v12H5Z"
          stroke={accent}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M11 27V13h8M19 20h8" stroke={accent} strokeWidth="2.4" />
      </svg>
      <span
        style={{ fontSize: size * 1.25, color, letterSpacing: "-0.07em" }}
        className="font-body font-semibold leading-none"
      >
        nook<span style={{ color: accent }}>.</span>
      </span>
    </>
  );
  const className =
    "inline-flex shrink-0 items-center gap-2.5 rounded-sm select-none";
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      aria-label="Nook home"
      className={className}
    >
      {mark}
    </button>
  ) : (
    <Link href="/" aria-label="Nook home" className={className}>
      {mark}
    </Link>
  );
};
