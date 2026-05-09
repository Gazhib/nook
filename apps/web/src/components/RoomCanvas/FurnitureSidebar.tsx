import { FurnitureTag } from "./FurnitureTag";
import { Piece } from "./useRoom";

const FURNITURE = [
  { type: "Sofa", w: 120, h: 60, color: "#8B7355" },
  { type: "Chair", w: 40, h: 40, color: "#A0926B" },
  { type: "Bed", w: 100, h: 140, color: "#B8A590" },
  { type: "Table", w: 80, h: 80, color: "#6B5B4E" },
  { type: "Desk", w: 100, h: 50, color: "#7D6B5D" },
  { type: "Bookshelf", w: 90, h: 25, color: "#5C4A3A" },
  { type: "Dresser", w: 70, h: 40, color: "#8B7B6B" },
  { type: "Shelf", w: 60, h: 20, color: "#6E5E4E" },
  { type: "Lamp", w: 20, h: 20, color: "#C4A97D" },
  { type: "Rug", w: 120, h: 80, color: "#C9B8A5" },
  { type: "Plant", w: 25, h: 25, color: "#7A8B6F" },
];

export const FurnitureSidebar = ({
  addPiece,
}: {
  addPiece: (piece: Piece) => void;
}) => {
  return (
    <div className="fixed left-5 top-1/2 -translate-y-1/2 z-50 bg-paper border border-hair rounded-xl p-3 shadow-md flex flex-col gap-0.5 min-w-36">
      <p className="font-display text-xs font-semibold text-muted uppercase tracking-widest px-2 pb-2 border-b border-hair-2 mb-1">
        Furniture
      </p>
      {FURNITURE.map((item) => (
        <FurnitureTag onClick = {addPiece} key={item.type} {...item} />
      ))}
    </div>
  );
};
