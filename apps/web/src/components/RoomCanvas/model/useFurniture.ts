import { FurnitureItem } from "@nook/shared";
import { KonvaEventObject } from "konva/lib/Node";
import type { Rect as KonvaRect } from "konva/lib/shapes/Rect";
import type {
  Box,
  Transformer as KonvaTransformer,
} from "konva/lib/shapes/Transformer";
import { useEffect, useRef, useState } from "react";

import * as Y from "yjs";

export const useFurniture = (yFurniture: Y.Map<FurnitureItem>) => {
  const [furnitures, setFurnitures] = useState<FurnitureItem[]>([]);

  const transformRef = useRef<KonvaTransformer>(null);

  const selectedFurnitureRef = useRef<KonvaRect>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const gridSize = 30;

  const addFurniture = (furniture: FurnitureItem) => {
    const newFurniture = { ...furniture, id: crypto.randomUUID() };

    yFurniture.set(newFurniture.id, newFurniture);
  };

  const selectFurniture = (id: string) => {
    setSelectedId(id);
  };

  const moveFurniture = (id: string, dx: number, dy: number) => {
    const movedFurniture = yFurniture.get(id);

    if (!id || !movedFurniture) return;

    yFurniture.set(id, {
      ...movedFurniture,
      position: {
        x: movedFurniture.position.x + dx,
        y: movedFurniture.position.y + dy,
      },
    });
  };

  const onTransformEnd = (e: KonvaEventObject<Event>) => {
    if (!selectedId) return;

    const node = e.target;
    if (!node) return;

    const newRotation = node.rotation();
    const newWidth = node.width() * node.scaleX();
    const newHeight = node.height() * node.scaleY();

    const newX = Math.round(node.x() / gridSize) * gridSize;
    const newY = Math.round(node.y() / gridSize) * gridSize;

    const newPiece = {
      ...(yFurniture.get(selectedId) as FurnitureItem),
      rotation: newRotation,
      width: newWidth,
      height: newHeight,
      position: { x: newX, y: newY },
    };

    yFurniture.set(selectedId, newPiece);

    node.scaleX(1);
    node.scaleY(1);
  };

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const newX = Math.round(pos.x / gridSize) * gridSize;
    const newY = Math.round(pos.y / gridSize) * gridSize;
    return { x: newX, y: newY };
  };

  const onDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const newX = Math.round(e.target.x() / gridSize) * gridSize;
    const newY = Math.round(e.target.y() / gridSize) * gridSize;

    if (!selectedId) return;

    const newPiece = {
      ...(yFurniture.get(selectedId) as FurnitureItem),
      position: { x: newX, y: newY },
    };

    yFurniture.set(selectedId, newPiece);
  };

  const transformSnapFunc = (oldBox: Box, newBox: Box) => {
    const newX = Math.round(newBox.x / gridSize) * gridSize;
    const newY = Math.round(newBox.y / gridSize) * gridSize;
    const newWidth = Math.round(newBox.width / gridSize) * gridSize;
    const newHeight = Math.round(newBox.height / gridSize) * gridSize;
    return {
      ...newBox,
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    };
  };

  useEffect(() => {
    if (transformRef.current && selectedFurnitureRef.current) {
      transformRef.current.nodes([selectedFurnitureRef.current]);
      transformRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedId) {
        yFurniture.delete(selectedId);

        setSelectedId(null);
        selectedFurnitureRef.current = null;
        transformRef.current?.nodes([]);
      }

      if (!selectedId) return;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case "ArrowUp": {
          moveFurniture(selectedId, 0, -10);
          break;
        }
        case "ArrowDown": {
          moveFurniture(selectedId, 0, 10);
          break;
        }
        case "ArrowLeft": {
          moveFurniture(selectedId, -10, 0);
          break;
        }
        case "ArrowRight": {
          moveFurniture(selectedId, 10, 0);
          break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  useEffect(() => {
    const sync = () => {
      const newFurnitures: FurnitureItem[] = [];
      yFurniture.forEach((value) => {
        newFurnitures.push(value);
      });
      setFurnitures(newFurnitures);
    };

    yFurniture.observe(sync);

    return () => {
      yFurniture.unobserve(sync);
    };
  }, []);

  const handleClickOutside = () => {
    setSelectedId(null);
    selectedFurnitureRef.current = null;
    transformRef.current?.nodes([]);
  };

  return {
    addFurniture,
    selectFurniture,
    setFurnitures,
    furnitures,
    handleClickOutside,
    selectedId,
    transformRef,
    selectedFurnitureRef,
    gridSize,
    onTransformEnd,
    onDragEnd,
    transformSnapFunc,
    dragBoundFunc,
  };
};
