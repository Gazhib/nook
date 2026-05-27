import { roomRepository } from "../repositories/roomRepository";

export const roomService = {
  async createRoom(ownerId: number) {
    const roomId = roomRepository.createRoom(ownerId);

    return roomId;
  },
};
