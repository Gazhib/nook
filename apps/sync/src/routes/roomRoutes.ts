import { Hono } from "hono";
import { roomControllers } from "../controllers/roomControllers";
import { tokenMiddleware } from "../middleware/token";

export const roomRoutes = new Hono();

roomRoutes.use("*", tokenMiddleware);

roomRoutes.post("/", roomControllers.createRoom);

roomRoutes.get("/:roomId", roomControllers.getRoomInfo);
roomRoutes.post("/room_snapshot", roomControllers.setRoomSnapshot);
roomRoutes.get("/:roomId/room_members", roomControllers.getRoomMembers);
roomRoutes.get("/:roomId/accessibility", roomControllers.setRoomAccessibility);
roomRoutes.get("/:roomId/access", roomControllers.getRoomAccess);
roomRoutes.get("/", roomControllers.getRooms);

roomRoutes.post("/:roomId/:username/invite", roomControllers.inviteUser);
roomRoutes.post("/:roomId/rename", roomControllers.renameRoom);
