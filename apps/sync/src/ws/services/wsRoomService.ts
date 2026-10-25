import { WsRoom } from "../model/wsRoomModel";
import { roomRepository } from "../../repositories/roomRepository";
import { deleteDoc } from "../model/YJSmodel";
import { roomService } from "../../services/roomService";
import { saveDirtyRoom } from "./saveRoomSnapshot";

const SAVE_INTERVAL_MS = 30_000;
const EMPTY_GRACE_MS = 10_000;

export const WsRoomService = {
  async saveSnapshot(roomId: string, room: WsRoom) {
    try {
      await saveDirtyRoom(room, (state) =>
        roomRepository.setRoomSnapshot(roomId, state),
      );
    } catch (err) {
      console.error(`Failed to save snapshot for room ${roomId}`, err);
    }
  },

  startSaveInterval(roomId: string, room: WsRoom) {
    if (room.saveInterval) return;

    room.saveInterval = setInterval(() => {
      this.saveSnapshot(roomId, room);
    }, SAVE_INTERVAL_MS);
  },

  cancelEviction(room: WsRoom) {
    if (room.emptyTimer) {
      clearTimeout(room.emptyTimer);
      room.emptyTimer = undefined;
    }
  },

  scheduleEviction(roomId: string, room: WsRoom) {
    room.emptyTimer = setTimeout(async () => {
      room.emptyTimer = undefined;
      if (room.conns.size > 0) return;
      await this.saveSnapshot(roomId, room);
      if (room.conns.size > 0) return;
      if (room.dirty || room.saving) {
        this.scheduleEviction(roomId, room);
        return;
      }
      clearInterval(room.saveInterval);
      room.saveInterval = undefined;
      deleteDoc(roomId);
    }, EMPTY_GRACE_MS);
  },

  async getRole(roomId: string, userId: string) {
    return roomService.getRoomRole(roomId, userId);
  },

  async getAccessibility(roomId: string) {
    const accessibility = await roomRepository.getRoomAccessibility(roomId);
    return accessibility;
  },
};
