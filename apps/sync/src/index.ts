import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "./loadEnv";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    // credentials: true,
    maxAge: 86400,
  })
);

import { IncomingMessage } from "http";
import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import { RawData, WebSocket, WebSocketServer } from "ws";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as Y from "yjs";

import { drizzle } from "drizzle-orm/node-postgres";
import { authRoutes } from "./routes/authRoutes";
import { roomRoutes } from "./routes/roomRoutes";
import { userRoutes } from "./routes/userRoutes";
import { cors } from "hono/cors";

export const db = drizzle(process.env.DATABASE_URL!);

const wss = new WebSocketServer({ noServer: true });
const docs = new Map();

const getDoc = (name: string) => {
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

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const roomName = req.url?.slice(1);

  if (!roomName) {
    return;
  }

  const { doc, awareness, conns } = getDoc(roomName);
  conns.add(ws);

  ws.on("message", (message: RawData) => {
    const buffers = Array.isArray(message)
      ? message
      : message instanceof ArrayBuffer
      ? [Buffer.from(message)]
      : [message];

    const decoder = decoding.createDecoder(
      new Uint8Array(Buffer.concat(buffers))
    );
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

  ws.on("error", (err) => {
    if (err.cause === "ECONNRESET") {
      console.log("Connection closed");
    } else {
      console.log(err);
    }
  });

  ws.on("close", () => conns.delete(ws));

  // send initial sync
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, 0);
  syncProtocol.writeSyncStep1(encoder, doc);
  ws.send(encoding.toUint8Array(encoder));
});



const customErrorNames = new Set(["NotFoundError", "RoomError", "UserError"]);

app.onError((err, c) => {
  if (err instanceof Error && customErrorNames.has(err.name))
    return c.json({ error: err.message }, 404);

  return c.json({ error: "Internal server error" }, 500);
});

app.get("/health", (c) => {
  return c.json({ ok: true });
});

app.route("/rooms", roomRoutes);
app.route("/users", userRoutes);
app.route("/auth", authRoutes);

serve({ fetch: app.fetch, port: 1234, websocket: { server: wss } }, () => {
  console.log("Server is running on 1234");
});
