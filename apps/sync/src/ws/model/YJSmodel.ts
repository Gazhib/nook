import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import { WsRoom } from "./wsRoomModel";

const docs = new Map<string, WsRoom>();

export const getDoc = (name: string) : WsRoom => {
  if (!docs.has(name)) {
    const doc = new Y.Doc();

    docs.set(name, {
      doc,
      awareness: new awarenessProtocol.Awareness(doc),
      conns: new Set(),
      dirty: false,
      saving: false,
    });

    const entry = docs.get(name);

    doc.on("update", () => {
      if (entry) entry.dirty = true;
    });
  }
  return docs.get(name)!;
};

export const deleteDoc = (name: string) => {
  docs.delete(name);
};
