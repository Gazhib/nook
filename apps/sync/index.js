import {serve} from "@hono/node-server"
import {Hono} from "hono"

const app = new Hono();

import { WebSocketServer } from "ws";
import * as Y from "yjs";
import * as syncProtocol from "y-protocols/sync";
import * as awarenessProtocol from "y-protocols/awareness";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

const wss = new WebSocketServer({ port: 1234 });
const docs = new Map();

const getDoc = (name) => {
  if (!docs.has(name)) {
    const doc = new Y.Doc();
    docs.set(name, {
      doc,
      awareness: new awarenessProtocol.Awareness(doc),
      conns: new Set(),
    });
  }
  return docs.get(name);
};

wss.on("connection", (ws, req) => {
  const roomName = req.url.slice(1);
  const { doc, awareness, conns } = getDoc(roomName);
  conns.add(ws);

  ws.on("message", (message) => {
    const decoder = decoding.createDecoder(new Uint8Array(message));
    const encoder = encoding.createEncoder();
    const messageType = decoding.readVarUint(decoder);

    if (messageType === 0) {
      // sync
      encoding.writeVarUint(encoder, 0);
      syncProtocol.readSyncMessage(decoder, encoder, doc, null);
      if (encoding.length(encoder) > 1) ws.send(encoding.toUint8Array(encoder));
    } else if (messageType === 1) {
      // awareness
      awarenessProtocol.applyAwarenessUpdate(
        awareness,
        decoding.readVarUint8Array(decoder),
        ws
      );
    }
  });

  ws.on("close", () => conns.delete(ws));

  // send initial sync
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, 0);
  syncProtocol.writeSyncStep1(encoder, doc);
  ws.send(encoding.toUint8Array(encoder));
});


app.get("/health", (c) => {
  return c.json({ ok: true });
});

serve({ fetch: app.fetch, port: 4000 }, () => {
  console.log("Server is running on 4000");
});
