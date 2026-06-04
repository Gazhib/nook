import type { Rect as KonvaRect } from "konva/lib/shapes/Rect";
import { Ref, useEffect } from "react";
import { Rect } from "react-konva";

import { FurnitureItem } from "@nook/shared";
import { KonvaEventObject } from "konva/lib/Node";

interface FurnitureProps extends FurnitureItem {
  onClick: () => void;
  color: string;
  isSelected?: boolean;
  ref?: Ref<KonvaRect> | null;
  dragBoundFunc: (pos: { x: number; y: number }) => { x: number; y: number };
  onDragStart?: () => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: KonvaEventObject<Event>) => void;
  draggable: boolean;
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
  onDragEnd,
  onTransformEnd,
  rotation,
  draggable,
}: FurnitureProps) => {
  return (
    <Rect
      onTransformEnd={onTransformEnd}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      ref={ref}
      onClick={onClick}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={color}
      draggable={draggable}
      stroke={"#C45A3C"}
      strokeWidth={isSelected ? 2 : 0}
      dragBoundFunc={dragBoundFunc}
      rotation={rotation}
    />
  );
};
