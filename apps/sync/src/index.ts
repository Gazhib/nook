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
    credentials: true,
    maxAge: 86400,
  }),
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
import * as schema from "./schemas";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { verifyToken } from "./middleware/token";
import { Duplex } from "stream";
import { AppError } from "./errors";
import { DATABASE_URL } from "./loadEnv";
import type { Role } from "@nook/shared";
import { assertRoomId } from "./controllers/roomControllers";
import { registerRoomConnection } from "./ws/services/roomConnections";
import { removeAwarenessStates } from "y-protocols/awareness";

export const db = drizzle(DATABASE_URL, { schema });
const wss = new WebSocketServer({ noServer: true });

wss.on(
  "connection",
  (ws: WebSocket, req: IncomingMessage, userRole: Role, userId: string) => {
    const roomId = req.url?.slice(1).split("?")[0];

    if (!roomId) {
      return;
    }

    const room = getDoc(roomId);
    const { doc, awareness, conns } = room;
    conns.add(ws);
    const unregister = registerRoomConnection(roomId, userId, ws);
    const controlledIds = new Set<number>();
    const trackAwareness = (
      {
        added,
        updated,
        removed,
      }: { added: number[]; updated: number[]; removed: number[] },
      origin: unknown,
    ) => {
      if (origin !== ws) return;
      for (const id of [...added, ...updated]) controlledIds.add(id);
      for (const id of removed) controlledIds.delete(id);
    };
    awareness.on("update", trackAwareness);

    WsRoomService.cancelEviction(room);
    WsRoomService.startSaveInterval(roomId, room);

    ws.on("message", (message: RawData) => {
      if (ws.readyState === WebSocket.OPEN) {
        YJScontroller.handleMessage(
          message,
          doc,
          ws,
          awareness,
          userRole !== "viewer",
        );
      }
    });
    ws.on("error", (err) => {
      if (err.cause === "ECONNRESET") {
        console.log("Connection closed");
      } else {
        console.error(err);
      }
    });
    ws.on("close", () => {
      unregister();
      awareness.off("update", trackAwareness);
      removeAwarenessStates(awareness, [...controlledIds], ws);
      conns.delete(ws);
      if (conns.size === 0) {
        void WsRoomService.saveSnapshot(roomId, room);
        WsRoomService.scheduleEviction(roomId, room);
      }
    });

    try {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, 0);
      syncProtocol.writeSyncStep1(encoder, doc);
      ws.send(encoding.toUint8Array(encoder));
    } catch (err) {
      console.error(`Failed to send initial sync for room ${roomId}`, err);
      conns.delete(ws);
      ws.close();
    }
  },
);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  if (err instanceof AppError) {
    if (!err.expose) console.error(err);
    return c.json(
      { error: err.expose ? err.message : "Internal server error" },
      err.status as ContentfulStatusCode,
    );
  }

  console.error(err);
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

server.on(
  "upgrade",
  async (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    const roomId = req.url?.slice(1).split("?")[0];
    if (!roomId) {
      socket.destroy();
      return;
    }

    const cookieHeader = req.headers.cookie;
    const token = Object.fromEntries(
      (cookieHeader ?? "").split(";").map((c) => c.trim().split("=")),
    ).access_token;

    let userId;
    let userRole: Role;

    try {
      userId = await verifyToken(token);
    } catch {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    try {
      assertRoomId(roomId);
      userRole = await WsRoomService.getRole(roomId, userId);
    } catch {
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req, userRole, userId);
    });
  },
);
