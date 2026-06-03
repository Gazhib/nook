import { getUserByIdService } from "@/services/userServices";
import { Stage } from "konva/lib/Stage";
import { RefObject, useEffect, useState } from "react";
import { Awareness } from "y-protocols/awareness";

const userNames = ["Batyr", "Alish", "Mon ceau", "Rusik"];

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
  awarenessRef: RefObject<Awareness | null>
) => {
  const randomNumber = Number((Math.random() * 10).toFixed()) % colors.length;
  const color = colors[randomNumber];
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserByIdService();
        setUsername(userData.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mousePos = stageRef.current?.getRelativePointerPosition();
      if (mousePos === null) return;
      awarenessRef.current?.setLocalStateField("user", {
        name: username,
        color,
        mousePos,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [username]);
};
