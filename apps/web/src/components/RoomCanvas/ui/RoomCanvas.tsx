"use client";

import { Stage as StageType } from "konva/lib/Stage";
import { useRef } from "react";
import { Layer, Stage, Transformer } from "react-konva";
import { Cursor } from "./Cursor";
import { Furniture } from "./Furniture";
import { useFurniture } from "../model/useFurniture";
import { useViewPort } from "../model/useViewPort";
import { useYjsRoom } from "../model/useYjsRoom";
import { usePresence } from "../model/usePresence";
import { notFound } from "next/navigation";
import { Role } from "@nook/shared";
import { CanvasSidebar } from "./CanvasSidebar";
import { SnapToggle } from "./SnapToggle";
import { ZoomWidget } from "./ZoomWidget";

export const RoomCanvas = ({
  roomId,
  role,
}: {
  roomId: string;
  role: Role | null;
}) => {
  const stageRef = useRef<StageType | null>(null);
  const { yFurniture, users, awarenessRef, isRoomMissing } = useYjsRoom({
    roomId,
  });
  const { isPanning, size, containerRef, getViewportCenter, scale, position } =
    useViewPort(stageRef);
  usePresence(stageRef, awarenessRef);
  const {
    addFurniture,
    handleClickOutside,
    selectFurniture,
    transformRef,
    selectedFurnitureRef,
    transformSnapFunc,
    onDragEnd,
    onTransformEnd,
    dragBoundFunc,
    furnitures,
    selectedId,
  } = useFurniture(yFurniture, role, getViewportCenter);
  if (isRoomMissing) notFound();
  const canEdit = role === "owner" || role === "editor";
  return (
    <div className="flex min-h-0 w-full flex-1 overflow-hidden">
      {canEdit && <CanvasSidebar addFurniture={addFurniture} />}
      <div
        ref={containerRef}
        className="plan-surface relative min-h-0 min-w-0 flex-1 overflow-hidden"
        style={{
          cursor: isPanning ? "grab" : "default",
          backgroundSize: `${30 * scale}px ${30 * scale}px`,
          backgroundPosition: `${position.x - (30 * scale) / 2}px ${position.y - (30 * scale) / 2}px`,
        }}
        aria-label="Room planning canvas"
      >
        <div className="pointer-events-none absolute left-5 top-5 z-10 flex items-center gap-2">
          <span className="eyebrow rounded bg-paper/90 px-2 py-1 text-muted">
            Floor plan
          </span>
          <span className="hidden text-[10px] text-muted sm:inline">
            Top view
          </span>
        </div>
        <Stage
          ref={stageRef}
          width={size.width}
          height={size.height}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) handleClickOutside();
          }}
          onTouchStart={(e) => {
            if (e.target === e.target.getStage()) handleClickOutside();
          }}
        >
          <Layer>
            {furnitures.map((furniture) => (
              <Furniture
                key={furniture.id}
                {...furniture}
                onDragStart={() => selectFurniture(furniture.id)}
                onDragEnd={onDragEnd}
                onTransformEnd={onTransformEnd}
                dragBoundFunc={dragBoundFunc}
                isSelected={selectedId === furniture.id}
                ref={selectedId === furniture.id ? selectedFurnitureRef : null}
                onClick={() => selectFurniture(furniture.id)}
                draggable={canEdit && !isPanning}
              />
            ))}
            {users
              .filter((user) => user.user?.mousePos)
              .map((user) => (
                <Cursor
                  key={user.clientId}
                  position={user.user.mousePos}
                  color={user.user.color}
                  name={user.user.name}
                />
              ))}
            <Transformer
              ref={transformRef}
              boundBoxFunc={transformSnapFunc}
              flipEnabled={false}
              borderStroke="#234b3d"
              anchorStroke="#234b3d"
              anchorFill="#fff"
              anchorSize={7}
              anchorCornerRadius={2}
              rotateAnchorOffset={25}
            />
          </Layer>
        </Stage>
        {!furnitures.length && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
            <div className="max-w-[300px] text-center">
              <svg
                width="84"
                height="80"
                viewBox="0 0 84 80"
                fill="none"
                className="mx-auto mb-5 text-[#8b9a80]"
                aria-hidden="true"
              >
                <path
                  d="M12 12h60v56H48m-16 0H12V12Zm36 56V52a16 16 0 0 0-16 16M52 12v22h20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 4h60M5 12v56m7-67v6m60-6v6M2 12h6M2 68h6"
                  stroke="currentColor"
                  strokeWidth=".6"
                />
              </svg>
              <h2 className="font-display text-[25px] leading-tight tracking-tight text-ink-2 sm:text-[30px]">
                Room for possibility.
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                {canEdit
                  ? "Choose a piece from the library to start arranging your space."
                  : "This room is waiting for its first piece."}
              </p>
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
          <SnapToggle />
          <p className="hidden rounded bg-paper/90 px-2 py-2 text-[10px] text-muted lg:block">
            <kbd className="rounded border border-hair px-1">Space</kbd> + drag
            to pan · Scroll to zoom
          </p>
          <ZoomWidget scale={scale} />
        </div>
      </div>
    </div>
  );
};
