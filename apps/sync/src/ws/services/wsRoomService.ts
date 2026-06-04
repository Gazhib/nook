import { encodeStateAsUpdate } from "yjs";
import { WsRoom } from "../model/wsRoomModel";
import { roomRepository } from "../../repositories/roomRepository";
import { deleteDoc } from "../model/YJSmodel";
import { get } from "http";

const SAVE_INTERVAL_MS = 30_000;
const EMPTY_GRACE_MS = 10_000;

export const WsRoomService = {
  async saveSnapshot(roomId: string, room: WsRoom) {
    if (room.saving) return;
    if (!room.dirty) return;
    room.saving = true;

    try {
      const update = encodeStateAsUpdate(room.doc);
      const state = Buffer.from(update);
      await roomRepository.setRoomSnapshot(roomId, state);
      room.dirty = false;
    } catch (err) {
      console.error(`Failed to save snapshot for room ${roomId}`, err);
    } finally {
      room.saving = false;
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
    room.emptyTimer = setTimeout(() => {
      clearInterval(room.saveInterval);
      room.saveInterval = undefined;
      deleteDoc(roomId);
    }, EMPTY_GRACE_MS);
  },

  async getRole(roomId: string, userId: string) {
    const role = await roomRepository.getRoomAccess(roomId, userId);
    return role;
  },

  async getAccessibility(roomId: string) {
    const accessibility = await roomRepository.getRoomAccessibility(roomId);
    return accessibility;
  },
};
