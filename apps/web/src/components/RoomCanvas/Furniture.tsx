import type { Rect as KonvaRect } from "konva/lib/shapes/Rect";
import { Ref } from "react";
import { Rect } from "react-konva";

import { FurnitureItem } from "@nook/shared";

interface FurnitureProps extends FurnitureItem {
  onClick: () => void;
  color: string;
  isSelected?: boolean;
  ref?: Ref<KonvaRect> | null;
  dragBoundFunc: (pos: { x: number; y: number }) => { x: number; y: number };
  onDragStart?: () => void;
}

export const Furniture = ({
  type,
  onClick,
  position: { x, y },
  width,
  height,
  color,
  isSelected = false,
  ref,
  dragBoundFunc,
  onDragStart,
}: FurnitureProps) => {
  return (
    <Rect
      onDragStart={onDragStart}
      ref={ref}
      onClick={onClick}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={color}
      draggable
      stroke={"#C45A3C"}
      strokeWidth={isSelected ? 2 : 0}
      dragBoundFunc={dragBoundFunc}
    />
  );
};
