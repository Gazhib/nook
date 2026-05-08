import { Line } from "react-konva";

export const Grid = ({
  width,
  height,
  gridSize,
}: {
  width: number;
  height: number;
  gridSize: number;
}) => {
  return (
    <>
      {Array.from({ length: Math.floor(width / gridSize) + 1 }).map((_, i) => (
        <Line
          key={`v-${i}`}
          points={[i * gridSize, 0, i * gridSize, height]}
          stroke="#E0D9D1"
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: Math.floor(height / gridSize) + 1 }).map((_, i) => (
        <Line
          key={`h-${i}`}
          points={[0, i * gridSize, width, i * gridSize]}
          stroke="#E0D9D1"
          strokeWidth={1}
        />
      ))}
    </>
  );
};
