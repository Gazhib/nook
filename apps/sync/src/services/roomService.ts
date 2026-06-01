import { db } from "..";
import { roomRepository } from "../repositories/roomRepository";

export const roomService = {
  async createRoom(ownerId: string) {
    const roomId = await roomRepository.createRoom(ownerId);

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

  async getRoomAccess(roomId: string, userId: string) {
    const role = await roomRepository.getRoomAccess(roomId, userId);

    return role;
  },
};
