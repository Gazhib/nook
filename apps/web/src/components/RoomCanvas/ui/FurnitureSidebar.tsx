import { FurnitureItem } from "@nook/shared";
import { FurnitureTag } from "./FurnitureTag";

const FURNITURE = [
  { type: "Sofa", width: 120, height: 60, color: "#8B7355" },
  { type: "Chair", width: 40, height: 40, color: "#A0926B" },
  { type: "Bed", width: 100, height: 140, color: "#B8A590" },
  { type: "Table", width: 80, height: 80, color: "#6B5B4E" },
  { type: "Desk", width: 100, height: 50, color: "#7D6B5D" },
  { type: "Bookshelf", width: 90, height: 25, color: "#5C4A3A" },
  { type: "Dresser", width: 70, height: 40, color: "#8B7B6B" },
  { type: "Shelf", width: 60, height: 20, color: "#6E5E4E" },
  { type: "Lamp", width: 20, height: 20, color: "#C4A97D" },
  { type: "Rug", width: 120, height: 80, color: "#C9B8A5" },
  { type: "Plant", width: 25, height: 25, color: "#7A8B6F" },
  { type: "Wall", width: 140, height: 24, color: "#CDBFAE" },
];

export const FurnitureSidebar = ({
  addFurniture,
  toggleWebSocket,
}: {
  addFurniture: (piece: FurnitureItem) => void;
  toggleWebSocket: () => void;
}) => {
  return (
    <div className="fixed left-5 top-1/2 -translate-y-1/2 z-50 bg-paper border border-hair rounded-xl p-3 shadow-md flex flex-col gap-0.5 min-w-36">
      <p className="font-display text-xs font-semibold text-muted uppercase tracking-widest px-2 pb-2 border-b border-hair-2 mb-1">
        Furniture
      </p>
      {FURNITURE.map((item) => (
        <FurnitureTag
          onClick={addFurniture}
          key={item.type}
          {...item}
          toggleWebsocket={toggleWebSocket}
        />
      ))}
    </div>
  );
};
