import { Layer, Rect, Stage, Transformer } from "react-konva";
import { Furniture } from "./Furniture";
import { FurnitureSidebar } from "./FurnitureSidebar";
import { Grid } from "./Grid";
import { useRoom } from "./useRoom";

export const RoomCanvas = () => {
  const {
    containerRef,
    size,
    pieces,
    selectedId,
    selectedPieceRef,
    tranformRef,
    gridSize,
    addPiece,
    selectPiece,
    handleClickOutside,
    dragBoundFunc,
    transformSnapFunc,
  } = useRoom();

  return (
    <div ref={containerRef} className="w-full h-full">
      <FurnitureSidebar addPiece={addPiece} />
      <Stage width={size.width} height={size.height} className="bg-paper">
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
                dragBoundFunc={dragBoundFunc}
                isSelected={selectedId === piece.id}
                ref={selectedId === piece.id ? selectedPieceRef : null}
                onClick={() => selectPiece(piece.id)}
                key={piece.id}
                {...piece}
              />
            );
          })}
          <Transformer ref={tranformRef} boundBoxFunc={transformSnapFunc} />
        </Layer>
      </Stage>
    </div>
  );
};
