import { FurnitureItem, Role } from "@nook/shared";
import { KonvaEventObject } from "konva/lib/Node";
import type { Image as KonvaImage } from "konva/lib/shapes/Image";
import type {
  Box,
  Transformer as KonvaTransformer,
} from "konva/lib/shapes/Transformer";
import { Stage } from "konva/lib/Stage";
import { useCallback, useEffect, useRef, useState } from "react";

import * as Y from "yjs";
import { isEditableTarget } from "./isEditableTarget";

const LOCAL_ORIGIN = Symbol("local");

export const useFurniture = (
  yFurniture: Y.Map<FurnitureItem>,
  role: Role | null,
  getViewportCenter: (stage: Stage) => { x: number; y: number },
) => {
  const [furnitures, setFurnitures] = useState<FurnitureItem[]>([]);

  const transformRef = useRef<KonvaTransformer>(null);

  const selectedFurnitureRef = useRef<KonvaImage>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const gridSize = 30;

  const ydoc = yFurniture.doc;

  const mutateYFurniture = useCallback(
    (newFurniture: FurnitureItem) => {
      if (role === "viewer" || role === null) return;
      ydoc?.transact(() => {
        yFurniture.set(newFurniture.id, newFurniture);
      }, LOCAL_ORIGIN);
    },
    [role, ydoc, yFurniture],
  );

  const addFurniture = (furniture: FurnitureItem) => {
    const stage = transformRef.current?.getStage();
    if (!stage) return;
    const center = getViewportCenter(stage);
    const position = {
      x: Math.round((center.x - furniture.width / 2) / gridSize) * gridSize,
      y: Math.round((center.y - furniture.height / 2) / gridSize) * gridSize,
    };
    const newFurniture = { ...furniture, position, id: crypto.randomUUID() };
    mutateYFurniture(newFurniture);
  };

  const selectFurniture = (id: string) => {
    if (role === "viewer" || role === null) return;
    setSelectedId(id);
  };

  const moveFurniture = useCallback(
    (id: string, dx: number, dy: number) => {
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
    },
    [yFurniture, mutateYFurniture],
  );

  const onTransformEnd = (e: KonvaEventObject<Event>) => {
    if (!selectedId) return;
    if (role === "viewer" || role === null) return;

    const node = e.target;
    if (!node) return;

    const furniture = yFurniture.get(selectedId);
    if (!furniture) return;
    const newRotation = node.rotation();
    const newWidth = Math.max(gridSize, Math.abs(node.width() * node.scaleX()));
    const newHeight = Math.max(
      gridSize,
      Math.abs(node.height() * node.scaleY()),
    );

    const newX = Math.round(node.x() / gridSize) * gridSize;
    const newY = Math.round(node.y() / gridSize) * gridSize;

    const newFurniture = {
      ...furniture,
      rotation: newRotation,
      width: newWidth,
      height: newHeight,
      position: { x: newX, y: newY },
    };

    mutateYFurniture(newFurniture);

    node.scaleX(1);
    node.scaleY(1);
    node.size({ width: newWidth, height: newHeight });
    node.position({ x: newX, y: newY });
  };

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    // Konva supplies absolute coordinates here; snap in local coordinates on drop.
    return pos;
  };

  const onDragEnd = (e: KonvaEventObject<DragEvent>) => {
    if (role === "viewer" || role === null) return;
    const newX = Math.round(e.target.x() / gridSize) * gridSize;
    const newY = Math.round(e.target.y() / gridSize) * gridSize;

    if (!selectedId) return;
    const furniture = yFurniture.get(selectedId);
    if (!furniture) return;

    const newFurniture = {
      ...furniture,
      position: { x: newX, y: newY },
    };

    mutateYFurniture(newFurniture);
    e.target.position({ x: newX, y: newY });
  };

  const transformSnapFunc = (oldBox: Box, newBox: Box) => {
    const scale = transformRef.current?.getStage()?.scaleX() ?? 1;
    if (newBox.width < gridSize * scale || newBox.height < gridSize * scale) {
      return oldBox;
    }
    return newBox;
  };

  useEffect(() => {
    const transformer = transformRef.current;
    if (!transformer) return;
    const node = selectedFurnitureRef.current;
    transformer.nodes(
      role !== "viewer" && role !== null && selectedId && node ? [node] : [],
    );
    transformer.getLayer()?.batchDraw();
  }, [selectedId, role, furnitures]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
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
  }, [selectedId, role, ydoc, yFurniture, moveFurniture]);

  useEffect(() => {
    const sync = () => {
      const newFurnitures: FurnitureItem[] = [];
      yFurniture.forEach((value) => {
        newFurnitures.push(value);
      });
      setFurnitures(newFurnitures);
      setSelectedId((id) => (id && yFurniture.has(id) ? id : null));
    };

    yFurniture.observe(sync);
    sync();

    return () => {
      yFurniture.unobserve(sync);
    };
  }, [yFurniture]);

  const undoManagerRef = useRef<Y.UndoManager | null>(null);

  useEffect(() => {
    const manager = new Y.UndoManager(yFurniture, {
      trackedOrigins: new Set([LOCAL_ORIGIN]),
    });
    undoManagerRef.current = manager;
    return () => {
      manager.destroy();
      if (undoManagerRef.current === manager) undoManagerRef.current = null;
    };
  }, [yFurniture]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target) || role === "viewer" || role === null)
        return;
      if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
      const key = e.key.toLowerCase();
      if (key !== "z" && key !== "y") return;
      e.preventDefault();
      if (key === "y" || e.shiftKey) undoManagerRef.current?.redo();
      else undoManagerRef.current?.undo();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
