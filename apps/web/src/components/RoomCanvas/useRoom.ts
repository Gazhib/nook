import { KonvaEventObject } from "konva/lib/Node";
import type { Box } from "konva/lib/shapes/Transformer";
import { Stage } from "konva/lib/Stage";
import { useEffect, useRef, useState } from "react";

import { useYjsRoom } from "./model/useYjsRoom";
import { FurnitureItem } from "@nook/shared";
import { useViewPort } from "./model/useViewPort";
import { usePresence } from "./model/usePresence";



export const useRoom = () => {

  const stageRef = useRef<Stage>(null);

  const { yFurniture, furnitures, awarenessRef, selectedId, users } =
    useYjsRoom();
  const { isPanning } = useViewPort(stageRef);
  usePresence(stageRef, awarenessRef);







  return {
    size,
    containerRef,
    selectedId,
    gridSize,
    dragBoundFunc,
    transformSnapFunc,
    onDragEnd,
    stageRef,
    onTransformEnd,
    furnitures,
    users,
    yFurniture,
    isPanning,
  };
};
