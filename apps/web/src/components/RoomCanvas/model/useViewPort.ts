import { Stage } from "konva/lib/Stage";
import { RefObject, useEffect, useRef, useState } from "react";
import { isEditableTarget } from "./isEditableTarget";

export const useViewPort = (stageRef: RefObject<Stage | null>) => {
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
      // Don't hijack Space while the user is typing (e.g. the room-name input).
      if (isEditableTarget(e.target)) return;
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

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });

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

  const getViewportCenter = (stage: Stage) => {
    const transform = stage.getAbsoluteTransform().copy().invert();
    return transform.point({
      x: stage.width() / 2,
      y: stage.height() / 2,
    });
  };

  return { isPanning, containerRef, size, getViewportCenter };
};
