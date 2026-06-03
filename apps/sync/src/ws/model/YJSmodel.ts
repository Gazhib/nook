import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import { WebSocket } from "ws";
import { WsRoom } from "./wsRoomModel";

const docs = new Map<string, WsRoom>();

export const getDoc = (name: string): WsRoom => {
  if (!docs.has(name)) {
    const doc = new Y.Doc();

    const entry: WsRoom = {
      doc,
      awareness: new awarenessProtocol.Awareness(doc),
      conns: new Set(),
      dirty: false,
      saving: false,
    };

    docs.set(name, entry);

    const broadcast = (data: Uint8Array, exclude?: WebSocket) => {
      entry.conns.forEach((conn) => {
        if (conn !== exclude && conn.readyState === conn.OPEN) conn.send(data);
      });
    };

    doc.on("update", (update: Uint8Array, origin: unknown) => {
      entry.dirty = true;
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, 0);
      syncProtocol.writeUpdate(encoder, update);
      broadcast(
        encoding.toUint8Array(encoder),
        origin instanceof WebSocket ? origin : undefined
      );
    });

    entry.awareness.on(
      "update",
      ({ added, updated, removed }: { added: number[]; updated: number[]; removed: number[] }) => {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, 1);
        encoding.writeVarUint8Array(
          encoder,
          awarenessProtocol.encodeAwarenessUpdate(entry.awareness, [
            ...added,
            ...updated,
            ...removed,
          ])
        );
        broadcast(encoding.toUint8Array(encoder));
      }
    );
  }
  return docs.get(name)!;
};

export const deleteDoc = (name: string) => {
  docs.delete(name);
};
