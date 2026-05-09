const INK = "var(--color-ink)";
const PAPER = "var(--color-paper)";
const HAIR = "var(--color-hair)";
const HAIR_2 = "var(--color-hair-2)";
const MUTED = "var(--color-muted)";
const ACCENT = "var(--color-accent)";
const FONT_BODY = "var(--font-body)";
const FONT_MONO = "var(--font-mono)";

export const TopDownRoom = ({
  w = 600,
  h = 368,
  selectedId = "table",
  showCursors = true,
}: {
  w?: number;
  h?: number;
  selectedId?: string;
  showCursors?: boolean;
}) => {
  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="bg-paper block"
    >
      {/* subtle plan grid */}
      <defs>
        <pattern
          id="planGrid"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M24 0 L0 0 0 24"
            fill="none"
            stroke={HAIR_2}
            strokeWidth="0.8"
          />
        </pattern>
      </defs>
      <rect x="0" y="0" width={w} height={h} fill="url(#planGrid)" />
      {/* room outline */}
      <g transform={`translate(${(w - 440) / 2}, ${(h - 280) / 2})`}>
        <rect
          x="0"
          y="0"
          width="440"
          height="280"
          fill="white"
          stroke={INK}
          strokeWidth="1.5"
        />
        {/* door gap */}
        <rect x="340" y="-1" width="50" height="3" fill={PAPER} />
        <path
          d="M340 0 Q 340 40 380 40"
          fill="none"
          stroke={HAIR}
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        {/* window */}
        <rect
          x="40"
          y="-3"
          width="90"
          height="6"
          fill="white"
          stroke={INK}
          strokeWidth="1"
        />

        {/* rug */}
        <rect
          x="60"
          y="70"
          width="200"
          height="120"
          fill="rgba(184,86,62,0.08)"
          stroke={MUTED}
          strokeWidth="0.8"
          strokeDasharray="3 2"
        />

        {/* sofa — top */}
        <g>
          <rect
            x="70"
            y="24"
            width="170"
            height="46"
            rx="3"
            fill="rgba(29,26,22,0.06)"
            stroke={INK}
            strokeWidth="1.2"
          />
          <line
            x1="127"
            y1="24"
            x2="127"
            y2="70"
            stroke={INK}
            strokeWidth="0.8"
            opacity="0.5"
          />
          <line
            x1="184"
            y1="24"
            x2="184"
            y2="70"
            stroke={INK}
            strokeWidth="0.8"
            opacity="0.5"
          />
        </g>

        {/* coffee table — center, selected */}
        <g>
          <rect
            x="110"
            y="100"
            width="100"
            height="56"
            rx="2"
            fill="white"
            stroke={selectedId === "table" ? ACCENT : INK}
            strokeWidth={selectedId === "table" ? 2 : 1.2}
          />
          {selectedId === "table" &&
            [
              [110, 100],
              [210, 100],
              [110, 156],
              [210, 156],
            ].map(([x, y], i) => (
              <rect
                key={i}
                x={x - 3}
                y={y - 3}
                width="6"
                height="6"
                fill="white"
                stroke={ACCENT}
                strokeWidth="1.5"
              />
            ))}
        </g>

        {/* armchair — right */}
        <g>
          <rect
            x="290"
            y="60"
            width="60"
            height="60"
            rx="4"
            fill="rgba(29,26,22,0.06)"
            stroke={INK}
            strokeWidth="1.2"
          />
          <rect
            x="290"
            y="60"
            width="60"
            height="10"
            fill="rgba(29,26,22,0.12)"
            stroke={INK}
            strokeWidth="1"
          />
        </g>

        {/* bookshelf — right wall */}
        <g>
          <rect
            x="400"
            y="40"
            width="28"
            height="160"
            fill="rgba(29,26,22,0.10)"
            stroke={INK}
            strokeWidth="1.2"
          />
          <line
            x1="400"
            y1="80"
            x2="428"
            y2="80"
            stroke={INK}
            strokeWidth="0.6"
            opacity="0.6"
          />
          <line
            x1="400"
            y1="120"
            x2="428"
            y2="120"
            stroke={INK}
            strokeWidth="0.6"
            opacity="0.6"
          />
          <line
            x1="400"
            y1="160"
            x2="428"
            y2="160"
            stroke={INK}
            strokeWidth="0.6"
            opacity="0.6"
          />
        </g>

        {/* lamp — corner */}
        <g>
          <circle
            cx="30"
            cy="240"
            r="10"
            fill="rgba(184,86,62,0.10)"
            stroke={INK}
            strokeWidth="1.1"
          />
          <circle cx="30" cy="240" r="3" fill={INK} opacity="0.5" />
        </g>

        {/* plant */}
        <g>
          <circle
            cx="395"
            cy="248"
            r="12"
            fill="rgba(122,143,107,0.22)"
            stroke={INK}
            strokeWidth="1.1"
          />
          <circle cx="395" cy="248" r="4" fill="rgba(122,143,107,0.5)" />
        </g>

        {/* dimension hints */}
        <g fontFamily={FONT_MONO} fontSize="9" fill={MUTED}>
          <text x="220" y="-10" textAnchor="middle">
            4.40 m
          </text>
          <text
            x="-14"
            y="144"
            textAnchor="middle"
            transform="rotate(-90, -14, 144)"
          >
            2.80 m
          </text>
        </g>
      </g>

      {/* remote cursors */}
      {showCursors && (
        <>
          <g
            transform={`translate(${(w - 440) / 2 + 90}, ${(h - 280) / 2 + 100})`}
          >
            <path
              d="M0 0 L0 16 L5 12 L8 20 L11 19 L8 11 L14 11 Z"
              fill="#7A8F6B"
              stroke="white"
              strokeWidth="1"
            />
            <rect x="14" y="14" width="44" height="16" rx="3" fill="#7A8F6B" />
            <text
              x="36"
              y="25"
              textAnchor="middle"
              fontFamily={FONT_BODY}
              fontSize="10"
              fill="white"
              fontWeight="500"
            >
              Alex
            </text>
          </g>
          <g
            transform={`translate(${(w - 440) / 2 + 300}, ${(h - 280) / 2 + 170})`}
          >
            <path
              d="M0 0 L0 16 L5 12 L8 20 L11 19 L8 11 L14 11 Z"
              fill="#B8563E"
              stroke="white"
              strokeWidth="1"
            />
            <rect x="14" y="14" width="44" height="16" rx="3" fill="#B8563E" />
            <text
              x="36"
              y="25"
              textAnchor="middle"
              fontFamily={FONT_BODY}
              fontSize="10"
              fill="white"
              fontWeight="500"
            >
              Mira
            </text>
          </g>
        </>
      )}
    </svg>
  );
};
