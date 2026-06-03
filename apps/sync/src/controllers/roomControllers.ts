import { Context } from "hono";
import { BadRequestError, NotFoundError } from "../errors";
import { roomService } from "../services/roomService";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function readJsonBody(
  c: Context
): Promise<Record<string, unknown>> {
  const body = await c.req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new BadRequestError("Request body must be a JSON object");
  }
  return body as Record<string, unknown>;
}

export function assertRoomId(
  roomId: string | undefined
): asserts roomId is string {
  if (!roomId || roomId.trim() === "") {
    throw new BadRequestError("Invalid roomId");
  }
  if (!UUID_REGEX.test(roomId)) {
    throw new NotFoundError("Room not found");
  }
}

export const roomControllers = {
  async createRoom(c: Context) {
    const ownerId = c.get("userId");

    if (!ownerId || ownerId.trim() === "") {
      throw new BadRequestError("Invalid ownerId");
    }

    const roomId = await roomService.createRoom(ownerId);

    return c.json({ message: "Room was created successfully", roomId }, 200);
  },

  async getRoomInfo(c: Context) {
    const roomId = c.req.param("roomId");
    const userId = c.get("userId");

    assertRoomId(roomId);

    await roomService.getRoomAccess(roomId, userId);

    const room = await roomService.getRoomInfo(roomId);
    const roomSnapshot = await roomService.getRoomSnapshot(roomId);

    return c.json(
      { message: "Room found successfully", room, roomSnapshot },
      200
    );
  },

  async setRoomSnapshot(c: Context) {
    const body = await readJsonBody(c);
    const roomId = body.roomId;
    const state = body.state;

    if (typeof roomId !== "string") {
      throw new BadRequestError('Field "roomId" is required');
    }
    if (typeof state !== "string") {
      throw new BadRequestError('Field "state" must be a base64 string');
    }

    assertRoomId(roomId);

    await roomService.setRoomSnapshot(roomId, Buffer.from(state, "base64"));

    return c.json({ message: "Room snapshot saved successfully" }, 200);
  },

  async getRoomAccess(c: Context) {
    const roomId = c.req.param("roomId");
    const userId = c.get("userId");

    assertRoomId(roomId);

    const role = await roomService.getRoomRole(roomId, userId);

    if (role === null) {
      throw new NotFoundError("You have no access to the room");
    }

    return c.json({ role, message: "Your role" }, 200);
  },

  async setRoomAccessibility(c: Context) {
    const roomId = c.req.param("roomId");

    assertRoomId(roomId);

    await roomService.setRoomAccessibility(roomId);
    return c.json({ message: "Room accessibility has changed" }, 200);
  },

  async getRoomMembers(c: Context) {
    const roomId = c.req.param("roomId");

    assertRoomId(roomId);

    const members = await roomService.getRoomMembers(roomId);
    return c.json({ members, message: "Room members found" }, 200);
  },

  async inviteUser(c: Context) {
    const { roomId, username } = c.req.param();
    const body = await readJsonBody(c);
    const role = body.role;

    assertRoomId(roomId);

    if (!username || username.trim() === "") {
      throw new BadRequestError("Invalid username");
    }
    if (typeof role !== "string") {
      throw new BadRequestError('Field "role" is required');
    }

    const inviterId = c.get("userId");

    await roomService.inviteUser(roomId, username, role, inviterId);

    return c.json({ message: "User invited successfully" }, 200);
  },

  async getRooms(c: Context) {
    const userId = c.get("userId");

    const rooms = await roomService.getRoomsForUser(userId);

    return c.json({ rooms, message: "Rooms found successfully" }, 200);
  },

  async renameRoom(c: Context) {
    const roomId = c.req.param("roomId");
    const body = await readJsonBody(c);
    const newName = body.newName;

    assertRoomId(roomId);

    if (typeof newName !== "string" || newName.trim() === "") {
      throw new BadRequestError("Invalid newName");
    }

    const userId = c.get("userId");

    await roomService.renameRoom(roomId, newName, userId);

    return c.json({ message: "Room renamed successfully" }, 200);
  },
};
