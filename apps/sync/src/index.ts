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
import * as encoding from "lib0/encoding";
import { RawData, WebSocket, WebSocketServer } from "ws";
import * as syncProtocol from "y-protocols/sync";

import { drizzle } from "drizzle-orm/node-postgres";
import { cors } from "hono/cors";
import { authRoutes } from "./routes/authRoutes";
import { roomRoutes } from "./routes/roomRoutes";
import { userRoutes } from "./routes/userRoutes";
import { YJScontroller } from "./ws/controllers/YJScontroller";
import { getDoc } from "./ws/model/YJSmodel";
import { WsRoomService } from "./ws/services/wsRoomService";

export const db = drizzle(process.env.DATABASE_URL!);
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const roomId = req.url?.slice(1).split("?")[0];
  if (!roomId) {
    return;
  }

  const room = getDoc(roomId);
  const { doc, awareness, conns } = room;
  conns.add(ws);

  WsRoomService.cancelEviction(room);
  WsRoomService.startSaveInterval(roomId, room);

  ws.on("message", (message: RawData) =>
    YJScontroller.handleMessage(message, doc, ws, awareness)
  );
  ws.on("error", (err) => {
    if (err.cause === "ECONNRESET") {
      console.log("Connection closed");
    } else {
      console.log(err);
    }
  });
  ws.on("close", () => {
    conns.delete(ws);
    if (conns.size === 0) {
      WsRoomService.saveSnapshot(roomId, room);
      WsRoomService.scheduleEviction(roomId, room);
    }
  });
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

const server = serve({ fetch: app.fetch, port: 1234 }, () => {
  console.log("Server is running on 1234");
});

server.on("upgrade", (req, socket, head) => {
  const roomId = req.url?.slice(1).split("?")[0];
  if (!roomId) {
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});
