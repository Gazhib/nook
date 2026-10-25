import { getUserByIdService } from "@/services/userServices";
import { Stage } from "konva/lib/Stage";
import { RefObject, useEffect, useState } from "react";
import { Awareness } from "y-protocols/awareness";

const colors = [
  "#30bced",
  "#6eeb83",
  "#ffbc42",
  "#ecd444",
  "#ee6352",
  "#9ac2c9",
  "#8acb88",
  "#1be7ff",
];

export const usePresence = (
  stageRef: RefObject<Stage | null>,
  awarenessRef: RefObject<Awareness | null>,
) => {
  const [color] = useState(
    () => colors[Math.floor(Math.random() * colors.length)],
  );
  const [username, setUsername] = useState("");

  useEffect(() => {
    let active = true;
    const fetchUserData = async () => {
      try {
        const userData = await getUserByIdService();
        if (active) setUsername(userData.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    void fetchUserData();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const container = stage.container();
    const handlePointerMove = (event: PointerEvent) => {
      stage.setPointersPositions(event);
      const mousePos = stage.getRelativePointerPosition();
      if (
        !mousePos ||
        !Number.isFinite(mousePos.x) ||
        !Number.isFinite(mousePos.y)
      )
        return;
      awarenessRef.current?.setLocalStateField("user", {
        name: username,
        color,
        mousePos,
      });
    };
    const clearPointer = () =>
      awarenessRef.current?.setLocalStateField("user", null);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", clearPointer);
    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", clearPointer);
      clearPointer();
    };
  }, [username, color, stageRef, awarenessRef]);
};
