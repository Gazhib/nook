import { Hono } from "hono";
import { roomControllers } from "../controllers/roomControllers";

export const roomRoutes = new Hono();

roomRoutes.post("/", roomControllers.createRoom);

roomRoutes.get("/:roomId", roomControllers.getRoomInfo);
roomRoutes.post("/room_snapshot", roomControllers.setRoomSnapshot);
