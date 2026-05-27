import { Context } from "hono";
import { roomService } from "../services/roomService";
import { userService } from "../services/userService";

export const roomControllers = {
  async createRoom(c: Context) {
    const ownerId = Number(c.req.param("ownerId"));

    if (!Number.isInteger(ownerId) || ownerId < 1) {
      return c.json({ error: "Invalid ownerId" }, 400);
    }

    if (!ownerId) throw new Error("Owner id is not provided");
    // userService.findUserById(ownerId);
    const roomId = roomService.createRoom(ownerId);

    return c.json({ message: "Room was created successfully", roomId }, 200);
  },
};
