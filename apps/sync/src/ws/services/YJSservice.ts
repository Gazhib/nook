import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import { RawData, WebSocket } from "ws";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import { Doc } from "yjs";

export const YJSservice = {
  handleMessage(
    message: RawData,
    doc: Doc,
    ws: WebSocket,
    awareness: awarenessProtocol.Awareness,
    canWrite: boolean,
  ) {
    try {
      const buffers = Array.isArray(message)
        ? message
        : message instanceof ArrayBuffer
          ? [Buffer.from(message)]
          : [message];

      const decoder = decoding.createDecoder(
        new Uint8Array(Buffer.concat(buffers)),
      );
      const encoder = encoding.createEncoder();
      const messageType = decoding.readVarUint(decoder);

      if (messageType === 0) {
        if (
          !canWrite &&
          decoding.peekVarUint(decoder) !== syncProtocol.messageYjsSyncStep1
        ) {
          return;
        }
        // sync
        encoding.writeVarUint(encoder, 0);
        syncProtocol.readSyncMessage(decoder, encoder, doc, ws);
        if (encoding.length(encoder) > 1) {
          ws.send(encoding.toUint8Array(encoder));
        }
      } else if (messageType === 1) {
        // awareness
        awarenessProtocol.applyAwarenessUpdate(
          awareness,
          decoding.readVarUint8Array(decoder),
          ws,
        );
      }
    } catch (err) {
      console.error("Failed to handle YJS message", err);
    }
  },
};
