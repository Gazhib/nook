import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";
import { roomRepository } from "../repositories/roomRepository";
import { Role, Accessibility } from "@nook/shared/index";

const VALID_ROLES: readonly Role[] = ["viewer", "editor", "owner"];

export const roomService = {
  async createRoom(ownerId: string) {
    const roomId = await roomRepository.createRoom(ownerId);
    await roomRepository.setRole(ownerId, "owner", roomId);

    return roomId;
  },

  async getRoomInfo(roomId: string) {
    const room = await roomRepository.getRoomInfo(roomId);
    return room;
  },

  async getRoomSnapshot(roomId: string) {
    const room_snapshot = await roomRepository.getRoomSnapshot(roomId);
    return room_snapshot;
  },

  async setRoomSnapshot(roomId: string, state: Buffer) {
    await roomRepository.setRoomSnapshot(roomId, state);
  },

  async getRoomRole(roomId: string, userId: string) {
    const role = await roomRepository.getRoomAccess(roomId, userId);

    return role;
  },

  async getRoomAccess(roomId: string, userId: string) {
    const role = await roomRepository.getRoomAccess(roomId, userId);
    const accessibility = await roomRepository.getRoomAccessibility(roomId);

    if (accessibility === "public" || role !== null) return;

    throw new NotFoundError("You have no access to the room");
  },

  async setRoomAccessibility(roomId: string, accessibility: Accessibility) {
    await roomRepository.setRoomAccessibility(roomId, accessibility);
  },

  async getRoomMembers(roomId: string) {
    const members = await roomRepository.getRoomMembers(roomId);
    return members;
  },

  async inviteUser(
    roomId: string,
    username: string,
    role: string,
    inviterId: string
  ) {
    const normalizedRole = role.toLowerCase();
    if (!VALID_ROLES.includes(normalizedRole as Role)) {
      throw new BadRequestError(
        `Role must be one of: ${VALID_ROLES.join(", ")}`
      );
    }

    const inviterRole = await roomRepository.getRoomAccess(roomId, inviterId);

    if (inviterRole !== "owner") {
      throw new ForbiddenError(
        "You have no access to invite users to the room"
      );
    }

    const user = await roomRepository.inviteUser(
      roomId,
      username,
      normalizedRole as Role
    );
    return user;
  },

  async getRoomsForUser(userId: string) {
    const rooms = await roomRepository.getRoomsForUser(userId);
    return rooms;
  },

  async renameRoom(roomId: string, newName: string, userId: string) {
    const role = await roomRepository.getRoomAccess(roomId, userId);

    if (role !== "owner") {
      throw new ForbiddenError("Only the owner can rename the room");
    }

    await roomRepository.renameRoom(roomId, newName);
  },

  async getRoomName(roomId: string) {
    const name = await roomRepository.getRoomName(roomId);
    return name;
  },

  async changeRole(
    roomId: string,
    userId: string,
    role: string,
    changerId: string
  ) {
    const changerRole = await this.getRoomRole(roomId, changerId);

    const normalizedRole = role.toLowerCase();

    if (!VALID_ROLES.includes(normalizedRole as Role)) {
      throw new BadRequestError(
        `Role must be one of: ${VALID_ROLES.join(", ")}`
      );
    }

    if (changerRole !== "owner")
      throw new ForbiddenError("Only the owner can change role in the room");

    await roomRepository.changeRole(roomId, userId, normalizedRole as Role);
  },

  async kickUser(roomId: string, userId: string, kickerId: string) {
    const kickerRole = await this.getRoomRole(roomId, kickerId);

    if (kickerRole !== "owner")
      throw new ForbiddenError("Only the owner can kick from the room");

    await roomRepository.kickUserFromRoom(roomId, userId);
  },
};
