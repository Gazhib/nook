import { Group, Layer, Rect, Stage, Transformer } from "react-konva";
import { Furniture } from "./Furniture";
import { FurnitureSidebar } from "./FurnitureSidebar";
import { Grid } from "./Grid";
import { useRoom } from "./useRoom";
import { Cursor } from "./Cursor";

export const RoomCanvas = () => {
  const {
    containerRef,
    size,
    pieces,
    selectedId,
    selectedPieceRef,
    transformRef,
    gridSize,
    stageRef,
    addPiece,
    selectPiece,
    handleClickOutside,
    dragBoundFunc,
    transformSnapFunc,
    onDragEnd,
    isPanning,
    onTransformEnd,
    users,
  } = useRoom();

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ cursor: isPanning ? "grab" : "default" }}
    >
      <FurnitureSidebar addPiece={addPiece} />
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
          {pieces.map((piece) => {
            return (
              <Furniture
                onDragStart={() => selectPiece(piece.id)}
                onDragEnd={onDragEnd}
                onTransformEnd={onTransformEnd}
                dragBoundFunc={dragBoundFunc}
                isSelected={selectedId === piece.id}
                ref={selectedId === piece.id ? selectedPieceRef : null}
                onClick={() => selectPiece(piece.id)}
                key={piece.id}
                {...piece}
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
    </div>
  );
};
