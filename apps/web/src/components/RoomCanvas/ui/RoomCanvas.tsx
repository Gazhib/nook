import { Stage as StageType } from "konva/lib/Stage";
import { use, useRef } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";
import { Cursor } from "./Cursor";
import { Furniture } from "./Furniture";
import { FurnitureSidebar } from "./FurnitureSidebar";
import { Grid } from "./Grid";
import { useFurniture } from "../model/useFurniture";
import { useViewPort } from "../model/useViewPort";
import { useYjsRoom } from "../model/useYjsRoom";
import { usePresence } from "../model/usePresence";
import { notFound } from "next/navigation";
import { Role } from "@nook/shared";

export const RoomCanvas = ({
  roomId,
  role,
}: {
  roomId: string;
  role: Role | null;
}) => {
  const stageRef = useRef<StageType | null>(null);

  const { yFurniture, users, awarenessRef, isRoomMissing, toggleWebsocket } =
    useYjsRoom({
      roomId: roomId,
    });

  if (isRoomMissing) notFound();

  const { isPanning, size, containerRef, getViewportCenter } =
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
    gridSize,
    furnitures,
    selectedId,
  } = useFurniture(yFurniture, role, getViewportCenter);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ cursor: isPanning ? "grab" : "default" }}
    >
      {role !== "viewer" && role !== null && (
        <FurnitureSidebar
          addFurniture={addFurniture}
          toggleWebSocket={toggleWebsocket}
        />
      )}
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        className="bg-paper"
      >
        <Layer>
          <Rect
            onClick={handleClickOutside}
            width={size.width}
            height={size.height}
            className="bg-paper"
          />
          <Grid gridSize={gridSize} width={size.width} height={size.height} />
          {furnitures.map((furniture) => {
            return (
              <Furniture
                onDragStart={() => selectFurniture(furniture.id)}
                onDragEnd={onDragEnd}
                onTransformEnd={onTransformEnd}
                dragBoundFunc={dragBoundFunc}
                isSelected={selectedId === furniture.id}
                ref={selectedId === furniture.id ? selectedFurnitureRef : null}
                onClick={() => selectFurniture(furniture.id)}
                key={furniture.id}
                draggable={role !== "viewer" && role !== null}
                {...furniture}
              />
            );
          })}

          {users.map((user) => {
            return (
              <Cursor
                key={`${user.clientId}`}
                position={user.user?.mousePos}
                color={user.user?.color}
                name={user.user?.name}
              />
            );
          })}

          <Transformer ref={transformRef} boundBoxFunc={transformSnapFunc} />
        </Layer>
      </Stage>
    </div>
  );
};
