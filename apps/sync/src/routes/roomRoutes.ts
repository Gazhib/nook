import { Hono } from "hono";
import { roomControllers } from "../controllers/roomControllers";

export const roomRoutes = new Hono();

roomRoutes.post("/:ownerId", roomControllers.createRoom);
