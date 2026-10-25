import { Icon } from "@/components/Icon";

export const SnapToggle = ({ on = true }) => (
  <div
    className="flex min-h-9 items-center gap-2 rounded-lg border border-hair bg-white px-3 text-[10px] text-muted shadow-sm"
    title="Furniture snaps to the grid when placed"
  >
    <Icon name="grid" size={13} />
    <span className="hidden sm:inline">Grid snapping</span>
    <span
      className={`h-1.5 w-1.5 rounded-full ${on ? "bg-accent" : "bg-muted"}`}
    />
    <span>{on ? "On" : "Off"}</span>
  </div>
);
