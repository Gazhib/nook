import { Context } from "hono";
import { roomService } from "../services/roomService";
import { userService } from "../services/userService";

export const roomControllers = {
  async createRoom(c: Context) {
    const ownerId = 1;

    // get ownerId from httponlycookie

    if (!Number.isInteger(ownerId) || ownerId < 1) {
      return c.json({ error: "Invalid ownerId" }, 400);
    }

    if (!ownerId) throw new Error("Owner id is not provided");
    // userService.findUserById(ownerId);
    const roomId = await roomService.createRoom(ownerId);

    return c.json({ message: "Room was created successfully", roomId }, 200);
  },

  async getRoomInfo(c: Context) {
    const roomId = Number(c.req.param("roomId"));

    // get ownerId from httponlycookie and check whether they are equal

    if (!Number.isInteger(roomId) || roomId < 1 || !roomId) {
      return c.json({ error: "Invalid roomId" }, 400);
    }

    const room = await roomService.getRoomInfo(roomId);
    const roomSnapshot = await roomService.getRoomSnapshot(roomId);

    return c.json(
      { message: "Room found successfully", room, roomSnapshot },
      200
    );
  },

  async setRoomSnapshot(c: Context) {
    const { roomId, state } = await c.req.json();

    await roomService.setRoomSnapshot(roomId, Buffer.from(state, "base64"));

    return c.json(
      { message: "Room snapshot saved successfully" },
      200
    );
  },
};
