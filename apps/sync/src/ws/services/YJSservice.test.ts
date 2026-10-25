import assert from "node:assert/strict";
import test from "node:test";
import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import type { WebSocket } from "ws";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as Y from "yjs";
import { YJSservice } from "./YJSservice";

function syncMessage(write: (encoder: encoding.Encoder) => void) {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, 0);
  write(encoder);
  return Buffer.from(encoding.toUint8Array(encoder));
}

test("viewer can request the current room state without writing", () => {
  const server = new Y.Doc();
  const client = new Y.Doc();
  const awareness = new awarenessProtocol.Awareness(server);
  server.getMap("furniture").set("chair", "saved");
  const replies: Uint8Array[] = [];
  const ws = {
    send: (data: Uint8Array) => replies.push(data),
  } as unknown as WebSocket;
  try {
    YJSservice.handleMessage(
      syncMessage((encoder) => syncProtocol.writeSyncStep1(encoder, client)),
      server,
      ws,
      awareness,
      false,
    );
    assert.equal(replies.length, 1);
    const reply = replies[0];
    assert.ok(reply);
    const decoder = decoding.createDecoder(reply);
    assert.equal(decoding.readVarUint(decoder), 0);
    syncProtocol.readSyncMessage(
      decoder,
      encoding.createEncoder(),
      client,
      null,
    );
    assert.equal(client.getMap("furniture").get("chair"), "saved");
  } finally {
    awareness.destroy();
    server.destroy();
    client.destroy();
  }
});

test("viewer sync-step2 and update packets cannot mutate room state", () => {
  const server = new Y.Doc();
  const attacker = new Y.Doc();
  const awareness = new awarenessProtocol.Awareness(server);
  attacker.getMap("furniture").set("chair", "injected");
  const ws = { send() {} } as unknown as WebSocket;
  try {
    for (const packet of [
      syncMessage((encoder) => syncProtocol.writeSyncStep2(encoder, attacker)),
      syncMessage((encoder) =>
        syncProtocol.writeUpdate(encoder, Y.encodeStateAsUpdate(attacker)),
      ),
    ]) {
      YJSservice.handleMessage(packet, server, ws, awareness, false);
      assert.equal(server.getMap("furniture").size, 0);
    }
    YJSservice.handleMessage(
      syncMessage((encoder) =>
        syncProtocol.writeUpdate(encoder, Y.encodeStateAsUpdate(attacker)),
      ),
      server,
      ws,
      awareness,
      true,
    );
    assert.equal(server.getMap("furniture").get("chair"), "injected");
  } finally {
    awareness.destroy();
    server.destroy();
    attacker.destroy();
  }
});

test("viewers can publish cursor presence", () => {
  const server = new Y.Doc();
  const client = new Y.Doc();
  const awareness = new awarenessProtocol.Awareness(server);
  const clientAwareness = new awarenessProtocol.Awareness(client);
  try {
    clientAwareness.setLocalState({
      user: { name: "Viewer", mousePos: { x: 1, y: 2 } },
    });
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, 1);
    encoding.writeVarUint8Array(
      encoder,
      awarenessProtocol.encodeAwarenessUpdate(clientAwareness, [
        client.clientID,
      ]),
    );
    YJSservice.handleMessage(
      Buffer.from(encoding.toUint8Array(encoder)),
      server,
      {} as WebSocket,
      awareness,
      false,
    );
    assert.equal(
      awareness.getStates().get(client.clientID)?.user.name,
      "Viewer",
    );
  } finally {
    awareness.destroy();
    clientAwareness.destroy();
    server.destroy();
    client.destroy();
  }
});
