import { db } from "..";
import { roomRepository } from "../repositories/roomRepository";

export const roomService = {
  async createRoom(ownerId: number) {
    const roomId = await roomRepository.createRoom(ownerId);

    return roomId;
  },

  async getRoomInfo(roomId: number) {
    const room = await roomRepository.getRoomInfo(roomId);
    return room;
  },

  async getRoomSnapshot(roomId: number) {
    const room_snapshot = await roomRepository.getRoomSnapshot(roomId);
    return room_snapshot;
  },

  async setRoomSnapshot(roomId: number, state: Buffer) {
    await roomRepository.setRoomSnapshot(roomId, state);
  },
};
