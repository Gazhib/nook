import { Hono } from "hono";
import { roomControllers } from "../controllers/roomControllers";
import { tokenMiddleware } from "../middleware/token";

export const roomRoutes = new Hono();

roomRoutes.use("*", tokenMiddleware);

roomRoutes.post("/", roomControllers.createRoom);

roomRoutes.get("/:roomId", roomControllers.getRoomInfo);
roomRoutes.get("/:roomId/room_members", roomControllers.getRoomMembers);
roomRoutes.get("/:roomId/access", roomControllers.getRoomAccess);
roomRoutes.get("/", roomControllers.getRooms);
roomRoutes.get("/:roomId/name", roomControllers.getRoomName);
roomRoutes.get("/:roomId/:userId/kick", roomControllers.kickUser);

roomRoutes.post("/room_snapshot", roomControllers.setRoomSnapshot);
roomRoutes.post("/:roomId/accessibility", roomControllers.setRoomAccessibility);
roomRoutes.post("/:roomId/:username/invite", roomControllers.inviteUser);
roomRoutes.post("/:roomId/rename", roomControllers.renameRoom);
roomRoutes.post("/:roomId/:userId/role", roomControllers.changeRole);
