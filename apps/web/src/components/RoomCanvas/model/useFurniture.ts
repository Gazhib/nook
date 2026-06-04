import { FurnitureItem, Role } from "@nook/shared";
import { KonvaEventObject } from "konva/lib/Node";
import type { Image as KonvaImage } from "konva/lib/shapes/Image";
import type {
  Box,
  Transformer as KonvaTransformer,
} from "konva/lib/shapes/Transformer";
import { useEffect, useMemo, useRef, useState } from "react";

import * as Y from "yjs";

const LOCAL_ORIGIN = Symbol("local");

export const useFurniture = (
  yFurniture: Y.Map<FurnitureItem>,
  role: Role | null
) => {
  const [furnitures, setFurnitures] = useState<FurnitureItem[]>([]);

  const transformRef = useRef<KonvaTransformer>(null);

  const selectedFurnitureRef = useRef<KonvaImage>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const gridSize = 30;

  const ydoc = yFurniture.doc;

  const mutateYFurniture = (newFurniture: FurnitureItem) => {
    if (role === "viewer" || role === null) return;
    ydoc?.transact(() => {
      yFurniture.set(newFurniture.id, newFurniture);
    }, LOCAL_ORIGIN);
  };

  const addFurniture = (furniture: FurnitureItem) => {
    const newFurniture = { ...furniture, id: crypto.randomUUID() };
    mutateYFurniture(newFurniture);
  };

  const selectFurniture = (id: string) => {
    if (role === "viewer" || role === null) return;
    setSelectedId(id);
  };

  const moveFurniture = (id: string, dx: number, dy: number) => {
    const movedFurniture = yFurniture.get(id);

    if (!id || !movedFurniture) return;

    const newFurniture = {
      ...movedFurniture,
      position: {
        x: movedFurniture.position.x + dx,
        y: movedFurniture.position.y + dy,
      },
    };

    mutateYFurniture(newFurniture);
  };

  const onTransformEnd = (e: KonvaEventObject<Event>) => {
    if (!selectedId) return;
    if (role === "viewer" || role === null) return;

    const node = e.target;
    if (!node) return;

    const newRotation = node.rotation();
    const newWidth = node.width() * node.scaleX();
    const newHeight = node.height() * node.scaleY();

    const newX = Math.round(node.x() / gridSize) * gridSize;
    const newY = Math.round(node.y() / gridSize) * gridSize;

    const newFurniture = {
      ...(yFurniture.get(selectedId) as FurnitureItem),
      rotation: newRotation,
      width: newWidth,
      height: newHeight,
      position: { x: newX, y: newY },
    };

    mutateYFurniture(newFurniture);

    node.scaleX(1);
    node.scaleY(1);
  };

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const newX = Math.round(pos.x / gridSize) * gridSize;
    const newY = Math.round(pos.y / gridSize) * gridSize;
    return { x: newX, y: newY };
  };

  const onDragEnd = (e: KonvaEventObject<DragEvent>) => {
    if (role === "viewer" || role === null) return;
    const newX = Math.round(e.target.x() / gridSize) * gridSize;
    const newY = Math.round(e.target.y() / gridSize) * gridSize;

    if (!selectedId) return;

    const newFurniture = {
      ...(yFurniture.get(selectedId) as FurnitureItem),
      position: { x: newX, y: newY },
    };

    mutateYFurniture(newFurniture);
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
      if (role === "viewer" || role === null) return;
      transformRef.current.nodes([selectedFurnitureRef.current]);
      transformRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, role]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (role === "viewer" || role === null) return;
      if (e.key === "Delete" && selectedId) {
        ydoc?.transact(() => {
          yFurniture.delete(selectedId);
        }, LOCAL_ORIGIN);

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
  }, [selectedId, role]);

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

  const undoManager = useMemo(
    () =>
      new Y.UndoManager(yFurniture, {
        trackedOrigins: new Set([LOCAL_ORIGIN]),
      }),
    [yFurniture]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (role === "viewer" || role === null) return;
      if (e.ctrlKey && (e.key === "z" || e.key === "Z")) {
        undoManager.undo();
      } else if (e.ctrlKey && (e.key === "y" || e.key === "Y")) {
        undoManager.redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
  }, [role]);

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
