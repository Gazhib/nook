import type { Image as KonvaImage } from "konva/lib/shapes/Image";
import { Ref } from "react";
import { Image } from "react-konva";

import { FurnitureItem } from "@nook/shared";
import { KonvaEventObject } from "konva/lib/Node";

import { useFurnitureImage } from "../model/useFurnitureImage";

interface FurnitureProps extends FurnitureItem {
  type: string;
  onClick: () => void;
  color: string;
  isSelected?: boolean;
  ref?: Ref<KonvaImage> | null;
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
  isSelected = false,
  ref,
  dragBoundFunc,
  onDragStart,
  onDragEnd,
  onTransformEnd,
  rotation,
  draggable,
}: FurnitureProps) => {
  const image = useFurnitureImage(type);

  return (
    // Konva draws a canvas node rather than a DOM image; the canvas has its own label.
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      image={image}
      onTransformEnd={onTransformEnd}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      ref={ref}
      onClick={onClick}
      onTap={onClick}
      x={x}
      y={y}
      width={width}
      height={height}
      draggable={draggable}
      stroke={"#234b3d"}
      strokeWidth={isSelected ? 2 : 0}
      dragBoundFunc={dragBoundFunc}
      rotation={rotation}
    />
  );
};
