import Link from "next/link";
import { Icon } from "../../Icon";

export const RoomCard = ({
  name,
  id,
  when,
  index = 0,
}: {
  name: string;
  id: string;
  when?: string;
  index?: number;
}) => (
  <Link
    href={`/rooms/${id}`}
    className="room-card group flex min-w-0 flex-col overflow-hidden rounded-xl border border-hair bg-white transition-shadow hover:border-[#9dae99] hover:shadow-[0_6px_24px_#24332c0a]"
  >
    <div
      className="plan-surface relative flex h-[190px] items-center justify-center border-b border-hair-2"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 220 150"
        className="h-[132px] w-[194px] text-[#7b8c71]"
        fill="none"
        stroke="currentColor"
      >
        <path d="M30 25h160v100h-60m-35 0H30V25Z" strokeWidth="2" />
        <path d="M130 125V90a35 35 0 0 0-35 35M135 25v40h55" strokeWidth="1" />
        <path d="M55 23h43v4H55zM188 80h4v25h-4z" fill="#f5f3ed" />
        <path
          d="M30 12h160M18 25v100M30 8v8m160-8v8M14 25h8m-8 100h8"
          strokeWidth=".6"
          opacity=".65"
        />
      </svg>
      <span className="absolute left-4 top-4 rounded border border-hair bg-white/80 px-2 py-1 font-mono text-[9px] text-muted">
        PLAN {String(index + 1).padStart(2, "0")}
      </span>
      <span className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-accent shadow-sm">
        <Icon name="arrow" size={15} className="room-card-arrow" />
      </span>
    </div>
    <div className="p-5">
      <h2 className="truncate text-[15px] font-medium tracking-tight">
        {name}
      </h2>
      <p className="mt-2 text-[11px] text-muted">
        {when ? `Created ${when}` : "Your room, ready to arrange"}
      </p>
    </div>
  </Link>
);
