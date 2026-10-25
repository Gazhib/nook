import Link from "next/link";
import { Icon } from "../../Icon";

export const RoomsSidebar = () => (
  <aside className="hidden w-[232px] shrink-0 flex-col border-r border-hair bg-[#fcfcf8] px-5 py-8 md:flex">
    <p className="eyebrow mb-5 px-3 text-muted">Your workspace</p>
    <Link
      href="/rooms"
      aria-current="page"
      className="flex items-center gap-3 rounded-lg bg-fill-2 px-3 py-3 text-[13px] font-medium text-accent"
    >
      <Icon name="rooms" size={18} />
      All rooms
      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
    </Link>
    <div className="mt-auto pt-20">
      <div className="rounded-xl border border-hair bg-paper p-4">
        <span className="mb-5 block text-accent">
          <Icon name="rooms" size={25} />
        </span>
        <p className="font-display text-xl leading-tight">
          Make space for
          <br />
          your next idea.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Your rooms live here. Pick up a plan, move things around, and make it
          yours.
        </p>
      </div>
      <p className="mt-6 px-1 text-[10px] text-muted">
        Thoughtfully simple. Made for real life.
      </p>
    </div>
  </aside>
);
