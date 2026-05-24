import { Group, Label, Line, Tag, Text } from "react-konva";

export const Cursor = ({
  color,
  name,
  position,
}: {
  color: string;
  name: string;
  position: { x: number; y: number };
}) => {


  return (
    <Group x={position.x} y={position.y}>
      <Line
        points={[0, 0, 0, 17, 4, 13, 7, 20, 9, 19, 6, 12, 11, 12]}
        closed
        fill={color}
        stroke="white"
        strokeWidth={1}
      />
      <Label x={12} y={10}>
        <Tag fill={color} cornerRadius={3} />
        <Text text={name} fill="white" fontSize={12} padding={4} />
      </Label>
    </Group>
  );
};
