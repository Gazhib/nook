import { Context } from "hono";
import { RoomError } from "../errors";
import { roomService } from "../services/roomService";
import { HTTPException } from "hono/http-exception";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const roomControllers = {
  async createRoom(c: Context) {
    const ownerId = c.get("userId");

    // get ownerId from jwt

    if (!ownerId || ownerId.trim() === "") {
      return c.json({ error: "Invalid ownerId" }, 400);
    }

    if (!ownerId) throw new Error("Owner id is not provided");
    // userService.findUserById(ownerId);
    const roomId = await roomService.createRoom(ownerId);

    return c.json({ message: "Room was created successfully", roomId }, 200);
  },

  async getRoomInfo(c: Context) {
    const roomId = c.req.param("roomId");

    const userId = c.get("userId");

    if (!roomId || roomId.trim() === "") {
      return c.json({ error: "Invalid roomId" }, 400);
    }

    if (!UUID_REGEX.test(roomId)) {
      throw new RoomError("Room not found");
    }

    const role = roomService.getRoomAccess(roomId, userId);

    if (role === null) {
      throw new HTTPException(404, {
        message: "You have no access to the room",
      });
    }

    const room = await roomService.getRoomInfo(roomId);
    const roomSnapshot = await roomService.getRoomSnapshot(roomId);

    return c.json(
      { message: "Room found successfully", room, roomSnapshot, role },
      200
    );
  },

  async setRoomSnapshot(c: Context) {
    const { roomId, state } = await c.req.json();

    // Dont forget to add check of user

    if (!UUID_REGEX.test(roomId)) {
      throw new RoomError("Room not found");
    }

    await roomService.setRoomSnapshot(roomId, Buffer.from(state, "base64"));

    return c.json({ message: "Room snapshot saved successfully" }, 200);
  },

  async getRoomAccess(c: Context) {
    const roomId = await c.req.param("roomId");

    // dont forget to pick userId from jwt

    const userId = c.get("userId");

    if (!roomId || roomId.trim() === "") {
      return c.json({ error: "Invalid roomId" }, 400);
    }

    if (!UUID_REGEX.test(roomId)) {
      throw new RoomError("Room not found");
    }

    const role = await roomService.getRoomAccess(roomId, userId);

    if (role === null) {
      return c.json({ message: "You have no access to the room" }, 404);
    }

    return c.json({ role, message: "Your role" }, 200);
  },
};
