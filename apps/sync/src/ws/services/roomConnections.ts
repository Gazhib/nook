import type { WebSocket } from "ws";

const connections = new Map<string, Map<WebSocket, string>>();

export function registerRoomConnection(
  roomId: string,
  userId: string,
  ws: WebSocket,
) {
  let room = connections.get(roomId);
  if (!room) connections.set(roomId, (room = new Map()));
  room.set(ws, userId);
  return () => {
    room.delete(ws);
    if (room.size === 0 && connections.get(roomId) === room)
      connections.delete(roomId);
  };
}

export function closeRoomConnections(roomId: string, userId?: string) {
  connections.get(roomId)?.forEach((connectedUserId, ws) => {
    if (!userId || connectedUserId === userId)
      ws.close(1008, "Room access changed");
  });
}
