import type { Rect as KonvaRect } from "konva/lib/shapes/Rect";
import type {
  Box,
  Transformer as KonvaTransformer,
} from "konva/lib/shapes/Transformer";
import { useEffect, useRef, useState } from "react";

export type Piece = {
  id: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
};

export const useRoom = () => {
  const [size, setSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [pieces, setPieces] = useState<Piece[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedPieceRef = useRef<KonvaRect>(null);

  const tranformRef = useRef<KonvaTransformer>(null);

  const gridSize = 30;

  const addPiece = (piece: Piece) => {
    setPieces((prev) => [
      ...prev,
      {
        ...piece,
        id: crypto.randomUUID(),
      },
    ]);
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
    if (tranformRef.current && selectedPieceRef.current) {
      tranformRef.current.nodes([selectedPieceRef.current]);
      tranformRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedId) {
        setPieces((prev) => prev.filter((piece) => piece.id !== selectedId));
        setSelectedId(null);
        selectedPieceRef.current = null;
        tranformRef.current?.nodes([]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleClickOutside = () => {
    setSelectedId(null);
    selectedPieceRef.current = null;
    tranformRef.current?.nodes([]);
  };

  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const newX = Math.round(pos.x / gridSize) * gridSize;
    const newY = Math.round(pos.y / gridSize) * gridSize;
    return { x: newX, y: newY };
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

  // const [history, setHistory] = useState<Piece[][]>([pieces]);
  // const [historyIndex, setHistoryIndex] = useState(0);

  // useEffect(() => {
  //   setHistory((prev) => {
  //     const newHistory = prev.slice(0, historyIndex);
  //     newHistory.push(pieces);
  //     setHistoryIndex(newHistory.length);
  //     return newHistory;
  //   });
  // }, [pieces]);

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {

  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, [history]);


  return {
    size,
    containerRef,
    selectedId,
    pieces,
    selectedPieceRef,
    tranformRef,
    gridSize,
    addPiece,
    selectPiece,
    handleClickOutside,
    dragBoundFunc,
    transformSnapFunc,
    // history,
  };
};
