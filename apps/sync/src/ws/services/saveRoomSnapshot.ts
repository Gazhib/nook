import { encodeStateAsUpdate } from "yjs";
import type { WsRoom } from "../model/wsRoomModel";

export async function saveDirtyRoom(
  room: WsRoom,
  persist: (state: Buffer) => Promise<void>,
) {
  if (room.saving || !room.dirty) return;
  room.saving = true;
  room.dirty = false;
  try {
    await persist(Buffer.from(encodeStateAsUpdate(room.doc)));
  } catch (error) {
    room.dirty = true;
    throw error;
  } finally {
    room.saving = false;
  }
}
