import assert from "node:assert/strict";
import test from "node:test";
import type { WebSocket } from "ws";
import {
  closeRoomConnections,
  registerRoomConnection,
} from "./roomConnections";

test("permission changes close only the affected room and user, with clean unregister", () => {
  const closed: string[] = [];
  const socket = (name: string) =>
    ({
      close: (code: number) => {
        assert.equal(code, 1008);
        closed.push(name);
      },
    }) as unknown as WebSocket;
  const unregister = [
    registerRoomConnection("room-a", "alice", socket("alice-one")),
    registerRoomConnection("room-a", "alice", socket("alice-two")),
    registerRoomConnection("room-a", "bob", socket("bob")),
    registerRoomConnection("room-b", "alice", socket("other-room")),
  ];
  try {
    closeRoomConnections("room-a", "alice");
    assert.deepEqual(closed, ["alice-one", "alice-two"]);
    closed.length = 0;
    closeRoomConnections("room-a");
    assert.deepEqual(closed, ["alice-one", "alice-two", "bob"]);
  } finally {
    for (const remove of unregister) remove();
  }
  closed.length = 0;
  closeRoomConnections("room-a");
  closeRoomConnections("room-b");
  assert.deepEqual(closed, []);
});
