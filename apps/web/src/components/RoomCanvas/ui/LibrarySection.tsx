import { FurnitureItem } from "@nook/shared";
import Image from "next/image";

export type LibraryItem = Omit<FurnitureItem, "id" | "position" | "rotation">;

export const LibrarySection = ({
  title,
  items,
  onAdd,
}: {
  title: string;
  items: LibraryItem[];
  onAdd: (item: FurnitureItem) => void;
}) => (
  <section className="mb-6">
    <h3 className="mb-3 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[.12em] text-muted md:text-[10px]">
      {title}
      <span className="hidden font-mono text-[9px] font-normal md:inline">
        {String(items.length).padStart(2, "0")}
      </span>
    </h3>
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {items.map((item) => (
        <button
          type="button"
          key={item.type}
          onClick={() =>
            onAdd({ ...item, id: "", position: { x: 0, y: 0 }, rotation: 0 })
          }
          title={`Add ${item.type.toLowerCase()}`}
          className="group flex min-h-[102px] min-w-0 flex-col items-center justify-center gap-2 rounded-lg border border-hair-2 bg-[#fafbf7] p-2 transition-colors hover:border-[#a9b99f] hover:bg-fill"
        >
          <Image
            src={`/svgs/${item.type.toLowerCase()}.svg`}
            alt=""
            width={60}
            height={52}
            className="h-[48px] w-[60px] object-contain transition-transform group-hover:scale-105"
            unoptimized
          />
          <span className="text-[10px] text-ink-2 md:text-[11px]">
            {item.type}
          </span>
        </button>
      ))}
    </div>
  </section>
);
