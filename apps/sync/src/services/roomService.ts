import { BadRequestError, ForbiddenError } from "../errors";
import { roomRepository } from "../repositories/roomRepository";
import { Role, Accessibility } from "@nook/shared/index";
import {
  assertRoomEditor,
  assertRoomOwner,
  resolveRoomRole,
} from "./roomPermissions";
import { closeRoomConnections } from "../ws/services/roomConnections";

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

  async setRoomSnapshot(roomId: string, state: Buffer, userId: string) {
    assertRoomEditor(await this.getRoomRole(roomId, userId));
    await roomRepository.setRoomSnapshot(roomId, state);
  },

  async getRoomRole(roomId: string, userId: string) {
    const [role, accessibility] = await Promise.all([
      roomRepository.getRoomAccess(roomId, userId),
      roomRepository.getRoomAccessibility(roomId),
    ]);
    return resolveRoomRole(role, accessibility);
  },

  async getRoomAccess(roomId: string, userId: string) {
    await this.getRoomRole(roomId, userId);
  },

  async setRoomAccessibility(
    roomId: string,
    accessibility: Accessibility,
    userId: string,
  ) {
    assertRoomOwner(await this.getRoomRole(roomId, userId));
    await roomRepository.setRoomAccessibility(roomId, accessibility);
    closeRoomConnections(roomId);
  },

  async getRoomMembers(roomId: string, userId: string) {
    await this.getRoomAccess(roomId, userId);
    const members = await roomRepository.getRoomMembers(roomId);
    return members;
  },

  async inviteUser(
    roomId: string,
    username: string,
    role: string,
    inviterId: string,
  ) {
    const normalizedRole = role.toLowerCase();
    if (!VALID_ROLES.includes(normalizedRole as Role)) {
      throw new BadRequestError(
        `Role must be one of: ${VALID_ROLES.join(", ")}`,
      );
    }

    const inviterRole = await roomRepository.getRoomAccess(roomId, inviterId);

    if (inviterRole !== "owner") {
      throw new ForbiddenError(
        "You have no access to invite users to the room",
      );
    }

    const user = await roomRepository.inviteUser(
      roomId,
      username,
      normalizedRole as Role,
    );
    closeRoomConnections(roomId, user.id);
    return user;
  },

  async getRoomsForUser(userId: string) {
    const rooms = await roomRepository.getRoomsForUser(userId);
    return rooms;
  },

  async renameRoom(roomId: string, newName: string, userId: string) {
    const normalizedName = newName.trim();
    if (!normalizedName || normalizedName.length > 255) {
      throw new BadRequestError(
        "Room name must contain between 1 and 255 characters",
      );
    }
    const role = await roomRepository.getRoomAccess(roomId, userId);

    if (role !== "owner") {
      throw new ForbiddenError("Only the owner can rename the room");
    }

    await roomRepository.renameRoom(roomId, normalizedName);
  },

  async getRoomName(roomId: string, userId: string) {
    await this.getRoomAccess(roomId, userId);
    const name = await roomRepository.getRoomName(roomId);
    return name;
  },

  async changeRole(
    roomId: string,
    userId: string,
    role: string,
    changerId: string,
  ) {
    const changerRole = await this.getRoomRole(roomId, changerId);

    const normalizedRole = role.toLowerCase();

    if (!VALID_ROLES.includes(normalizedRole as Role)) {
      throw new BadRequestError(
        `Role must be one of: ${VALID_ROLES.join(", ")}`,
      );
    }

    if (changerRole !== "owner")
      throw new ForbiddenError("Only the owner can change role in the room");

    await roomRepository.changeRole(roomId, userId, normalizedRole as Role);
    closeRoomConnections(roomId, userId);
  },

  async kickUser(roomId: string, userId: string, kickerId: string) {
    const kickerRole = await this.getRoomRole(roomId, kickerId);

    if (kickerRole !== "owner")
      throw new ForbiddenError("Only the owner can kick from the room");

    await roomRepository.kickUserFromRoom(roomId, userId);
    closeRoomConnections(roomId, userId);
  },
};
