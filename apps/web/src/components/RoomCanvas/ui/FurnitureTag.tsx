import { FurnitureItem } from "@nook/shared";

interface FurnitureProps {
  type: string;
  width: number;
  height: number;
  color: string;
  onDragStart?: (e: React.DragEvent) => void;
  onClick?: (piece: FurnitureItem) => void;
  toggleWebsocket?: () => void;
}

export const FurnitureTag = ({
  type,
  width,
  height,
  color,
  onDragStart,
  onClick,
  toggleWebsocket,
}: FurnitureProps) => {
  return (
    <div
      draggable
      // onDragStart={onDragStart}
      onClick={() => {
        onClick?.({
          id: "",
          type,
          position: { x: 0, y: 0 },
          width,
          height,
          color,
          rotation: 0,
        });
      }}
      title={`${type} (${width}×${height})`}
      className="flex items-center gap-2 px-2 py-1.5 rounded cursor-grab active:cursor-grabbing hover:bg-fill-2 transition-colors group"
    >
      <div
        className="shrink-0 rounded-sm border border-hair"
        style={{ width: 20, height: 14, backgroundColor: color }}
      />
      <span className="font-body text-sm text-ink-2 group-hover:text-ink transition-colors">
        {type}
      </span>
      <span className="ml-auto font-mono text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity">
        {width}×{height}
      </span>
    </div>
  );
};
