import { Hono } from "hono";
import { roomControllers } from "../controllers/roomControllers";
import { tokenMiddleware } from "../middleware/token";

export const roomRoutes = new Hono();

// roomRoutes.use("*", tokenMiddleware);

roomRoutes.post("/", roomControllers.createRoom);

roomRoutes.get("/:roomId", roomControllers.getRoomInfo);
roomRoutes.post("/room_snapshot", roomControllers.setRoomSnapshot);
// /rooms/:id/access