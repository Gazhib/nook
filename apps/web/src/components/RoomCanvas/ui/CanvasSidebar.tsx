import { useState } from "react";
import { FurnitureItem } from "@nook/shared";
import { Icon } from "@/components/Icon";
import { LibraryItem, LibrarySection } from "./LibrarySection";

const sections: { title: string; items: LibraryItem[] }[] = [
  {
    title: "Seating",
    items: [
      { type: "Sofa", width: 120, height: 60, color: "#8B7355" },
      { type: "Chair", width: 40, height: 40, color: "#A0926B" },
    ],
  },
  {
    title: "Tables & desks",
    items: [
      { type: "Table", width: 80, height: 80, color: "#6B5B4E" },
      { type: "Desk", width: 100, height: 50, color: "#7D6B5D" },
    ],
  },
  {
    title: "Bed & storage",
    items: [
      { type: "Bed", width: 100, height: 140, color: "#B8A590" },
      { type: "Bookshelf", width: 90, height: 25, color: "#5C4A3A" },
      { type: "Dresser", width: 70, height: 40, color: "#8B7B6B" },
      { type: "Shelf", width: 60, height: 20, color: "#6E5E4E" },
    ],
  },
  {
    title: "Finishing touches",
    items: [
      { type: "Lamp", width: 20, height: 20, color: "#C4A97D" },
      { type: "Rug", width: 120, height: 80, color: "#C9B8A5" },
      { type: "Plant", width: 25, height: 25, color: "#7A8B6F" },
      { type: "Wall", width: 140, height: 24, color: "#CDBFAE" },
    ],
  },
];

export const CanvasSidebar = ({
  addFurniture,
}: {
  addFurniture: (item: FurnitureItem) => void;
}) => {
  const [query, setQuery] = useState("");
  const filtered = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.type.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    }))
    .filter((section) => section.items.length);
  return (
    <aside
      aria-label="Furniture library"
      className="z-10 flex w-[108px] shrink-0 flex-col border-r border-hair bg-[#fcfcf8] md:w-[252px]"
    >
      <div className="border-b border-hair-2 px-3 py-5 md:px-5">
        <h2 className="text-[13px] font-medium md:text-sm">
          Furniture<span className="text-accent"> library</span>
        </h2>
        <p className="mt-1.5 hidden text-[11px] leading-relaxed text-muted md:block">
          A few pieces. Endless possibilities.
        </p>
        <label className="relative mt-4 block">
          <span className="sr-only">Search furniture</span>
          <Icon
            name="search"
            size={14}
            className="pointer-events-none absolute left-2.5 top-3 text-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="nook-input !py-2.5 !pl-8 !pr-2 !text-[11px]"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pt-5 md:px-5">
        {filtered.map((section) => (
          <LibrarySection
            key={section.title}
            {...section}
            onAdd={addFurniture}
          />
        ))}
        {!filtered.length && (
          <p role="status" className="py-4 text-xs leading-relaxed text-muted">
            No pieces match “{query}”.
          </p>
        )}
      </div>
      <p className="hidden border-t border-hair-2 px-5 py-4 text-[10px] leading-relaxed text-muted md:block">
        <span className="mr-1.5 text-accent">↗</span>Click a piece to add it to
        your room.
      </p>
    </aside>
  );
};
