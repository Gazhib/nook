import { FurnitureItem } from "@nook/shared";
import { KonvaEventObject } from "konva/lib/Node";
import type { Rect as KonvaRect } from "konva/lib/shapes/Rect";
import type {
  Box,
  Transformer as KonvaTransformer,
} from "konva/lib/shapes/Transformer";
import { Stage } from "konva/lib/Stage";
import { useEffect, useRef, useState } from "react";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Awareness } from "y-protocols/awareness";

type User = {
  mousePos: {
    x: number;
    y: number;
  };
  color: string;
  name: string;
};

export interface UsersAwareness {
  clientId: number;
  user: User;
}

const userNames = ["Batyr", "Alish", "Mon ceau", "Rusik"];

const colors = [
  "#30bced",
  "#6eeb83",
  "#ffbc42",
  "#ecd444",
  "#ee6352",
  "#9ac2c9",
  "#8acb88",
  "#1be7ff",
];

export const useRoom = () => {
  const randomNumber = Number((Math.random() * 10).toFixed()) % colors.length;

  const color = colors[randomNumber];

  const userName = userNames[randomNumber % userNames.length];

  const [size, setSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [pieces, setPieces] = useState<FurnitureItem[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedPieceRef = useRef<KonvaRect>(null);

  const transformRef = useRef<KonvaTransformer>(null);

  const gridSize = 30;

  const addPiece = (piece: FurnitureItem) => {
    const newPiece = { ...piece, id: crypto.randomUUID() };

    ypiecesRef.current.set(newPiece.id, newPiece);
  };

  const selectPiece = (id: string) => {
    setSelectedId(id);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      setSize({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [containerRef]);

  useEffect(() => {
    if (transformRef.current && selectedPieceRef.current) {
      transformRef.current.nodes([selectedPieceRef.current]);
      transformRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedId) {
        ypiecesRef.current.delete(selectedId);

        setSelectedId(null);
        selectedPieceRef.current = null;
        transformRef.current?.nodes([]);
      }

      if (!selectedId) return;

      switch (e.key) {
        case "ArrowUp": {
          e.preventDefault();
          const newPieceUp = ypiecesRef.current.get(selectedId);

          ypiecesRef.current.set(newPieceUp.id, {
            ...newPieceUp,
            position: { ...newPieceUp.position, y: newPieceUp.position.y - 10 },
          });
          break;
        }
        case "ArrowDown":
          {
            e.preventDefault();
            const newPieceDown = ypiecesRef.current.get(selectedId);

            ypiecesRef.current.set(newPieceDown.id, {
              ...newPieceDown,
              position: {
                ...newPieceDown.position,
                y: newPieceDown.position.y + 10,
              },
            });
          }
          break;
        case "ArrowLeft": {
          e.preventDefault();
          const newPieceLeft = ypiecesRef.current.get(selectedId);

          ypiecesRef.current.set(newPieceLeft.id, {
            ...newPieceLeft,
            position: {
              ...newPieceLeft.position,
              x: newPieceLeft.position.x - 10,
            },
          });
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          const newPieceRight = ypiecesRef.current.get(selectedId);

          ypiecesRef.current.set(newPieceRight.id, {
            ...newPieceRight,
            position: {
              ...newPieceRight.position,
              x: newPieceRight.position.x + 10,
            },
          });
          break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  const handleClickOutside = () => {
    setSelectedId(null);
    selectedPieceRef.current = null;
    transformRef.current?.nodes([]);
  };

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const newX = Math.round(pos.x / gridSize) * gridSize;
    const newY = Math.round(pos.y / gridSize) * gridSize;
    return { x: newX, y: newY };
  };

  const onDragEnd = (e: KonvaEventObject<DragEvent>) => {
    if (!selectedId) return;

    const newX = Math.round(e.target.x() / gridSize) * gridSize;
    const newY = Math.round(e.target.y() / gridSize) * gridSize;

    const newPiece = {
      ...ypiecesRef.current.get(selectedId),
      position: { x: newX, y: newY },
    };

    ypiecesRef.current.set(newPiece.id, newPiece);
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
      ...ypiecesRef.current.get(selectedId),
      rotation: newRotation,
      width: newWidth,
      height: newHeight,
      position: { x: newX, y: newY },
    };

    ypiecesRef.current.set(newPiece.id, newPiece);

    node.scaleX(1);
    node.scaleY(1);
  };

  const stageRef = useRef<Stage>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!stageRef.current) return;
      e.preventDefault();

      const stage = stageRef.current;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const oldScale = stage.scaleX();
      const newScale = e.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;

      if (newScale < 0.5 || newScale > 3) return;

      const canvasPoint = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      stage.scale({ x: newScale, y: newScale });
      stage.position({
        x: pointer.x - canvasPoint.x * newScale,
        y: pointer.y - canvasPoint.y * newScale,
      });
      stage.batchDraw();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const [isPanning, setIsPanning] = useState(false);
  const isSpaceHeld = useRef(false);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        isSpaceHeld.current = true;
        setIsPanning(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpaceHeld.current = false;
        lastMousePos.current = null;
        setIsPanning(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const [users, setUsers] = useState<UsersAwareness[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mousePos = stageRef.current?.getRelativePointerPosition();
      if (mousePos === null) return;
      awarenessRef.current?.setLocalStateField("user", {
        name: userName,
        color,
        mousePos,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (isSpaceHeld.current) {
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (
        !isSpaceHeld.current ||
        e.buttons !== 1 ||
        !lastMousePos.current ||
        !stageRef.current
      )
        return;

      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      const stage = stageRef.current;
      stage.position({ x: stage.x() + dx, y: stage.y() + dy });
      stage.batchDraw();
    };

    const handleMouseUp = () => {
      lastMousePos.current = null;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const ypiecesRef = useRef<Y.Map<any>>(new Y.Map());

  const awarenessRef = useRef<Awareness>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      "room_name",
      ydoc
    );

    const awareness = provider.awareness;

    awareness.on("change", (_changes: any) => {
      const states = Array.from(awareness.getStates().entries())
        .filter(([clientId]) => clientId !== awareness.clientID)
        .map(([clientId, state]) => ({
          clientId,
          ...state,
        })) as UsersAwareness[];
      setUsers(states);
    });

    awarenessRef.current = awareness;

    const yPieces = ydoc.getMap("pieces");
    ypiecesRef.current = yPieces;

    yPieces.observe(() => {
      const newPieces: FurnitureItem[] = [];
      yPieces.forEach((value, key) => {
        newPieces.push(value as FurnitureItem);
      });
      setPieces(newPieces);
    });

    return () => {
      ydoc.destroy();
      provider.destroy();
    };
  }, []);

  return {
    size,
    containerRef,
    selectedId,
    pieces,
    selectedPieceRef,
    transformRef,
    gridSize,
    addPiece,
    selectPiece,
    handleClickOutside,
    dragBoundFunc,
    transformSnapFunc,
    onDragEnd,
    stageRef,
    isPanning,
    onTransformEnd,
    users,
  };
};
