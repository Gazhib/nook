import { FurnitureItem } from "@nook/shared";
import { KonvaEventObject } from "konva/lib/Node";
import type { Rect as KonvaRect } from "konva/lib/shapes/Rect";
import type {
  Box,
  Transformer as KonvaTransformer,
} from "konva/lib/shapes/Transformer";
import { useEffect, useRef, useState } from "react";

export const useRoom = () => {
  const [size, setSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [pieces, setPieces] = useState<FurnitureItem[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedPieceRef = useRef<KonvaRect>(null);

  const transformRef = useRef<KonvaTransformer>(null);

  const gridSize = 30;

  const addPiece = (piece: FurnitureItem) => {
    const newPieces = [
      ...pieces,
      {
        ...piece,
        id: crypto.randomUUID(),
      },
    ];

    setPieces(newPieces);

    const newHistory = [...history.slice(0, historyIndex + 1), newPieces];

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
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
        
        const newPieces = pieces.filter((piece) => piece.id !== selectedId);
        const newHistory = [...history.slice(0, historyIndex + 1), newPieces];
        setPieces(newPieces);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);

        setSelectedId(null);
        selectedPieceRef.current = null;
        transformRef.current?.nodes([]);
      }

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setPieces((prev) =>
            prev.map((piece) =>
              piece.id === selectedId
                ? {
                    ...piece,
                    position: {
                      x: piece.position.x,
                      y: piece.position.y - 10,
                    },
                  }
                : piece
            )
          );
          break;
        case "ArrowDown":
          e.preventDefault();
          setPieces((prev) =>
            prev.map((piece) =>
              piece.id === selectedId
                ? {
                    ...piece,
                    position: {
                      x: piece.position.x,
                      y: piece.position.y + 10,
                    },
                  }
                : piece
            )
          );
          break;
        case "ArrowLeft":
          e.preventDefault();
          setPieces((prev) =>
            prev.map((piece) =>
              piece.id === selectedId
                ? {
                    ...piece,
                    position: {
                      x: piece.position.x - 10,
                      y: piece.position.y,
                    },
                  }
                : piece
            )
          );
          break;
        case "ArrowRight":
          e.preventDefault();
          setPieces((prev) =>
            prev.map((piece) =>
              piece.id === selectedId
                ? {
                    ...piece,
                    position: {
                      x: piece.position.x + 10,
                      y: piece.position.y,
                    },
                  }
                : piece
            )
          );
          break;
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
    const newX = Math.round(e.target.x() / gridSize) * gridSize;
    const newY = Math.round(e.target.y() / gridSize) * gridSize;

    const newPieces = pieces.map((piece) =>
      piece.id === selectedId
        ? {
            ...piece,
            position: { x: newX, y: newY },
          }
        : piece
    );

    setPieces(newPieces);
    const newHistory = [...history.slice(0, historyIndex + 1), newPieces];

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
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

  const [history, setHistory] = useState<FurnitureItem[][]>([pieces ?? []]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (historyIndex > 0) {
          setHistoryIndex((prev) => prev - 1);
          setPieces(history[historyIndex - 1]);
        }
        setSelectedId(null);
        selectedPieceRef.current = null;
        transformRef.current?.nodes([]);
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          setHistoryIndex((prev) => prev + 1);
          setPieces(history[historyIndex + 1]);
        }
        setSelectedId(null);
        selectedPieceRef.current = null;
        transformRef.current?.nodes([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history, historyIndex]);
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
    // history,
  };
};
