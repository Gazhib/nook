import { Stage as StageType } from "konva/lib/Stage";
import { use, useRef } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";
import { Cursor } from "./Cursor";
import { Furniture } from "./Furniture";
import { FurnitureSidebar } from "./FurnitureSidebar";
import { Grid } from "./Grid";
import { useFurniture } from "./model/useFurniture";
import { useViewPort } from "./model/useViewPort";
import { useYjsRoom } from "./model/useYjsRoom";
import { usePresence } from "./model/usePresence";

export const RoomCanvas = ({ roomId }: { roomId: string }) => {
  const stageRef = useRef<StageType | null>(null);

  const { yFurniture, users, awarenessRef, saveNewSnapshot } = useYjsRoom({
    roomId: Number(roomId),
  });

  const { isPanning, size, containerRef } = useViewPort(stageRef);

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
  } = useFurniture(yFurniture);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ cursor: isPanning ? "grab" : "default" }}
    >
      <FurnitureSidebar addFurniture={addFurniture} />
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
                {...furniture}
              />
            );
          })}

          {users.map((user) => {
            return (
              <Cursor
                key={`${user.clientId}`}
                position={user.user.mousePos}
                color={user.user.color}
                name={user.user.name}
              />
            );
          })}

          <Transformer ref={transformRef} boundBoxFunc={transformSnapFunc} />
        </Layer>
      </Stage>

      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 bg-paper border border-hair rounded-xl p-3 shadow-md flex flex-col gap-0.5 min-w-36">
        <button
          onClick={() => saveNewSnapshot(Number(roomId))}
          className="font-display text-xs font-semibold text-muted uppercase tracking-widest px-2 pb-2 border-b border-hair-2 mb-1"
        >
          Add snapshot
        </button>
      </div>
    </div>
  );
};
