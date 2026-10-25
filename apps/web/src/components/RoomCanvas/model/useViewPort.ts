import { Stage } from "konva/lib/Stage";
import { RefObject, useEffect, useRef, useState } from "react";
import { isEditableTarget } from "./isEditableTarget";

export const useViewPort = (stageRef: RefObject<Stage | null>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const container = stage.container();
    let isSpaceHeld = false;
    let lastMousePos: { x: number; y: number } | null = null;
    const resetPan = () => {
      isSpaceHeld = false;
      lastMousePos = null;
      setIsPanning(false);
    };
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      stage.setPointersPositions(e);
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const oldScale = stage.scaleX();
      const newScale = Math.min(
        3,
        Math.max(0.5, e.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1),
      );
      const canvasPoint = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };
      stage.scale({ x: newScale, y: newScale });
      stage.position({
        x: pointer.x - canvasPoint.x * newScale,
        y: pointer.y - canvasPoint.y * newScale,
      });
      setScale(newScale);
      setPosition(stage.position());
      stage.batchDraw();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      if (
        e.target instanceof HTMLElement &&
        e.target.closest("button, a, select, [role='button']")
      )
        return;
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        isSpaceHeld = true;
        setIsPanning(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") resetPan();
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (isSpaceHeld && e.button === 0) {
        lastMousePos = { x: e.clientX, y: e.clientY };
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isSpaceHeld || e.buttons !== 1 || !lastMousePos) return;
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      lastMousePos = { x: e.clientX, y: e.clientY };
      stage.position({ x: stage.x() + dx, y: stage.y() + dy });
      setPosition(stage.position());
      stage.batchDraw();
    };
    const handleMouseUp = () => {
      lastMousePos = null;
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("blur", resetPan);
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("blur", resetPan);
    };
  }, [stageRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      setSize((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      );
    };
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    handleResize();
    return () => observer.disconnect();
  }, []);

  const getViewportCenter = (stage: Stage) => {
    const transform = stage.getAbsoluteTransform().copy().invert();
    return transform.point({ x: stage.width() / 2, y: stage.height() / 2 });
  };
  return { isPanning, containerRef, size, scale, position, getViewportCenter };
};
